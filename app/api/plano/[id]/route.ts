import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const plano = await prisma.plano.findUnique({ where: { id } })
  if (!plano) return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 })
  return NextResponse.json(plano)
}
