import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { renderToBuffer } from '@react-pdf/renderer'
import { criarPlanoPDF } from '@/lib/pdf-document'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const plano = await prisma.plano.findUnique({ where: { id } })
  if (!plano || plano.status !== 'gerado' || !plano.planoGerado) {
    return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 })
  }

  const doc = criarPlanoPDF(plano)
  const buffer = await renderToBuffer(doc)

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="PlanoAI-${plano.nome.split(' ')[0]}.pdf"`,
    },
  })
}
