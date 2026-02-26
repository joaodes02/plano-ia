import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { validarCPF } from '@/lib/validacoes'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { pagamento, dadosFormulario } = await req.json()

    if (!dadosFormulario?.nome || !dadosFormulario?.email || !dadosFormulario?.cpf || !dadosFormulario?.telefone) {
      return NextResponse.json({ error: 'Dados obrigatórios não preenchidos' }, { status: 400 })
    }

    if (!validarCPF(dadosFormulario.cpf)) {
      return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })
    }

    const telefoneDigits = dadosFormulario.telefone.replace(/\D/g, '')
    if (telefoneDigits.length < 10) {
      return NextResponse.json({ error: 'Telefone inválido' }, { status: 400 })
    }

    // Salvar rascunho no banco antes do pagamento
    const rascunho = await prisma.plano.create({
      data: {
        email: dadosFormulario.email,
        nome: dadosFormulario.nome,
        cpf: dadosFormulario.cpf.replace(/\D/g, ''),
        billingId: `pending_${Date.now()}`,
        status: 'aguardando_pagamento',
        dadosFormulario,
        cargoAtual: dadosFormulario.cargo_atual,
        cargoObjetivo: dadosFormulario.cargo_objetivo,
        planoTipo: 'com_notion',
      },
    })

    if (pagamento === 'cartao') {
      return await criarCheckoutStripe(rascunho.id, dadosFormulario)
    } else {
      return await criarCheckoutWoovi(rascunho.id, dadosFormulario)
    }
  } catch (error) {
    console.error('Erro no checkout:', error)
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}

async function criarCheckoutStripe(planoId: string, dados: Record<string, string>) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      { price: process.env.STRIPE_PRICE_ID!, quantity: 1 },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gerando?planoId=${planoId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
    customer_email: dados.email,
    metadata: { planoId },
  })

  await prisma.plano.update({
    where: { id: planoId },
    data: { billingId: session.id, paymentProvider: 'stripe' },
  })

  return NextResponse.json({ url: session.url })
}

async function criarCheckoutWoovi(planoId: string, dados: Record<string, string>) {
  const response = await fetch('https://api.woovi.com/api/v1/charge', {
    method: 'POST',
    headers: {
      Authorization: process.env.WOOVI_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      correlationID: planoId,
      value: 2490,
      comment: 'PlanoAI - Plano de Carreira 90 dias',
      customer: {
        name: dados.nome,
        email: dados.email,
        taxID: dados.cpf.replace(/\D/g, ''),
        phone: dados.telefone.replace(/\D/g, ''),
      },
      additionalInfo: [{ key: 'planoId', value: planoId }],
      expiresIn: 3600,
    }),
  })

  const data = await response.json()

  if (!data?.charge?.paymentLinkUrl) {
    console.error('Woovi error:', data)
    return NextResponse.json({ error: 'Erro ao gerar PIX. Tente novamente.' }, { status: 500 })
  }

  await prisma.plano.update({
    where: { id: planoId },
    data: { billingId: planoId, paymentProvider: 'woovi' },
  })

  return NextResponse.json({ url: data.charge.paymentLinkUrl })
}
