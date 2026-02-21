"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const MENSAGENS = [
  "Aguardando confirmação do PIX...",
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
  const billingId = searchParams.get("billingId") ||
    (typeof window !== "undefined" ? localStorage.getItem("planoai_billingId") : null);

  const [msgIndex, setMsgIndex] = useState(0);
  const [progresso, setProgresso] = useState(5);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!billingId) {
      router.replace("/");
      return;
    }

    // Rotação de mensagens
    const msgInterval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MENSAGENS.length);
    }, 3000);

    // Progresso suavizado
    const progressInterval = setInterval(() => {
      setProgresso((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 3;
      });
    }, 800);

    // Polling a cada 3 segundos
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/plano/billing/${billingId}`);
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
  }, [billingId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (erro) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0f0f0f] px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 text-5xl">⚠️</div>
          <h2 className="mb-3 text-2xl font-bold text-white">Algo deu errado</h2>
          <p className="mb-6 text-[#a0a0a0] text-sm">{erro}</p>
          <a
            href="mailto:suporte@planoai.com.br"
            className="block text-sm text-[#737373] hover:text-white transition"
          >
            Contatar suporte
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0f0f0f] px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Logo */}
        <a href="/" className="mb-12 inline-block text-xl font-bold text-white">
          Plano<span className="text-indigo-400">AI</span>
        </a>

        {/* Spinner */}
        <div className="mb-8 flex items-center justify-center">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 rounded-full border-4 border-[#2a2a2a]" />
            <div
              className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"
              style={{ animationDuration: "1s" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">🤖</span>
            </div>
          </div>
        </div>

        {/* Mensagem atual */}
        <h2 className="mb-3 text-2xl font-bold text-white min-h-[2rem] transition-all">
          {MENSAGENS[msgIndex]}
        </h2>
        <p className="mb-8 text-[#a0a0a0] text-sm">
          Nossa IA está analisando seu perfil e criando um plano sob medida para você
        </p>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-2 w-full rounded-full bg-[#2a2a2a] overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-700"
              style={{ width: `${Math.min(progresso, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[#555]">{Math.round(Math.min(progresso, 100))}%</p>
        </div>

        {/* Steps */}
        <div className="mt-8 space-y-2 text-left">
          {MENSAGENS.slice(0, 5).map((msg, i) => (
            <div
              key={msg}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all ${
                i < msgIndex
                  ? "text-indigo-400"
                  : i === msgIndex
                  ? "text-white bg-indigo-600/10 border border-indigo-600/20"
                  : "text-[#444]"
              }`}
            >
              {i < msgIndex ? (
                <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : i === msgIndex ? (
                <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
              ) : (
                <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-[#333]" />
              )}
              {msg}
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-[#555]">
          Por favor, não feche essa janela
        </p>
      </div>
    </main>
  );
}

export default function GerandoPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    }>
      <GerandoContent />
    </Suspense>
  );
}
