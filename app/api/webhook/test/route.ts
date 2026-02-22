import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Rota de teste para criar um plano fake já gerado
// Uso: POST /api/webhook/test
// Retorna o ID do plano para acessar /resultado/{id} e testar o Notion
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Não disponível em produção' }, { status: 403 })
  }

  const plano = await prisma.plano.create({
    data: {
      email: 'teste@planoai.com',
      nome: 'João Teste',
      billingId: `test_${Date.now()}`,
      status: 'gerado',
      paymentProvider: 'woovi',
      planoTipo: 'com_notion',
      cargoAtual: 'Desenvolvedor Junior',
      cargoObjetivo: 'Desenvolvedor Senior',
      dadosFormulario: {
        cargo_atual: 'Desenvolvedor Junior',
        area: 'Tecnologia',
        salario_atual: 'R$3.000',
        tempo_experiencia: '2 anos',
        cargo_objetivo: 'Desenvolvedor Senior',
        salario_objetivo: 'R$12.000',
        prazo: '12 meses',
        motivacao: 'Crescer na carreira',
        habilidades: 'JavaScript, React',
        gaps: 'Arquitetura, Liderança',
        entrevistas: 'Poucas',
        tempo_disponivel: '10h/semana',
        nome: 'João Teste',
        email: 'teste@planoai.com',
        cpf: '00000000000',
        telefone: '11999999999',
        preferencias_aprendizado: ['cursos', 'livros'],
        contexto: 'Teste',
      },
      planoGerado: {
        resumo_executivo: 'João está em uma posição sólida como Desenvolvedor Junior com 2 anos de experiência. Sua transição para Senior é viável no prazo de 12 meses, mas exigirá foco em arquitetura de software e habilidades de liderança técnica.\n\nOs gaps identificados são comuns nessa transição e podem ser superados com dedicação de 10h semanais. A base em JavaScript e React é um excelente ponto de partida.\n\nRecomendamos um plano estruturado focando primeiro em fundamentos de arquitetura, depois em práticas de liderança, e por fim em visibilidade e posicionamento para a promoção.',
        gaps_prioritarios: [
          { gap: 'Arquitetura de Software', impacto: 'Sem conhecimento de arquitetura, fica limitado a tarefas de implementação', solucao: 'Estudar padrões de design, clean architecture e system design' },
          { gap: 'Liderança Técnica', impacto: 'Seniors precisam mentorear juniors e tomar decisões técnicas', solucao: 'Assumir mentoria de um junior e liderar code reviews' },
          { gap: 'Comunicação Técnica', impacto: 'Dificuldade em defender decisões técnicas para stakeholders', solucao: 'Praticar apresentações técnicas e documentação de RFC' },
        ],
        plano_90_dias: {
          mes1: {
            foco: 'Fundamentos de Arquitetura',
            semanas: [
              { semana: 1, objetivo: 'Entender padrões de design', acoes: ['Estudar SOLID', 'Ler Clean Architecture cap 1-5', 'Refatorar um módulo do projeto'], entregavel: 'Módulo refatorado com SOLID', tempo_estimado: '10h' },
              { semana: 2, objetivo: 'Aprender Clean Architecture', acoes: ['Implementar camadas no projeto', 'Separar domínio de infra', 'Criar testes unitários'], entregavel: 'Projeto com camadas separadas', tempo_estimado: '10h' },
              { semana: 3, objetivo: 'System Design básico', acoes: ['Estudar escalabilidade', 'Desenhar arquitetura de um sistema', 'Revisar com senior'], entregavel: 'Documento de arquitetura', tempo_estimado: '10h' },
              { semana: 4, objetivo: 'Consolidar aprendizados', acoes: ['Apresentar para o time', 'Documentar decisões', 'Code review focado em arquitetura'], entregavel: 'Apresentação técnica feita', tempo_estimado: '10h' },
            ],
          },
          mes2: {
            foco: 'Liderança Técnica',
            semanas: [
              { semana: 5, objetivo: 'Iniciar mentoria', acoes: ['Escolher um junior para mentorar', 'Definir plano de 1:1 semanal', 'Liderar primeiro code review'], entregavel: 'Mentoria iniciada', tempo_estimado: '10h' },
              { semana: 6, objetivo: 'Assumir ownership técnico', acoes: ['Propor melhoria técnica', 'Criar RFC', 'Defender proposta em reunião'], entregavel: 'RFC aprovado', tempo_estimado: '10h' },
              { semana: 7, objetivo: 'Melhorar comunicação', acoes: ['Fazer apresentação técnica', 'Escrever post no blog interno', 'Documentar processo'], entregavel: 'Apresentação e post publicados', tempo_estimado: '10h' },
              { semana: 8, objetivo: 'Consolidar liderança', acoes: ['Avaliar progresso do mentorado', 'Coletar feedback do time', 'Ajustar abordagem'], entregavel: 'Feedback coletado e plano ajustado', tempo_estimado: '10h' },
            ],
          },
          mes3: {
            foco: 'Posicionamento para Promoção',
            semanas: [
              { semana: 9, objetivo: 'Mapear impacto', acoes: ['Listar contribuições dos últimos 3 meses', 'Quantificar resultados', 'Preparar documento de impacto'], entregavel: 'Documento de impacto pronto', tempo_estimado: '10h' },
              { semana: 10, objetivo: 'Alinhar com gestão', acoes: ['Agendar 1:1 com gestor', 'Apresentar documento de impacto', 'Pedir feedback direto'], entregavel: '1:1 realizado com feedback', tempo_estimado: '10h' },
              { semana: 11, objetivo: 'Preencher gaps restantes', acoes: ['Focar nos pontos do feedback', 'Entregar projeto de alto impacto', 'Documentar resultados'], entregavel: 'Projeto entregue', tempo_estimado: '10h' },
              { semana: 12, objetivo: 'Formalizar pedido de promoção', acoes: ['Preparar script da conversa', 'Agendar reunião formal', 'Apresentar caso completo'], entregavel: 'Conversa de promoção realizada', tempo_estimado: '10h' },
            ],
          },
        },
        habilidades_desenvolver: [
          { habilidade: 'System Design', prioridade: 'alta', recursos: [{ tipo: 'curso', nome: 'System Design Interview', link_busca: 'system design interview curso' }] },
          { habilidade: 'Clean Architecture', prioridade: 'alta', recursos: [{ tipo: 'livro', nome: 'Clean Architecture - Robert Martin', link_busca: 'clean architecture robert martin' }] },
          { habilidade: 'Liderança Técnica', prioridade: 'media', recursos: [{ tipo: 'livro', nome: 'The Manager Path', link_busca: 'the manager path livro' }] },
        ],
        estrategia_promocao: {
          timing_ideal: 'Após completar o mês 3 do plano, quando você terá evidências concretas de impacto e crescimento.',
          argumentos: ['Assumi mentoria de junior com resultados mensuráveis', 'Liderei refatoração de arquitetura que melhorou performance', 'Apresentei 3 RFCs aceitos pelo time'],
          script_conversa: 'Olá [gestor], gostaria de conversar sobre meu crescimento na empresa. Nos últimos 3 meses, assumi responsabilidades de nível senior: mentorei o [junior], liderei a refatoração do [módulo] que resultou em [métrica], e propus melhorias de arquitetura aceitas pelo time. Acredito que estou pronto para o próximo nível e gostaria de entender o que mais preciso demonstrar.',
          alertas: ['Não peça promoção sem evidências concretas', 'Evite comparar-se com colegas', 'Não dê ultimatos'],
        },
        mensagem_motivacional: 'João, a jornada de Junior para Senior é uma das mais transformadoras na carreira de um dev. Você já tem a base técnica — agora é hora de construir a visão sistêmica e a influência que definem um Senior. Lembre-se: ninguém vira Senior da noite para o dia, mas com consistência de 10h/semana nos próximos 90 dias, você vai olhar para trás e se surpreender com o quanto evoluiu. Bora!',
      },
    },
  })

  return NextResponse.json({
    message: 'Plano de teste criado com sucesso!',
    planoId: plano.id,
    resultadoUrl: `/resultado/${plano.id}`,
    notionTestUrl: `/api/notion/auth?state=${plano.id}`,
  })
}
