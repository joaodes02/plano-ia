import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { gerarPlano } from '@/lib/gerarPlano'

// APENAS PARA TESTES LOCAIS — nao subir para producao
// Simula o pagamento PIX e dispara geracao do plano em background
export async function POST(req: NextRequest) {
  try {
    const { dadosFormulario } = await req.json()

    if (!dadosFormulario?.nome || !dadosFormulario?.email) {
      return NextResponse.json({ error: 'Dados obrigatorios nao preenchidos' }, { status: 400 })
    }

    const plano = await prisma.plano.create({
      data: {
        email: dadosFormulario.email,
        nome: dadosFormulario.nome,
        cpf: dadosFormulario.cpf?.replace(/\D/g, '') || null,
        billingId: `test_${Date.now()}`,
        status: 'aguardando_pagamento',
        dadosFormulario,
        cargoAtual: dadosFormulario.cargo_atual,
        cargoObjetivo: dadosFormulario.cargo_objetivo,
        paymentProvider: 'woovi',
        planoTipo: 'com_notion',
      },
    })

    console.log(`[TEST] Plano criado: ${plano.id} — gerando em background...`)

    // Gerar em background para simular o fluxo real (polling na /gerando)
    gerarPlano(plano.id).then(() => {
      console.log(`[TEST] Plano gerado: ${plano.id}`)
    }).catch((err) => {
      console.error(`[TEST] Erro ao gerar plano ${plano.id}:`, err)
    })

    // Retorna imediatamente com o planoId para redirecionar para /gerando
    return NextResponse.json({ planoId: plano.id })
  } catch (error) {
    console.error('[TEST] Erro:', error)
    return NextResponse.json({ error: 'Erro ao simular pagamento' }, { status: 500 })
  }
}
