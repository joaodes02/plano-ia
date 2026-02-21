import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e1e] bg-[#0f0f0f]/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            Plano<span className="text-indigo-400">AI</span>
          </span>
          <Link
            href="/formulario"
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Começar agora
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            Gerado por IA em menos de 2 minutos
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Descubra exatamente o que fazer{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              nos próximos 90 dias
            </span>{" "}
            para chegar no cargo e salário que você quer
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#a0a0a0] leading-relaxed">
            Plano de carreira <strong className="text-white">100% personalizado</strong> gerado por
            IA com base no seu perfil real — sem conselhos genéricos, só ações práticas que
            você pode começar hoje.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/formulario"
              className="group relative inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-indigo-500 hover:scale-105"
            >
              Gerar meu plano agora
              <span className="rounded-lg bg-indigo-500/50 px-2 py-1 text-sm font-normal">
                R$97
              </span>
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <p className="mt-4 text-sm text-[#737373]">
            Pagamento único • Sem assinatura • Resultado em minutos
          </p>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section className="border-y border-[#1e1e1e] bg-[#0a0a0a] py-12 px-4">
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { number: "2 min", label: "para gerar seu plano" },
            { number: "90 dias", label: "de plano detalhado" },
            { number: "12 semanas", label: "de metas específicas" },
            { number: "R$97", label: "pagamento único" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-3xl font-extrabold text-indigo-400">{item.number}</div>
              <div className="mt-1 text-sm text-[#737373]">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Como funciona</h2>
            <p className="mt-4 text-[#a0a0a0]">Três passos simples para ter seu plano em mãos</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Preencha o formulário",
                desc: "4 etapas rápidas sobre sua situação atual, seus objetivos, habilidades e o que te falta para chegar lá.",
              },
              {
                step: "02",
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
                title: "Faça o pagamento",
                desc: "Pagamento seguro via cartão de crédito. Uma compra única de R$97, sem surpresas.",
              },
              {
                step: "03",
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                title: "Receba seu plano",
                desc: "Em menos de 2 minutos, sua estratégia personalizada de 90 dias estará pronta para você seguir.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-[#2a2a2a] bg-[#141414] p-8 transition hover:border-indigo-500/40"
              >
                <div className="mb-4 text-indigo-400">{item.icon}</div>
                <div className="mb-2 text-5xl font-black text-[#1e1e1e] absolute top-6 right-6">
                  {item.step}
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
                <p className="text-[#a0a0a0] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que está incluso */}
      <section className="bg-[#0a0a0a] py-24 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              O que está incluso no seu plano
            </h2>
            <p className="mt-4 text-[#a0a0a0]">
              Tudo que você precisa para dar o próximo passo na sua carreira
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🎯",
                title: "Análise dos seus gaps",
                desc: "Os 3 principais obstáculos que estão te impedindo de crescer e como resolver cada um.",
              },
              {
                icon: "📅",
                title: "Plano semana a semana",
                desc: "12 semanas com objetivos, ações específicas e entregáveis claros para cada período.",
              },
              {
                icon: "📚",
                title: "Recursos recomendados",
                desc: "Cursos, livros e recursos selecionados de acordo com sua área e preferência de aprendizado.",
              },
              {
                icon: "💬",
                title: "Script para pedir promoção",
                desc: "Argumentos personalizados e o momento ideal para abordar o assunto com seu gestor.",
              },
              {
                icon: "📊",
                title: "Resumo executivo",
                desc: "Análise profunda do seu perfil, oportunidades e a viabilidade de atingir seu objetivo.",
              },
              {
                icon: "💾",
                title: "Download em PDF",
                desc: "Salve seu plano e acesse quando quiser, sem precisar entrar no sistema novamente.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-xl border border-[#2a2a2a] bg-[#141414] p-6"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-[#a0a0a0] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Para quem é o PlanoAI</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Profissionais que querem uma promoção mas não sabem por onde começar",
              "Quem quer mudar de área ou cargo e precisa de um roteiro claro",
              "Pessoas que estão estagnadas no salário há mais de 1 ano",
              "Quem quer organizar o desenvolvimento profissional de forma estruturada",
              "Profissionais que já sabem o que querem, mas não sabem como chegar lá",
              "Quem quer aproveitar melhor o tempo de estudo e foco nas coisas certas",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
                <svg className="h-5 w-5 flex-shrink-0 text-indigo-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[#d0d0d0]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 to-[#0f0f0f] p-10 text-center">
            <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
              Pronto para ter clareza sobre sua carreira?
            </h2>
            <p className="mb-8 text-[#a0a0a0] text-lg">
              Invista R$97 em um plano que pode valer meses de aceleração na sua carreira.
            </p>

            <Link
              href="/formulario"
              className="group inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-10 py-5 text-xl font-bold text-white shadow-lg transition-all hover:bg-indigo-500 hover:scale-105"
            >
              Gerar meu plano agora — R$97
              <svg className="h-6 w-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-[#737373]">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pagamento 100% seguro
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sem assinatura
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resultado em minutos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e1e] py-8 px-4 text-center text-sm text-[#737373]">
        <p>© {new Date().getFullYear()} PlanoAI — Todos os direitos reservados</p>
      </footer>
    </main>
  );
}
