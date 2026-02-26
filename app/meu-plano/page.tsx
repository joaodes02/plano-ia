'use client'

import { useState } from 'react'
import { SharedNav } from '@/components/SharedNav'
import Link from 'next/link'
import { validarCPF } from '@/lib/validacoes'

interface PlanoResumo {
  id: string
  createdAt: string
  nome: string
  status: string
  cargoAtual: string | null
  cargoObjetivo: string | null
  planoTipo: string
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function MeuPlanoPage() {
  const [cpf, setCpf] = useState('')
  const [planos, setPlanos] = useState<PlanoResumo[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setPlanos(null)

    const cpfDigits = cpf.replace(/\D/g, '')
    if (!validarCPF(cpfDigits)) {
      setError('CPF inválido. Verifique os números e tente novamente.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/plano/cpf/${cpfDigits}`)
      if (res.status === 429) {
        setError('Muitas tentativas. Aguarde um minuto e tente novamente.')
        return
      }
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao buscar planos.')
        return
      }
      setPlanos(data.planos)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen bg-[#0C0B08]"
      style={{ fontFamily: 'var(--font-dm)', color: '#EDE4D3' }}
    >
      <SharedNav showCta />

      <div className="pt-28 pb-24 px-5 sm:px-8">
        <div className="mx-auto max-w-lg">

          {/* Header */}
          <div className="mb-12 text-center">
            <div
              className="flex items-center justify-center gap-3 mb-8"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <div className="h-px w-8 bg-[#C8923A]/50" />
              <span className="text-[10px] tracking-[0.2em] text-[#C8923A]/60 uppercase">
                Recuperar plano
              </span>
              <div className="h-px w-8 bg-[#C8923A]/50" />
            </div>

            <h1
              className="text-3xl sm:text-4xl font-black leading-tight mb-4"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              Já tenho um{' '}
              <em style={{ fontStyle: 'italic', color: '#C8923A' }}>plano</em>
            </h1>
            <p className="text-[15px] text-[#5E5849] leading-relaxed max-w-sm mx-auto">
              Digite o CPF que você usou no pagamento para acessar seu plano de carreira.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-10">
            <div className="relative mb-4">
              <input
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                className="w-full bg-[#131109] border border-[#1D1B14] px-5 py-4 text-[17px] text-[#EDE4D3] placeholder-[#2E2B24] outline-none transition-colors duration-200 focus:border-[#C8923A]/40"
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
              />
            </div>

            {error && (
              <p className="text-red-400/80 text-[13px] mb-4 px-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || cpf.replace(/\D/g, '').length < 11}
              className="w-full bg-[#C8923A] px-6 py-4 text-[#0C0B08] font-bold text-[14px] tracking-[0.06em] transition-all duration-300 hover:bg-[#D9A44B] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-dm)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Buscando...
                </span>
              ) : (
                'Buscar meu plano'
              )}
            </button>
          </form>

          {/* Results */}
          {planos !== null && planos.length === 0 && (
            <div className="text-center py-12 border border-[#1D1B14] bg-[#0F0E0B]">
              <div
                className="text-[40px] mb-4 opacity-10"
                style={{ fontFamily: 'var(--font-fraunces)' }}
              >
                ?
              </div>
              <p className="text-[15px] text-[#5E5849] mb-2">
                Nenhum plano encontrado para este CPF.
              </p>
              <p className="text-[13px] text-[#3E3A30] mb-6">
                Verifique se digitou corretamente ou crie um novo plano.
              </p>
              <Link
                href="/formulario"
                className="inline-flex items-center gap-2 border border-[#C8923A] px-6 py-3 text-[12px] font-bold text-[#C8923A] tracking-[0.1em] transition-all duration-300 hover:bg-[#C8923A] hover:text-[#0C0B08]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                CRIAR MEU PLANO
              </Link>
            </div>
          )}

          {planos !== null && planos.length > 0 && (
            <div className="space-y-3">
              <p
                className="text-[10px] tracking-[0.2em] text-[#5E5849] uppercase mb-4"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {planos.length} {planos.length === 1 ? 'plano encontrado' : 'planos encontrados'}
              </p>

              {planos.map((plano) => (
                <Link
                  key={plano.id}
                  href={plano.status === 'gerando' ? `/gerando?planoId=${plano.id}` : `/resultado/${plano.id}`}
                  className="group block border border-[#1D1B14] bg-[#0F0E0B] p-6 transition-all duration-300 hover:border-[#C8923A]/25 hover:bg-[#131109]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        {plano.status === 'gerando' ? (
                          <span
                            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] text-amber-400/70 uppercase"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70 animate-pulse" />
                            Gerando
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] text-emerald-400/70 uppercase"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                            Pronto
                          </span>
                        )}
                      </div>

                      <h3
                        className="text-[17px] font-bold text-[#EDE4D3] leading-snug mb-1 group-hover:text-[#C8923A] transition-colors duration-200"
                        style={{ fontFamily: 'var(--font-fraunces)' }}
                      >
                        {plano.cargoAtual || '—'}{' '}
                        <span className="text-[#C8923A]/40">→</span>{' '}
                        {plano.cargoObjetivo || '—'}
                      </h3>

                      <p
                        className="text-[11px] text-[#3E3A30] tracking-[0.08em]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {formatDate(plano.createdAt)}
                      </p>
                    </div>

                    <svg
                      className="h-5 w-5 text-[#2E2B24] shrink-0 mt-1 transition-all duration-200 group-hover:text-[#C8923A] group-hover:translate-x-1"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Footer note */}
          <p className="text-center text-[12px] text-[#2E2B24] mt-12 leading-relaxed">
            Seu CPF é usado apenas para localizar seu plano.<br />
            Não armazenamos nem compartilhamos seus dados.
          </p>
        </div>
      </div>
    </main>
  )
}
