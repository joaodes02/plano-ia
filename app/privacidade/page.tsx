export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Política de Privacidade</h1>

        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Dados coletados</h2>
            <p>Coletamos as informações fornecidas por você no formulário: nome, e-mail, cargo atual, cargo objetivo e informações de carreira. Esses dados são utilizados exclusivamente para gerar seu plano de carreira personalizado.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Uso dos dados</h2>
            <p>Seus dados são processados por inteligência artificial para gerar um plano de carreira personalizado. Não compartilhamos suas informações com terceiros, exceto os serviços necessários para o funcionamento da plataforma (processamento de pagamento e geração de IA).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Integração com Notion</h2>
            <p>Caso você opte por conectar sua conta do Notion, utilizamos o acesso concedido exclusivamente para criar o dashboard do seu plano de carreira. Não acessamos, lemos ou modificamos nenhum outro conteúdo do seu workspace.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Armazenamento</h2>
            <p>Seus dados são armazenados de forma segura em servidores protegidos. Você pode solicitar a exclusão dos seus dados a qualquer momento pelo e-mail de contato.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Contato</h2>
            <p>Para dúvidas sobre sua privacidade, entre em contato pelo e-mail disponível em nosso site.</p>
          </section>
        </div>

        <p className="text-zinc-500 text-sm mt-12">Última atualização: {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
