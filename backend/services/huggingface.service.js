const axios = require('axios');

class HuggingFaceService {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || '';
    this.baseUrl = 'https://api-inference.huggingface.co/models';
    
    if (this.apiKey) {
      console.log('✅ Hugging Face inicializado');
    } else {
      console.log('⚠️  HUGGINGFACE_API_KEY não encontrado');
    }
  }
  
  async query(model, input, options = {}) {
    if (!this.apiKey) {
      throw new Error('HUGGINGFACE_API_KEY não configurado. Obtenha em: https://huggingface.co/settings/tokens');
    }
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/${model}`,
        { inputs: input, ...options },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      
      return {
        success: true,
        data: response.data,
        model: model,
        provider: 'huggingface'
      };
    } catch (error) {
      console.error(`❌ HuggingFace error (${model}):`, error.message);
      throw error;
    }
  }
  
  // Tradução
  async translate(text, sourceLang = 'en', targetLang = 'pt') {
    const modelMap = {
      'en-pt': 'Helsinki-NLP/opus-mt-en-pt',
      'pt-en': 'Helsinki-NLP/opus-mt-tc-big-pt-en',
      'en-es': 'Helsinki-NLP/opus-mt-en-es',
      'en-fr': 'Helsinki-NLP/opus-mt-en-fr'
    };
    
    const modelKey = `${sourceLang}-${targetLang}`;
    const model = modelMap[modelKey] || modelMap['en-pt'];
    
    const result = await this.query(model, text);
    
    return {
      success: true,
      translatedText: result.data[0]?.translation_text || text,
      sourceLang,
      targetLang,
      model: model,
      provider: 'huggingface'
    };
  }
  
  // Resumo de texto
  async summarize(text, maxLength = 130, minLength = 30) {
    const model = 'facebook/bart-large-cnn';
    
    const result = await this.query(model, text, {
      parameters: {
        max_length: maxLength,
        min_length: minLength
      }
    });
    
    return {
      success: true,
      summary: result.data[0]?.summary_text || '',
      originalLength: text.length,
      summaryLength: result.data[0]?.summary_text?.length || 0,
      provider: 'huggingface'
    };
  }
  
  // Análise de sentimento
  async sentiment(text) {
    const model = 'cardiffnlp/twitter-roberta-base-sentiment';
    
    const result = await this.query(model, text);
    
    const scores = result.data[0] || [];
    const sentiment = scores.reduce((max, item) => 
      item.score > max.score ? item : max
    , { label: 'NEUTRAL', score: 0 });
    
    return {
      success: true,
      sentiment: sentiment.label,
      confidence: sentiment.score,
      allScores: scores,
      provider: 'huggingface'
    };
  }
  
  // Geração de código
  async generateCode(prompt, language = 'python') {
    const model = 'bigcode/starcoder';
    
    const fullPrompt = `# ${language}\n${prompt}\n`;
    
    const result = await this.query(model, fullPrompt, {
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7
      }
    });
    
    return {
      success: true,
      code: result.data[0]?.generated_text || '',
      language: language,
      provider: 'huggingface'
    };
  }
  
  // Resposta a perguntas
  async questionAnswering(question, context) {
    const model = 'deepset/roberta-base-squad2';
    
    const result = await this.query(model, {
      question: question,
      context: context
    });
    
    return {
      success: true,
      answer: result.data?.answer || '',
      confidence: result.data?.score || 0,
      provider: 'huggingface'
    };
  }
  
  // Chat genérico (usando model conversacional)
  async chat(message) {
    const model = 'microsoft/DialoGPT-medium';
    
    const result = await this.query(model, message);
    
    return {
      success: true,
      text: result.data?.generated_text || result.data[0]?.generated_text || '',
      provider: 'huggingface'
    };
  }
  
  isConfigured() {
    return !!this.apiKey;
  }
  
  getAvailableModels() {
    return {
      translate: ['Helsinki-NLP/opus-mt-en-pt', 'Helsinki-NLP/opus-mt-tc-big-pt-en'],
      summarize: ['facebook/bart-large-cnn'],
      sentiment: ['cardiffnlp/twitter-roberta-base-sentiment'],
      code: ['bigcode/starcoder'],
      qa: ['deepset/roberta-base-squad2'],
      chat: ['microsoft/DialoGPT-medium']
    };
  }
}

module.exports = new HuggingFaceService();
