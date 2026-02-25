import { SharedNav } from '@/components/SharedNav'
import Link from 'next/link'

const SECOES = [
  {
    n: '01',
    titulo: 'Dados coletados',
    texto: 'Coletamos as informações fornecidas por você no formulário: nome, e-mail, cargo atual, cargo objetivo e informações de carreira. Esses dados são utilizados exclusivamente para gerar seu plano de carreira personalizado.',
  },
  {
    n: '02',
    titulo: 'Uso dos dados',
    texto: 'Seus dados são processados por inteligência artificial para gerar um plano de carreira personalizado. Não compartilhamos suas informações com terceiros, exceto os serviços necessários para o funcionamento da plataforma (processamento de pagamento e geração de IA).',
  },
  {
    n: '03',
    titulo: 'Integração com Notion',
    texto: 'Caso você opte por conectar sua conta do Notion, utilizamos o acesso concedido exclusivamente para criar o dashboard do seu plano de carreira. Não acessamos, lemos ou modificamos nenhum outro conteúdo do seu workspace.',
  },
  {
    n: '04',
    titulo: 'Armazenamento',
    texto: 'Seus dados são armazenados de forma segura em servidores protegidos. Você pode solicitar a exclusão dos seus dados a qualquer momento pelo e-mail de contato.',
  },
  {
    n: '05',
    titulo: 'Contato',
    texto: 'Para dúvidas sobre sua privacidade, entre em contato pelo e-mail disponível em nosso site.',
  },
]

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-[#0C0B08]">
      <div className="grain-fix" aria-hidden />
      <SharedNav />

      <div className="mx-auto max-w-2xl px-5 pt-28 pb-16">

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6" style={{ fontFamily: 'var(--font-mono)' }}>
            <div className="h-px w-8 bg-[#C8923A]/50" />
            <span className="text-[10px] tracking-[0.2em] text-[#C8923A]/60 uppercase">Legal</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black text-[#EDE4D3] leading-tight"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Política de<br />
            <em style={{ fontStyle: 'italic', color: '#C8923A' }}>Privacidade</em>
          </h1>
        </div>

        {/* Seções */}
        <div className="space-y-0">
          {SECOES.map((s) => (
            <div key={s.n} className="border-b border-[#1D1B14] py-8">
              <div className="flex items-start gap-5">
                <span
                  className="text-[2.5rem] font-black text-[#1D1B14] leading-none shrink-0 select-none"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                  aria-hidden
                >
                  {s.n}
                </span>
                <div className="pt-1">
                  <h2
                    className="text-lg font-bold text-[#EDE4D3] mb-3 leading-tight"
                    style={{ fontFamily: 'var(--font-fraunces)' }}
                  >
                    {s.titulo}
                  </h2>
                  <p className="text-sm text-[#3E3A30] leading-relaxed" style={{ fontFamily: 'var(--font-dm)' }}>
                    {s.texto}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-between flex-wrap gap-4">
          <p
            className="text-[10px] text-[#2E2B24] tracking-[0.1em]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            ÚLTIMA ATUALIZAÇÃO: {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-6" style={{ fontFamily: 'var(--font-mono)' }}>
            <Link
              href="/termos"
              className="text-[10px] tracking-[0.1em] text-[#2E2B24] hover:text-[#C8923A]/60 transition-colors"
            >
              TERMOS DE USO
            </Link>
            <Link
              href="/"
              className="text-[10px] tracking-[0.1em] text-[#2E2B24] hover:text-[#C8923A]/60 transition-colors"
            >
              VOLTAR AO INÍCIO
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
