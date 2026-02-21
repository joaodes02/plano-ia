import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const body = await req.json()

  // AbacatePay envia evento billing.paid quando PIX é confirmado
  if (body?.event !== 'billing.paid') {
    return NextResponse.json({ ok: true })
  }

  const billingId = body?.data?.billing?.id
  if (!billingId) return NextResponse.json({ error: 'billingId ausente' }, { status: 400 })

  const plano = await prisma.plano.findUnique({ where: { billingId } })
  if (!plano || plano.status === 'gerado') return NextResponse.json({ ok: true })

  // Resetar status para permitir re-tentativa
  if (plano.status === 'erro') {
    await prisma.plano.update({ where: { billingId }, data: { status: 'pendente' } })
  }

  try {
    const dados = plano.dadosFormulario as Record<string, string>

    console.log('Chamando Claude para billingId:', billingId)

    const completion = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: `Você é um coach de carreira sênior com 15 anos de experiência no mercado brasileiro.

Crie um Plano de Carreira de 90 dias personalizado para:

PERFIL ATUAL:
- Cargo atual: ${dados.cargo_atual}
- Área: ${dados.area}
- Salário atual: ${dados.salario_atual}
- Tempo de experiência: ${dados.tempo_experiencia}

OBJETIVO:
- Cargo desejado: ${dados.cargo_objetivo}
- Salário desejado: ${dados.salario_objetivo}
- Prazo: ${dados.prazo}
- Motivação: ${dados.motivacao}

HABILIDADES E GAPS:
- Habilidades: ${dados.habilidades}
- Gaps: ${dados.gaps}
- Experiência em entrevistas: ${dados.entrevistas || 'Não informado'}
- Tempo disponível/semana: ${dados.tempo_disponivel}

PREFERÊNCIAS: ${dados.preferencias_aprendizado}
CONTEXTO: ${dados.contexto || 'Nenhum'}

IMPORTANTE: Responda SOMENTE com JSON válido. Sem texto antes ou depois. Sem markdown. Sem \`\`\`.

A estrutura EXATA do JSON deve ser:
{
  "resumo_executivo": "3 parágrafos analisando perfil, objetivo e viabilidade",
  "gaps_prioritarios": [
    {"gap": "nome", "impacto": "por que trava o crescimento", "solucao": "como resolver"}
  ],
  "plano_90_dias": {
    "mes1": {
      "foco": "tema do mês",
      "semanas": [
        {
          "semana": 1,
          "objetivo": "objetivo",
          "acoes": ["ação 1", "ação 2", "ação 3"],
          "entregavel": "o que deve estar feito",
          "tempo_estimado": "Xh"
        }
      ]
    },
    "mes2": { "foco": "", "semanas": [] },
    "mes3": { "foco": "", "semanas": [] }
  },
  "habilidades_desenvolver": [
    {
      "habilidade": "nome",
      "prioridade": "alta",
      "recursos": [{"tipo": "curso", "nome": "nome do recurso", "link_busca": "termo google"}]
    }
  ],
  "estrategia_promocao": {
    "timing_ideal": "quando abordar",
    "argumentos": ["argumento 1", "argumento 2"],
    "script_conversa": "script para conversa",
    "alertas": ["o que evitar"]
  },
  "mensagem_motivacional": "mensagem final personalizada"
}`,
        },
      ],
    })

    console.log('Claude respondeu. Stop reason:', completion.stop_reason)

    let texto = completion.content[0].type === 'text' ? completion.content[0].text : ''
    console.log('Resposta bruta (primeiros 300 chars):', texto.substring(0, 300))
    console.log('Resposta bruta (últimos 100 chars):', texto.substring(texto.length - 100))

    // Remover markdown caso o Claude envolva em ```json ... ```
    texto = texto.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()

    // Extrair JSON se tiver texto antes/depois
    const jsonMatch = texto.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      texto = jsonMatch[0]
    }

    const planoGerado = JSON.parse(texto)
    console.log('JSON parseado com sucesso!')

    await prisma.plano.update({
      where: { billingId },
      data: { status: 'gerado', planoGerado },
    })

    console.log('Plano salvo com sucesso para billingId:', billingId)
  } catch (err: unknown) {
    console.error('=== ERRO AO GERAR PLANO ===')
    console.error('Tipo:', err instanceof Error ? err.constructor.name : typeof err)
    console.error('Mensagem:', err instanceof Error ? err.message : String(err))
    if (err instanceof Error && err.stack) console.error('Stack:', err.stack)
    await prisma.plano.update({
      where: { billingId },
      data: { status: 'erro' },
    })
  }

  return NextResponse.json({ ok: true })
}
