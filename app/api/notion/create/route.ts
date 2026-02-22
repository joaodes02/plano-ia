import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { token, planoId } = body as { token: string; planoId: string }

  if (!token || !planoId) {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
  }

  const plano = await prisma.plano.findUnique({ where: { id: planoId } })
  if (!plano?.planoGerado) {
    return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 })
  }

  const notion = new Client({ auth: token })
  const dados = plano.planoGerado as Record<string, unknown>
  const dadosForm = plano.dadosFormulario as Record<string, string>

  try {
    const search = await notion.search({
      filter: { value: 'page', property: 'object' },
      page_size: 1,
    })

    if (!search.results.length) {
      return NextResponse.json({ error: 'Nenhuma página encontrada no Notion' }, { status: 400 })
    }

    const paginaRaizId = search.results[0].id

    // Extrair valores numéricos de salário
    const salarioAtualNum = parseNumber(dadosForm.salario_atual)
    const salarioObjetivoNum = parseNumber(dadosForm.salario_objetivo)
    const aumentoValor = salarioObjetivoNum - salarioAtualNum
    const aumentoPct = salarioAtualNum > 0 ? Math.round((aumentoValor / salarioAtualNum) * 100) : 0

    // Gerar URL do gráfico de progresso (QuickChart.io)
    const chartUrl = gerarChartUrl(dados)

    const children = [
      // === HEADER ===
      callout('🚀', 'purple_background',
        `Olá, ${plano.nome}! Este é seu plano personalizado de 90 dias para a transição de ${plano.cargoAtual} → ${plano.cargoObjetivo}. Siga as semanas na ordem e marque as tarefas conforme concluir.`
      ),
      blankLine(),
      { object: 'block' as const, type: 'table_of_contents' as const, table_of_contents: { color: 'default' as const } },
      blankLine(),

      // === PAINEL DE SALÁRIO ===
      heading2('💰 Meta Salarial'),
      ...gerarPainelSalario(dadosForm.salario_atual, dadosForm.salario_objetivo, aumentoValor, aumentoPct, plano.cargoAtual, plano.cargoObjetivo),
      divider(),

      // === GRÁFICO DE PROGRESSO ===
      heading2('📈 Curva de Evolução — 12 Semanas'),
      callout('📊', 'blue_background', 'Este gráfico mostra a evolução esperada ao longo das 12 semanas do plano. O progresso é acumulativo — cada semana constrói sobre a anterior.'),
      blankLine(),
      { object: 'block' as const, type: 'image' as const, image: { type: 'external' as const, external: { url: chartUrl } } },
      blankLine(),
      divider(),

      // === RESUMO EXECUTIVO ===
      heading2('📊 Resumo Executivo'),
      ...splitTextIntoBlocks((dados.resumo_executivo as string) || ''),
      divider(),

      // === GAPS PRIORITÁRIOS ===
      heading2('🎯 Gaps Prioritários'),
      callout('⚠️', 'yellow_background', 'Estes são os 3 principais gaps que travam seu crescimento. Resolva-os para acelerar sua transição.'),
      blankLine(),
      ...gerarBlocosGaps(dados.gaps_prioritarios as Gap[] || []),
      divider(),

      // === PLANO 90 DIAS ===
      heading2('📅 Plano de 90 Dias'),
      callout('📌', 'blue_background', 'Cada semana tem ações específicas e um entregável. Marque os checkboxes conforme concluir cada ação.'),
      blankLine(),
      ...gerarBlocosMes((dados.plano_90_dias as Record<string, unknown>)?.mes1, '🔵 Mês 1'),
      blankLine(),
      ...gerarBlocosMes((dados.plano_90_dias as Record<string, unknown>)?.mes2, '🟡 Mês 2'),
      blankLine(),
      ...gerarBlocosMes((dados.plano_90_dias as Record<string, unknown>)?.mes3, '🟢 Mês 3'),
      divider(),

      // === HABILIDADES A DESENVOLVER ===
      heading2('📚 Habilidades a Desenvolver'),
      ...gerarBlocosHabilidades(dados.habilidades_desenvolver as Habilidade[] || []),
      divider(),

      // === ESTRATÉGIA DE PROMOÇÃO ===
      heading2('💬 Estratégia de Promoção'),
      ...gerarBlocosEstrategia(dados.estrategia_promocao as Record<string, unknown> || {}),
      divider(),

      // === MENSAGEM MOTIVACIONAL ===
      callout('💪', 'green_background', (dados.mensagem_motivacional as string) || ''),
      blankLine(),
      paragraph(richText('Gerado por ', true), richText('PlanoAI — planoai.com.br')),
    ]

    // Notion API limita 100 children por request
    const firstBatch = children.slice(0, 100)
    const remainingBatches = children.slice(100)

    const dashboard = await notion.pages.create({
      parent: { type: 'page_id', page_id: paginaRaizId },
      icon: { type: 'emoji', emoji: '🎯' },
      cover: { type: 'external', external: { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1500' } },
      properties: {
        title: {
          title: [{ text: { content: `Plano de Carreira 90 dias — ${plano.nome}` } }],
        },
      },
      children: firstBatch,
    })

    const dashboardId = dashboard.id

    // Adicionar blocos restantes
    for (let i = 0; i < remainingBatches.length; i += 100) {
      const batch = remainingBatches.slice(i, i + 100)
      await notion.blocks.children.append({ block_id: dashboardId, children: batch })
    }

    // === CRIAR BANCO DE TAREFAS INLINE ===
    await criarBancoTarefas(notion, token, dashboardId, dados)

    const dashboardUrl = 'url' in dashboard ? (dashboard.url as string) : ''

    await prisma.plano.update({
      where: { id: planoId },
      data: {
        dadosFormulario: {
          ...(plano.dadosFormulario as Record<string, unknown>),
          notion_url: dashboardUrl,
        },
      },
    })

    return NextResponse.json({ success: true, url: dashboardUrl })
  } catch (err) {
    console.error('Erro Notion:', err)
    return NextResponse.json({ error: 'Erro ao criar dashboard' }, { status: 500 })
  }
}

// === BANCO DE TAREFAS INLINE ===

async function criarBancoTarefas(notion: Client, token: string, dashboardId: string, dados: Record<string, unknown>) {
  // Primeiro adicionar o heading
  await notion.blocks.children.append({
    block_id: dashboardId,
    children: [
      divider(),
      heading2('✅ Tracker de Tarefas'),
      callout('📋', 'green_background', 'Use este banco de dados para acompanhar cada tarefa do seu plano. Marque como concluída conforme avançar!'),
      blankLine(),
    ],
  })

  // Criar database inline via REST API direta (SDK tem tipos incompatíveis)
  const dbRes = await fetch('https://api.notion.com/v1/databases', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { type: 'page_id', page_id: dashboardId },
      is_inline: true,
      title: [{ text: { content: 'Tarefas do Plano' } }],
      properties: {
        'Tarefa': { title: {} },
        'Concluída': { checkbox: {} },
        'Semana': { number: {} },
        'Mês': {
          select: {
            options: [
              { name: 'Mês 1', color: 'blue' },
              { name: 'Mês 2', color: 'yellow' },
              { name: 'Mês 3', color: 'green' },
            ],
          },
        },
        'Entregável': { rich_text: {} },
        'Tempo': { rich_text: {} },
      },
    }),
  })

  if (!dbRes.ok) {
    console.error('Erro ao criar database Notion:', await dbRes.text())
    return
  }

  const db = await dbRes.json()

  // Popular com tarefas de todas as semanas
  const plano90 = dados.plano_90_dias as Record<string, unknown> | undefined
  if (!plano90) return

  const meses = [
    { key: 'mes1', label: 'Mês 1' },
    { key: 'mes2', label: 'Mês 2' },
    { key: 'mes3', label: 'Mês 3' },
  ]

  for (const mes of meses) {
    const mesData = plano90[mes.key] as MesData | undefined
    if (!mesData?.semanas) continue

    for (const semana of mesData.semanas) {
      for (const acao of (semana.acoes || [])) {
        await notion.pages.create({
          parent: { database_id: db.id },
          properties: {
            'Tarefa': { title: [{ text: { content: acao } }] },
            'Concluída': { checkbox: false },
            'Semana': { number: semana.semana },
            'Mês': { select: { name: mes.label } },
            'Entregável': { rich_text: [{ text: { content: semana.entregavel || '' } }] },
            'Tempo': { rich_text: [{ text: { content: semana.tempo_estimado || '' } }] },
          },
        })
      }
    }
  }
}

// === PAINEL DE SALÁRIO ===

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gerarPainelSalario(salarioAtual: string, salarioObjetivo: string, aumentoValor: number, aumentoPct: number, cargoAtual: string | null, cargoObjetivo: string | null): any[] {
  return [
    // Tabela visual com dados de salário
    {
      object: 'block' as const,
      type: 'table' as const,
      table: {
        table_width: 3,
        has_column_header: true,
        has_row_header: false,
        children: [
          tableRow(['', 'Atual', 'Objetivo']),
          tableRow(['Cargo', cargoAtual || '-', cargoObjetivo || '-']),
          tableRow(['Salário', salarioAtual || '-', salarioObjetivo || '-']),
          tableRow(['Aumento', `+${aumentoPct}%`, `+R$${aumentoValor.toLocaleString('pt-BR')}`]),
        ],
      },
    },
    blankLine(),
    callout('🎯', 'green_background', `Meta: sair de ${salarioAtual || '?'} para ${salarioObjetivo || '?'} — um aumento de ${aumentoPct}% (+R$${aumentoValor.toLocaleString('pt-BR')})`),
  ]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tableRow(cells: string[]): any {
  return {
    object: 'block' as const,
    type: 'table_row' as const,
    table_row: {
      cells: cells.map(cell => [{ text: { content: cell } }]),
    },
  }
}

// === GRÁFICO ===

function gerarChartUrl(dados: Record<string, unknown>): string {
  const plano90 = dados.plano_90_dias as Record<string, unknown> | undefined
  if (!plano90) return ''

  // Calcular ações acumuladas por semana
  const labels: string[] = []
  const acumulado: number[] = []
  let total = 0

  const meses = ['mes1', 'mes2', 'mes3']
  for (const mesKey of meses) {
    const mes = plano90[mesKey] as MesData | undefined
    if (!mes?.semanas) continue
    for (const semana of mes.semanas) {
      labels.push(`S${semana.semana}`)
      total += (semana.acoes || []).length
      acumulado.push(total)
    }
  }

  // Normalizar para porcentagem
  const maxAcoes = total
  const progresso = acumulado.map(v => Math.round((v / maxAcoes) * 100))

  const config = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Progresso do Plano (%)',
          data: progresso,
          fill: true,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.15)',
          tension: 0.4,
          pointBackgroundColor: '#6366f1',
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Evolução Esperada — 12 Semanas', color: '#333', font: { size: 16 } },
        legend: { display: false },
      },
      scales: {
        y: { min: 0, max: 100, title: { display: true, text: 'Progresso (%)' } },
        x: { title: { display: true, text: 'Semana' } },
      },
    },
  }

  const chartJson = encodeURIComponent(JSON.stringify(config))
  return `https://quickchart.io/chart?c=${chartJson}&w=700&h=400&bkg=white`
}

// === HELPERS ===

const bold = { bold: true, italic: false, strikethrough: false, underline: false, code: false, color: 'default' as const }
const normal = { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' as const }
const italicAnn = { bold: false, italic: true, strikethrough: false, underline: false, code: false, color: 'default' as const }

function richText(content: string, isBold = false) {
  return { text: { content }, annotations: isBold ? bold : normal }
}

function richTextItalic(content: string) {
  return { text: { content }, annotations: italicAnn }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function heading2(text: string): any {
  return { object: 'block', type: 'heading_2', heading_2: { rich_text: [richText(text)] } }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function heading3(text: string): any {
  return { object: 'block', type: 'heading_3', heading_3: { rich_text: [richText(text)] } }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callout(emoji: string, color: string, text: string): any {
  const truncated = text.length > 2000 ? text.slice(0, 1997) + '...' : text
  return { object: 'block', type: 'callout', callout: { icon: { type: 'emoji', emoji }, color, rich_text: [richText(truncated)] } }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function divider(): any { return { object: 'block', type: 'divider', divider: {} } }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function blankLine(): any { return { object: 'block', type: 'paragraph', paragraph: { rich_text: [] } } }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function paragraph(...parts: any[]): any { return { object: 'block', type: 'paragraph', paragraph: { rich_text: parts } } }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function todo(text: string, checked = false): any { return { object: 'block', type: 'to_do', to_do: { checked, rich_text: [richText(text)] } } }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bulletItem(...parts: any[]): any { return { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: parts } } }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function numberedItem(...parts: any[]): any { return { object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: parts } } }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function splitTextIntoBlocks(text: string): any[] {
  if (!text) return [paragraph(richText(''))]
  const paragraphs = text.split('\n').filter(Boolean)
  if (paragraphs.length > 1) {
    return paragraphs.map(p => paragraph(richText(p.length > 2000 ? p.slice(0, 1997) + '...' : p)))
  }
  if (text.length <= 2000) return [paragraph(richText(text))]
  const blocks = []
  for (let i = 0; i < text.length; i += 2000) blocks.push(paragraph(richText(text.slice(i, i + 2000))))
  return blocks
}

function parseNumber(val: string): number {
  if (!val) return 0
  return parseInt(val.replace(/\D/g, ''), 10) || 0
}

// === SEÇÕES ===

interface Gap { gap: string; impacto: string; solucao: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gerarBlocosGaps(gaps: Gap[]): any[] {
  if (!gaps.length) return []
  return gaps.flatMap((gap, i) => [{
    object: 'block' as const, type: 'toggle' as const,
    toggle: {
      rich_text: [richText(`${i + 1}. ${gap.gap}`, true)],
      children: [
        paragraph(richText('Impacto: ', true), richText(gap.impacto)),
        paragraph(richText('Solução: ', true), richText(gap.solucao)),
      ],
    },
  }])
}

interface Recurso { tipo: string; nome: string; link_busca: string }
interface Habilidade { habilidade: string; prioridade: string; recursos: Recurso[] }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gerarBlocosHabilidades(habilidades: Habilidade[]): any[] {
  if (!habilidades.length) return []
  const prioridadeEmoji: Record<string, string> = { alta: '🔴', media: '🟡', baixa: '🟢' }
  return habilidades.flatMap((hab) => {
    const emoji = prioridadeEmoji[hab.prioridade] || '⚪'
    return [{
      object: 'block' as const, type: 'toggle' as const,
      toggle: {
        rich_text: [richText(`${emoji} ${hab.habilidade} — Prioridade ${hab.prioridade}`, true)],
        children: (hab.recursos || []).map((rec) => {
          const tipoEmoji = rec.tipo === 'curso' ? '🎓' : rec.tipo === 'livro' ? '📖' : rec.tipo === 'canal' ? '📺' : '🔗'
          return bulletItem(richText(`${tipoEmoji} `), richText(rec.nome, true), richText(rec.link_busca ? ` — Buscar: "${rec.link_busca}"` : ''))
        }),
      },
    }]
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gerarBlocosEstrategia(estrategia: Record<string, unknown>): any[] {
  const blocks = []
  if (estrategia.timing_ideal) {
    blocks.push(callout('⏰', 'blue_background', `Momento ideal: ${estrategia.timing_ideal as string}`))
    blocks.push(blankLine())
  }
  const argumentos = estrategia.argumentos as string[] | undefined
  if (argumentos?.length) {
    blocks.push(heading3('Seus Argumentos'))
    blocks.push(...argumentos.map(arg => numberedItem(richText(arg))))
    blocks.push(blankLine())
  }
  if (estrategia.script_conversa) {
    blocks.push(heading3('Script da Conversa'))
    blocks.push({ object: 'block' as const, type: 'quote' as const, quote: { rich_text: [richTextItalic((estrategia.script_conversa as string).slice(0, 2000))] } })
    blocks.push(blankLine())
  }
  const alertas = estrategia.alertas as string[] | undefined
  if (alertas?.length) {
    blocks.push(heading3('⚠️ O Que Evitar'))
    blocks.push(...alertas.map(alerta => bulletItem(richText(alerta))))
  }
  return blocks
}

interface Semana { semana: number; objetivo: string; acoes: string[]; entregavel: string; tempo_estimado: string }
interface MesData { foco: string; semanas: Semana[] }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gerarBlocosMes(mes: unknown, titulo: string): any[] {
  if (!mes) return []
  const mesTyped = mes as MesData
  return [
    heading3(`${titulo} — ${mesTyped.foco || ''}`),
    ...(mesTyped.semanas || []).map((semana) => ({
      object: 'block' as const, type: 'toggle' as const,
      toggle: {
        rich_text: [richText(`Semana ${semana.semana}: `, true), richText(semana.objetivo), richText(` (${semana.tempo_estimado})`)],
        children: [
          ...(semana.acoes || []).map((acao: string) => todo(acao)),
          blankLine(),
          callout('🎯', 'gray_background', `Entregável: ${semana.entregavel || ''}`),
        ],
      },
    })),
  ]
}
