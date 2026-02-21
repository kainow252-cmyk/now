const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
    this.client = null;
    this.models = {
      fast: 'llama3-70b-8192',        // Mais rápido
      smart: 'mixtral-8x7b-32768',    // Mais inteligente
      small: 'gemma-7b-it'            // Mais econômico
    };
    
    if (this.apiKey) {
      this.client = new Groq({ apiKey: this.apiKey });
      console.log('✅ GroqCloud inicializado');
    } else {
      console.log('⚠️  GROQ_API_KEY não encontrado');
    }
  }
  
  async chat(message, model = 'fast', options = {}) {
    if (!this.client) {
      throw new Error('GROQ_API_KEY não configurado. Obtenha em: https://console.groq.com/');
    }
    
    try {
      const selectedModel = this.models[model] || this.models.fast;
      
      const response = await this.client.chat.completions.create({
        model: selectedModel,
        messages: [{ role: 'user', content: message }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1024,
        top_p: options.topP || 1,
        stream: false
      });
      
      return {
        success: true,
        text: response.choices[0].message.content,
        model: response.model,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        },
        provider: 'groq'
      };
    } catch (error) {
      console.error('❌ Groq error:', error.message);
      throw error;
    }
  }
  
  async stream(message, model = 'fast', options = {}) {
    if (!this.client) {
      throw new Error('GROQ_API_KEY não configurado');
    }
    
    const selectedModel = this.models[model] || this.models.fast;
    
    const stream = await this.client.chat.completions.create({
      model: selectedModel,
      messages: [{ role: 'user', content: message }],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1024,
      stream: true
    });
    
    return stream;
  }
  
  getModels() {
    return {
      success: true,
      models: Object.entries(this.models).map(([key, value]) => ({
        id: key,
        name: value,
        description: key === 'fast' ? 'Mais rápido (Llama 3)' :
                     key === 'smart' ? 'Mais inteligente (Mixtral)' :
                     'Mais econômico (Gemma)'
      })),
      provider: 'groq'
    };
  }
  
  isConfigured() {
    return !!this.client;
  }
}

module.exports = new GroqService();
