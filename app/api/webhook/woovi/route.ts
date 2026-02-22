import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { gerarPlano } from '@/lib/gerarPlano'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body?.event !== 'OPENPIX:CHARGE_COMPLETED') {
      return NextResponse.json({ ok: true })
    }

    const planoId = body?.charge?.correlationID
    if (!planoId) return NextResponse.json({ ok: true })

    const plano = await prisma.plano.findUnique({ where: { id: planoId } })
    if (!plano || plano.status === 'gerado') return NextResponse.json({ ok: true })

    await gerarPlano(planoId)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erro no webhook Woovi:', error)
    return NextResponse.json({ ok: true })
  }
}
