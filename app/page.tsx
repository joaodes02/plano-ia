'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#222]">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-5 text-left">
        <span className="text-[15px] font-medium text-white pr-4">{q}</span>
        <svg className={`h-5 w-5 shrink-0 text-[#666] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-5' : 'max-h-0'}`}>
        <p className="text-sm text-[#999] leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

const Check = () => (
  <svg className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const Star = () => (
  <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#181818] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-white tracking-tight">
            Plano<span className="text-indigo-400">AI</span>
          </span>
          <Link
            href="/formulario"
            className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#e5e5e5]"
          >
            Criar meu plano
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-5 sm:pt-36 sm:pb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-100 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-5 text-sm font-medium text-indigo-400 tracking-wide uppercase">
            Plano de carreira personalizado
          </p>

          <h1 className="mb-6 text-[2.25rem] font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            Conquiste o cargo que você merece nos próximos{' '}
            <span className="text-indigo-400">90 dias</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-base text-[#999] leading-relaxed sm:text-lg">
            Um plano de ação personalizado, semana a semana, com tudo que você precisa fazer para sair de onde está e chegar onde quer.
          </p>

          <Link
            href="/formulario"
            className="group inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-indigo-500 sm:text-lg"
          >
            Quero meu plano de carreira
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <p className="mt-4 text-sm text-[#555]">
            R$29,90 pagamento unico · Sem assinatura · Pronto em 2 minutos
          </p>
        </div>
      </section>

      {/* Barra de numeros */}
      <Section>
        <section className="border-y border-[#181818] py-10 px-5">
          <div className="mx-auto max-w-4xl grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { n: '+500', l: 'planos gerados' },
              { n: '90 dias', l: 'de plano detalhado' },
              { n: '12', l: 'semanas de metas' },
              { n: '4.8/5', l: 'de satisfacao' },
            ].map((i) => (
              <div key={i.l} className="text-center">
                <div className="text-2xl font-bold text-white sm:text-3xl">{i.n}</div>
                <div className="mt-1 text-xs text-[#666] uppercase tracking-wider">{i.l}</div>
              </div>
            ))}
          </div>
        </section>
      </Section>

      {/* Problema → Solucao */}
      <Section>
        <section className="py-20 px-5 sm:py-28">
          <div className="mx-auto max-w-5xl grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Problema */}
            <div>
              <p className="text-xs font-semibold text-red-400/80 uppercase tracking-wider mb-4">O problema</p>
              <h2 className="text-2xl font-bold text-white mb-6 sm:text-3xl leading-tight">
                Voce sabe onde quer chegar, mas nao sabe por onde comecar
              </h2>
              <div className="space-y-4">
                {[
                  'Fica perdido entre dezenas de cursos e conselhos genericos',
                  'Nao sabe o que falar na hora de pedir aumento ou promocao',
                  'Sente que esta estagnado enquanto colegas crescem',
                  'Nao tem um plano concreto — so vagas ideias do que fazer',
                ].map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-red-400/60 shrink-0" />
                    <p className="text-[15px] text-[#999]">{t}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solucao */}
            <div>
              <p className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider mb-4">A solucao</p>
              <h2 className="text-2xl font-bold text-white mb-6 sm:text-3xl leading-tight">
                Um plano claro, pratico e feito para a sua realidade
              </h2>
              <div className="space-y-4">
                {[
                  'Sabe exatamente o que estudar e praticar cada semana',
                  'Tem um script pronto para conversar com seu gestor',
                  'Identifica seus 3 principais gaps e como resolve-los',
                  'Acompanha seu progresso com metas e entregaveis claros',
                ].map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <Check />
                    <p className="text-[15px] text-[#ccc]">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Section>

      {/* O que voce recebe */}
      <Section>
        <section className="bg-[#0e0e0e] py-20 px-5 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">O que voce recebe</h2>
              <p className="mt-3 text-[#777] text-sm">Tudo incluso por R$29,90 — sem surpresas</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Analise de gaps', desc: 'Os 3 principais obstaculos que travam seu crescimento e como resolver cada um deles.', icon: '01' },
                { title: 'Plano 90 dias', desc: '12 semanas com objetivos, acoes e entregaveis claros — voce sabe o que fazer cada dia.', icon: '02' },
                { title: 'Recursos sob medida', desc: 'Cursos, livros e materiais selecionados para sua area e estilo de aprendizado.', icon: '03' },
                { title: 'Script de promocao', desc: 'Argumentos personalizados e o momento certo para abordar o assunto com seu gestor.', icon: '04' },
                { title: 'Resumo executivo', desc: 'Analise profunda do seu perfil, oportunidades e viabilidade do seu objetivo.', icon: '05' },
                { title: 'PDF profissional', desc: 'Baixe seu plano completo em PDF e acesse quando quiser, de qualquer lugar.', icon: '06' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-[#1a1a1a] bg-[#111] p-6 transition hover:border-[#2a2a2a]">
                  <span className="text-xs font-bold text-indigo-400/60 mb-3 block">{item.icon}</span>
                  <h3 className="mb-2 text-[15px] font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-[#888] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Section>

      {/* Depoimentos */}
      <Section>
        <section className="py-20 px-5 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Quem ja usou, recomenda</h2>
              <p className="mt-3 text-[#777] text-sm">Veja o que nossos usuarios estao dizendo</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Mariana S.',
                  role: 'Analista de Marketing',
                  text: 'Em 2 meses seguindo o plano, consegui a promocao que esperava ha mais de 1 ano. O script de conversa com meu gestor fez toda a diferenca.',
                  initials: 'MS',
                },
                {
                  name: 'Rafael C.',
                  role: 'Desenvolvedor Junior',
                  text: 'O plano me mostrou exatamente os gaps que eu nao enxergava. Comecei a estudar as coisas certas e em 3 meses passei para pleno.',
                  initials: 'RC',
                },
                {
                  name: 'Camila O.',
                  role: 'Coordenadora de RH',
                  text: 'Estava perdida sobre como crescer na carreira. O PlanoAI me deu um roteiro claro com acoes praticas para cada semana. Super recomendo.',
                  initials: 'CO',
                },
              ].map((d) => (
                <div key={d.name} className="rounded-xl border border-[#1a1a1a] bg-[#111] p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} />)}
                  </div>
                  <p className="text-sm text-[#bbb] leading-relaxed mb-5">"{d.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                      {d.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{d.name}</p>
                      <p className="text-xs text-[#666]">{d.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Section>

      {/* Como funciona */}
      <Section>
        <section className="bg-[#0e0e0e] py-20 px-5 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-14">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Como funciona</h2>
              <p className="mt-3 text-[#777] text-sm">3 passos simples para ter seu plano em maos</p>
            </div>

            <div className="space-y-0">
              {[
                { step: '1', title: 'Preencha o formulario', desc: 'Responda perguntas sobre seu cargo atual, objetivo, habilidades e o que te falta. Leva menos de 5 minutos.' },
                { step: '2', title: 'Faca o pagamento', desc: 'Pague R$29,90 via PIX ou cartao de credito. Compra unica, sem assinatura.' },
                { step: '3', title: 'Receba seu plano', desc: 'Em menos de 2 minutos, seu plano personalizado de 90 dias esta pronto. Voce tambem recebe por email.' },
              ].map((item, idx) => (
                <div key={item.step} className="flex gap-5 py-6">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
                      {item.step}
                    </div>
                    {idx < 2 && <div className="w-px flex-1 bg-[#1a1a1a] mt-2" />}
                  </div>
                  <div className="pb-2">
                    <h3 className="text-[15px] font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-[#888] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Section>

      {/* FAQ */}
      <Section>
        <section className="py-20 px-5 sm:py-28">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Perguntas frequentes</h2>
            </div>

            <div>
              <FAQItem
                q="Funciona para qualquer area profissional?"
                a="Sim! O plano e gerado com base nos seus dados reais — cargo, area, habilidades e objetivo. Funciona para tecnologia, marketing, vendas, RH, financas, saude e qualquer outra area."
              />
              <FAQItem
                q="Quanto tempo leva para receber meu plano?"
                a="Menos de 2 minutos apos a confirmacao do pagamento. Voce recebe na tela e tambem por email."
              />
              <FAQItem
                q="Posso baixar o plano em PDF?"
                a="Sim, voce pode baixar um PDF profissional com todo o conteudo do seu plano — analise de gaps, plano semana a semana, recursos e estrategia de promocao."
              />
              <FAQItem
                q="O pagamento e unico ou e assinatura?"
                a="Pagamento unico de R$29,90. Sem assinatura, sem cobrancas recorrentes e sem surpresas."
              />
              <FAQItem
                q="Quais formas de pagamento sao aceitas?"
                a="Aceitamos PIX e cartao de credito. O pagamento e processado de forma segura pela AbacatePay."
              />
            </div>
          </div>
        </section>
      </Section>

      {/* CTA Final */}
      <Section>
        <section className="pb-20 px-5 sm:pb-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
              Pronto para dar o proximo passo na sua carreira?
            </h2>
            <p className="mb-8 text-[#888] text-base">
              Pare de esperar o momento certo. O momento e agora.
            </p>

            <Link
              href="/formulario"
              className="group inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-indigo-500 sm:text-lg"
            >
              Criar meu plano agora — R$29,90
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-[#555]">
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pagamento seguro
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sem assinatura
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pronto em 2 minutos
              </span>
            </div>
          </div>
        </section>
      </Section>

      {/* Footer */}
      <footer className="border-t border-[#181818] py-8 px-5 text-center text-xs text-[#555]">
        <p>© {new Date().getFullYear()} PlanoAI — Todos os direitos reservados</p>
      </footer>
    </main>
  )
}
