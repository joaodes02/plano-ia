import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dadosFormulario } = body

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    // Criar billing na AbacatePay
    const response = await fetch(
      "https://api.abacatepay.com/v1/billing/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frequency: "ONE_TIME",
          methods: ["PIX", "CARD"],
          products: [
            {
              externalId: "prod_hKarEPuNtF06xEfrWPEwMwyK",
              name: "Plano de Carreira Inteligente",
              description:
                "Gere seu plano de carreira inteligente e consiga sua vaga dos sonhos!",
              quantity: 1,
              price: 2990, // em centavos (R$29,90)
            },
          ],
          returnUrl: `${baseUrl}/checkout?cancelado=1`,
          completionUrl: `${baseUrl}/gerando`,
          customer: {
            name: dadosFormulario.nome,
            email: dadosFormulario.email,
            cellphone: dadosFormulario.telefone.replace(/\D/g, ""),
            taxId: dadosFormulario.cpf.replace(/\D/g, ""),
          },
        }),
      },
    );

    const data = await response.json()
    console.log('AbacatePay response:', JSON.stringify(data, null, 2))

    if (!data?.data?.id) {
      return NextResponse.json({ error: 'Erro ao criar billing', details: data }, { status: 500 })
    }

    const billingId = data.data.id

    // Salvar plano no banco com status pendente
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

    // Retornar URL de pagamento + billingId para o frontend redirecionar
    return NextResponse.json({ url: data.data.url, billingId })
  } catch (error) {
    console.error('Erro no checkout:', error)
    return NextResponse.json({ error: 'Erro interno no checkout' }, { status: 500 })
  }
}
