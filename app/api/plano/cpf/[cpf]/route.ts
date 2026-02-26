import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validarCPF } from '@/lib/validacoes'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cpf: string }> }
) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde um minuto.' },
      { status: 429 }
    )
  }

  const { cpf } = await params
  const cpfDigits = cpf.replace(/\D/g, '')

  if (!validarCPF(cpfDigits)) {
    return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })
  }

  const planos = await prisma.plano.findMany({
    where: {
      cpf: cpfDigits,
      status: { in: ['gerado', 'gerando'] },
    },
    select: {
      id: true,
      createdAt: true,
      nome: true,
      status: true,
      cargoAtual: true,
      cargoObjetivo: true,
      planoTipo: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ planos })
}
