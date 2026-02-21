import { NextRequest, NextResponse } from 'next/server'

// Rota de teste para simular webhook da AbacatePay em dev
// Uso: POST /api/webhook/test?billingId=bill_xxx
// Isso dispara o mesmo fluxo que o webhook real
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Não disponível em produção' }, { status: 403 })
  }

  const billingId = req.nextUrl.searchParams.get('billingId')
  if (!billingId) {
    return NextResponse.json({ error: 'billingId obrigatório' }, { status: 400 })
  }

  // Simular o payload do webhook da AbacatePay
  const webhookPayload = {
    event: 'billing.paid',
    data: {
      billing: { id: billingId },
    },
  }

  // Chamar o webhook real internamente
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/webhook/abacatepay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webhookPayload),
  })

  const data = await res.json()
  return NextResponse.json({ message: 'Webhook simulado com sucesso', result: data })
}
