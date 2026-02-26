'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, visible } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
      }}
    >
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 mb-8"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      <div className="h-px w-8 bg-[#C8923A]/50" />
      <span className="text-[10px] tracking-[0.2em] text-[#C8923A]/60 uppercase">
        {children}
      </span>
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#1D1B14]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left gap-4"
      >
        <span
          className="text-[15px] font-medium text-[#EDE4D3]"
          style={{ fontFamily: 'var(--font-dm)' }}
        >
          {q}
        </span>
        <div
          className="shrink-0 h-6 w-6 border border-[#C8923A]/25 flex items-center justify-center transition-all duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
        >
          <span className="text-[#C8923A] text-sm leading-none select-none">+</span>
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '160px' : '0', paddingBottom: open ? '20px' : '0' }}
      >
        <p
          className="text-sm text-[#4A4540] leading-relaxed"
          style={{ fontFamily: 'var(--font-dm)' }}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

const TICKER = 'PROMOÇÃO · CRESCIMENTO · LIDERANÇA · DESENVOLVIMENTO · RECONHECIMENTO · OPORTUNIDADE · RESULTADO · CLAREZA · EVOLUÇÃO · '

export default function LandingPage() {
  return (
    <main
      className="min-h-screen bg-[#0C0B08] overflow-x-hidden"
      style={{ fontFamily: 'var(--font-dm)', color: '#EDE4D3' }}
    >
      <div className="grain-fix" aria-hidden />

      {/* ─── Nav ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1D1B14] bg-[#0C0B08]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="text-[17px] font-bold leading-none" style={{ fontFamily: 'var(--font-fraunces)' }}>
            <span className="text-[#EDE4D3]">Carreira </span>
            <em style={{ fontStyle: 'italic', color: '#C8923A' }}>Inteligente</em>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/meu-plano"
              className="text-[11px] text-[#5E5849] tracking-[0.1em] hover:text-[#C8923A] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              JÁ TENHO UM PLANO
            </Link>
            <Link
              href="/formulario"
              className="shine border border-[#C8923A] px-5 py-2 text-[11px] font-bold text-[#C8923A] tracking-[0.12em] transition-all duration-300 hover:bg-[#C8923A] hover:text-[#0C0B08]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              CRIAR MEU PLANO
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Decorative "90" watermark */}
        <div
          className="absolute right-[-2vw] bottom-0 pointer-events-none select-none text-[42vw] font-black text-white/[0.018] leading-none"
          style={{ fontFamily: 'var(--font-fraunces)', lineHeight: 0.88 }}
          aria-hidden
        >
          90
        </div>

        {/* Vertical accent line */}
        <div
          className="absolute top-0 right-[28%] h-full w-px pointer-events-none hidden lg:block"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(200,146,58,0.07) 45%, transparent)' }}
        />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 w-full py-24 sm:py-32">
          <div className="max-w-3xl">
            <div
              className="hero-badge flex items-center gap-3 mb-10"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <div className="h-px w-8 bg-[#C8923A]" />
              <span className="text-[10px] tracking-[0.18em] text-[#C8923A]/65">
                PLANO DE CARREIRA · IA GENERATIVA
              </span>
            </div>

            <h1
              className="hero-h1 mb-6 leading-[1.02] tracking-tight text-[#EDE4D3]"
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                fontWeight: 900,
              }}
            >
              Da onde você está<br />
              <em
                className="not-italic"
                style={{ color: '#C8923A', fontStyle: 'italic', fontFamily: 'var(--font-fraunces)' }}
              >
                para onde
              </em>
              <br />
              quer ir.
            </h1>

            <p className="hero-sub mb-10 text-[#5E5849] text-base sm:text-lg leading-relaxed max-w-lg">
              Um roteiro personalizado de{' '}
              <strong className="text-[#EDE4D3]/50 font-medium">90 dias</strong>, semana a semana,
              com tudo que você precisa para sair do lugar e chegar onde quer.
            </p>

            <div className="hero-cta flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Link
                href="/formulario"
                className="shine group inline-flex items-center gap-3 bg-[#C8923A] px-7 py-3.5 text-[#0C0B08] font-bold text-base transition-all duration-300 hover:bg-[#D9A44B]"
              >
                <span style={{ fontFamily: 'var(--font-dm)' }}>Quero meu plano</span>
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <span
                className="text-[10px] text-[#2E2B24] tracking-[0.15em]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                A PARTIR DE R$24,90 · SEM ASSINATURA
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Ticker ───────────────────────────────────────────────────── */}
      <div className="border-y border-[#1D1B14] py-3.5 overflow-hidden bg-[#0F0E0B]">
        <div className="ticker-track">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-[10px] tracking-[0.22em] text-[#2E2B24] pr-0"
              style={{ fontFamily: 'var(--font-mono)', minWidth: 'max-content' }}
            >
              {TICKER}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Stats ────────────────────────────────────────────────────── */}
      <Reveal>
        <section className="py-14 px-5 sm:px-8 bg-[#0F0E0B]">
          <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#1D1B14]">
            {[
              { n: '+500', l: 'Planos gerados' },
              { n: '90', l: 'Dias de plano' },
              { n: '12', l: 'Semanas de metas' },
              { n: '4.8', l: 'Satisfação média' },
            ].map((s) => (
              <div key={s.l} className="text-center py-4 px-4 sm:px-8">
                <div
                  className="text-4xl sm:text-5xl font-black text-[#EDE4D3] leading-none mb-2"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  {s.n}
                </div>
                <div
                  className="text-[10px] tracking-[0.15em] text-[#2E2B24] uppercase"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <div
        className="h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #C8923A, transparent)' }}
      />

      {/* ─── Problema → Solução ───────────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-5 sm:px-8">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-24">

          <Reveal>
            <div>
              <div
                className="flex items-center gap-3 mb-8"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <div className="h-px w-8 bg-red-400/30" />
                <span className="text-[10px] tracking-[0.2em] text-red-400/45 uppercase">
                  O Problema
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl lg:text-[2.2rem] font-black text-[#EDE4D3] mb-10 leading-tight"
                style={{ fontFamily: 'var(--font-fraunces)' }}
              >
                Você sabe onde quer chegar, mas não sabe por onde começar.
              </h2>
              <div className="space-y-5">
                {[
                  'Perdido entre dezenas de cursos e conselhos genéricos',
                  'Sem saber o que falar ao pedir aumento ou promoção',
                  'Estagnado enquanto colegas crescem ao seu redor',
                  'Sem plano concreto — só vagas ideias do que fazer',
                ].map((t) => (
                  <div key={t} className="flex items-start gap-4">
                    <span
                      className="text-red-400/35 text-xs mt-0.5 shrink-0 w-4"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      ✕
                    </span>
                    <p className="text-[14px] text-[#3E3A30] leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div>
              <Label>A Solução</Label>
              <h2
                className="text-2xl sm:text-3xl lg:text-[2.2rem] font-black text-[#EDE4D3] mb-10 leading-tight"
                style={{ fontFamily: 'var(--font-fraunces)' }}
              >
                Um plano claro, prático e feito para a sua realidade.
              </h2>
              <div className="space-y-5">
                {[
                  'Sabe exatamente o que estudar e praticar cada semana',
                  'Tem um script pronto para conversar com seu gestor',
                  'Identifica seus 3 principais gaps e como resolvê-los',
                  'Acompanha progresso com metas e entregáveis claros',
                ].map((t) => (
                  <div key={t} className="flex items-start gap-4">
                    <span className="text-[#C8923A] text-sm mt-0.5 shrink-0 w-4">→</span>
                    <p className="text-[14px] text-[#7A7068] leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div
        className="h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #C8923A, transparent)' }}
      />

      {/* ─── O que você recebe ────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-5 sm:px-8 bg-[#0F0E0B]">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-end justify-between gap-8 flex-wrap mb-16">
              <h2
                className="text-4xl sm:text-5xl font-black text-[#EDE4D3] leading-tight"
                style={{ fontFamily: 'var(--font-fraunces)' }}
              >
                O que você<br />
                <em style={{ fontStyle: 'italic', color: '#C8923A' }}>recebe</em>
              </h2>
              <span
                className="text-[10px] text-[#2E2B24] tracking-[0.15em] self-end pb-2"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                A PARTIR DE R$24,90 — SEM SURPRESAS
              </span>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1D1B14]">
            {[
              { n: '01', title: 'Análise de gaps', desc: 'Os 3 principais obstáculos que travam seu crescimento e como resolver cada um deles.' },
              { n: '02', title: 'Plano 90 dias', desc: '12 semanas com objetivos, ações e entregáveis claros — você sabe o que fazer cada dia.' },
              { n: '03', title: 'Recursos sob medida', desc: 'Cursos, livros e materiais selecionados para sua área e estilo de aprendizado.' },
              { n: '04', title: 'Script de promoção', desc: 'Argumentos personalizados e o momento certo para abordar o assunto com seu gestor.' },
              { n: '05', title: 'Resumo executivo', desc: 'Análise profunda do seu perfil, oportunidades e viabilidade do seu objetivo.' },
              { n: '06', title: 'PDF profissional', desc: 'Baixe seu plano completo em PDF e acesse quando quiser, de qualquer lugar.' },
            ].map((item) => (
              <Reveal key={item.n}>
                <div className="group bg-[#0F0E0B] p-8 h-full transition-colors duration-300 hover:bg-[#131109]">
                  <span
                    className="text-[10px] text-[#C8923A]/25 mb-6 block tracking-widest"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {item.n}
                  </span>
                  <h3
                    className="text-[17px] font-bold text-[#EDE4D3] mb-3 leading-snug group-hover:text-[#C8923A] transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-fraunces)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-[#3E3A30] leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Como funciona ────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-5 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Label>Como funciona</Label>
          </Reveal>

          <div className="space-y-0">
            {[
              { n: '01', title: 'Preencha o formulário', desc: 'Responda perguntas sobre seu cargo, objetivo, habilidades e o que te falta. Leva menos de 5 minutos.' },
              { n: '02', title: 'Faça o pagamento', desc: 'Pague via PIX (R$24,90) ou cartão (R$27,90). Compra única, sem assinatura.' },
              { n: '03', title: 'Receba seu plano', desc: 'Em menos de 2 minutos, seu plano personalizado de 90 dias está pronto. Você também recebe por email.' },
            ].map((step, idx) => (
              <Reveal key={step.n} delay={idx * 80}>
                <div className="grid grid-cols-[72px_1fr] sm:grid-cols-[110px_1fr] items-start border-b border-[#1D1B14] py-10 gap-6">
                  <div
                    className="text-[3.5rem] sm:text-[5rem] font-black text-[#1D1B14] leading-none"
                    style={{ fontFamily: 'var(--font-fraunces)' }}
                  >
                    {step.n}
                  </div>
                  <div className="pt-1.5">
                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#EDE4D3] mb-2 leading-tight"
                      style={{ fontFamily: 'var(--font-fraunces)' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[14px] text-[#3E3A30] leading-relaxed max-w-md">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Depoimentos ──────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-5 sm:px-8 bg-[#0F0E0B] border-t border-[#1D1B14]">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-16">
              <Label>Depoimentos</Label>
              <h2
                className="text-4xl sm:text-5xl font-black text-[#EDE4D3] leading-tight"
                style={{ fontFamily: 'var(--font-fraunces)' }}
              >
                Quem já usou,<br />
                <em style={{ fontStyle: 'italic', color: '#C8923A' }}>recomenda.</em>
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-px bg-[#1D1B14]">
            {[
              { name: 'Mariana S.', role: 'Analista de Marketing', text: 'Em 2 meses seguindo o plano, consegui a promoção que esperava há mais de 1 ano. O script de conversa com meu gestor fez toda a diferença.', initials: 'MS' },
              { name: 'Rafael C.', role: 'Desenvolvedor Junior', text: 'O plano me mostrou exatamente os gaps que eu não enxergava. Comecei a estudar as coisas certas e em 3 meses passei para pleno.', initials: 'RC' },
              { name: 'Camila O.', role: 'Coordenadora de RH', text: 'Estava perdida sobre como crescer na carreira. O PlanoAI me deu um roteiro claro com ações práticas para cada semana. Super recomendo.', initials: 'CO' },
            ].map((d) => (
              <Reveal key={d.name}>
                <div className="bg-[#0F0E0B] p-8 flex flex-col h-full">
                  <div
                    className="text-[5rem] leading-none text-[#C8923A]/10 mb-2 select-none"
                    style={{ fontFamily: 'var(--font-fraunces)' }}
                    aria-hidden
                  >
                    "
                  </div>
                  <p className="text-[14px] text-[#5E5849] leading-relaxed mb-8 flex-1">
                    {d.text}
                  </p>
                  <div className="flex items-center gap-3 border-t border-[#1D1B14] pt-5">
                    <div
                      className="h-9 w-9 bg-[#1D1B14] flex items-center justify-center text-xs font-bold text-[#C8923A]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {d.initials}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#EDE4D3]">{d.name}</p>
                      <p
                        className="text-[10px] tracking-[0.1em] text-[#2E2B24]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {d.role.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Final ────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-5 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="relative border border-[#C8923A]/12 p-10 sm:p-16 text-center overflow-hidden">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#C8923A]/35" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#C8923A]/35" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#C8923A]/35" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#C8923A]/35" />

              <div
                className="text-[10px] tracking-[0.22em] text-[#C8923A]/45 mb-8"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                PRÓXIMO PASSO
              </div>

              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#EDE4D3] mb-5 leading-tight"
                style={{ fontFamily: 'var(--font-fraunces)' }}
              >
                Pronto para dar o<br />
                próximo passo?
              </h2>
              <p className="text-[#3E3A30] text-base mb-10 max-w-md mx-auto leading-relaxed">
                Pare de esperar o momento certo.{' '}
                <span className="text-[#5E5849]">O momento é agora.</span>
              </p>

              <Link
                href="/formulario"
                className="shine group inline-flex items-center gap-3 bg-[#C8923A] px-8 py-4 text-[#0C0B08] font-bold text-base transition-all duration-300 hover:bg-[#D9A44B]"
              >
                Criar meu plano — a partir de R$24,90
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <div
                className="mt-8 flex flex-wrap items-center justify-center gap-5 text-[10px] text-[#2E2B24] tracking-[0.15em]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <span>PAGAMENTO SEGURO</span>
                <span className="opacity-30">·</span>
                <span>SEM ASSINATURA</span>
                <span className="opacity-30">·</span>
                <span>PRONTO EM 2 MINUTOS</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-5 sm:px-8 border-t border-[#1D1B14]">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="mb-14">
              <Label>FAQ</Label>
              <h2
                className="text-3xl sm:text-4xl font-black text-[#EDE4D3] leading-tight"
                style={{ fontFamily: 'var(--font-fraunces)' }}
              >
                Perguntas<br />
                <em style={{ fontStyle: 'italic', color: '#C8923A' }}>frequentes</em>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div>
              <FAQItem
                q="Funciona para qualquer área profissional?"
                a="Sim! O plano é gerado com base nos seus dados reais — cargo, área, habilidades e objetivo. Funciona para tecnologia, marketing, vendas, RH, finanças, saúde e qualquer outra área."
              />
              <FAQItem
                q="Quanto tempo leva para receber meu plano?"
                a="Menos de 2 minutos após a confirmação do pagamento. Você recebe na tela e também por email."
              />
              <FAQItem
                q="Posso baixar o plano em PDF?"
                a="Sim, você pode baixar um PDF profissional com todo o conteúdo do seu plano — análise de gaps, plano semana a semana, recursos e estratégia de promoção."
              />
              <FAQItem
                q="O pagamento é único ou é assinatura?"
                a="Pagamento único a partir de R$24,90. Sem assinatura, sem cobranças recorrentes e sem surpresas."
              />
              <FAQItem
                q="Quais formas de pagamento são aceitas?"
                a="Aceitamos PIX e cartão de crédito. O pagamento é processado de forma segura pela AbacatePay."
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1D1B14] py-8 px-5 sm:px-8">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
          <p
            className="text-[10px] tracking-[0.15em] text-[#2E2B24]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            © {new Date().getFullYear()} PLANOAI · TODOS OS DIREITOS RESERVADOS
          </p>
          <div
            className="flex items-center gap-6 text-[10px] tracking-[0.12em] text-[#2E2B24]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <Link href="/privacidade" className="hover:text-[#C8923A]/60 transition-colors duration-200">
              PRIVACIDADE
            </Link>
            <Link href="/termos" className="hover:text-[#C8923A]/60 transition-colors duration-200">
              TERMOS
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
