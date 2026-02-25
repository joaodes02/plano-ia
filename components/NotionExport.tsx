'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

export function NotionExport({ planoId, notionUrlSalva }: { planoId: string; notionUrlSalva?: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const notionStatus = searchParams.get('notion')
  const notionUrl = searchParams.get('url')
  const notionToken = searchParams.get('notionToken')

  const [status, setStatus] = useState<'idle' | 'criando' | 'sucesso' | 'erro'>(
    notionUrlSalva ? 'sucesso' :
    notionStatus === 'sucesso' ? 'sucesso' :
    notionStatus === 'erro' ? 'erro' :
    notionStatus === 'criando' ? 'criando' : 'idle'
  )
  const [dashboardUrl, setDashboardUrl] = useState(
    notionUrlSalva || (notionUrl ? decodeURIComponent(notionUrl) : '')
  )
  const chamouRef = useRef(false)

  useEffect(() => {
    if (notionToken && status === 'criando' && !chamouRef.current) {
      chamouRef.current = true
      criarDashboard(notionToken)
    }
  }, [notionToken, status])

  async function criarDashboard(token: string) {
    try {
      const res = await fetch('/api/notion/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, planoId }),
      })

      const data = await res.json()

      if (res.ok && data.url) {
        setStatus('sucesso')
        setDashboardUrl(data.url)
        router.replace(`/resultado/${planoId}?notion=sucesso&url=${encodeURIComponent(data.url)}`)
      } else {
        setStatus('erro')
        router.replace(`/resultado/${planoId}?notion=erro`)
      }
    } catch {
      setStatus('erro')
      router.replace(`/resultado/${planoId}?notion=erro`)
    }
  }

  if (status === 'criando') {
    return (
      <div className="border border-[#C8923A]/20 bg-[#0F0E0B] p-6">
        <div className="flex items-center gap-4">
          <div className="h-5 w-5 border border-[#C8923A] border-t-transparent animate-spin shrink-0" />
          <div>
            <h3 className="text-[#EDE4D3] font-bold text-sm" style={{ fontFamily: 'var(--font-fraunces)' }}>
              Criando seu dashboard no Notion...
            </h3>
            <p className="text-[#3E3A30] text-xs mt-0.5" style={{ fontFamily: 'var(--font-dm)' }}>
              Isso pode levar alguns segundos. Não feche esta página.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'sucesso' && dashboardUrl) {
    return (
      <div className="relative border border-[#C8923A]/20 bg-[#0F0E0B] p-6">
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#C8923A]/40" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#C8923A]/40" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#C8923A]/40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#C8923A]/40" />

        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#C8923A]">→</span>
          <div>
            <h3 className="text-[#EDE4D3] font-bold text-sm" style={{ fontFamily: 'var(--font-fraunces)' }}>
              Dashboard criado no Notion!
            </h3>
            <p className="text-[#3E3A30] text-xs mt-0.5" style={{ fontFamily: 'var(--font-dm)' }}>
              Seu plano completo está pronto para usar
            </p>
          </div>
        </div>
        <a
          href={dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[#C8923A]/40 px-4 py-2 text-sm text-[#C8923A] hover:bg-[#C8923A]/10 transition-colors"
          style={{ fontFamily: 'var(--font-dm)' }}
        >
          Abrir meu Dashboard no Notion →
        </a>
      </div>
    )
  }

  if (status === 'erro') {
    return (
      <div className="border border-red-500/15 bg-[#0F0E0B] p-6">
        <p className="text-red-400/70 text-sm mb-4" style={{ fontFamily: 'var(--font-dm)' }}>
          Não foi possível criar o dashboard. Tente novamente.
        </p>
        <a
          href={`/api/notion/auth?state=${planoId}`}
          className="inline-flex items-center gap-2 border border-[#1D1B14] px-4 py-2 text-sm text-[#3E3A30] hover:border-[#C8923A]/30 hover:text-[#EDE4D3] transition-colors"
          style={{ fontFamily: 'var(--font-dm)' }}
        >
          Tentar novamente →
        </a>
      </div>
    )
  }

  return (
    <div className="border border-[#1D1B14] bg-[#0F0E0B] p-6">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
            <div className="h-px w-6 bg-[#C8923A]/40" />
            <span className="text-[10px] tracking-[0.18em] text-[#C8923A]/50 uppercase">Notion</span>
          </div>
          <h3 className="text-[#EDE4D3] font-bold mb-1 text-sm" style={{ fontFamily: 'var(--font-fraunces)' }}>
            Criar Dashboard no Notion
          </h3>
          <p className="text-[#3E3A30] text-xs leading-relaxed max-w-sm" style={{ fontFamily: 'var(--font-dm)' }}>
            Seu plano inclui um dashboard completo no Notion com tarefas, checklists e metas por semana.
          </p>
        </div>
        <a
          href={`/api/notion/auth?state=${planoId}`}
          className="shine shrink-0 inline-flex items-center gap-2 border border-[#C8923A]/40 px-4 py-2.5 text-sm text-[#C8923A] hover:bg-[#C8923A]/10 transition-colors"
          style={{ fontFamily: 'var(--font-dm)' }}
        >
          Conectar Notion →
        </a>
      </div>
    </div>
  )
}
