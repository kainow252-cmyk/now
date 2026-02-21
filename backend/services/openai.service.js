const axios = require('axios');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-4';
  }

  async chat(messages, userId = 'default') {
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured, using mock response');
      return this.mockResponse(messages[messages.length - 1].content);
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `Você é NOW, uma assistente digital inteligente estilo Jarvis. 
              Você é focada em ajudar empresários e investidores.
              Suas características:
              - Profissional, direta e inteligente
              - Responde em português brasileiro
              - Aprende os hábitos do usuário
              - Ajuda com agenda, investimentos, pesquisas, redes sociais
              - Dá sugestões estratégicas
              - Respostas curtas e objetivas (máximo 2-3 frases)
              Contexto do usuário: ${userId}`
            },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      return this.mockResponse(messages[messages.length - 1].content);
    }
  }

  mockResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes('bom dia')) {
      const date = new Date().toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric',
        month: 'long'
      });
      return `Bom dia! Hoje é ${date}. Sua agenda está organizada com 2 compromissos prioritários.`;
    }

    if (lowerMsg.includes('agenda') || lowerMsg.includes('organiza')) {
      return 'Agenda organizada: Reunião estratégica às 10h e análise financeira às 15h. Deseja mais detalhes?';
    }

    if (lowerMsg.includes('investimento') || lowerMsg.includes('notícia') || lowerMsg.includes('mercado')) {
      return 'Mercado em alta: Bitcoin +3.2%, tech stocks subindo. Identifiquei 2 oportunidades. Deseja análise completa?';
    }

    if (lowerMsg.includes('post') || lowerMsg.includes('rede')) {
      return 'Post criado sobre investimentos em tecnologia. Ajustei ao seu estilo profissional. Confirma publicação?';
    }

    if (lowerMsg.includes('viagem')) {
      return 'Analisando destinos baseado em suas preferências... 3 sugestões encontradas. Quer ver?';
    }

    if (lowerMsg.includes('boa noite')) {
      return 'Boa noite! Hoje 4 de 5 tarefas concluídas. Amanhã priorize análise estratégica. Descanso produtivo!';
    }

    if (lowerMsg.includes('código') || lowerMsg.includes('site') || lowerMsg.includes('criar')) {
      return 'Posso criar: API, website, dashboard ou sistema. Especifique o tipo e começarei imediatamente.';
    }

    return 'Entendido. Estou processando sua solicitação. Como posso ajudar especificamente?';
  }

  async generateContent(prompt, type = 'general') {
    const systemPrompts = {
      'social_post': 'Crie um post profissional para redes sociais de um empresário/investidor.',
      'email': 'Escreva um email profissional e objetivo.',
      'report': 'Crie um relatório executivo conciso.',
      'code': 'Gere código limpo e bem documentado.',
      'general': 'Você é uma assistente executiva profissional.'
    };

    const messages = [
      {
        role: 'system',
        content: systemPrompts[type] || systemPrompts.general
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.chat(messages);
  }

  // 🎙️ TEXT-TO-SPEECH - Converte texto em áudio
  async textToSpeech(text, options = {}) {
    const {
      voice = 'nova',      // Vozes: alloy, echo, fable, onyx, nova, shimmer
      speed = 1.0,         // Velocidade: 0.25 a 4.0
      format = 'mp3'       // Formatos: mp3, opus, aac, flac
    } = options;

    if (!this.apiKey) {
      console.warn('OpenAI API key not configured, returning mock audio URL');
      return {
        success: false,
        audioUrl: null,
        audioBuffer: null,
        text: text,
        voice: voice,
        error: 'API key not configured'
      };
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/audio/speech`,
        {
          model: 'tts-1',     // tts-1 (rápido) ou tts-1-hd (alta qualidade)
          input: text,
          voice: voice,
          speed: speed,
          response_format: format
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'  // Importante para receber áudio
        }
      );

      // Converter para base64 para enviar ao frontend
      const audioBuffer = Buffer.from(response.data);
      const audioBase64 = audioBuffer.toString('base64');
      const audioDataUrl = `data:audio/${format};base64,${audioBase64}`;

      return {
        success: true,
        audioUrl: audioDataUrl,
        audioBuffer: audioBuffer,
        text: text,
        voice: voice,
        speed: speed,
        format: format,
        size: audioBuffer.length
      };
    } catch (error) {
      console.error('TTS error:', error.response?.data || error.message);
      return {
        success: false,
        audioUrl: null,
        audioBuffer: null,
        text: text,
        voice: voice,
        error: error.message
      };
    }
  }

  // 🎙️ CHAT COM ÁUDIO - Responde com texto E áudio
  async chatWithAudio(messages, userId = 'default', voiceOptions = {}) {
    // 1. Gerar resposta de texto
    const textResponse = await this.chat(messages, userId);

    // 2. Converter texto para áudio
    const audioResponse = await this.textToSpeech(textResponse, voiceOptions);

    // 3. Retornar ambos
    return {
      text: textResponse,
      audio: audioResponse,
      timestamp: new Date().toISOString(),
      userId: userId
    };
  }
}

module.exports = new OpenAIService();
