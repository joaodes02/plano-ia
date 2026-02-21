import { NextRequest, NextResponse } from 'next/server'
import { enviarPlanoEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'

// Rota de teste para enviar email diretamente
// Uso: POST /api/test-email?planoId=xxx
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Não disponível em produção' }, { status: 403 })
  }

  const planoId = req.nextUrl.searchParams.get('planoId')
  if (!planoId) {
    return NextResponse.json({ error: 'planoId obrigatório' }, { status: 400 })
  }

  const plano = await prisma.plano.findUnique({ where: { id: planoId } })
  if (!plano || !plano.planoGerado) {
    return NextResponse.json({ error: 'Plano não encontrado ou sem dados' }, { status: 404 })
  }

  try {
    await enviarPlanoEmail(
      plano.email,
      plano.nome,
      plano.planoGerado as Record<string, unknown>,
      plano.cargoAtual,
      plano.cargoObjetivo,
      plano.id,
    )
    return NextResponse.json({ message: 'Email enviado com sucesso', to: plano.email })
  } catch (err) {
    console.error('Erro ao enviar email de teste:', err)
    return NextResponse.json(
      { error: 'Erro ao enviar email', details: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
