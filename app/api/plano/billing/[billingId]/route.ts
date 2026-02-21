import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ billingId: string }> }) {
  const { billingId } = await params
  const plano = await prisma.plano.findUnique({ where: { billingId } })
  if (!plano) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(plano)
}
