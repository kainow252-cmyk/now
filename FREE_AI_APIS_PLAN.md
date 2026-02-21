# 🤖 FREE AI APIs - Plano de Integração Completo

**Data**: 2026-02-21  
**Objetivo**: Integrar 8+ APIs de IA gratuitas no JARVIS NOW

---

## 🎯 VISÃO GERAL

Transformar o JARVIS em um **hub multi-IA** com:
- ✅ 3+ LLMs gratuitos (Gemini, Llama 3, Mixtral)
- ✅ 2+ APIs de imagem (Stable Diffusion, Vision)
- ✅ 2+ APIs de áudio (ElevenLabs, Deepgram)
- ✅ Fallback inteligente automático
- ✅ $0/mês de custo base

---

## 📊 APIS PRIORITÁRIAS

### 🔥 PRIORIDADE ALTA (Implementar HOJE)

#### 1. **Google Gemini 1.5** (Texto/Chat)
**Status**: ✅ Já configurado (GEMINI_API_KEY presente)
**Modelo**: `gemini-1.5-flash` (mais rápido) e `gemini-1.5-pro` (mais preciso)
**Quota**: 15 RPM (requisições/minuto) gratuito
**Uso**: Chat principal, análise de contexto, visão
**Docs**: https://ai.google.dev/

```javascript
// backend/services/gemini.service.js (já existe)
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function chat(message) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(message);
  return result.response.text();
}
```

**Endpoints**:
- ✅ `POST /api/gemini/chat` (já existe)
- ✅ `POST /api/gemini/vision` (já existe)
- 🆕 `POST /api/gemini/stream` (adicionar)

---

#### 2. **GroqCloud** (LLM Ultra-Rápido)
**Status**: 🆕 Implementar
**Modelos**: `llama3-70b-8192`, `mixtral-8x7b-32768`, `gemma-7b-it`
**Quota**: ~6,000 tokens/min GRÁTIS
**Velocidade**: 500-800 tokens/seg (mais rápido que todos)
**Docs**: https://console.groq.com/docs

**Vantagem**: Respostas quase instantâneas para JARVIS

```javascript
// backend/services/groq.service.js (CRIAR)
const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY || ''
    });
    this.models = {
      fast: 'llama3-70b-8192',        // Mais rápido
      smart: 'mixtral-8x7b-32768',    // Mais inteligente
      small: 'gemma-7b-it'            // Mais econômico
    };
  }
  
  async chat(message, model = 'fast') {
    if (!this.client.apiKey) {
      throw new Error('GROQ_API_KEY não configurado');
    }
    
    const response = await this.client.chat.completions.create({
      model: this.models[model],
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
      max_tokens: 1024
    });
    
    return {
      text: response.choices[0].message.content,
      model: response.model,
      usage: response.usage
    };
  }
  
  async stream(message, model = 'fast') {
    const stream = await this.client.chat.completions.create({
      model: this.models[model],
      messages: [{ role: 'user', content: message }],
      stream: true
    });
    
    return stream;
  }
}

module.exports = new GroqService();
```

**Endpoints**:
- 🆕 `POST /api/groq/chat`
- 🆕 `POST /api/groq/stream`
- 🆕 `GET /api/groq/models`

**Como obter chave**:
1. https://console.groq.com/
2. Criar conta (email gratuito)
3. Copiar API Key
4. Adicionar em `.env`: `GROQ_API_KEY=gsk_...`

---

#### 3. **Hugging Face Inference API** (100k+ Modelos)
**Status**: 🆕 Implementar
**Modelos**: Qualquer modelo público no Hub
**Quota**: ~1,000 requisições/dia GRÁTIS
**Docs**: https://huggingface.co/docs/api-inference

**Casos de uso**:
- Tradução (Helsinki-NLP)
- Resumo (facebook/bart-large-cnn)
- Análise sentimento (cardiffnlp/twitter-roberta-base-sentiment)
- Geração código (bigcode/starcoder)

```javascript
// backend/services/huggingface.service.js (CRIAR)
const axios = require('axios');

class HuggingFaceService {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || '';
    this.baseUrl = 'https://api-inference.huggingface.co/models';
  }
  
  async query(model, input) {
    const response = await axios.post(
      `${this.baseUrl}/${model}`,
      { inputs: input },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
  
  // Tarefas pré-configuradas
  async translate(text, source = 'en', target = 'pt') {
    return this.query('Helsinki-NLP/opus-mt-en-pt', text);
  }
  
  async summarize(text) {
    return this.query('facebook/bart-large-cnn', text);
  }
  
  async sentiment(text) {
    return this.query('cardiffnlp/twitter-roberta-base-sentiment', text);
  }
  
  async generateCode(prompt) {
    return this.query('bigcode/starcoder', prompt);
  }
}

module.exports = new HuggingFaceService();
```

**Endpoints**:
- 🆕 `POST /api/hf/translate`
- 🆕 `POST /api/hf/summarize`
- 🆕 `POST /api/hf/sentiment`
- 🆕 `POST /api/hf/code`
- 🆕 `POST /api/hf/query` (genérico)

**Chave**: https://huggingface.co/settings/tokens

---

#### 4. **ElevenLabs TTS** (Voz Natural)
**Status**: ⚠️ Já configurado mas não funciona
**Quota**: 10,000 caracteres/mês GRÁTIS
**Vozes**: 3 vozes femininas + clonagem
**Docs**: https://elevenlabs.io/docs/api-reference

**Problema atual**: OpenAI TTS retorna áudio vazio

**Solução**: Usar ElevenLabs como alternativa

```javascript
// backend/services/voice.service.js (CRIAR - Agregador TTS)
const axios = require('axios');

class VoiceService {
  constructor() {
    this.providers = {
      elevenlabs: {
        apiKey: process.env.ELEVENLABS_API_KEY,
        baseUrl: 'https://api.elevenlabs.io/v1',
        voices: {
          nova: '21m00Tcm4TlvDq8ikWAM',      // Rachel (feminina suave)
          shimmer: 'pNInz6obpgDQGcFmaJgB',   // Adam (neutro)
          alloy: 'EXAVITQu4vr4xnSDxMaL'     // Domi (feminina energética)
        }
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: 'https://api.openai.com/v1',
        voices: ['nova', 'shimmer', 'alloy', 'echo', 'fable', 'onyx']
      }
    };
  }
  
  async textToSpeech(text, voice = 'nova', provider = 'elevenlabs') {
    try {
      if (provider === 'elevenlabs') {
        return await this.elevenLabsTTS(text, voice);
      } else {
        return await this.openAITTS(text, voice);
      }
    } catch (error) {
      console.error(`TTS ${provider} error:`, error.message);
      // Fallback automático
      return provider === 'elevenlabs'
        ? await this.openAITTS(text, voice)
        : await this.elevenLabsTTS(text, voice);
    }
  }
  
  async elevenLabsTTS(text, voice) {
    const config = this.providers.elevenlabs;
    const voiceId = config.voices[voice] || config.voices.nova;
    
    const response = await axios.post(
      `${config.baseUrl}/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'xi-api-key': config.apiKey,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );
    
    const audioBase64 = Buffer.from(response.data).toString('base64');
    return {
      success: true,
      audio: `data:audio/mpeg;base64,${audioBase64}`,
      provider: 'elevenlabs',
      voice: voice,
      text: text
    };
  }
  
  async openAITTS(text, voice) {
    // Código OpenAI corrigido (responseType: arraybuffer)
    // ... (código do JARVIS_EVOLUTION.md)
  }
}

module.exports = new VoiceService();
```

**Endpoints**:
- 🆕 `POST /api/voice/tts` (multi-provider)
- 🆕 `GET /api/voice/providers`
- 🆕 `GET /api/voice/voices`

---

### 🟡 PRIORIDADE MÉDIA (Próximos 3 dias)

#### 5. **OpenRouter** (Agregador Multi-Modelos)
**Status**: 🆕 Implementar
**Modelos**: 50+ LLMs (muitos gratuitos)
**Quota**: Varia por modelo (alguns ilimitados)
**Docs**: https://openrouter.ai/docs

**Vantagem**: Um único endpoint para acessar Llama, Mistral, Claude, etc.

```javascript
// backend/services/openrouter.service.js
const axios = require('axios');

class OpenRouterService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseUrl = 'https://openrouter.ai/api/v1';
    
    // Modelos gratuitos conhecidos
    this.freeModels = [
      'meta-llama/llama-3-8b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
      'google/gemma-7b-it:free'
    ];
  }
  
  async chat(message, model = 'auto') {
    const selectedModel = model === 'auto'
      ? this.freeModels[0]
      : model;
    
    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: selectedModel,
        messages: [{ role: 'user', content: message }]
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      text: response.data.choices[0].message.content,
      model: response.data.model,
      cost: response.data.usage?.total_cost || 0
    };
  }
  
  async listModels() {
    const response = await axios.get(`${this.baseUrl}/models`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });
    
    // Filtrar apenas modelos gratuitos
    return response.data.data.filter(m =>
      m.pricing?.prompt === '0' || m.id.includes(':free')
    );
  }
}

module.exports = new OpenRouterService();
```

---

#### 6. **Deepgram STT** (Transcrição Tempo Real)
**Status**: 🆕 Implementar
**Quota**: $200 em créditos grátis
**Velocidade**: 2-3x tempo real
**Docs**: https://developers.deepgram.com/

**Uso**: Transcrever comandos de voz do JARVIS

```javascript
// backend/services/deepgram.service.js
const { createClient } = require('@deepgram/sdk');

class DeepgramService {
  constructor() {
    this.client = createClient(process.env.DEEPGRAM_API_KEY);
  }
  
  async transcribe(audioUrl) {
    const { result } = await this.client.listen.prerecorded.transcribeUrl(
      { url: audioUrl },
      { model: 'nova-2', language: 'pt-BR' }
    );
    
    return {
      text: result.results.channels[0].alternatives[0].transcript,
      confidence: result.results.channels[0].alternatives[0].confidence
    };
  }
  
  async liveTranscribe(audioStream) {
    const connection = this.client.listen.live({
      model: 'nova-2',
      language: 'pt-BR',
      smart_format: true
    });
    
    connection.on('transcript', (data) => {
      console.log('Transcrito:', data.channel.alternatives[0].transcript);
    });
    
    return connection;
  }
}

module.exports = new DeepgramService();
```

---

#### 7. **Stability AI** (Geração de Imagens)
**Status**: 🆕 Implementar
**Quota**: 25 créditos/mês GRÁTIS (~25 imagens)
**Modelo**: Stable Diffusion 3
**Docs**: https://platform.stability.ai/docs/api-reference

```javascript
// backend/services/stability.service.js
const axios = require('axios');

class StabilityService {
  constructor() {
    this.apiKey = process.env.STABILITY_API_KEY;
    this.baseUrl = 'https://api.stability.ai/v1';
  }
  
  async generateImage(prompt) {
    const response = await axios.post(
      `${this.baseUrl}/generation/stable-diffusion-v3/text-to-image`,
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 512,
        width: 512,
        samples: 1,
        steps: 30
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const imageBase64 = response.data.artifacts[0].base64;
    return {
      success: true,
      image: `data:image/png;base64,${imageBase64}`,
      prompt: prompt
    };
  }
}

module.exports = new StabilityService();
```

---

#### 8. **Google Cloud Vision** (Análise Imagens)
**Status**: 🆕 Implementar
**Quota**: 1,000 requisições/mês GRÁTIS
**Docs**: https://cloud.google.com/vision/docs

**Uso**: OCR, detecção objetos, rostos

```javascript
// backend/services/vision.service.js
const vision = require('@google-cloud/vision');

class VisionService {
  constructor() {
    this.client = new vision.ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE
    });
  }
  
  async analyzeImage(imageUrl) {
    const [result] = await this.client.annotateImage({
      image: { source: { imageUri: imageUrl } },
      features: [
        { type: 'LABEL_DETECTION' },
        { type: 'TEXT_DETECTION' },
        { type: 'FACE_DETECTION' }
      ]
    });
    
    return {
      labels: result.labelAnnotations.map(l => l.description),
      text: result.textAnnotations[0]?.description || '',
      faces: result.faceAnnotations.length
    };
  }
}

module.exports = new VisionService();
```

---

## 🔄 SISTEMA DE FALLBACK INTELIGENTE

```javascript
// backend/services/ai-router.service.js (CRIAR)
class AIRouterService {
  constructor() {
    this.providers = {
      chat: ['groq', 'gemini', 'openrouter', 'huggingface'],
      voice: ['elevenlabs', 'openai'],
      vision: ['gemini', 'google-vision'],
      image: ['stability']
    };
    
    this.fallbackChain = {};
  }
  
  async chat(message, preferredProvider = 'groq') {
    const providers = [
      preferredProvider,
      ...this.providers.chat.filter(p => p !== preferredProvider)
    ];
    
    for (const provider of providers) {
      try {
        console.log(`Tentando ${provider}...`);
        const service = require(`./${provider}.service.js`);
        const result = await service.chat(message);
        console.log(`✅ ${provider} respondeu`);
        return { ...result, provider };
      } catch (error) {
        console.log(`❌ ${provider} falhou: ${error.message}`);
        continue;
      }
    }
    
    throw new Error('Todos os provedores de chat falharam');
  }
  
  async voice(text, preferredProvider = 'elevenlabs') {
    // Similar ao chat, mas para TTS
  }
}

module.exports = new AIRouterService();
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: APIs de Texto (2h)
- [ ] Criar `groq.service.js`
- [ ] Criar `huggingface.service.js`
- [ ] Criar `openrouter.service.js`
- [ ] Adicionar endpoints em `server-v5.js`
- [ ] Testar fallback entre LLMs

### Fase 2: APIs de Voz (2h)
- [ ] Corrigir `openai.service.js` (TTS)
- [ ] Criar `voice.service.js` (agregador)
- [ ] Integrar ElevenLabs
- [ ] Integrar Deepgram (STT)
- [ ] Testar voz feminina natural

### Fase 3: APIs de Imagem (1h)
- [ ] Criar `stability.service.js`
- [ ] Criar `vision.service.js`
- [ ] Adicionar endpoints
- [ ] Testar geração + análise

### Fase 4: Router Inteligente (1h)
- [ ] Criar `ai-router.service.js`
- [ ] Implementar fallback automático
- [ ] Adicionar métricas (taxa sucesso)
- [ ] Atualizar frontend JARVIS

---

## 🔑 VARIÁVEIS DE AMBIENTE

Adicionar em `.env`:

```bash
# Já configurados
GEMINI_API_KEY=AIzaSyBQzcuKt_yKvzxDYkH4z70vjjBioO931OU
OPENAI_API_KEY=sk-proj-LQbz_XAqGgie27qY...

# NOVOS (obter gratuitamente)
GROQ_API_KEY=gsk_...                    # https://console.groq.com/
HUGGINGFACE_API_KEY=hf_...              # https://huggingface.co/settings/tokens
OPENROUTER_API_KEY=sk-or-...            # https://openrouter.ai/keys
ELEVENLABS_API_KEY=...                  # https://elevenlabs.io/app/settings/api
DEEPGRAM_API_KEY=...                    # https://console.deepgram.com/
STABILITY_API_KEY=sk-...                # https://platform.stability.ai/account/keys
```

---

## 💰 CUSTOS TOTAIS

| API | Quota Grátis | Custo Após | Uso Estimado |
|-----|--------------|------------|--------------|
| Gemini | 15 RPM | Grátis | 100% |
| GroqCloud | 6k tokens/min | Grátis | 100% |
| Hugging Face | 1k req/dia | $0.06/1k | 90% |
| OpenRouter | Varia | $0-0.5/M | 80% |
| ElevenLabs | 10k chars/mês | $1/10k | 70% |
| Deepgram | $200 créditos | $0.0125/min | 100% |
| Stability AI | 25 imgs/mês | $0.002/img | 50% |
| Google Vision | 1k req/mês | $1.50/1k | 80% |
| **TOTAL** | **GRÁTIS** | **~$5-10/mês** | **Fase inicial 100% grátis** |

---

## 🚀 RESULTADO FINAL

Após implementação completa, o JARVIS terá:

✅ **3+ LLMs** rodando em paralelo (Groq, Gemini, HF)
✅ **Fallback automático** se um falhar
✅ **Voz feminina natural** (ElevenLabs + OpenAI)
✅ **Transcrição tempo real** (Deepgram)
✅ **Geração de imagens** (Stable Diffusion)
✅ **Análise de imagens** (Google Vision)
✅ **100+ modelos especializados** (Hugging Face)
✅ **$0/mês** durante desenvolvimento
✅ **Sistema de roteamento inteligente**

---

**Próximo passo**: Implementar `groq.service.js` e testar velocidade extrema!
