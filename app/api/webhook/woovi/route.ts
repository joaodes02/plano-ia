import { NextRequest, NextResponse } from 'next/server'
import { generatePlanForBilling } from '@/lib/generate-plan'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // OpenPix envia evento OPENPIX:CHARGE_COMPLETED quando o PIX é pago
    if (body?.event !== 'OPENPIX:CHARGE_COMPLETED') {
      return NextResponse.json({ ok: true })
    }

    const correlationID = body?.charge?.correlationID
    if (!correlationID) {
      return NextResponse.json({ error: 'correlationID ausente' }, { status: 400 })
    }

    await generatePlanForBilling(correlationID)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erro no webhook Woovi:', error)
    return NextResponse.json({ ok: true }) // sempre 200 para evitar retries
  }
}
