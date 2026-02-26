import Link from 'next/link'

export function SharedNav({ showCta = false }: { showCta?: boolean }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1D1B14] bg-[#0C0B08]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="text-[17px] font-bold leading-none" style={{ fontFamily: 'var(--font-fraunces)' }}>
          <span className="text-[#EDE4D3]">Carreira </span>
          <em style={{ fontStyle: 'italic', color: '#C8923A' }}>Inteligente</em>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/meu-plano"
            className="text-[11px] text-[#5E5849] tracking-[0.1em] hover:text-[#C8923A] transition-colors duration-200"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            JÁ TENHO UM PLANO
          </Link>
          {showCta && (
            <Link
              href="/formulario"
              className="shine border border-[#C8923A] px-5 py-2 text-[11px] font-bold text-[#C8923A] tracking-[0.12em] transition-all duration-300 hover:bg-[#C8923A] hover:text-[#0C0B08]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              CRIAR MEU PLANO
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
