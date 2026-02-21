const axios = require('axios');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1';
    this.model = 'gemini-2.5-flash';  // ✅ Modelo mais recente e rápido (2026)
  }

  async chat(messages, userId = 'default') {
    if (!this.apiKey) {
      console.warn('Gemini API key not configured, using mock response');
      return this.mockResponse(messages[messages.length - 1].content);
    }

    try {
      // Converter formato OpenAI para Gemini
      const contents = this.convertMessagesToGemini(messages, userId);

      const response = await axios.post(
        `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
            topP: 0.95,
            topK: 40
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE'
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Extrair resposta
      const text = response.data.candidates[0].content.parts[0].text;
      return text;

    } catch (error) {
      console.error('Gemini API error:', error.response?.data || error.message);
      return this.mockResponse(messages[messages.length - 1].content);
    }
  }

  convertMessagesToGemini(messages, userId) {
    // System prompt
    const systemPrompt = `Você é NOW, uma assistente digital inteligente estilo Jarvis. 

Suas características:
- Profissional, direta e inteligente
- Responde em português brasileiro
- Aprende os hábitos do usuário
- Ajuda com agenda, investimentos, pesquisas, redes sociais
- Dá sugestões estratégicas
- Respostas curtas e objetivas (máximo 2-3 frases)

Contexto do usuário: ${userId}`;

    // Converter mensagens
    const contents = [];

    // Adicionar system como primeira mensagem do user
    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    contents.push({
      role: 'model',
      parts: [{ text: 'Entendido! Sou NOW, sua assistente pessoal. Como posso ajudar?' }]
    });

    // Adicionar mensagens do histórico
    messages.forEach(msg => {
      if (msg.role === 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: msg.content }]
        });
      } else if (msg.role === 'assistant') {
        contents.push({
          role: 'model',
          parts: [{ text: msg.content }]
        });
      }
    });

    return contents;
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

  // 🎙️ CHAT COM ÁUDIO (usando Gemini para texto, OpenAI para voz)
  async chatWithAudio(messages, userId = 'default', voiceOptions = {}) {
    // 1. Gerar resposta de texto com Gemini
    const textResponse = await this.chat(messages, userId);

    // 2. Se OpenAI disponível, converter para áudio
    const openaiKey = process.env.OPENAI_API_KEY;
    let audioResponse = null;

    if (openaiKey) {
      try {
        // Usar OpenAI apenas para TTS
        const openaiService = require('./openai.service');
        audioResponse = await openaiService.textToSpeech(textResponse, voiceOptions);
      } catch (error) {
        console.warn('OpenAI TTS not available, returning text only');
      }
    }

    // 3. Retornar ambos
    return {
      text: textResponse,
      audio: audioResponse,
      timestamp: new Date().toISOString(),
      userId: userId,
      model: 'gemini-pro'
    };
  }

  // Análise de imagens (Gemini Vision)
  async analyzeImage(imageUrl, prompt = 'Descreva esta imagem') {
    if (!this.apiKey) {
      return 'Gemini API key não configurada';
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: imageUrl  // Base64 ou URL
                  }
                }
              ]
            }
          ]
        }
      );

      return response.data.candidates[0].content.parts[0].text;

    } catch (error) {
      console.error('Gemini Vision error:', error.response?.data || error.message);
      return 'Erro ao analisar imagem';
    }
  }
}

module.exports = new GeminiService();
