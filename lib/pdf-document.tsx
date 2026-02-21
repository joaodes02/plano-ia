import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { PlanoGerado, Mes, Acao, GapPrioritario, HabilidadeDesenvolver } from '@/types'

const c = {
  primary: '#4f46e5',
  primaryLight: '#eef2ff',
  dark: '#111827',
  text: '#374151',
  textLight: '#6b7280',
  border: '#e5e7eb',
  bg: '#f9fafb',
  white: '#ffffff',
  red: '#dc2626',
  yellow: '#ca8a04',
  green: '#16a34a',
}

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 9.5, color: c.text },
  // Header
  header: { backgroundColor: c.primary, padding: 24, borderRadius: 8, marginBottom: 20 },
  headerLogo: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: c.white },
  headerLogoAccent: { color: '#c7d2fe' },
  headerName: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: c.white, marginTop: 10 },
  headerTransition: { fontSize: 10, color: '#c7d2fe', marginTop: 3 },
  headerDate: { fontSize: 8, color: '#a5b4fc', marginTop: 3 },
  // Section
  sectionTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: c.dark, marginBottom: 6, marginTop: 16 },
  sectionBar: { width: 36, height: 2.5, backgroundColor: c.primary, borderRadius: 2, marginBottom: 10 },
  // Cards
  card: { backgroundColor: c.bg, borderRadius: 6, padding: 12, marginBottom: 8, border: `0.5 solid ${c.border}` },
  cardText: { fontSize: 9, color: c.text, lineHeight: 1.6 },
  // Gaps — vertical stack
  gapCard: { backgroundColor: c.bg, borderRadius: 6, padding: 12, marginBottom: 6, border: `0.5 solid ${c.border}` },
  gapHeader: { flexDirection: 'row' as const, alignItems: 'center' as const, marginBottom: 6 },
  gapNumber: { width: 22, height: 22, borderRadius: 11, backgroundColor: c.primaryLight, justifyContent: 'center' as const, alignItems: 'center' as const, marginRight: 8 },
  gapNumberText: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: c.primary },
  gapName: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: c.dark, flex: 1 },
  gapLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: c.textLight, textTransform: 'uppercase' as const, marginBottom: 2, marginTop: 6, letterSpacing: 0.5 },
  gapText: { fontSize: 8.5, color: c.text, lineHeight: 1.5 },
  // Semanas
  semanaRow: { flexDirection: 'row' as const, marginBottom: 8, paddingBottom: 6, borderBottom: `0.5 solid ${c.border}` },
  semanaNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: c.primaryLight, justifyContent: 'center' as const, alignItems: 'center' as const, marginRight: 8, marginTop: 1 },
  semanaNumText: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: c.primary },
  semanaContent: { flex: 1 },
  semanaObj: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: c.dark },
  semanaTime: { fontSize: 7, color: c.textLight, marginLeft: 6 },
  semanaAction: { fontSize: 8, color: c.text, marginLeft: 4, marginTop: 2, lineHeight: 1.4 },
  semanaEntregavel: { fontSize: 8, color: c.primary, marginTop: 4, fontFamily: 'Helvetica-Oblique' },
  // Mes
  mesCard: { backgroundColor: c.bg, borderRadius: 6, padding: 12, marginBottom: 10, border: `0.5 solid ${c.border}` },
  mesTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: c.dark, marginBottom: 3 },
  mesFoco: { fontSize: 8.5, color: c.primary, marginBottom: 10, fontFamily: 'Helvetica-Oblique' },
  // Habilidades
  habCard: { backgroundColor: c.bg, borderRadius: 6, padding: 10, marginBottom: 6, border: `0.5 solid ${c.border}` },
  habHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 6 },
  habName: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: c.dark, flex: 1 },
  badge: { fontSize: 7, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontFamily: 'Helvetica-Bold' },
  badgeAlta: { backgroundColor: '#fef2f2', color: c.red },
  badgeMedia: { backgroundColor: '#fefce8', color: c.yellow },
  badgeBaixa: { backgroundColor: '#f0fdf4', color: c.green },
  recursoRow: { flexDirection: 'row' as const, alignItems: 'center' as const, marginTop: 3, marginLeft: 4 },
  recursoTag: { fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: c.textLight, backgroundColor: '#f3f4f6', paddingHorizontal: 4, paddingVertical: 1.5, borderRadius: 3, marginRight: 5, textTransform: 'uppercase' as const },
  recursoNome: { fontSize: 8, color: c.text, flex: 1 },
  // Promoção
  promoCard: { backgroundColor: c.bg, borderRadius: 6, padding: 12, marginBottom: 8, border: `0.5 solid ${c.border}` },
  promoLabel: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: c.primary, textTransform: 'uppercase' as const, marginBottom: 4, letterSpacing: 0.5 },
  promoText: { fontSize: 8.5, color: c.text, lineHeight: 1.5 },
  // Script
  scriptCard: { backgroundColor: c.primaryLight, borderRadius: 6, padding: 12, marginBottom: 8 },
  // Alertas
  alertCard: { backgroundColor: '#fefce8', borderRadius: 6, padding: 12, marginBottom: 8 },
  alertText: { fontSize: 8.5, color: '#92400e', lineHeight: 1.5 },
  // Motivacional
  motivacional: { backgroundColor: c.primaryLight, borderRadius: 8, padding: 20, marginTop: 14 },
  motivacionalText: { fontSize: 10, color: c.primary, lineHeight: 1.7, fontFamily: 'Helvetica-Oblique', textAlign: 'center' as const },
  // Footer
  footer: { position: 'absolute' as const, bottom: 20, left: 40, right: 40, flexDirection: 'row' as const, justifyContent: 'space-between' as const },
  footerText: { fontSize: 7, color: c.textLight },
})

function SemanaItem({ semana, isLast }: { semana: Acao; isLast: boolean }) {
  return (
    <View style={isLast ? { ...s.semanaRow, borderBottom: 'none', marginBottom: 0, paddingBottom: 0 } : s.semanaRow} wrap={false}>
      <View style={s.semanaNum}>
        <Text style={s.semanaNumText}>S{semana.semana}</Text>
      </View>
      <View style={s.semanaContent}>
        <View style={{ flexDirection: 'row' as const, alignItems: 'center' as const }}>
          <Text style={s.semanaObj}>{semana.objetivo}</Text>
          <Text style={s.semanaTime}>{semana.tempo_estimado}</Text>
        </View>
        {semana.acoes.map((acao, i) => (
          <Text key={i} style={s.semanaAction}>• {acao}</Text>
        ))}
        <Text style={s.semanaEntregavel}>Entregavel: {semana.entregavel}</Text>
      </View>
    </View>
  )
}

function MesSection({ titulo, mes }: { titulo: string; mes: Mes }) {
  return (
    <View style={s.mesCard}>
      <Text style={s.mesTitle}>{titulo}</Text>
      <Text style={s.mesFoco}>Foco: {mes.foco}</Text>
      {mes.semanas.map((semana, idx) => (
        <SemanaItem key={semana.semana} semana={semana} isLast={idx === mes.semanas.length - 1} />
      ))}
    </View>
  )
}

function GapCard({ gap, index }: { gap: GapPrioritario; index: number }) {
  return (
    <View style={s.gapCard} wrap={false}>
      <View style={s.gapHeader}>
        <View style={s.gapNumber}>
          <Text style={s.gapNumberText}>{index + 1}</Text>
        </View>
        <Text style={s.gapName}>{gap.gap}</Text>
      </View>
      <Text style={s.gapLabel}>Impacto</Text>
      <Text style={s.gapText}>{gap.impacto}</Text>
      <Text style={s.gapLabel}>Solucao</Text>
      <Text style={s.gapText}>{gap.solucao}</Text>
    </View>
  )
}

function tipoLabel(tipo: string): string {
  if (tipo === 'curso') return 'CURSO'
  if (tipo === 'livro') return 'LIVRO'
  if (tipo === 'canal') return 'CANAL'
  return 'LINK'
}

function HabilidadeCard({ hab }: { hab: HabilidadeDesenvolver }) {
  const badgeStyle = hab.prioridade === 'alta' ? s.badgeAlta : hab.prioridade === 'media' ? s.badgeMedia : s.badgeBaixa
  const prioridadeLabel = hab.prioridade === 'alta' ? 'Alta' : hab.prioridade === 'media' ? 'Media' : 'Baixa'

  return (
    <View style={s.habCard} wrap={false}>
      <View style={s.habHeader}>
        <Text style={s.habName}>{hab.habilidade}</Text>
        <Text style={{ ...s.badge, ...badgeStyle }}>{prioridadeLabel}</Text>
      </View>
      {hab.recursos.map((rec, i) => (
        <View key={i} style={s.recursoRow}>
          <Text style={s.recursoTag}>{tipoLabel(rec.tipo)}</Text>
          <Text style={s.recursoNome}>{rec.nome}</Text>
        </View>
      ))}
    </View>
  )
}

function Footer() {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>PlanoAI</Text>
      <Text style={s.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  )
}

export function criarPlanoPDF(plano: {
  nome: string
  cargoAtual: string | null
  cargoObjetivo: string | null
  createdAt: Date
  planoGerado: unknown
}) {
  const pg = plano.planoGerado as PlanoGerado

  return (
    <Document>
      {/* Pagina 1: Header + Resumo + Gaps */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerLogo}>Plano<Text style={s.headerLogoAccent}>AI</Text></Text>
          <Text style={s.headerName}>Plano de Carreira de {plano.nome}</Text>
          <Text style={s.headerTransition}>
            {plano.cargoAtual}  {'->'}  {plano.cargoObjetivo}
          </Text>
          <Text style={s.headerDate}>
            Gerado em {new Date(plano.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </Text>
        </View>

        <Text style={s.sectionTitle}>Resumo Executivo</Text>
        <View style={s.sectionBar} />
        <View style={s.card}>
          <Text style={s.cardText}>{pg.resumo_executivo}</Text>
        </View>

        <Text style={s.sectionTitle}>Gaps Prioritarios</Text>
        <View style={s.sectionBar} />
        {pg.gaps_prioritarios.slice(0, 3).map((gap, i) => (
          <GapCard key={i} gap={gap} index={i} />
        ))}

        <Footer />
      </Page>

      {/* Pagina 2+: Plano 90 dias */}
      <Page size="A4" style={s.page}>
        <Text style={{ ...s.sectionTitle, marginTop: 0 }}>Plano 90 Dias</Text>
        <View style={s.sectionBar} />
        <MesSection titulo="Mes 1" mes={pg.plano_90_dias.mes1} />
        <MesSection titulo="Mes 2" mes={pg.plano_90_dias.mes2} />
        <MesSection titulo="Mes 3" mes={pg.plano_90_dias.mes3} />
        <Footer />
      </Page>

      {/* Pagina 3+: Habilidades + Promocao + Motivacional */}
      <Page size="A4" style={s.page}>
        <Text style={{ ...s.sectionTitle, marginTop: 0 }}>Habilidades para Desenvolver</Text>
        <View style={s.sectionBar} />
        {pg.habilidades_desenvolver.map((hab, i) => (
          <HabilidadeCard key={i} hab={hab} />
        ))}

        <Text style={s.sectionTitle}>Estrategia de Promocao</Text>
        <View style={s.sectionBar} />

        <View style={s.promoCard} wrap={false}>
          <Text style={s.promoLabel}>Timing ideal</Text>
          <Text style={s.promoText}>{pg.estrategia_promocao.timing_ideal}</Text>
        </View>

        <View style={s.promoCard} wrap={false}>
          <Text style={s.promoLabel}>Argumentos</Text>
          {pg.estrategia_promocao.argumentos.map((arg, i) => (
            <Text key={i} style={{ ...s.promoText, marginBottom: 3 }}>{i + 1}. {arg}</Text>
          ))}
        </View>

        <View style={s.scriptCard} wrap={false}>
          <Text style={s.promoLabel}>Script da conversa</Text>
          <Text style={s.promoText}>{pg.estrategia_promocao.script_conversa}</Text>
        </View>

        {pg.estrategia_promocao.alertas.length > 0 && (
          <View style={s.alertCard} wrap={false}>
            <Text style={{ ...s.promoLabel, color: '#92400e' }}>O que evitar</Text>
            {pg.estrategia_promocao.alertas.map((alerta, i) => (
              <Text key={i} style={s.alertText}>• {alerta}</Text>
            ))}
          </View>
        )}

        <View style={s.motivacional} wrap={false}>
          <Text style={s.motivacionalText}>"{pg.mensagem_motivacional}"</Text>
        </View>

        <Footer />
      </Page>
    </Document>
  )
}
