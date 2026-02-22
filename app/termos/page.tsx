export default function TermosPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Termos de Uso</h1>

        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Serviço</h2>
            <p>O PlanoAI é uma plataforma que utiliza inteligência artificial para gerar planos de carreira personalizados. O plano gerado é baseado nas informações fornecidas por você e tem caráter orientativo.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Responsabilidade</h2>
            <p>O plano de carreira gerado é uma sugestão baseada em IA e não substitui a orientação de um profissional de carreira ou RH. Os resultados dependem da aplicação e do contexto individual de cada usuário.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Pagamento</h2>
            <p>O acesso ao plano de carreira é mediante pagamento único. Após a confirmação do pagamento e geração do plano, não realizamos reembolsos, salvo em casos de falha técnica comprovada na geração do conteúdo.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Propriedade intelectual</h2>
            <p>O plano de carreira gerado é de uso exclusivo do comprador. É proibida a revenda ou distribuição do conteúdo gerado pela plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Integração com Notion</h2>
            <p>A criação do dashboard no Notion é um recurso adicional disponível no plano completo. O PlanoAI não se responsabiliza por alterações na API do Notion que possam afetar o funcionamento da integração.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">6. Alterações</h2>
            <p>Estes termos podem ser atualizados a qualquer momento. O uso continuado da plataforma implica na aceitação dos termos vigentes.</p>
          </section>
        </div>

        <p className="text-zinc-500 text-sm mt-12">Última atualização: {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
