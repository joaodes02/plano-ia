"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { FormularioData } from "@/types";
import { Suspense } from "react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const cancelado = searchParams.get("cancelado");

  const [formData, setFormData] = useState<FormularioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("planoai_form");
      if (saved) {
        setFormData(JSON.parse(saved));
      } else {
        window.location.href = "/formulario";
      }
    } catch {
      window.location.href = "/formulario";
    }
  }, []);

  async function handlePagar() {
    if (!formData) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dadosFormulario: formData }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Erro ao iniciar pagamento");
      }

      // Salvar billingId para a página /gerando usar
      if (data.billingId) {
        sessionStorage.setItem("planoai_billingId", data.billingId);
      }
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setLoading(false);
    }
  }

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <a href="/" className="text-xl font-bold text-white">
            Plano<span className="text-indigo-400">AI</span>
          </a>
        </div>

        {cancelado && (
          <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-yellow-300 text-sm">
            Pagamento cancelado. Você pode tentar novamente.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Resumo do pedido */}
          <div className="lg:col-span-3 rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6">
            <h2 className="mb-6 text-xl font-bold text-white">Resumo do seu pedido</h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 rounded-xl bg-[#1a1a1a] p-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 text-lg">
                  🎯
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Plano de Carreira 90 Dias</p>
                  <p className="text-xs text-[#a0a0a0] mt-0.5">
                    De <span className="text-indigo-300">{formData.cargo_atual}</span> para{" "}
                    <span className="text-indigo-300">{formData.cargo_objetivo}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-[#2a2a2a] pt-4">
              {[
                "Análise dos 3 principais gaps",
                "Plano semana a semana (12 semanas)",
                "Recursos recomendados personalizados",
                "Script para pedir promoção/aumento",
                "Resumo executivo do seu perfil",
                "Download em PDF",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm">
                  <svg className="h-4 w-4 flex-shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#c0c0c0]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pagamento */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6">
              <div className="mb-6 text-center">
                <div className="text-4xl font-extrabold text-white">R$29,90</div>
                <div className="text-sm text-[#737373] mt-1">pagamento único</div>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handlePagar}
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white transition hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Redirecionando...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    Pagar via PIX
                  </>
                )}
              </button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#737373]">
                  <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pagamento via PIX — AbacatePay
                </div>
                <div className="flex items-center gap-2 text-xs text-[#737373]">
                  <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Criptografia SSL de ponta a ponta
                </div>
                <div className="flex items-center gap-2 text-xs text-[#737373]">
                  <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sem assinatura ou cobranças futuras
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
              <p className="text-xs text-[#737373] text-center">
                Após o pagamento, seu plano será gerado em menos de 2 minutos e ficará disponível imediatamente.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/formulario" className="text-sm text-[#737373] hover:text-white transition">
            ← Voltar e editar respostas
          </a>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
