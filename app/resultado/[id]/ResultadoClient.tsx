"use client";

import { useState, useEffect } from "react";
import type { Plano, Acao } from "@/types";
import { NotionExport } from "@/components/NotionExport";
import { SharedNav } from "@/components/SharedNav";

const PRIORIDADE_STYLES = {
  alta: { label: "Alta", color: "text-red-400/80 border-red-500/20 bg-red-500/5" },
  media: { label: "Média", color: "text-yellow-400/80 border-yellow-500/20 bg-yellow-500/5" },
  baixa: { label: "Baixa", color: "text-[#C8923A]/80 border-[#C8923A]/20 bg-[#C8923A]/5" },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6" style={{ fontFamily: 'var(--font-mono)' }}>
      <div className="h-px w-8 bg-[#C8923A]/50" />
      <span className="text-[10px] tracking-[0.2em] text-[#C8923A]/60 uppercase">{children}</span>
    </div>
  );
}

function GoldDivider() {
  return (
    <div
      className="h-px my-10"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(200,146,58,0.2), transparent)' }}
    />
  );
}

function SemanaCard({ semana }: { semana: Acao }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#1D1B14] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#131109] transition-colors duration-200"
      >
        <div className="flex items-center gap-4">
          <span
            className="text-[10px] text-[#C8923A]/40 shrink-0 w-8"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            S{semana.semana}
          </span>
          <div>
            <span className="font-medium text-[#EDE4D3] text-sm" style={{ fontFamily: 'var(--font-dm)' }}>
              {semana.objetivo}
            </span>
            <span
              className="ml-3 text-[10px] text-[#2E2B24]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {semana.tempo_estimado}
            </span>
          </div>
        </div>
        <div
          className="shrink-0 h-5 w-5 border border-[#C8923A]/20 flex items-center justify-center transition-all duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
        >
          <span className="text-[#C8923A] text-xs leading-none select-none">+</span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-[#1D1B14]">
          <div className="pt-4 space-y-4">
            <div>
              <p
                className="mb-2 text-[10px] uppercase tracking-[0.15em] text-[#2E2B24]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Ações da semana
              </p>
              <ul className="space-y-2">
                {semana.acoes.map((acao, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#7A7068]" style={{ fontFamily: 'var(--font-dm)' }}>
                    <span className="text-[#C8923A] shrink-0 mt-0.5">→</span>
                    {acao}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-[#C8923A]/10 bg-[#C8923A]/5 p-4">
              <p
                className="text-[10px] uppercase tracking-[0.15em] text-[#C8923A]/60 mb-1"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Entregável
              </p>
              <p className="text-sm text-[#EDE4D3]" style={{ fontFamily: 'var(--font-dm)' }}>
                {semana.entregavel}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MesSection({ titulo, numero, mes, defaultOpen }: {
  titulo: string;
  numero: string;
  mes: { foco: string; semanas: Acao[] };
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="border border-[#1D1B14] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#0F0E0B] transition-colors duration-200"
      >
        <div className="flex items-center gap-5">
          <span
            className="text-[3.5rem] font-black text-[#1D1B14] leading-none hidden sm:block select-none"
            style={{ fontFamily: 'var(--font-fraunces)' }}
            aria-hidden
          >
            {numero}
          </span>
          <div>
            <h3
              className="text-lg font-bold text-[#EDE4D3] leading-tight"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              {titulo}
            </h3>
            <p className="text-sm text-[#C8923A]/60 mt-0.5" style={{ fontFamily: 'var(--font-dm)' }}>
              {mes.foco}
            </p>
          </div>
        </div>
        <div
          className="shrink-0 h-6 w-6 border border-[#C8923A]/20 flex items-center justify-center transition-all duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
        >
          <span className="text-[#C8923A] text-sm leading-none select-none">+</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-[#1D1B14] bg-[#0F0E0B]">
          {mes.semanas.map((semana) => (
            <SemanaCard key={semana.semana} semana={semana} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function ResultadoClient({ plano }: { plano: Plano }) {
  const [copied, setCopied] = useState(false);
  const pg = plano.planoGerado!;

  useEffect(() => {
    localStorage.removeItem("planoai_form");
    localStorage.removeItem("planoai_billingId");
  }, []);

  function handleDownloadPDF() {
    window.open(`/api/plano/${plano.id}/pdf`, '_blank');
  }

  function handleShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main className="min-h-screen bg-[#0C0B08]">
      <div className="grain-fix" aria-hidden />
      <SharedNav />

      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="border-b border-[#1D1B14] pt-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              {/* Cargo route */}
              <div
                className="flex items-center gap-2 mb-3 text-[10px] tracking-[0.12em] text-[#2E2B24]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <span>{plano.cargoAtual?.toUpperCase()}</span>
                <span className="text-[#C8923A]/40">→</span>
                <span className="text-[#C8923A]/70">{plano.cargoObjetivo?.toUpperCase()}</span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-black text-[#EDE4D3] leading-tight"
                style={{ fontFamily: 'var(--font-fraunces)' }}
              >
                Plano de Carreira<br />
                <em style={{ fontStyle: 'italic', color: '#C8923A' }}>{plano.nome}</em>
              </h1>
              <p
                className="mt-3 text-[10px] text-[#2E2B24] tracking-[0.1em]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Gerado em{" "}
                {new Date(plano.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }).toUpperCase()}
              </p>
            </div>

            <div className="flex items-center gap-3 no-print">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 border border-[#1D1B14] px-4 py-2.5 text-sm text-[#3E3A30] transition hover:border-[#C8923A]/30 hover:text-[#EDE4D3]"
                style={{ fontFamily: 'var(--font-dm)' }}
              >
                {copied ? (
                  <><span className="text-[#C8923A]">→</span> Copiado!</>
                ) : (
                  <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg> Compartilhar</>
                )}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="shine flex items-center gap-2 bg-[#C8923A] px-4 py-2.5 text-sm font-bold text-[#0C0B08] transition hover:bg-[#D9A44B]"
                style={{ fontFamily: 'var(--font-dm)' }}
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

      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-12 space-y-12">

        {/* ─── Resumo Executivo ──────────────────────────────────── */}
        <section>
          <SectionLabel>Resumo Executivo</SectionLabel>
          <h2
            className="text-2xl font-bold text-[#EDE4D3] mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Análise do seu perfil
          </h2>
          <div className="border border-[#1D1B14] bg-[#0F0E0B] p-6 sm:p-8">
            <div className="space-y-4">
              {pg.resumo_executivo.split("\n").filter(Boolean).map((p, i) => (
                <p
                  key={i}
                  className={`leading-relaxed ${i === 0 ? 'text-[#7A7068] text-base italic' : 'text-[#3E3A30] text-sm'}`}
                  style={{ fontFamily: i === 0 ? 'var(--font-fraunces)' : 'var(--font-dm)' }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ─── Gaps Prioritários ────────────────────────────────── */}
        <section>
          <SectionLabel>Diagnóstico</SectionLabel>
          <h2
            className="text-2xl font-bold text-[#EDE4D3] mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Seus 3 principais gaps identificados
          </h2>
          <div className="grid sm:grid-cols-3 gap-px bg-[#1D1B14]">
            {pg.gaps_prioritarios.map((gap, i) => (
              <div key={i} className="bg-[#0F0E0B] p-6">
                <div
                  className="text-[2.5rem] font-black text-[#1D1B14] leading-none mb-4 select-none"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                  aria-hidden
                >
                  0{i + 1}
                </div>
                <h3
                  className="font-bold text-[#EDE4D3] text-sm mb-4 leading-snug"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  {gap.gap}
                </h3>
                <div className="space-y-3 border-t border-[#1D1B14] pt-4">
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-[0.15em] text-[#2E2B24] mb-1"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      Por que trava
                    </p>
                    <p className="text-xs text-[#3E3A30] leading-relaxed" style={{ fontFamily: 'var(--font-dm)' }}>
                      {gap.impacto}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-[0.15em] text-[#C8923A]/50 mb-1"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      Como resolver
                    </p>
                    <p className="text-xs text-[#7A7068] leading-relaxed" style={{ fontFamily: 'var(--font-dm)' }}>
                      {gap.solucao}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <GoldDivider />

        {/* ─── Plano 90 dias ────────────────────────────────────── */}
        <section>
          <SectionLabel>Plano de ação</SectionLabel>
          <h2
            className="text-2xl font-bold text-[#EDE4D3] mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Semana a semana — 90 dias
          </h2>
          <div className="space-y-px bg-[#1D1B14]">
            <MesSection numero="01" titulo="Mês 1 — Semanas 1 a 4" mes={pg.plano_90_dias.mes1} defaultOpen={true} />
            <MesSection numero="02" titulo="Mês 2 — Semanas 5 a 8" mes={pg.plano_90_dias.mes2} />
            <MesSection numero="03" titulo="Mês 3 — Semanas 9 a 12" mes={pg.plano_90_dias.mes3} />
          </div>
        </section>

        <GoldDivider />

        {/* ─── Habilidades ──────────────────────────────────────── */}
        <section>
          <SectionLabel>Desenvolvimento</SectionLabel>
          <h2
            className="text-2xl font-bold text-[#EDE4D3] mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Habilidades para desenvolver
          </h2>
          <div className="space-y-px bg-[#1D1B14]">
            {pg.habilidades_desenvolver.map((hab, i) => (
              <div key={i} className="bg-[#0F0E0B] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <h3
                    className="font-bold text-[#EDE4D3]"
                    style={{ fontFamily: 'var(--font-fraunces)' }}
                  >
                    {hab.habilidade}
                  </h3>
                  {(() => {
                    const style = PRIORIDADE_STYLES[hab.prioridade] ?? PRIORIDADE_STYLES.media;
                    return (
                      <span
                        className={`border px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase ${style.color}`}
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {style.label}
                      </span>
                    );
                  })()}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {hab.recursos.map((rec, j) => (
                    <div key={j} className="flex items-start gap-3 border border-[#1D1B14] p-4">
                      <span className="text-[#C8923A] shrink-0 mt-0.5">→</span>
                      <div>
                        <p className="text-sm font-medium text-[#EDE4D3]" style={{ fontFamily: 'var(--font-dm)' }}>
                          {rec.nome}
                        </p>
                        <p
                          className="text-[10px] text-[#2E2B24] capitalize mt-0.5"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {rec.tipo}
                        </p>
                        {rec.link_busca && (
                          <p
                            className="mt-1 text-[11px] text-[#C8923A]/50"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            &quot;{rec.link_busca}&quot;
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

        <GoldDivider />

        {/* ─── Estratégia de Promoção ───────────────────────────── */}
        <section>
          <SectionLabel>Promoção</SectionLabel>
          <h2
            className="text-2xl font-bold text-[#EDE4D3] mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Como pedir aumento/promoção
          </h2>
          <div className="relative border border-[#C8923A]/12 p-6 sm:p-8 space-y-6">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#C8923A]/30" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#C8923A]/30" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#C8923A]/30" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#C8923A]/30" />

            <div>
              <p
                className="text-[10px] uppercase tracking-[0.15em] text-[#C8923A]/50 mb-3"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Timing ideal
              </p>
              <p className="text-[#7A7068] leading-relaxed text-sm" style={{ fontFamily: 'var(--font-dm)' }}>
                {pg.estrategia_promocao.timing_ideal}
              </p>
            </div>

            <div className="border-t border-[#1D1B14] pt-6">
              <p
                className="text-[10px] uppercase tracking-[0.15em] text-[#C8923A]/50 mb-3"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Seus argumentos
              </p>
              <ul className="space-y-3">
                {pg.estrategia_promocao.argumentos.map((arg, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#7A7068]" style={{ fontFamily: 'var(--font-dm)' }}>
                    <span className="text-[#C8923A] shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    {arg}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#1D1B14] pt-6">
              <p
                className="text-[10px] uppercase tracking-[0.15em] text-[#C8923A]/50 mb-3"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Script da conversa
              </p>
              <p
                className="text-[#7A7068] leading-relaxed text-sm whitespace-pre-line"
                style={{ fontFamily: 'var(--font-dm)' }}
              >
                {pg.estrategia_promocao.script_conversa}
              </p>
            </div>

            {pg.estrategia_promocao.alertas.length > 0 && (
              <div className="border-t border-[#1D1B14] pt-6">
                <p
                  className="text-[10px] uppercase tracking-[0.15em] text-yellow-600/60 mb-3"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  O que evitar
                </p>
                <ul className="space-y-2">
                  {pg.estrategia_promocao.alertas.map((alerta, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#3E3A30]" style={{ fontFamily: 'var(--font-dm)' }}>
                      <span className="text-yellow-600/50 shrink-0">·</span>
                      {alerta}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <GoldDivider />

        {/* ─── Mensagem Motivacional ────────────────────────────── */}
        <section>
          <div className="bg-[#0F0E0B] border border-[#1D1B14] p-8 sm:p-12 text-center">
            <div
              className="text-[6rem] leading-none text-[#C8923A]/8 mb-0 select-none -mb-6"
              style={{ fontFamily: 'var(--font-fraunces)' }}
              aria-hidden
            >
              &ldquo;
            </div>
            <div className="flex items-center justify-center gap-3 mb-6" style={{ fontFamily: 'var(--font-mono)' }}>
              <div className="h-px w-8 bg-[#C8923A]/30" />
              <span className="text-[10px] tracking-[0.2em] text-[#C8923A]/40 uppercase">
                Para você, {plano.nome.split(' ')[0]}
              </span>
              <div className="h-px w-8 bg-[#C8923A]/30" />
            </div>
            <p
              className="text-[#7A7068] leading-relaxed text-lg italic max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              &ldquo;{pg.mensagem_motivacional}&rdquo;
            </p>
          </div>
        </section>

        {/* ─── Dashboard Notion ─────────────────────────────────── */}
        <NotionExport
          planoId={plano.id}
          notionUrlSalva={(plano.dadosFormulario as unknown as Record<string, string>)?.notion_url || ''}
        />

        {/* ─── Botões de ação ───────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-px bg-[#1D1B14] no-print pb-8">
          <button
            onClick={handleDownloadPDF}
            className="shine flex items-center justify-center gap-2 bg-[#C8923A] px-6 py-4 font-bold text-[#0C0B08] transition hover:bg-[#D9A44B]"
            style={{ fontFamily: 'var(--font-dm)' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Baixar PDF
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-[#0F0E0B] border border-[#1D1B14] px-6 py-4 font-medium text-[#3E3A30] transition hover:border-[#C8923A]/30 hover:text-[#EDE4D3]"
            style={{ fontFamily: 'var(--font-dm)' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {copied ? "Link copiado!" : "Compartilhar resultado"}
          </button>
        </div>
      </div>
    </main>
  );
}
