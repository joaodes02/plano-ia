"use client";

import { useState } from "react";
import type { Plano, Acao } from "@/types";

const PRIORIDADE_COLORS = {
  alta: "text-red-400 bg-red-500/10 border-red-500/20",
  media: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  baixa: "text-green-400 bg-green-500/10 border-green-500/20",
};

function SemanaCard({ semana }: { semana: Acao }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#222] transition"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-xs font-bold text-indigo-400">
            S{semana.semana}
          </span>
          <div>
            <span className="font-medium text-white text-sm">{semana.objetivo}</span>
            <span className="ml-3 text-xs text-[#555]">{semana.tempo_estimado}</span>
          </div>
        </div>
        <svg
          className={`h-4 w-4 text-[#555] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-[#2a2a2a]">
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#737373]">Ações da semana</p>
              <ul className="space-y-2">
                {semana.acoes.map((acao, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#c0c0c0]">
                    <svg className="h-4 w-4 flex-shrink-0 text-indigo-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {acao}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Entregável</p>
              <p className="text-sm text-[#c0c0c0]">{semana.entregavel}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MesSection({ titulo, mes, defaultOpen }: { titulo: string; mes: { foco: string; semanas: Acao[] }; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#1a1a1a] transition"
      >
        <div>
          <h3 className="text-lg font-bold text-white">{titulo}</h3>
          <p className="text-sm text-indigo-400 mt-0.5">{mes.foco}</p>
        </div>
        <svg
          className={`h-5 w-5 text-[#555] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-3 border-t border-[#2a2a2a] pt-4">
          {mes.semanas.map((semana) => (
            <SemanaCard key={semana.semana} semana={semana} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResultadoClient({ plano }: { plano: Plano }) {
  const [copied, setCopied] = useState(false);
  const pg = plano.planoGerado!;

  function handlePrint() {
    window.print();
  }

  function handleShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      {/* Header de resultado */}
      <div className="border-b border-[#1e1e1e] bg-gradient-to-b from-indigo-950/30 to-[#0f0f0f]">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <a href="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition">
                ← PlanoAI
              </a>
              <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                Plano de Carreira de {plano.nome}
              </h1>
              <p className="mt-2 text-[#a0a0a0]">
                <span className="text-white">{plano.cargoAtual}</span>
                {" → "}
                <span className="text-indigo-400 font-semibold">{plano.cargoObjetivo}</span>
              </p>
              <p className="mt-1 text-xs text-[#555]">
                Gerado em {new Date(plano.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-3 no-print">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] px-4 py-2.5 text-sm font-medium text-[#a0a0a0] transition hover:border-[#3a3a3a] hover:text-white"
              >
                {copied ? (
                  <>
                    <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copiado!
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Compartilhar
                  </>
                )}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">

        {/* Resumo Executivo */}
        <section>
          <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">📊</span>
            Resumo Executivo
          </h2>
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6">
            <div className="text-[#c0c0c0] leading-relaxed space-y-4">
              {pg.resumo_executivo.split("\n").filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Gaps Prioritários */}
        <section>
          <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-400">🎯</span>
            Seus 3 principais gaps identificados
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {pg.gaps_prioritarios.map((gap, i) => (
              <div key={i} className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
                    {i + 1}
                  </span>
                  <h3 className="font-bold text-white text-sm">{gap.gap}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1">Por que trava seu crescimento</p>
                    <p className="text-xs text-[#a0a0a0] leading-relaxed">{gap.impacto}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Como resolver</p>
                    <p className="text-xs text-[#c0c0c0] leading-relaxed">{gap.solucao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Plano 90 dias */}
        <section>
          <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">📅</span>
            Plano semana a semana — 90 dias
          </h2>
          <div className="space-y-4">
            <MesSection titulo="Mês 1 — Semanas 1 a 4" mes={pg.plano_90_dias.mes1} defaultOpen={true} />
            <MesSection titulo="Mês 2 — Semanas 5 a 8" mes={pg.plano_90_dias.mes2} />
            <MesSection titulo="Mês 3 — Semanas 9 a 12" mes={pg.plano_90_dias.mes3} />
          </div>
        </section>

        {/* Habilidades para desenvolver */}
        <section>
          <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-400">📚</span>
            Habilidades para desenvolver
          </h2>
          <div className="space-y-4">
            {pg.habilidades_desenvolver.map((hab, i) => (
              <div key={i} className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-5">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-bold text-white">{hab.habilidade}</h3>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${PRIORIDADE_COLORS[hab.prioridade]}`}>
                    {hab.prioridade === "alta" ? "Alta prioridade" : hab.prioridade === "media" ? "Média prioridade" : "Baixa prioridade"}
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {hab.recursos.map((rec, j) => (
                    <div key={j} className="flex items-start gap-3 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-3">
                      <span className="text-lg flex-shrink-0">
                        {rec.tipo === "curso" ? "🎓" : rec.tipo === "livro" ? "📖" : rec.tipo === "canal" ? "📺" : "🔗"}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">{rec.nome}</p>
                        <p className="text-xs text-[#737373] capitalize">{rec.tipo}</p>
                        {rec.link_busca && (
                          <p className="mt-1 text-xs text-indigo-400">
                            Buscar: &quot;{rec.link_busca}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Estratégia de Promoção */}
        <section>
          <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 text-green-400">💬</span>
            Como pedir aumento/promoção
          </h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6">
              <h3 className="mb-3 font-semibold text-indigo-400 text-sm uppercase tracking-wider">Timing ideal</h3>
              <p className="text-[#c0c0c0] leading-relaxed">{pg.estrategia_promocao.timing_ideal}</p>
            </div>

            <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6">
              <h3 className="mb-3 font-semibold text-indigo-400 text-sm uppercase tracking-wider">Seus argumentos</h3>
              <ul className="space-y-2">
                {pg.estrategia_promocao.argumentos.map((arg, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#c0c0c0]">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20 text-xs font-bold text-green-400">
                      {i + 1}
                    </span>
                    {arg}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
              <h3 className="mb-3 font-semibold text-indigo-400 text-sm uppercase tracking-wider">Script da conversa</h3>
              <p className="text-[#c0c0c0] leading-relaxed text-sm whitespace-pre-line">
                {pg.estrategia_promocao.script_conversa}
              </p>
            </div>

            {pg.estrategia_promocao.alertas.length > 0 && (
              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">
                <h3 className="mb-3 font-semibold text-yellow-400 text-sm uppercase tracking-wider">⚠️ O que evitar</h3>
                <ul className="space-y-2">
                  {pg.estrategia_promocao.alertas.map((alerta, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#c0c0c0]">
                      <span className="text-yellow-400 flex-shrink-0">•</span>
                      {alerta}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Mensagem Motivacional */}
        <section>
          <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 to-[#0f0f0f] p-8 text-center">
            <div className="mb-4 text-4xl">✨</div>
            <h2 className="mb-4 text-xl font-bold text-white">Mensagem para você, {plano.nome.split(' ')[0]}</h2>
            <p className="text-[#c0c0c0] leading-relaxed text-lg italic max-w-2xl mx-auto">
              &ldquo;{pg.mensagem_motivacional}&rdquo;
            </p>
          </div>
        </section>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 no-print pb-8">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white transition hover:bg-indigo-500"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Baixar PDF
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#2a2a2a] px-6 py-4 font-semibold text-white transition hover:border-[#3a3a3a] hover:bg-[#1a1a1a]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {copied ? "Link copiado!" : "Compartilhar resultado"}
          </button>
        </div>
      </div>
    </main>
  );
}
