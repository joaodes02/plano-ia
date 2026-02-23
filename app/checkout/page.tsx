'use client'

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

type Pagamento = 'pix' | 'cartao'

const PRECOS = {
  pix: 'R$24,90',
  cartao: 'R$27,90',
}

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
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="text-xl font-bold text-white">
            Plano<span className="text-indigo-400">AI</span>
          </a>
        </div>

        <h1 className="text-3xl font-black text-center mb-2">Quase lá!</h1>
        <p className="text-zinc-400 text-center mb-10">Escolha como prefere pagar</p>

        {cancelado && (
          <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-yellow-300 text-sm">
            Pagamento cancelado. Você pode tentar novamente.
          </div>
        )}

        {/* O que está incluso */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <p className="text-sm font-semibold text-indigo-400 mb-3">INCLUÍDO NO SEU PLANO</p>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li className="flex items-center gap-2"><svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Plano de carreira completo de 90 dias</li>
            <li className="flex items-center gap-2"><svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Análise dos seus principais gaps</li>
            <li className="flex items-center gap-2"><svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Metas e ações semana a semana</li>
            <li className="flex items-center gap-2"><svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Estratégia de promoção com script</li>
            <li className="flex items-center gap-2"><svg className="h-4 w-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> <span className="text-indigo-300">Dashboard completo no Notion</span></li>
            <li className="flex items-center gap-2"><svg className="h-4 w-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> <span className="text-indigo-300">Tarefas e checklists por semana</span></li>
          </ul>
        </div>

        {/* Seleção de pagamento */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setPagamento('pix')}
            className={`flex flex-col items-center justify-center gap-1 py-4 rounded-xl border-2 font-medium transition-all ${
              pagamento === 'pix'
                ? 'border-green-500 bg-green-950 text-green-400'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            <span className="text-2xl">⚡</span>
            <span className="font-bold">PIX</span>
            <span className="text-lg font-black">{PRECOS.pix}</span>
          </button>

          <button
            onClick={() => setPagamento('cartao')}
            className={`flex flex-col items-center justify-center gap-1 py-4 rounded-xl border-2 font-medium transition-all ${
              pagamento === 'cartao'
                ? 'border-indigo-500 bg-indigo-950 text-indigo-400'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            <span className="text-2xl">💳</span>
            <span className="font-bold">Cartão</span>
            <span className="text-lg font-black">{PRECOS.cartao}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handlePagar}
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-colors"
        >
          {loading ? 'Aguarde...' : `Pagar ${PRECOS[pagamento]} ${pagamento === 'pix' ? 'via PIX' : 'no cartão'}`}
        </button>

        <p className="text-center text-zinc-500 text-xs mt-4">
          Pagamento seguro. Acesso imediato após confirmação.
        </p>

        {isDev && (
          <button
            onClick={handleSimular}
            disabled={loading}
            className="w-full mt-3 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black font-bold text-sm rounded-2xl transition-colors"
          >
            {loading ? 'Aguarde...' : 'DEV: Simular pagamento (pular Woovi/Stripe)'}
          </button>
        )}

        <div className="mt-6 text-center">
          <a href="/formulario" className="text-sm text-zinc-500 hover:text-white transition">
            ← Voltar e editar respostas
          </a>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
