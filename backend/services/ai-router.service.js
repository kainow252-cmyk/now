// Sistema de Fallback Inteligente entre APIs de IA
class AIRouterService {
  constructor() {
    this.providers = {
      chat: ['groq', 'gemini', 'huggingface'],
      voice: ['browser'], // ElevenLabs seria aqui se configurado
      image: [] // Stability AI seria aqui
    };
    this.stats = new Map();
  }
  
  async chat(message, preferredProvider = 'groq') {
    const providers = [preferredProvider, ...this.providers.chat.filter(p => p !== preferredProvider)];
    
    for (const provider of providers) {
      try {
        console.log(`🔄 Tentando ${provider}...`);
        let service;
        
        if (provider === 'groq') {
          service = require('./groq.service');
          if (!service.isConfigured()) continue;
          const result = await service.chat(message);
          this.recordSuccess(provider);
          return { ...result, provider };
        }
        
        if (provider === 'gemini') {
          service = require('./gemini.service');
          const result = await service.chat(message);
          this.recordSuccess(provider);
          return { success: true, text: result, provider };
        }
        
        if (provider === 'huggingface') {
          service = require('./huggingface.service');
          if (!service.isConfigured()) continue;
          const result = await service.chat(message);
          this.recordSuccess(provider);
          return result;
        }
        
      } catch (error) {
        console.log(`❌ ${provider} falhou: ${error.message}`);
        this.recordFailure(provider);
        continue;
      }
    }
    
    throw new Error('Todos os provedores de chat falharam');
  }
  
  recordSuccess(provider) {
    const stats = this.stats.get(provider) || { success: 0, failure: 0 };
    stats.success++;
    this.stats.set(provider, stats);
  }
  
  recordFailure(provider) {
    const stats = this.stats.get(provider) || { success: 0, failure: 0 };
    stats.failure++;
    this.stats.set(provider, stats);
  }
  
  getStats() {
    const result = {};
    for (const [provider, stats] of this.stats.entries()) {
      const total = stats.success + stats.failure;
      result[provider] = {
        ...stats,
        successRate: total > 0 ? (stats.success / total * 100).toFixed(2) + '%' : '0%'
      };
    }
    return result;
  }
}

module.exports = new AIRouterService();
