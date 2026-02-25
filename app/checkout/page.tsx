'use client'

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SharedNav } from '@/components/SharedNav'

type Pagamento = 'pix' | 'cartao'

const PRECOS = {
  pix: 'R$24,90',
  cartao: 'R$27,90',
}

const ITENS_INCLUSOS = [
  { text: 'Plano de carreira completo de 90 dias' },
  { text: 'Análise dos seus principais gaps' },
  { text: 'Metas e ações semana a semana' },
  { text: 'Estratégia de promoção com script' },
  { text: 'Dashboard completo no Notion', destaque: true },
  { text: 'Tarefas e checklists por semana', destaque: true },
]

function CheckoutContent() {
  const searchParams = useSearchParams()
  const cancelado = searchParams.get('cancelado')

  const [pagamento, setPagamento] = useState<Pagamento>('pix')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('planoai_form')
      if (saved) {
        setFormData(JSON.parse(saved))
      } else {
        window.location.href = '/formulario'
      }
    } catch {
      window.location.href = '/formulario'
    }
  }, [])

  const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'

  const handlePagar = async () => {
    if (!formData) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pagamento, dadosFormulario: formData }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Erro ao iniciar pagamento')
      }

      window.location.href = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setLoading(false)
    }
  }

  const handleSimular = async () => {
    if (!formData) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/test/simular-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dadosFormulario: formData }),
      })

      const data = await res.json()

      if (!res.ok || !data.planoId) {
        throw new Error(data.error || 'Erro ao simular pagamento')
      }

      window.location.href = `/gerando?planoId=${data.planoId}`
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setLoading(false)
    }
  }

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0B08]">
        <div className="h-8 w-8 border border-[#C8923A] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0C0B08]">
      <div className="grain-fix" aria-hidden />
      <SharedNav />

      <div className="flex min-h-screen items-start justify-center px-5 pt-28 pb-16">
        <div className="w-full max-w-md">

          {/* Label */}
          <div className="flex items-center gap-3 mb-8" style={{ fontFamily: 'var(--font-mono)' }}>
            <div className="h-px w-8 bg-[#C8923A]/50" />
            <span className="text-[10px] tracking-[0.2em] text-[#C8923A]/60 uppercase">Pagamento</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-black text-[#EDE4D3] mb-2 leading-tight"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Quase lá.
          </h1>
          <p className="text-[#3E3A30] mb-10 text-sm">Escolha como prefere pagar e receba seu plano em minutos.</p>

          {cancelado && (
            <div
              className="mb-6 border border-yellow-600/30 bg-yellow-600/5 p-4 text-center text-yellow-400/80 text-sm"
              style={{ fontFamily: 'var(--font-dm)' }}
            >
              Pagamento cancelado. Você pode tentar novamente.
            </div>
          )}

          {/* O que está incluso */}
          <div className="border border-[#1D1B14] bg-[#0F0E0B] p-6 mb-6">
            <p
              className="text-[10px] tracking-[0.18em] text-[#C8923A]/60 uppercase mb-4"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Incluído no seu plano
            </p>
            <ul className="space-y-3">
              {ITENS_INCLUSOS.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm" style={{ fontFamily: 'var(--font-dm)' }}>
                  <span className={`flex-shrink-0 ${item.destaque ? 'text-[#C8923A]' : 'text-[#C8923A]/50'}`}>→</span>
                  <span className={item.destaque ? 'text-[#EDE4D3]' : 'text-[#7A7068]'}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Seleção de pagamento */}
          <div className="grid grid-cols-2 gap-px bg-[#1D1B14] mb-6">
            <button
              onClick={() => setPagamento('pix')}
              className={`relative flex flex-col items-center justify-center gap-2 py-6 transition-all duration-200 ${
                pagamento === 'pix'
                  ? 'bg-[#0F0E0B]'
                  : 'bg-[#0C0B08] hover:bg-[#0F0E0B]'
              }`}
            >
              {pagamento === 'pix' && (
                <>
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#C8923A]" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#C8923A]" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#C8923A]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#C8923A]" />
                </>
              )}
              <div>
                <div
                  className="text-[9px] tracking-[0.18em] text-[#C8923A] mb-1 text-center"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  ⚡ PIX · RECOMENDADO
                </div>
                <div
                  className={`text-2xl font-black text-center ${pagamento === 'pix' ? 'text-[#EDE4D3]' : 'text-[#3E3A30]'}`}
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  {PRECOS.pix}
                </div>
              </div>
            </button>

            <button
              onClick={() => setPagamento('cartao')}
              className={`relative flex flex-col items-center justify-center gap-2 py-6 transition-all duration-200 ${
                pagamento === 'cartao'
                  ? 'bg-[#0F0E0B]'
                  : 'bg-[#0C0B08] hover:bg-[#0F0E0B]'
              }`}
            >
              {pagamento === 'cartao' && (
                <>
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#C8923A]" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#C8923A]" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#C8923A]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#C8923A]" />
                </>
              )}
              <div>
                <div
                  className="text-[9px] tracking-[0.18em] text-[#C8923A]/50 mb-1 text-center"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  💳 CARTÃO
                </div>
                <div
                  className={`text-2xl font-black text-center ${pagamento === 'cartao' ? 'text-[#EDE4D3]' : 'text-[#3E3A30]'}`}
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  {PRECOS.cartao}
                </div>
              </div>
            </button>
          </div>

          {error && (
            <div
              className="mb-4 border border-red-500/20 bg-red-500/5 p-3 text-center text-red-400/80 text-sm"
              style={{ fontFamily: 'var(--font-dm)' }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handlePagar}
            disabled={loading}
            className="shine w-full py-4 bg-[#C8923A] hover:bg-[#D9A44B] disabled:bg-[#1D1B14] disabled:cursor-not-allowed text-[#0C0B08] font-bold text-base transition-colors duration-200"
            style={{ fontFamily: 'var(--font-dm)' }}
          >
            {loading ? 'Aguarde...' : `Pagar ${PRECOS[pagamento]} ${pagamento === 'pix' ? 'via PIX' : 'no cartão'}`}
          </button>

          <p
            className="text-center text-[#2E2B24] text-[10px] mt-4 tracking-[0.1em]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            PAGAMENTO SEGURO · ACESSO IMEDIATO APÓS CONFIRMAÇÃO
          </p>

          {isDev && (
            <button
              onClick={handleSimular}
              disabled={loading}
              className="w-full mt-3 py-3 border border-yellow-600/40 text-yellow-600/70 hover:border-yellow-600/70 hover:text-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {loading ? 'Aguarde...' : 'DEV: Simular pagamento (pular Woovi/Stripe)'}
            </button>
          )}

          <div className="mt-8 text-center">
            <a
              href="/formulario"
              className="text-sm text-[#2E2B24] hover:text-[#EDE4D3] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-dm)' }}
            >
              ← Voltar e editar respostas
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0C0B08]">
        <div className="h-8 w-8 border border-[#C8923A] border-t-transparent animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
