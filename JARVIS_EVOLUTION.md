# 🤖 JARVIS EVOLUTION - Roadmap Completo

**Data**: 2026-02-21  
**Status**: 🟢 **FASE 1 COMPLETA** → Iniciando **FASE 2**

---

## 🎯 OBJETIVO
Transformar o NOW AI Assistant em um sistema completo estilo **JARVIS do Homem de Ferro**, com:
- ✅ Interface holográfica 3D (FEITO)
- ✅ Reconhecimento de voz contínuo (FEITO)
- ⚠️ Voz feminina natural (PARCIAL - áudio vazio)
- 🔄 Controle por gestos (EM DESENVOLVIMENTO)
- 🔄 Aprendizado contínuo (EM DESENVOLVIMENTO)
- 🔄 Automação residencial (PLANEJADO)
- 🔄 Multi-dispositivo (PLANEJADO)

---

## 📊 STATUS ATUAL (Fase 1 ✅)

### ✅ Interface JARVIS (100%)
- **Arquivo**: `/home/user/webapp/frontend/jarvis.html`
- **Tamanho**: ~20 KB, 600 linhas
- **Features**:
  - Grid holográfico 3D animado
  - 4 painéis flutuantes (Status, Dados, APIs, Logs)
  - Orbe central pulsante (cyan)
  - CRT scanlines
  - 9+ animações CSS avançadas
  - Esquema de cores cyan/azul (#00f6ff)

### ✅ Conhecimento Mundial (85%)
- **13 APIs gratuitas** integradas
- **11/13 funcionando** (News, Books, Movies, Sports, Space, Holidays, Weather, Crypto, Exchange, Countries, Wikipedia)
- **2 parciais** (Music, Quotes)
- **$0/mês** de custo
- **15 endpoints** REST

### ⚠️ Voz (70%)
- **Reconhecimento**: Web Speech API (português-BR) ✅
- **TTS OpenAI**: Configurado, mas áudio vazio ❌
- **3 vozes femininas**: nova, shimmer, alloy
- **Wake-word**: "NOW" ✅

---

## 🚀 FASE 2: JARVIS INTELIGENTE (Next 7 dias)

### 1️⃣ **CORRIGIR VOZ FEMININA** (Urgente - 2h)

**Problema atual**: OpenAI TTS retorna `audio: ""` (vazio)

**Solução**:
```javascript
// backend/services/openai.service.js
async textToSpeech(text, options = {}) {
  const voice = options.voice || 'nova'; // voz padrão feminina
  const speed = options.speed || 1.0;
  const format = options.format || 'mp3';
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1-hd', // modelo HD
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
        responseType: 'arraybuffer' // CRUCIAL: receber binário
      }
    );
    
    // Converter para base64
    const audioBase64 = Buffer.from(response.data).toString('base64');
    const audioDataUrl = `data:audio/mp3;base64,${audioBase64}`;
    
    return {
      success: true,
      audio: audioDataUrl,
      format: format,
      voice: voice,
      text: text
    };
  } catch (error) {
    console.error('OpenAI TTS Error:', error.message);
    return {
      success: false,
      audio: '',
      error: error.message
    };
  }
}
```

**Teste**:
```bash
curl -X POST http://localhost:3000/api/knowledge/voice \
  -H "Content-Type: application/json" \
  -d '{"question":"Olá, como posso ajudar?","voice":"nova"}'
```

---

### 2️⃣ **APRENDIZADO CONTÍNUO** (3 dias)

**Memória de Conversas**:
```javascript
// backend/services/memory.service.js
class MemoryService {
  constructor() {
    this.conversations = new Map();
    this.userProfiles = new Map();
    this.contextWindow = 10; // últimas 10 mensagens
  }
  
  async storeConversation(userId, message, response) {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, []);
    }
    
    const history = this.conversations.get(userId);
    history.push({
      timestamp: new Date(),
      user: message,
      assistant: response,
      intent: this.detectIntent(message)
    });
    
    // Limitar histórico
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
  }
  
  async getContext(userId) {
    const history = this.conversations.get(userId) || [];
    return history.slice(-this.contextWindow);
  }
  
  detectIntent(message) {
    const intents = {
      weather: /clima|temperatura|tempo|chuva/i,
      crypto: /bitcoin|cripto|eth|moeda/i,
      news: /notícias|noticia|news|acontecendo/i,
      book: /livro|book|ler|leitura/i,
      movie: /filme|serie|assistir|netflix/i
    };
    
    for (const [intent, regex] of Object.entries(intents)) {
      if (regex.test(message)) return intent;
    }
    return 'general';
  }
  
  async learnPreference(userId, intent, feedback) {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        preferences: {},
        frequency: {}
      });
    }
    
    const profile = this.userProfiles.get(userId);
    
    // Contar frequência de uso
    profile.frequency[intent] = (profile.frequency[intent] || 0) + 1;
    
    // Armazenar feedback
    if (feedback) {
      profile.preferences[intent] = feedback;
    }
  }
  
  async getSuggestions(userId) {
    const profile = this.userProfiles.get(userId);
    if (!profile) return [];
    
    // Sugestões baseadas em uso frequente
    const sorted = Object.entries(profile.frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return sorted.map(([intent, count]) => ({
      intent,
      suggestion: this.generateSuggestion(intent)
    }));
  }
  
  generateSuggestion(intent) {
    const suggestions = {
      weather: 'Quer saber o clima de hoje?',
      crypto: 'Verificar preço do Bitcoin?',
      news: 'Ver últimas notícias?',
      book: 'Procurar um livro novo?',
      movie: 'Sugestões de filmes?'
    };
    return suggestions[intent] || 'Posso ajudar?';
  }
}

module.exports = new MemoryService();
```

**Endpoint**:
```javascript
// POST /api/jarvis/learn
app.post('/api/jarvis/learn', async (req, res) => {
  try {
    const { userId, message, feedback } = req.body;
    
    const context = await memoryService.getContext(userId);
    const intent = memoryService.detectIntent(message);
    
    await memoryService.learnPreference(userId, intent, feedback);
    
    res.json({
      success: true,
      intent,
      contextSize: context.length,
      message: 'Aprendi suas preferências!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/jarvis/suggestions/:userId
app.get('/api/jarvis/suggestions/:userId', async (req, res) => {
  try {
    const suggestions = await memoryService.getSuggestions(req.params.userId);
    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### 3️⃣ **CONTROLE POR GESTOS** (2 dias)

**TensorFlow.js + Handpose**:
```html
<!-- frontend/jarvis.html - adicionar -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose@0.0.7"></script>

<script>
let handposeModel;
let videoElement;
let isGestureMode = false;

async function initGestureControl() {
  // Carregar modelo
  handposeModel = await handpose.load();
  
  // Configurar webcam
  videoElement = document.createElement('video');
  videoElement.width = 640;
  videoElement.height = 480;
  
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user' }
  });
  videoElement.srcObject = stream;
  videoElement.play();
  
  // Loop de detecção
  detectGestures();
}

async function detectGestures() {
  if (!isGestureMode) return;
  
  const predictions = await handposeModel.estimateHands(videoElement);
  
  if (predictions.length > 0) {
    const hand = predictions[0];
    const gesture = classifyGesture(hand.landmarks);
    
    if (gesture) {
      executeGesture(gesture);
    }
  }
  
  requestAnimationFrame(detectGestures);
}

function classifyGesture(landmarks) {
  // landmarks[0] = pulso
  // landmarks[4] = ponta do polegar
  // landmarks[8] = ponta do indicador
  // landmarks[12] = ponta do dedo médio
  
  const thumb = landmarks[4];
  const index = landmarks[8];
  const middle = landmarks[12];
  
  // Distância polegar-indicador
  const distance = Math.sqrt(
    Math.pow(thumb[0] - index[0], 2) +
    Math.pow(thumb[1] - index[1], 2)
  );
  
  // Gestos
  if (distance < 30) {
    return 'pinch'; // Apertar (selecionar)
  }
  
  if (index[1] < middle[1] && middle[1] < landmarks[16][1]) {
    return 'point'; // Apontar (ativar)
  }
  
  if (thumb[0] > index[0] && index[0] > middle[0]) {
    return 'swipe_right'; // Deslizar direita (próximo)
  }
  
  if (thumb[0] < index[0] && index[0] < middle[0]) {
    return 'swipe_left'; // Deslizar esquerda (anterior)
  }
  
  return null;
}

function executeGesture(gesture) {
  const actions = {
    pinch: () => togglePanel('status'),
    point: () => startVoiceRecognition(),
    swipe_right: () => nextPanel(),
    swipe_left: () => previousPanel()
  };
  
  if (actions[gesture]) {
    actions[gesture]();
    showGestureFeedback(gesture);
  }
}

function showGestureFeedback(gesture) {
  const feedback = document.createElement('div');
  feedback.className = 'gesture-feedback';
  feedback.textContent = `Gesto: ${gesture}`;
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background: rgba(0, 246, 255, 0.2);
    border: 2px solid #00f6ff;
    border-radius: 10px;
    color: #00f6ff;
    font-size: 16px;
    animation: fadeOut 2s forwards;
  `;
  document.body.appendChild(feedback);
  setTimeout(() => feedback.remove(), 2000);
}

// Ativar/desativar gestos
document.addEventListener('keydown', (e) => {
  if (e.key === 'g') {
    isGestureMode = !isGestureMode;
    if (isGestureMode) {
      initGestureControl();
      console.log('✅ Controle por gestos ativado');
    } else {
      console.log('❌ Controle por gestos desativado');
    }
  }
});
</script>

<style>
@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}
</style>
```

**Comandos por gesto**:
- 👌 **Pinça** (polegar + indicador): Selecionar/ativar painel
- 👆 **Apontar**: Iniciar reconhecimento de voz
- 👉 **Deslizar direita**: Próximo painel
- 👈 **Deslizar esquerda**: Painel anterior
- ✋ **Mão aberta**: Pausar JARVIS
- ✊ **Mão fechada**: Voltar ao início

---

### 4️⃣ **AUTOMAÇÃO RESIDENCIAL** (2 dias)

**Integração Home Assistant**:
```javascript
// backend/services/home.service.js
const axios = require('axios');

class HomeService {
  constructor() {
    this.haUrl = process.env.HOME_ASSISTANT_URL || 'http://homeassistant.local:8123';
    this.haToken = process.env.HOME_ASSISTANT_TOKEN || '';
  }
  
  async getDevices() {
    try {
      const response = await axios.get(`${this.haUrl}/api/states`, {
        headers: { 'Authorization': `Bearer ${this.haToken}` }
      });
      
      return response.data.map(device => ({
        id: device.entity_id,
        name: device.attributes.friendly_name || device.entity_id,
        state: device.state,
        type: device.entity_id.split('.')[0],
        lastUpdated: device.last_updated
      }));
    } catch (error) {
      console.error('Home Assistant Error:', error.message);
      return [];
    }
  }
  
  async controlDevice(entityId, action, value = null) {
    try {
      const domain = entityId.split('.')[0];
      const service = this.mapAction(domain, action);
      
      const payload = {
        entity_id: entityId
      };
      
      if (value !== null) {
        if (domain === 'light') payload.brightness = value;
        if (domain === 'climate') payload.temperature = value;
      }
      
      await axios.post(
        `${this.haUrl}/api/services/${domain}/${service}`,
        payload,
        { headers: { 'Authorization': `Bearer ${this.haToken}` } }
      );
      
      return { success: true, message: `${action} executado em ${entityId}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  mapAction(domain, action) {
    const actions = {
      light: { on: 'turn_on', off: 'turn_off', toggle: 'toggle' },
      switch: { on: 'turn_on', off: 'turn_off', toggle: 'toggle' },
      climate: { on: 'turn_on', off: 'turn_off', set: 'set_temperature' },
      cover: { open: 'open_cover', close: 'close_cover', stop: 'stop_cover' }
    };
    
    return actions[domain]?.[action] || 'turn_on';
  }
  
  async getScenes() {
    try {
      const response = await axios.get(`${this.haUrl}/api/states`, {
        headers: { 'Authorization': `Bearer ${this.haToken}` }
      });
      
      return response.data
        .filter(e => e.entity_id.startsWith('scene.'))
        .map(scene => ({
          id: scene.entity_id,
          name: scene.attributes.friendly_name
        }));
    } catch (error) {
      return [];
    }
  }
  
  async activateScene(sceneId) {
    try {
      await axios.post(
        `${this.haUrl}/api/services/scene/turn_on`,
        { entity_id: sceneId },
        { headers: { 'Authorization': `Bearer ${this.haToken}` } }
      );
      
      return { success: true, message: `Cena ${sceneId} ativada` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new HomeService();
```

**Comandos de voz**:
```javascript
// Adicionar em jarvis.html
function processHomeCommand(transcript) {
  const commands = {
    'acender luz': { entity: 'light.sala', action: 'on' },
    'apagar luz': { entity: 'light.sala', action: 'off' },
    'ligar ar': { entity: 'climate.quarto', action: 'on' },
    'desligar ar': { entity: 'climate.quarto', action: 'off' },
    'abrir cortina': { entity: 'cover.cortina_sala', action: 'open' },
    'fechar cortina': { entity: 'cover.cortina_sala', action: 'close' },
    'modo cinema': { scene: 'scene.cinema' },
    'modo dormir': { scene: 'scene.dormir' },
    'modo trabalho': { scene: 'scene.trabalho' }
  };
  
  for (const [phrase, cmd] of Object.entries(commands)) {
    if (transcript.includes(phrase)) {
      if (cmd.scene) {
        activateScene(cmd.scene);
      } else {
        controlDevice(cmd.entity, cmd.action);
      }
      return true;
    }
  }
  return false;
}

async function controlDevice(entity, action) {
  const response = await fetch('/api/home/control', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entity, action })
  });
  
  const result = await response.json();
  addLog(`🏠 ${result.message}`);
  speak(result.message);
}
```

---

### 5️⃣ **ANÁLISE PREDITIVA** (2 dias)

**Machine Learning Básico**:
```javascript
// backend/services/predict.service.js
class PredictService {
  constructor() {
    this.patterns = new Map();
  }
  
  async analyzePatterns(userId) {
    const memory = await memoryService.getContext(userId);
    
    // Agrupar por hora do dia
    const hourlyPatterns = {};
    memory.forEach(conv => {
      const hour = new Date(conv.timestamp).getHours();
      if (!hourlyPatterns[hour]) hourlyPatterns[hour] = [];
      hourlyPatterns[hour].push(conv.intent);
    });
    
    // Calcular frequências
    const predictions = {};
    for (const [hour, intents] of Object.entries(hourlyPatterns)) {
      const frequency = {};
      intents.forEach(intent => {
        frequency[intent] = (frequency[intent] || 0) + 1;
      });
      
      const mostCommon = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])[0];
      
      predictions[hour] = {
        intent: mostCommon[0],
        confidence: mostCommon[1] / intents.length
      };
    }
    
    return predictions;
  }
  
  async predictNext(userId) {
    const currentHour = new Date().getHours();
    const patterns = await this.analyzePatterns(userId);
    
    const prediction = patterns[currentHour];
    if (prediction && prediction.confidence > 0.5) {
      return {
        intent: prediction.intent,
        confidence: prediction.confidence,
        suggestion: this.getSuggestion(prediction.intent)
      };
    }
    
    return null;
  }
  
  getSuggestion(intent) {
    const suggestions = {
      weather: 'Você costuma checar o clima agora. Quer saber a previsão?',
      crypto: 'Hora de verificar Bitcoin? Preço está em $68,408',
      news: 'Notícias do dia já estão prontas!',
      book: 'Que tal continuar aquela leitura?',
      movie: 'É hora do filme! Tenho sugestões.'
    };
    return suggestions[intent] || 'Posso ajudar em algo?';
  }
}

module.exports = new PredictService();
```

**Notificações Proativas**:
```javascript
// frontend/jarvis.html
setInterval(async () => {
  const userId = 'user123'; // pegar do contexto
  const prediction = await fetch(`/api/jarvis/predict/${userId}`)
    .then(r => r.json());
  
  if (prediction && prediction.confidence > 0.7) {
    showProactiveNotification(prediction.suggestion);
  }
}, 60000); // checar a cada 1 minuto

function showProactiveNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'jarvis-notification';
  notification.innerHTML = `
    <div class="notification-icon">💡</div>
    <div class="notification-text">${message}</div>
    <button onclick="dismissNotification(this)">OK</button>
  `;
  document.body.appendChild(notification);
  
  // Auto-falar
  speak(message);
}
```

---

## 🎯 FASE 3: MULTI-DISPOSITIVO (Next 14 dias)

### 📱 App Mobile (React Native)
- Sincronização em tempo real
- Notificações push
- Controle remoto
- Widget de tela inicial

### ⌚ Smartwatch Integration
- Comandos rápidos
- Notificações discretas
- Gestos de pulso

### 🖥️ Desktop App (Electron)
- Hotkey global (Ctrl+Space)
- Overlay sempre visível
- Integração com OS

---

## 📈 MÉTRICAS DE SUCESSO

| Feature | Status | Meta | Prazo |
|---------|--------|------|-------|
| Voz feminina funcional | ⚠️ 70% | 100% | 2h |
| Memória de conversas | ❌ 0% | 100% | 3 dias |
| Controle por gestos | ❌ 0% | 80% | 2 dias |
| Automação residencial | ❌ 0% | 100% | 2 dias |
| Análise preditiva | ❌ 0% | 70% | 2 dias |
| App mobile | ❌ 0% | 80% | 14 dias |

---

## 💰 CUSTOS ESTIMADOS

| Serviço | Custo Mensal | Limite Grátis |
|---------|--------------|---------------|
| APIs Globais (13) | $0 | Ilimitado |
| OpenAI TTS | $0-20 | $18 free trial |
| Hospedagem (VPS) | $5-10 | Sandbox grátis |
| Home Assistant | $0 | Self-hosted |
| Total | **$5-30** | **Fase inicial grátis** |

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. ✅ **[AGORA]** Corrigir OpenAI TTS (áudio vazio)
2. ✅ **[HOJE]** Testar voz feminina "nova"
3. 📝 **[Amanhã]** Implementar memória de conversas
4. 🤖 **[2 dias]** Adicionar controle por gestos
5. 🏠 **[3 dias]** Integrar Home Assistant
6. 📱 **[7 dias]** Iniciar app mobile

---

**Documentação criada**: 2026-02-21  
**Última atualização**: 2026-02-21  
**Versão**: 2.0  
**Autor**: NOW AI Assistant  
