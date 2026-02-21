import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validarCPF } from '@/lib/validacoes'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dadosFormulario, paymentMethod } = body

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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

    if (paymentMethod === 'card') {
      return await handleStripeCheckout(dadosFormulario, baseUrl)
    } else {
      return await handleWooviCheckout(dadosFormulario, baseUrl)
    }
  } catch (error) {
    console.error('Erro no checkout:', error)
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}

async function handleWooviCheckout(dadosFormulario: Record<string, string>, baseUrl: string) {
  const correlationID = crypto.randomUUID()

  const response = await fetch('https://api.openpix.com.br/api/v1/charge', {
    method: 'POST',
    headers: {
      Authorization: process.env.WOOVI_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      correlationID,
      value: 1990,
      comment: 'Plano de Carreira Inteligente - PlanoAI',
      customer: {
        name: dadosFormulario.nome,
        email: dadosFormulario.email,
        taxID: dadosFormulario.cpf.replace(/\D/g, ''),
        phone: dadosFormulario.telefone.replace(/\D/g, ''),
      },
      additionalInfo: [
        { key: 'returnUrl', value: `${baseUrl}/gerando?billingId=${correlationID}` },
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok || !data?.charge?.correlationID) {
    console.error('Woovi error:', data)
    return NextResponse.json({ error: 'Erro ao criar cobrança PIX. Tente novamente.' }, { status: 500 })
  }

  await prisma.plano.create({
    data: {
      email: dadosFormulario.email,
      nome: dadosFormulario.nome,
      billingId: correlationID,
      paymentProvider: 'woovi',
      status: 'pendente',
      dadosFormulario,
      cargoAtual: dadosFormulario.cargo_atual,
      cargoObjetivo: dadosFormulario.cargo_objetivo,
    },
  })

  return NextResponse.json({
    url: data.charge.paymentLinkUrl,
    billingId: correlationID,
  })
}

async function handleStripeCheckout(dadosFormulario: Record<string, string>, baseUrl: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Plano de Carreira Inteligente',
            description: 'Plano de carreira 90 dias personalizado com IA',
          },
          unit_amount: 2490,
        },
        quantity: 1,
      },
    ],
    customer_email: dadosFormulario.email,
    success_url: `${baseUrl}/gerando?billingId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout?cancelado=1`,
    metadata: {
      planoai: 'true',
    },
  })

  await prisma.plano.create({
    data: {
      email: dadosFormulario.email,
      nome: dadosFormulario.nome,
      billingId: session.id,
      paymentProvider: 'stripe',
      status: 'pendente',
      dadosFormulario,
      cargoAtual: dadosFormulario.cargo_atual,
      cargoObjetivo: dadosFormulario.cargo_objetivo,
    },
  })

  return NextResponse.json({ url: session.url, billingId: session.id })
}
