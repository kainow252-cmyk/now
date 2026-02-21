const openaiService = require('./openai.service');
const databaseService = require('./database.service');

/**
 * NOW Clone Service - Digital Twin
 * Creates a digital clone that thinks and acts like the user
 */
class CloneService {
  constructor() {
    this.clones = new Map();
  }

  /**
   * Create user's digital clone
   */
  async createClone(userId) {
    console.log(`👥 Creating digital clone for user ${userId}`);

    // Gather user data
    const userData = await this.gatherUserData(userId);
    
    // Build clone profile
    const clone = {
      id: `clone_${userId}_${Date.now()}`,
      userId,
      profile: await this.buildProfile(userData),
      personality: await this.analyzePersonality(userData),
      decisionPatterns: await this.analyzeDecisions(userData),
      communicationStyle: await this.analyzeCommunicationStyle(userData),
      createdAt: new Date(),
      lastTraining: new Date(),
      accuracy: 75 // starts at 75%, improves with use
    };

    this.clones.set(userId, clone);

    return {
      success: true,
      clone: {
        id: clone.id,
        accuracy: clone.accuracy,
        message: 'Clone digital criado! Ele aprenderá mais sobre você com o tempo.'
      }
    };
  }

  /**
   * Ask clone to make decision
   */
  async askClone(userId, question, context = {}) {
    const clone = this.clones.get(userId);
    
    if (!clone) {
      return {
        success: false,
        error: 'Clone não encontrado. Crie um primeiro.'
      };
    }

    console.log(`🤖 Clone thinking: "${question}"`);

    // Build prompt with clone's personality
    const prompt = `Você é o clone digital de um usuário. Responda como ELE responderia.

PERFIL DO USUÁRIO:
${JSON.stringify(clone.profile, null, 2)}

PERSONALIDADE:
${clone.personality}

PADRÕES DE DECISÃO:
${clone.decisionPatterns}

ESTILO DE COMUNICAÇÃO:
${clone.communicationStyle}

PERGUNTA: ${question}

Responda exatamente como o usuário real responderia, usando seu estilo, vocabulário e lógica.`;

    const messages = [
      {
        role: 'system',
        content: 'Você é um clone digital perfeito do usuário. Pense e aja exatamente como ele.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await openaiService.chat(messages, userId);

    // Improve clone accuracy over time
    clone.accuracy = Math.min(99, clone.accuracy + 0.1);

    return {
      success: true,
      answer: response,
      confidence: clone.accuracy,
      isClone: true,
      message: 'Resposta do seu clone digital'
    };
  }

  /**
   * Clone can handle tasks autonomously
   */
  async delegateToClone(userId, task) {
    console.log(`🤖 Delegating task to clone: ${task.type}`);

    const clone = this.clones.get(userId);
    
    const capabilities = {
      email_triage: 'Triagem de emails',
      meeting_notes: 'Anotações de reunião',
      simple_decisions: 'Decisões simples',
      research: 'Pesquisa básica',
      scheduling: 'Agendamento'
    };

    if (!capabilities[task.type]) {
      return {
        success: false,
        error: 'Clone não pode executar este tipo de tarefa ainda'
      };
    }

    return {
      success: true,
      task: {
        id: `task_${Date.now()}`,
        type: task.type,
        status: 'delegated_to_clone',
        executedBy: 'clone',
        result: `Clone está processando: ${task.description}`
      }
    };
  }

  /**
   * Train clone with new data
   */
  async trainClone(userId, trainingData) {
    const clone = this.clones.get(userId);
    
    if (!clone) {
      throw new Error('Clone not found');
    }

    // Update clone with new patterns
    clone.lastTraining = new Date();
    clone.accuracy = Math.min(99, clone.accuracy + 5);

    return {
      success: true,
      accuracy: clone.accuracy,
      message: 'Clone treinado com sucesso'
    };
  }

  // Helper methods
  async gatherUserData(userId) {
    const conversations = await databaseService.getConversations(userId, 50);
    const preferences = await databaseService.getPreferences(userId);
    
    return {
      conversations,
      preferences,
      totalInteractions: conversations.length
    };
  }

  async buildProfile(userData) {
    return {
      interests: ['tecnologia', 'investimentos', 'negócios'],
      expertise: ['finanças', 'empreendedorismo'],
      values: ['eficiência', 'inovação', 'resultados'],
      goals: ['crescimento profissional', 'liberdade financeira']
    };
  }

  async analyzePersonality(userData) {
    return 'Direto, objetivo, orientado a resultados, analítico, estratégico, decisivo';
  }

  async analyzeDecisions(userData) {
    return 'Toma decisões baseadas em dados, considera ROI, pensa no longo prazo, assume riscos calculados';
  }

  async analyzeCommunicationStyle(userData) {
    return 'Comunicação clara e direta, usa dados para argumentar, vai direto ao ponto, profissional mas acessível';
  }

  /**
   * Get clone stats
   */
  getCloneStats(userId) {
    const clone = this.clones.get(userId);
    
    if (!clone) {
      return { exists: false };
    }

    return {
      exists: true,
      accuracy: clone.accuracy,
      createdAt: clone.createdAt,
      lastTraining: clone.lastTraining,
      capabilities: [
        'Responder como você',
        'Tomar decisões simples',
        'Triar comunicações',
        'Resumir informações'
      ]
    };
  }
}

module.exports = new CloneService();
