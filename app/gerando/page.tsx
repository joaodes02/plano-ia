"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const MENSAGENS = [
  "Confirmando pagamento...",
  "Analisando seu perfil...",
  "Identificando seus gaps...",
  "Montando seu plano de 90 dias...",
  "Definindo metas semanais...",
  "Personalizando recursos de aprendizado...",
  "Elaborando estratégia de promoção...",
  "Quase pronto...",
];

function GerandoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const planoId = searchParams.get("planoId");
  const billingId = searchParams.get("billingId") ||
    (typeof window !== "undefined" ? localStorage.getItem("planoai_billingId") : null);

  const identifier = planoId || billingId;

  const [msgIndex, setMsgIndex] = useState(0);
  const [progresso, setProgresso] = useState(5);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!identifier) {
      router.replace("/");
      return;
    }

    const msgInterval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MENSAGENS.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgresso((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 3;
      });
    }, 800);

    const pollInterval = setInterval(async () => {
      try {
        const url = planoId
          ? `/api/plano/${planoId}`
          : `/api/plano/billing/${identifier}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();

        if (data.status === "gerado") {
          clearInterval(pollInterval);
          clearInterval(msgInterval);
          clearInterval(progressInterval);
          setProgresso(100);
          setTimeout(() => {
            router.replace(`/resultado/${data.id}`);
          }, 800);
        } else if (data.status === "erro") {
          clearInterval(pollInterval);
          clearInterval(msgInterval);
          clearInterval(progressInterval);
          setErro("Ocorreu um erro ao gerar seu plano. Por favor, entre em contato com o suporte.");
        }
      } catch {
        // Silencia erros de rede durante o polling
      }
    }, 3000);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
      clearInterval(pollInterval);
    };
  }, [identifier]); // eslint-disable-line react-hooks/exhaustive-deps

  if (erro) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0C0B08] px-5">
        <div className="grain-fix" aria-hidden />
        <div className="max-w-md w-full text-center relative z-10">
          <div
            className="text-[10px] tracking-[0.2em] text-red-400/50 mb-6 uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            ⚠ Erro
          </div>
          <h2
            className="mb-4 text-2xl font-bold text-[#EDE4D3]"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Algo deu errado
          </h2>
          <p className="mb-8 text-[#3E3A30] text-sm leading-relaxed">{erro}</p>
          <a
            href="mailto:suporte@planoai.com.br"
            className="text-[10px] text-[#C8923A]/50 hover:text-[#C8923A] transition tracking-[0.12em] uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Contatar suporte →
          </a>
        </div>
      </main>
    );
  }

  const progressPct = Math.round(Math.min(progresso, 100));

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0C0B08] px-5">
      <div className="grain-fix" aria-hidden />

      {/* Subtle gold glow */}
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,146,58,0.04) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-sm w-full text-center">

        {/* Central element */}
        <div className="mb-12 flex items-center justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div
              className="h-32 w-32 border border-[#1D1B14] rounded-full animate-spin-slow"
              style={{ animationDuration: '8s' }}
            />
            {/* Inner ring */}
            <div
              className="absolute inset-4 border border-[#C8923A]/20 rounded-full animate-spin-slow"
              style={{ animationDuration: '5s', animationDirection: 'reverse' }}
            />
            {/* Center number */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-5xl font-black text-[#C8923A] animate-pulse-gold leading-none"
                style={{ fontFamily: 'var(--font-fraunces)' }}
              >
                {progressPct}
              </span>
            </div>
          </div>
        </div>

        {/* Mensagem atual */}
        <div className="flex items-center justify-center gap-3 mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
          <div className="h-px w-6 bg-[#C8923A]/50" />
          <span className="text-[10px] tracking-[0.2em] text-[#C8923A]/60 uppercase">
            {MENSAGENS[msgIndex]}
          </span>
          <div className="h-px w-6 bg-[#C8923A]/50" />
        </div>

        <p className="mb-10 text-[#3E3A30] text-xs leading-relaxed">
          Nossa IA está analisando seu perfil e criando um plano sob medida
        </p>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="h-px w-full bg-[#1D1B14] overflow-hidden">
            <div
              className="h-px bg-[#C8923A] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p
            className="mt-2 text-[10px] text-[#2E2B24] text-right"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {progressPct}%
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-2 text-left">
          {MENSAGENS.slice(0, 5).map((msg, i) => (
            <div
              key={msg}
              className={`flex items-center gap-3 py-2 text-sm transition-all duration-300`}
              style={{ fontFamily: 'var(--font-dm)' }}
            >
              <span
                className={`text-sm flex-shrink-0 w-4 ${
                  i < msgIndex
                    ? 'text-[#C8923A]'
                    : i === msgIndex
                    ? 'text-[#C8923A]'
                    : 'text-[#1D1B14]'
                }`}
              >
                {i < msgIndex ? '→' : i === msgIndex ? (
                  <span className="inline-block animate-pulse-gold">·</span>
                ) : '·'}
              </span>
              <span
                className={
                  i < msgIndex
                    ? 'text-[#7A7068]'
                    : i === msgIndex
                    ? 'text-[#EDE4D3]'
                    : 'text-[#1D1B14]'
                }
              >
                {msg}
              </span>
            </div>
          ))}
        </div>

        <p
          className="mt-10 text-[10px] text-[#2E2B24] tracking-[0.12em] uppercase"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Por favor, não feche essa janela
        </p>
      </div>
    </main>
  );
}

export default function GerandoPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0C0B08]">
        <div className="h-8 w-8 border border-[#C8923A] border-t-transparent animate-spin" />
      </div>
    }>
      <GerandoContent />
    </Suspense>
  );
}
