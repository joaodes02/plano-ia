import { SharedNav } from '@/components/SharedNav'
import Link from 'next/link'

const SECOES = [
  {
    n: '01',
    titulo: 'Serviço',
    texto: 'O PlanoAI é uma plataforma que utiliza inteligência artificial para gerar planos de carreira personalizados. O plano gerado é baseado nas informações fornecidas por você e tem caráter orientativo.',
  },
  {
    n: '02',
    titulo: 'Responsabilidade',
    texto: 'O plano de carreira gerado é uma sugestão baseada em IA e não substitui a orientação de um profissional de carreira ou RH. Os resultados dependem da aplicação e do contexto individual de cada usuário.',
  },
  {
    n: '03',
    titulo: 'Pagamento',
    texto: 'O acesso ao plano de carreira é mediante pagamento único. Após a confirmação do pagamento e geração do plano, não realizamos reembolsos, salvo em casos de falha técnica comprovada na geração do conteúdo.',
  },
  {
    n: '04',
    titulo: 'Propriedade intelectual',
    texto: 'O plano de carreira gerado é de uso exclusivo do comprador. É proibida a revenda ou distribuição do conteúdo gerado pela plataforma.',
  },
  {
    n: '05',
    titulo: 'Integração com Notion',
    texto: 'A criação do dashboard no Notion é um recurso adicional disponível no plano completo. O PlanoAI não se responsabiliza por alterações na API do Notion que possam afetar o funcionamento da integração.',
  },
  {
    n: '06',
    titulo: 'Alterações',
    texto: 'Estes termos podem ser atualizados a qualquer momento. O uso continuado da plataforma implica na aceitação dos termos vigentes.',
  },
]

export default function TermosPage() {
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
            Termos de<br />
            <em style={{ fontStyle: 'italic', color: '#C8923A' }}>Uso</em>
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
              href="/privacidade"
              className="text-[10px] tracking-[0.1em] text-[#2E2B24] hover:text-[#C8923A]/60 transition-colors"
            >
              PRIVACIDADE
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
