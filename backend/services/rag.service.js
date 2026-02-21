const openaiService = require('./openai.service');
const learningService = require('./learning.service');

/**
 * RAG (Retrieval-Augmented Generation) Service
 * Combines internet search with AI to provide accurate, up-to-date responses
 */
class RAGService {
  constructor() {
    this.vectorStore = new Map(); // Simple vector store (use Pinecone/Weaviate in production)
    this.cache = new Map();
  }

  /**
   * Answer question using RAG
   * 1. Search internet for relevant information
   * 2. Pass context to AI
   * 3. Generate informed response
   */
  async answerWithContext(question, userId = 'default') {
    console.log(`🧠 RAG Query: "${question}"`);

    try {
      // Check cache first
      const cached = this.getFromCache(question);
      if (cached) {
        console.log('✅ Answer from cache');
        return cached;
      }

      // Step 1: Search internet for context
      const searchResults = await learningService.searchInternet(question, {
        depth: 5,
        realtime: false
      });

      if (!searchResults.results || searchResults.results.length === 0) {
        // No context found, use AI directly
        return await this.answerWithoutContext(question, userId);
      }

      // Step 2: Extract relevant context
      const context = this.buildContext(searchResults.results);

      // Step 3: Generate AI response with context
      const messages = [
        {
          role: 'system',
          content: `Você é NOW, assistente inteligente para empresários.
          
Use o contexto abaixo para responder com informações atualizadas e precisas.
Se o contexto não for suficiente, use seu conhecimento geral.
Responda de forma objetiva e profissional.

CONTEXTO DA INTERNET:
${context}

Sempre cite as fontes quando usar informações do contexto.`
        },
        {
          role: 'user',
          content: question
        }
      ];

      const response = await openaiService.chat(messages, userId);

      // Add sources to response
      const enhancedResponse = {
        answer: response,
        sources: searchResults.results.slice(0, 3).map(r => ({
          title: r.title,
          url: r.url,
          source: r.source
        })),
        contextUsed: true,
        timestamp: new Date()
      };

      // Cache the result
      this.storeInCache(question, enhancedResponse);

      return enhancedResponse;

    } catch (error) {
      console.error('RAG error:', error.message);
      return await this.answerWithoutContext(question, userId);
    }
  }

  /**
   * Build context from search results
   */
  buildContext(results) {
    return results
      .slice(0, 5)
      .map((result, index) => {
        return `[${index + 1}] ${result.title}
Fonte: ${result.source}
Conteúdo: ${result.snippet}
URL: ${result.url}
`;
      })
      .join('\n---\n');
  }

  /**
   * Answer without internet context (fallback)
   */
  async answerWithoutContext(question, userId) {
    const messages = [
      {
        role: 'user',
        content: question
      }
    ];

    const response = await openaiService.chat(messages, userId);

    return {
      answer: response,
      sources: [],
      contextUsed: false,
      timestamp: new Date()
    };
  }

  /**
   * Learn and store information
   */
  async learnTopic(topic, depth = 'medium') {
    const depthSettings = {
      light: { sources: ['news'], articles: 3 },
      medium: { sources: ['news', 'tech'], articles: 5 },
      deep: { sources: ['news', 'tech', 'finance', 'business'], articles: 10 }
    };

    const settings = depthSettings[depth] || depthSettings.medium;

    console.log(`📚 Learning topic: ${topic} (${depth} depth)`);

    const learned = await learningService.learnFromSources(topic, settings.sources);

    // Store in vector database (simplified)
    this.storeVector(topic, learned);

    return {
      success: true,
      topic,
      learned: learned.learned,
      depth,
      summary: learned.summary
    };
  }

  /**
   * Batch learning - learn multiple topics
   */
  async batchLearn(topics) {
    console.log(`🎓 Batch learning ${topics.length} topics`);

    const results = [];

    for (const topic of topics) {
      const result = await this.learnTopic(topic, 'medium');
      results.push(result);
      
      // Delay to avoid rate limits
      await this.sleep(2000);
    }

    return {
      success: true,
      topicsLearned: topics.length,
      results
    };
  }

  /**
   * Smart search - search and explain
   */
  async smartSearch(query, userId = 'default') {
    // First, get raw search results
    const searchResults = await learningService.searchInternet(query);

    if (!searchResults.results || searchResults.results.length === 0) {
      return {
        summary: 'Não encontrei informações relevantes no momento.',
        results: [],
        sources: 0
      };
    }

    // Then, ask AI to summarize and explain
    const context = this.buildContext(searchResults.results);

    const messages = [
      {
        role: 'system',
        content: `Você é NOW. Analise os resultados de busca abaixo e crie um resumo executivo.
        
Foque em:
- Principais insights
- Dados importantes
- Tendências identificadas
- Ações recomendadas

RESULTADOS DA BUSCA:
${context}`
      },
      {
        role: 'user',
        content: `Resuma as informações sobre: ${query}`
      }
    ];

    const summary = await openaiService.chat(messages, userId);

    return {
      summary,
      results: searchResults.results.slice(0, 5),
      sources: searchResults.sources,
      timestamp: new Date()
    };
  }

  /**
   * Real-time market intelligence
   */
  async getMarketIntelligence(symbol, userId = 'default') {
    // Search for latest news and analysis
    const query = `${symbol} stock analysis latest news`;
    
    const searchResults = await learningService.searchInternet(query, {
      sources: 'finance',
      realtime: true
    });

    const context = this.buildContext(searchResults.results || []);

    const messages = [
      {
        role: 'system',
        content: `Você é um analista financeiro. Use o contexto abaixo para análise:

${context}

Forneça análise profissional sobre ${symbol}.`
      },
      {
        role: 'user',
        content: `Analise ${symbol} e dê recomendação`
      }
    ];

    const analysis = await openaiService.chat(messages, userId);

    return {
      symbol,
      analysis,
      sources: searchResults.results?.slice(0, 3) || [],
      timestamp: new Date()
    };
  }

  /**
   * Training mode - continuous learning
   */
  async startTraining(schedule = 'hourly') {
    console.log(`🎓 Starting training mode: ${schedule}`);

    const trainingTopics = [
      'artificial intelligence trends',
      'financial markets today',
      'technology investments',
      'startup funding',
      'cryptocurrency market',
      'business innovation'
    ];

    // Initial training
    await this.batchLearn(trainingTopics);

    // Schedule continuous learning based on schedule
    const intervals = {
      hourly: 3600000,    // 1 hour
      daily: 86400000,    // 24 hours
      realtime: 600000    // 10 minutes
    };

    const interval = intervals[schedule] || intervals.hourly;

    return {
      success: true,
      schedule,
      interval: `${interval / 1000}s`,
      topics: trainingTopics.length,
      message: `Training iniciado. NOW irá aprender continuamente.`
    };
  }

  // Cache management
  getFromCache(key) {
    const cached = this.cache.get(key.toLowerCase());
    if (cached && (Date.now() - cached.timestamp < 3600000)) { // 1 hour
      return cached.data;
    }
    return null;
  }

  storeInCache(key, data) {
    this.cache.set(key.toLowerCase(), {
      data,
      timestamp: Date.now()
    });

    // Limit cache size
    if (this.cache.size > 500) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  clearCache() {
    this.cache.clear();
  }

  // Vector store (simplified - use Pinecone/Weaviate in production)
  storeVector(key, data) {
    this.vectorStore.set(key, {
      data,
      stored: new Date()
    });
  }

  getVector(key) {
    return this.vectorStore.get(key);
  }

  // Helper
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Statistics
  getStats() {
    return {
      cacheSize: this.cache.size,
      vectorStoreSize: this.vectorStore.size,
      learningStats: learningService.getStats()
    };
  }
}

module.exports = new RAGService();
