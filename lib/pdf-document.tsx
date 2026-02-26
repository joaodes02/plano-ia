import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { PlanoGerado, Mes, Acao, GapPrioritario, HabilidadeDesenvolver } from '@/types'

/* ── Brand palette ──────────────────────────────────────────────── */
const c = {
  black: '#0C0B08',
  gold: '#C8923A',
  goldLight: '#D9A44B',
  goldMuted: '#C8923A',
  cream: '#EDE4D3',
  dark: '#1A1914',
  text: '#2E2B24',
  textBody: '#3D3A33',
  textMuted: '#6B665C',
  border: '#D6D0C4',
  borderLight: '#E8E3D9',
  bg: '#F8F6F2',
  bgAlt: '#F1EDE6',
  white: '#FFFFFF',
  red: '#9B2C2C',
  amber: '#92400E',
  green: '#276749',
}

const pad = (n: number) => String(n).padStart(2, '0')

/* ── Styles ─────────────────────────────────────────────────────── */
const s = StyleSheet.create({

  /* Cover page */
  coverPage: {
    backgroundColor: c.black,
    padding: 0,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  coverContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 56,
    paddingBottom: 64,
  },
  coverTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: c.gold,
  },
  coverBrand: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: c.gold,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 48,
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: 'Times-Roman',
    color: c.cream,
    lineHeight: 1.2,
    marginBottom: 6,
  },
  coverTitleItalic: {
    fontSize: 32,
    fontFamily: 'Times-Italic',
    color: c.gold,
    lineHeight: 1.2,
  },
  coverName: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: c.cream,
    marginTop: 24,
    letterSpacing: 0.5,
  },
  coverTransition: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: c.gold,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  coverDivider: {
    width: 48,
    height: 1,
    backgroundColor: c.gold,
    marginTop: 32,
    marginBottom: 16,
    opacity: 0.4,
  },
  coverDate: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#5E5849',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  coverFooter: {
    position: 'absolute',
    bottom: 32,
    right: 56,
  },
  coverFooterText: {
    fontSize: 7,
    fontFamily: 'Helvetica',
    color: '#3E3A30',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  /* Interior pages */
  page: {
    padding: 52,
    paddingBottom: 64,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: c.textBody,
    backgroundColor: c.white,
  },

  /* Page header strip */
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    paddingBottom: 12,
    borderBottom: `0.75 solid ${c.border}`,
  },
  pageHeaderBrand: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: c.textMuted,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  pageHeaderRight: {
    fontSize: 7,
    fontFamily: 'Helvetica',
    color: c.textMuted,
    letterSpacing: 1,
  },

  /* Section headers */
  sectionHeader: {
    marginBottom: 18,
    marginTop: 4,
  },
  sectionNumber: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: c.gold,
    letterSpacing: 2,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Times-Roman',
    color: c.black,
    letterSpacing: 0.3,
  },
  sectionRule: {
    width: 32,
    height: 1.5,
    backgroundColor: c.gold,
    marginTop: 10,
  },

  /* Body text */
  bodyText: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: c.textBody,
    lineHeight: 1.7,
  },
  bodyCard: {
    backgroundColor: c.bg,
    padding: 16,
    marginBottom: 16,
    borderLeft: `2 solid ${c.gold}`,
  },

  /* Gap cards */
  gapCard: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottom: `0.5 solid ${c.borderLight}`,
  },
  gapCardLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottom: 'none',
  },
  gapHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  gapNum: {
    fontSize: 22,
    fontFamily: 'Times-Roman',
    color: c.gold,
    marginRight: 12,
    lineHeight: 1,
    minWidth: 24,
  },
  gapTitleWrap: {
    flex: 1,
    paddingTop: 4,
  },
  gapName: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: c.black,
    marginBottom: 2,
  },
  gapFieldLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: c.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 3,
    marginTop: 8,
  },
  gapFieldText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: c.textBody,
    lineHeight: 1.6,
    paddingLeft: 36,
  },

  /* Month / week plan */
  mesBlock: {
    marginBottom: 20,
  },
  mesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: `1 solid ${c.black}`,
  },
  mesNum: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: c.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginRight: 12,
  },
  mesTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: c.black,
    flex: 1,
  },
  mesFoco: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Oblique',
    color: c.textMuted,
    marginBottom: 12,
    paddingLeft: 1,
  },

  semanaRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: `0.5 solid ${c.borderLight}`,
  },
  semanaRowLast: {
    flexDirection: 'row',
    marginBottom: 0,
    paddingBottom: 0,
  },
  semanaLabel: {
    width: 52,
    paddingTop: 1,
  },
  semanaLabelText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: c.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  semanaTime: {
    fontSize: 6.5,
    fontFamily: 'Helvetica',
    color: c.textMuted,
    marginTop: 2,
  },
  semanaContent: {
    flex: 1,
  },
  semanaObj: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: c.black,
    marginBottom: 4,
  },
  semanaAction: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: c.textBody,
    lineHeight: 1.5,
    paddingLeft: 8,
    marginTop: 1,
  },
  semanaEntregavel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: c.gold,
    marginTop: 5,
    letterSpacing: 0.3,
  },

  /* Skills */
  habCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: `0.5 solid ${c.borderLight}`,
  },
  habCardLast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
    paddingBottom: 0,
  },
  habLeft: {
    flex: 1,
  },
  habName: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: c.black,
    marginBottom: 4,
  },
  habBadge: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    marginTop: 1,
  },
  habBadgeAlta: { backgroundColor: '#FBF0F0', color: c.red },
  habBadgeMedia: { backgroundColor: '#FDF8ED', color: c.amber },
  habBadgeBaixa: { backgroundColor: '#F0F7F3', color: c.green },
  recursoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    paddingLeft: 2,
  },
  recursoTag: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: c.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginRight: 6,
    width: 36,
  },
  recursoNome: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: c.textBody,
    flex: 1,
  },

  /* Promotion strategy */
  promoBlock: {
    marginBottom: 14,
  },
  promoLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: c.gold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  promoText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: c.textBody,
    lineHeight: 1.6,
  },
  scriptBox: {
    backgroundColor: c.bg,
    padding: 14,
    borderLeft: `2 solid ${c.gold}`,
    marginBottom: 14,
  },
  alertBox: {
    backgroundColor: '#FFFBF0',
    padding: 14,
    borderLeft: `2 solid ${c.amber}`,
    marginBottom: 14,
  },
  alertLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: c.amber,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  alertText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: c.amber,
    lineHeight: 1.6,
  },

  /* Motivational */
  motivacionalBox: {
    backgroundColor: c.black,
    padding: 28,
    marginTop: 20,
  },
  motivacionalText: {
    fontSize: 11,
    fontFamily: 'Times-Italic',
    color: c.cream,
    lineHeight: 1.8,
    textAlign: 'center',
  },
  motivacionalAttr: {
    fontSize: 7,
    fontFamily: 'Helvetica',
    color: c.gold,
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 52,
    right: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTop: `0.5 solid ${c.borderLight}`,
  },
  footerBrand: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: c.textMuted,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  footerPage: {
    fontSize: 6.5,
    fontFamily: 'Helvetica',
    color: c.textMuted,
    letterSpacing: 1,
  },
})

/* ── Helper Components ──────────────────────────────────────────── */

function PageHeaderStrip({ nome }: { nome: string }) {
  return (
    <View style={s.pageHeader} fixed>
      <Text style={s.pageHeaderBrand}>Carreira Inteligente</Text>
      <Text style={s.pageHeaderRight}>{nome}</Text>
    </View>
  )
}

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionNumber}>{num}</Text>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionRule} />
    </View>
  )
}

function PageFooter() {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerBrand}>Carreira Inteligente</Text>
      <Text style={s.footerPage} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  )
}

function GapCard({ gap, index, isLast }: { gap: GapPrioritario; index: number; isLast: boolean }) {
  return (
    <View style={isLast ? { ...s.gapCard, ...s.gapCardLast } : s.gapCard} wrap={false}>
      <View style={s.gapHeader}>
        <Text style={s.gapNum}>{pad(index + 1)}</Text>
        <View style={s.gapTitleWrap}>
          <Text style={s.gapName}>{gap.gap}</Text>
        </View>
      </View>
      <Text style={s.gapFieldLabel}>Impacto</Text>
      <Text style={s.gapFieldText}>{gap.impacto}</Text>
      <Text style={s.gapFieldLabel}>Solucao</Text>
      <Text style={s.gapFieldText}>{gap.solucao}</Text>
    </View>
  )
}

function SemanaItem({ semana, isLast }: { semana: Acao; isLast: boolean }) {
  return (
    <View style={isLast ? s.semanaRowLast : s.semanaRow} wrap={false}>
      <View style={s.semanaLabel}>
        <Text style={s.semanaLabelText}>Sem {pad(semana.semana)}</Text>
        <Text style={s.semanaTime}>{semana.tempo_estimado}</Text>
      </View>
      <View style={s.semanaContent}>
        <Text style={s.semanaObj}>{semana.objetivo}</Text>
        {semana.acoes.map((acao, i) => (
          <Text key={i} style={s.semanaAction}>—  {acao}</Text>
        ))}
        <Text style={s.semanaEntregavel}>Entregavel: {semana.entregavel}</Text>
      </View>
    </View>
  )
}

function MesSection({ num, mes }: { num: number; mes: Mes }) {
  return (
    <View style={s.mesBlock}>
      <View style={s.mesHeader}>
        <Text style={s.mesNum}>MES {pad(num)}</Text>
        <Text style={s.mesTitle}>{mes.foco}</Text>
      </View>
      {mes.semanas.map((semana, idx) => (
        <SemanaItem key={semana.semana} semana={semana} isLast={idx === mes.semanas.length - 1} />
      ))}
    </View>
  )
}

function tipoLabel(tipo: string): string {
  if (tipo === 'curso') return 'CURSO'
  if (tipo === 'livro') return 'LIVRO'
  if (tipo === 'canal') return 'CANAL'
  return 'LINK'
}

function HabilidadeCard({ hab, isLast }: { hab: HabilidadeDesenvolver; isLast: boolean }) {
  const badgeStyle = hab.prioridade === 'alta' ? s.habBadgeAlta
    : hab.prioridade === 'media' ? s.habBadgeMedia : s.habBadgeBaixa
  const label = hab.prioridade === 'alta' ? 'Alta' : hab.prioridade === 'media' ? 'Media' : 'Baixa'

  return (
    <View style={isLast ? s.habCardLast : s.habCard} wrap={false}>
      <View style={s.habLeft}>
        <Text style={s.habName}>{hab.habilidade}</Text>
        {hab.recursos.map((rec, i) => (
          <View key={i} style={s.recursoRow}>
            <Text style={s.recursoTag}>{tipoLabel(rec.tipo)}</Text>
            <Text style={s.recursoNome}>{rec.nome}</Text>
          </View>
        ))}
      </View>
      <Text style={{ ...s.habBadge, ...badgeStyle }}>{label}</Text>
    </View>
  )
}

/* ── Main Document ──────────────────────────────────────────────── */

export function criarPlanoPDF(plano: {
  nome: string
  cargoAtual: string | null
  cargoObjetivo: string | null
  createdAt: Date
  planoGerado: unknown
}) {
  const pg = plano.planoGerado as PlanoGerado
  const dateStr = new Date(plano.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document>

      {/* ── Cover Page ────────────────────────────────────────────── */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverTopBar} />
        <View style={s.coverContent}>
          <Text style={s.coverBrand}>Carreira Inteligente</Text>
          <Text style={s.coverTitle}>
            Plano de Carreira{'\n'}
            <Text style={s.coverTitleItalic}>90 Dias</Text>
          </Text>
          <Text style={s.coverName}>{plano.nome}</Text>
          <Text style={s.coverTransition}>
            {plano.cargoAtual}  {'\u2192'}  {plano.cargoObjetivo}
          </Text>
          <View style={s.coverDivider} />
          <Text style={s.coverDate}>Gerado em {dateStr}</Text>
        </View>
        <View style={s.coverFooter}>
          <Text style={s.coverFooterText}>Confidencial</Text>
        </View>
      </Page>

      {/* ── Section 01: Resumo Executivo ──────────────────────────── */}
      <Page size="A4" style={s.page}>
        <PageHeaderStrip nome={plano.nome} />
        <SectionHead num="01" title="Resumo Executivo" />
        <View style={s.bodyCard}>
          <Text style={s.bodyText}>{pg.resumo_executivo}</Text>
        </View>

        {/* ── Section 02: Gaps Prioritarios ──────────────────────── */}
        <SectionHead num="02" title={`Gaps Prioritarios`} />
        {pg.gaps_prioritarios.slice(0, 3).map((gap, i) => (
          <GapCard key={i} gap={gap} index={i} isLast={i === Math.min(pg.gaps_prioritarios.length, 3) - 1} />
        ))}
        <PageFooter />
      </Page>

      {/* ── Section 03: Plano 90 Dias ─────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <PageHeaderStrip nome={plano.nome} />
        <SectionHead num="03" title="Plano de Acao — 90 Dias" />
        <MesSection num={1} mes={pg.plano_90_dias.mes1} />
        <MesSection num={2} mes={pg.plano_90_dias.mes2} />
        <MesSection num={3} mes={pg.plano_90_dias.mes3} />
        <PageFooter />
      </Page>

      {/* ── Section 04: Habilidades ───────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <PageHeaderStrip nome={plano.nome} />
        <SectionHead num="04" title="Habilidades para Desenvolver" />
        {pg.habilidades_desenvolver.map((hab, i) => (
          <HabilidadeCard key={i} hab={hab} isLast={i === pg.habilidades_desenvolver.length - 1} />
        ))}

        {/* ── Section 05: Estrategia de Promocao ─────────────────── */}
        <SectionHead num="05" title={`Estrategia de Promocao`} />

        <View style={s.promoBlock} wrap={false}>
          <Text style={s.promoLabel}>Timing Ideal</Text>
          <Text style={s.promoText}>{pg.estrategia_promocao.timing_ideal}</Text>
        </View>

        <View style={s.promoBlock} wrap={false}>
          <Text style={s.promoLabel}>Argumentos</Text>
          {pg.estrategia_promocao.argumentos.map((arg, i) => (
            <Text key={i} style={{ ...s.promoText, marginBottom: 3 }}>
              {pad(i + 1)}.  {arg}
            </Text>
          ))}
        </View>

        <View style={s.scriptBox} wrap={false}>
          <Text style={s.promoLabel}>Script da Conversa</Text>
          <Text style={s.promoText}>{pg.estrategia_promocao.script_conversa}</Text>
        </View>

        {pg.estrategia_promocao.alertas.length > 0 && (
          <View style={s.alertBox} wrap={false}>
            <Text style={s.alertLabel}>O que Evitar</Text>
            {pg.estrategia_promocao.alertas.map((alerta, i) => (
              <Text key={i} style={s.alertText}>—  {alerta}</Text>
            ))}
          </View>
        )}

        {/* ── Motivational close ─────────────────────────────────── */}
        <View style={s.motivacionalBox} wrap={false}>
          <Text style={s.motivacionalText}>&ldquo;{pg.mensagem_motivacional}&rdquo;</Text>
          <Text style={s.motivacionalAttr}>Sua jornada comeca agora</Text>
        </View>

        <PageFooter />
      </Page>

    </Document>
  )
}
