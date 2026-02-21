// Serviço de Conversação Inteligente - NOW AI
// Integra conhecimento local + APIs + busca autônoma

const aiRouterService = require('./ai-router.service');
const freeAPIsService = require('./free-apis.service');

class ConversationService {
  constructor() {
    this.localKnowledge = new Map();
    this.conversationHistory = new Map(); // userId -> messages[]
  }

  /**
   * Processa uma pergunta do usuário com inteligência completa
   */
  async ask(question, userId = 'default') {
    try {
      // 1. Busca primeiro no conhecimento local
      const localResult = this.searchLocalKnowledge(question);
      
      if (localResult.confidence > 0.8) {
        console.log(`✅ Respondendo com conhecimento local (${(localResult.confidence * 100).toFixed(0)}%)`);
        return {
          success: true,
          answer: localResult.answer,
          source: 'local',
          confidence: localResult.confidence,
          data: localResult.data
        };
      }

      // 2. Tenta APIs gratuitas de conhecimento
      console.log('🔍 Buscando em APIs de conhecimento...');
      const knowledgeResult = await freeAPIsService.query(question);
      
      if (knowledgeResult.success) {
        // Adiciona ao conhecimento local para próximas consultas
        this.addToLocalKnowledge(question, knowledgeResult);
        
        return {
          success: true,
          answer: this.formatKnowledgeResponse(knowledgeResult),
          source: 'api',
          confidence: 0.9,
          data: knowledgeResult
        };
      }

      // 3. Fallback para IA (Groq -> Gemini -> HuggingFace)
      console.log('🤖 Usando IA para responder...');
      
      // Adiciona histórico de conversa
      const history = this.getHistory(userId);
      const contextualMessage = this.buildContextualMessage(question, history);
      
      const aiResult = await aiRouterService.chat(contextualMessage);
      
      // Salva na história
      this.addToHistory(userId, { role: 'user', content: question });
      this.addToHistory(userId, { role: 'assistant', content: aiResult.text || aiResult.response });
      
      return {
        success: true,
        answer: aiResult.text || aiResult.response || aiResult.message,
        source: 'ai',
        provider: aiResult.provider,
        confidence: 0.7
      };

    } catch (error) {
      console.error('❌ Erro ao processar pergunta:', error.message);
      return {
        success: false,
        error: error.message,
        answer: 'Desculpe, não consegui processar sua pergunta no momento.'
      };
    }
  }

  /**
   * Busca inteligente no conhecimento local
   */
  searchLocalKnowledge(question) {
    const q = question.toLowerCase();
    
    for (const [key, value] of this.localKnowledge.entries()) {
      const keywords = key.split(' ');
      const matches = keywords.filter(kw => q.includes(kw)).length;
      const confidence = matches / keywords.length;
      
      if (confidence > 0.5) {
        return {
          answer: value.answer,
          confidence: confidence,
          data: value.data,
          timestamp: value.timestamp
        };
      }
    }
    
    return { confidence: 0 };
  }

  /**
   * Adiciona conhecimento ao cache local
   */
  addToLocalKnowledge(question, data) {
    const key = question.toLowerCase().slice(0, 100);
    this.localKnowledge.set(key, {
      answer: this.formatKnowledgeResponse(data),
      data: data,
      timestamp: Date.now()
    });

    // Limita o tamanho do cache
    if (this.localKnowledge.size > 1000) {
      const firstKey = this.localKnowledge.keys().next().value;
      this.localKnowledge.delete(firstKey);
    }
  }

  /**
   * Formata resposta das APIs de conhecimento
   */
  formatKnowledgeResponse(data) {
    // Wikipedia
    if (data.summary) {
      return data.summary;
    }
    
    // Crypto
    if (data.price) {
      const change = data.change24h > 0 ? 'subiu' : 'caiu';
      return `${data.coin || 'A moeda'} está cotada em $${data.price} USD, ${change} ${Math.abs(data.change24h).toFixed(2)}% nas últimas 24 horas.`;
    }
    
    // Weather
    if (data.temperature !== undefined) {
      return `A temperatura atual é ${data.temperature}°C, com sensação térmica de ${data.apparentTemperature}°C. Vento: ${data.windspeed} km/h.`;
    }
    
    // Exchange
    if (data.rates) {
      const brl = data.rates.BRL?.toFixed(2);
      const eur = data.rates.EUR?.toFixed(2);
      return `Cotações: 1 ${data.base} = R$ ${brl} BRL, € ${eur} EUR.`;
    }
    
    // Country
    if (data.name && data.population) {
      return `${data.name} tem ${(data.population / 1_000_000).toFixed(1)} milhões de habitantes, capital ${data.capital}.`;
    }
    
    // News
    if (data.articles && data.articles.length > 0) {
      const headlines = data.articles.slice(0, 3)
        .map((a, i) => `${i + 1}. ${a.title}`)
        .join('\n');
      return `Principais notícias:\n${headlines}`;
    }

    // Space
    if (data.title && data.explanation) {
      return `Imagem do dia da NASA: ${data.title}. ${data.explanation.slice(0, 200)}...`;
    }

    // Genérico
    return JSON.stringify(data).slice(0, 300);
  }

  /**
   * Gerencia histórico de conversa por usuário
   */
  getHistory(userId, limit = 10) {
    const history = this.conversationHistory.get(userId) || [];
    return history.slice(-limit);
  }

  addToHistory(userId, message) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }
    
    const history = this.conversationHistory.get(userId);
    history.push({ ...message, timestamp: Date.now() });

    // Limita histórico a 100 mensagens
    if (history.length > 100) {
      history.shift();
    }
  }

  /**
   * Constrói mensagem contextual com histórico
   */
  buildContextualMessage(question, history) {
    if (history.length === 0) {
      return question;
    }

    // Adiciona últimas 3 interações como contexto
    const recentHistory = history.slice(-6);
    const contextLines = recentHistory.map(msg => 
      `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`
    );
    
    return `Histórico recente:\n${contextLines.join('\n')}\n\nPergunta atual: ${question}`;
  }

  /**
   * Retorna estatísticas do sistema
   */
  getStats() {
    return {
      localKnowledgeSize: this.localKnowledge.size,
      activeUsers: this.conversationHistory.size,
      totalConversations: Array.from(this.conversationHistory.values())
        .reduce((sum, hist) => sum + hist.length, 0),
      aiStats: aiRouterService.getStats()
    };
  }

  /**
   * Limpa dados antigos (manutenção)
   */
  cleanup(maxAgeMs = 24 * 60 * 60 * 1000) { // 24h
    const now = Date.now();
    
    // Limpa conhecimento antigo
    for (const [key, value] of this.localKnowledge.entries()) {
      if (now - value.timestamp > maxAgeMs) {
        this.localKnowledge.delete(key);
      }
    }

    console.log(`🧹 Limpeza concluída. Cache local: ${this.localKnowledge.size} itens`);
  }
}

module.exports = new ConversationService();
