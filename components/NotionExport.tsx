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
        // Limpar token da URL
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
      <div className="bg-zinc-900 border border-indigo-700 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <div>
            <h3 className="text-white font-bold">Criando seu dashboard no Notion...</h3>
            <p className="text-zinc-400 text-sm">Isso pode levar alguns segundos. Nao feche esta pagina.</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'sucesso' && dashboardUrl) {
    return (
      <div className="bg-zinc-900 border border-green-800 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">✅</span>
          <div>
            <h3 className="text-white font-bold">Dashboard criado no Notion!</h3>
            <p className="text-zinc-400 text-sm">Seu plano completo esta pronto para usar</p>
          </div>
        </div>
        <a
          href={dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-medium text-sm hover:bg-zinc-100 transition-colors"
        >
          Abrir meu Dashboard no Notion →
        </a>
      </div>
    )
  }

  if (status === 'erro') {
    return (
      <div className="bg-zinc-900 border border-red-800 rounded-2xl p-6 mb-8">
        <p className="text-red-400 text-sm mb-3">Nao foi possivel criar o dashboard. Tente novamente.</p>
        <a
          href={`/api/notion/auth?state=${planoId}`}
          className="inline-flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-zinc-700 transition-colors"
        >
          Tentar novamente
        </a>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-indigo-700 rounded-2xl p-6 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📋</span>
            <h3 className="text-white font-bold">Criar Dashboard no Notion</h3>
          </div>
          <p className="text-zinc-400 text-sm">
            Seu plano inclui um dashboard completo no Notion com tarefas, checklists e metas por semana. Conecte sua conta para criar agora.
          </p>
        </div>
        <a
          href={`/api/notion/auth?state=${planoId}`}
          className="shrink-0 inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-medium text-sm hover:bg-zinc-100 transition-colors"
        >
          Conectar Notion
        </a>
      </div>
    </div>
  )
}
