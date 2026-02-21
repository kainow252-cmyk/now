const openaiService = require('./openai.service');
const ragService = require('./rag.service');
const financeService = require('./finance.service');

/**
 * Multi-Agent System
 * Different AI agents with specialized expertise
 */
class AgentsService {
  constructor() {
    this.agents = {
      ceo: {
        name: 'CEO Agent',
        role: 'Chief Executive Officer',
        expertise: 'Estratégia, visão de negócio, liderança, crescimento',
        systemPrompt: `Você é o CEO Agent, um executivo sênior especializado em:
- Estratégia empresarial de alto nível
- Visão de longo prazo
- Crescimento e escala
- Liderança e cultura organizacional
- Tomada de decisões estratégicas

Responda de forma executiva, direta e estratégica.
Pense como um CEO que precisa ver o quadro geral.`
      },
      
      cfo: {
        name: 'CFO Agent',
        role: 'Chief Financial Officer',
        expertise: 'Finanças, investimentos, ROI, análise financeira',
        systemPrompt: `Você é o CFO Agent, um diretor financeiro especializado em:
- Análise financeira detalhada
- ROI e viabilidade econômica
- Gestão de investimentos
- Riscos financeiros
- Planejamento financeiro estratégico

Sempre inclua números, cálculos e análise quantitativa.
Seja preciso e baseado em dados.`
      },
      
      tech: {
        name: 'Tech Agent',
        role: 'Chief Technology Officer',
        expertise: 'Tecnologia, desenvolvimento, arquitetura, inovação',
        systemPrompt: `Você é o Tech Agent, um CTO especializado em:
- Arquitetura de sistemas
- Tecnologias emergentes
- Stack tecnológico
- Escalabilidade técnica
- Inovação e R&D

Foque em viabilidade técnica, arquitetura e implementação.
Seja técnico mas compreensível.`
      },
      
      marketing: {
        name: 'Marketing Agent',
        role: 'Chief Marketing Officer',
        expertise: 'Marketing, branding, growth hacking, vendas',
        systemPrompt: `Você é o Marketing Agent, um CMO especializado em:
- Estratégias de marketing
- Branding e posicionamento
- Growth hacking
- Análise de mercado
- Aquisição de clientes

Pense em audiência, mercado, canais e conversão.
Seja criativo mas orientado a resultados.`
      },
      
      legal: {
        name: 'Legal Agent',
        role: 'Chief Legal Officer',
        expertise: 'Jurídico, compliance, contratos, regulamentação',
        systemPrompt: `Você é o Legal Agent, um advogado corporativo especializado em:
- Análise jurídica
- Compliance e regulamentação
- Contratos e acordos
- Propriedade intelectual
- Riscos legais

Identifique riscos legais e sugira proteções.
Seja cauteloso e detalhista.`
      },
      
      hr: {
        name: 'HR Agent',
        role: 'Chief Human Resources Officer',
        expertise: 'Recursos humanos, cultura, talentos, recrutamento',
        systemPrompt: `Você é o HR Agent, um diretor de RH especializado em:
- Gestão de talentos
- Cultura organizacional
- Recrutamento estratégico
- Desenvolvimento de pessoas
- Engajamento de equipe

Foque em pessoas, cultura e desenvolvimento organizacional.`
      },
      
      operations: {
        name: 'Operations Agent',
        role: 'Chief Operations Officer',
        expertise: 'Operações, processos, eficiência, execução',
        systemPrompt: `Você é o Operations Agent, um COO especializado em:
- Eficiência operacional
- Processos e workflows
- Gestão de projetos
- Execução e implementação
- Otimização de recursos

Foque em como executar e tornar eficiente.
Seja prático e orientado a processos.`
      }
    };
  }

  /**
   * Consult a specific agent
   */
  async consultAgent(agentId, question, context = {}) {
    const agent = this.agents[agentId];
    
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    console.log(`🤖 Consulting ${agent.name}...`);

    // Build enhanced context if needed
    let enhancedContext = '';
    
    if (context.useRag) {
      // Get internet context for more informed answers
      const ragResponse = await ragService.answerWithContext(question, context.userId);
      enhancedContext = `\n\nCONTEXTO DA INTERNET:\n${ragResponse.answer}`;
    }

    const messages = [
      {
        role: 'system',
        content: agent.systemPrompt + enhancedContext
      },
      {
        role: 'user',
        content: question
      }
    ];

    const response = await openaiService.chat(messages, context.userId);

    return {
      agent: agentId,
      agentName: agent.name,
      role: agent.role,
      response,
      expertise: agent.expertise,
      timestamp: new Date()
    };
  }

  /**
   * Multi-agent consultation (Board Meeting)
   */
  async boardMeeting(question, agentIds = ['ceo', 'cfo', 'tech'], options = {}) {
    console.log(`👥 Convening board meeting with: ${agentIds.join(', ')}`);

    const consultations = [];

    // Consult each agent
    for (const agentId of agentIds) {
      try {
        const consultation = await this.consultAgent(agentId, question, options);
        consultations.push(consultation);
      } catch (error) {
        console.error(`Error consulting ${agentId}:`, error.message);
      }
    }

    // CEO synthesizes all opinions
    const synthesis = await this.synthesizeOpinions(question, consultations);

    return {
      question,
      agents: consultations,
      synthesis,
      recommendation: synthesis.recommendation,
      timestamp: new Date()
    };
  }

  /**
   * CEO synthesizes all agent opinions
   */
  async synthesizeOpinions(question, consultations) {
    const allOpinions = consultations.map(c => 
      `${c.agentName} (${c.role}):\n${c.response}`
    ).join('\n\n---\n\n');

    const synthesisPrompt = `Você é o CEO consolidando opiniões de especialistas.

PERGUNTA ORIGINAL:
${question}

OPINIÕES DOS ESPECIALISTAS:
${allOpinions}

Sua tarefa:
1. Sintetize as opiniões de forma executiva
2. Identifique consensos e divergências
3. Forneça uma RECOMENDAÇÃO FINAL clara
4. Liste próximos passos (action items)

Seja direto, estratégico e decisivo.`;

    const messages = [
      {
        role: 'system',
        content: 'Você é um CEO experiente sintetizando opiniões de especialistas.'
      },
      {
        role: 'user',
        content: synthesisPrompt
      }
    ];

    const synthesis = await openaiService.chat(messages);

    return {
      synthesis,
      recommendation: this.extractRecommendation(synthesis),
      agentsConsulted: consultations.length
    };
  }

  /**
   * Extract recommendation from synthesis
   */
  extractRecommendation(synthesis) {
    // Simple extraction - in production use better NLP
    const lines = synthesis.split('\n');
    const recLine = lines.find(l => 
      l.toLowerCase().includes('recomendação') || 
      l.toLowerCase().includes('recomendo')
    );
    
    return recLine || 'Ver síntese completa';
  }

  /**
   * Specialized consultation based on topic
   */
  async smartConsult(question, options = {}) {
    // Detect which agents are needed based on question
    const relevantAgents = this.detectRelevantAgents(question);
    
    return await this.boardMeeting(question, relevantAgents, options);
  }

  /**
   * Detect which agents should be consulted
   */
  detectRelevantAgents(question) {
    const q = question.toLowerCase();
    const agents = [];

    // Financial keywords
    if (q.match(/invest|financ|money|roi|custo|preço|lucro|receita/)) {
      agents.push('cfo');
    }

    // Tech keywords
    if (q.match(/tecnolog|sistema|app|software|código|desenvolv/)) {
      agents.push('tech');
    }

    // Marketing keywords
    if (q.match(/market|vend|client|brand|campanha|anúncio/)) {
      agents.push('marketing');
    }

    // Legal keywords
    if (q.match(/legal|contrato|lei|regulação|jurídico|compliance/)) {
      agents.push('legal');
    }

    // HR keywords
    if (q.match(/equipe|contrat|talent|cultura|rh|pessoas/)) {
      agents.push('hr');
    }

    // Operations keywords
    if (q.match(/process|operação|workflow|eficiência|execução/)) {
      agents.push('operations');
    }

    // Always include CEO for strategy
    if (!agents.includes('ceo')) {
      agents.unshift('ceo');
    }

    // If no specific agents detected, use default board
    if (agents.length === 1) { // only CEO
      return ['ceo', 'cfo', 'tech'];
    }

    return agents;
  }

  /**
   * Get all available agents
   */
  getAgents() {
    return Object.keys(this.agents).map(id => ({
      id,
      name: this.agents[id].name,
      role: this.agents[id].role,
      expertise: this.agents[id].expertise
    }));
  }

  /**
   * Financial analysis with CFO
   */
  async analyzeFinancials(data) {
    const question = `Analise esta situação financeira e forneça recomendações:
    
${JSON.stringify(data, null, 2)}

Forneça análise detalhada incluindo ROI, riscos e oportunidades.`;

    return await this.consultAgent('cfo', question);
  }

  /**
   * Tech feasibility with CTO
   */
  async analyzeTechFeasibility(projectDescription) {
    const question = `Analise a viabilidade técnica deste projeto:

${projectDescription}

Forneça análise sobre tecnologias, arquitetura, escalabilidade e riscos técnicos.`;

    return await this.consultAgent('tech', question);
  }

  /**
   * Market analysis with CMO
   */
  async analyzeMarket(productDescription) {
    const question = `Analise o mercado para este produto/serviço:

${productDescription}

Forneça análise de mercado, audiência-alvo, posicionamento e estratégias de growth.`;

    return await this.consultAgent('marketing', question);
  }
}

module.exports = new AgentsService();
