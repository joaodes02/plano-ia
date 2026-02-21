import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validarCPF } from '@/lib/validacoes'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dadosFormulario } = body

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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    const response = await fetch(
      'https://api.abacatepay.com/v1/billing/create',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frequency: 'ONE_TIME',
          methods: ['PIX', 'CARD'],
          products: [
            {
              externalId: 'prod_hKarEPuNtF06xEfrWPEwMwyK',
              name: 'Plano de Carreira Inteligente',
              description: 'Gere seu plano de carreira inteligente e consiga sua vaga dos sonhos!',
              quantity: 1,
              price: 2990,
            },
          ],
          returnUrl: `${baseUrl}/checkout?cancelado=1`,
          completionUrl: `${baseUrl}/gerando`,
          customer: {
            name: dadosFormulario.nome,
            email: dadosFormulario.email,
            cellphone: telefoneDigits,
            taxId: dadosFormulario.cpf.replace(/\D/g, ''),
          },
        }),
      },
    )

    const data = await response.json()

    if (!data?.data?.id) {
      // Mapear erros da AbacatePay para mensagens claras
      const abacateError = data?.error || ''
      let userError = 'Erro ao processar pagamento. Tente novamente.'
      if (abacateError.includes('taxId')) userError = 'CPF inválido. Verifique e tente novamente.'
      else if (abacateError.includes('cellphone')) userError = 'Telefone inválido. Verifique e tente novamente.'
      else if (abacateError.includes('email')) userError = 'Email inválido. Verifique e tente novamente.'
      else if (abacateError.includes('returnUrl') || abacateError.includes('completionUrl')) userError = 'Erro de configuração do sistema. Tente novamente mais tarde.'

      console.error('AbacatePay error:', data)
      return NextResponse.json({ error: userError }, { status: 500 })
    }

    const billingId = data.data.id

    await prisma.plano.create({
      data: {
        email: dadosFormulario.email,
        nome: dadosFormulario.nome,
        billingId,
        status: 'pendente',
        dadosFormulario,
        cargoAtual: dadosFormulario.cargo_atual,
        cargoObjetivo: dadosFormulario.cargo_objetivo,
      },
    })

    return NextResponse.json({ url: data.data.url, billingId })
  } catch (error) {
    console.error('Erro no checkout:', error)
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
