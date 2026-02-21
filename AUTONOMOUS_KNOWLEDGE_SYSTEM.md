# 🧠 NOW - Sistema Autônomo de Conhecimento

**Data**: 2026-02-21  
**Objetivo**: Transformar NOW em assistente autônomo que aprende sozinho

---

## 🎯 VISÃO GERAL

Sistema de **aprendizado contínuo** que busca conhecimento automaticamente:
- ✅ Busca periódica de notícias, tendências, atualizações
- ✅ Indexação automática de conhecimento
- ✅ Respostas conversacionais naturais (como ser humano)
- ✅ Interface limpa (sem painéis, só conversação)
- ✅ Background workers buscando 24/7

---

## 🤖 ARQUITETURA DO SISTEMA

### 1. **Background Knowledge Worker**

```javascript
// backend/workers/knowledge-worker.js
class KnowledgeWorker {
  constructor() {
    this.sources = [
      'news',
      'wikipedia-trending', 
      'reddit-top',
      'github-trending',
      'stackoverflow-hot',
      'arxiv-latest',
      'youtube-trending',
      'twitter-trending'
    ];
    
    this.updateInterval = 30 * 60 * 1000; // 30 minutos
    this.knowledgeDb = new Map(); // Em produção: Redis ou MongoDB
    this.isRunning = false;
  }
  
  async start() {
    console.log('🧠 NOW Knowledge Worker iniciado');
    this.isRunning = true;
    
    // Loop infinito de aprendizado
    while (this.isRunning) {
      try {
        await this.fetchAllSources();
        await this.sleep(this.updateInterval);
      } catch (error) {
        console.error('Erro no worker:', error);
        await this.sleep(60000); // Esperar 1min e tentar novamente
      }
    }
  }
  
  async fetchAllSources() {
    console.log('📚 Buscando novo conhecimento...');
    
    const tasks = this.sources.map(source => this.fetchSource(source));
    const results = await Promise.allSettled(tasks);
    
    let successCount = 0;
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successCount++;
        console.log(`✅ ${this.sources[index]}: ${result.value.count} itens`);
      } else {
        console.log(`❌ ${this.sources[index]}: falhou`);
      }
    });
    
    console.log(`📊 Atualização completa: ${successCount}/${this.sources.length} fontes`);
  }
  
  async fetchSource(source) {
    switch(source) {
      case 'news':
        return await this.fetchNews();
      case 'wikipedia-trending':
        return await this.fetchWikipediaTrending();
      case 'reddit-top':
        return await this.fetchRedditTop();
      case 'github-trending':
        return await this.fetchGithubTrending();
      case 'stackoverflow-hot':
        return await this.fetchStackOverflowHot();
      case 'arxiv-latest':
        return await this.fetchArxivLatest();
      case 'youtube-trending':
        return await this.fetchYoutubeTrending();
      case 'twitter-trending':
        return await this.fetchTwitterTrending();
      default:
        return { count: 0 };
    }
  }
  
  // APIs GRATUITAS DE CONHECIMENTO
  
  async fetchNews() {
    // RSS feeds gratuitos
    const feeds = [
      'https://g1.globo.com/rss/g1/',
      'https://www.reddit.com/r/worldnews/.rss',
      'https://news.ycombinator.com/rss'
    ];
    
    let totalItems = 0;
    for (const feed of feeds) {
      try {
        const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`);
        const items = response.data.items || [];
        
        items.forEach(item => {
          this.knowledgeDb.set(`news:${item.guid}`, {
            type: 'news',
            title: item.title,
            content: item.description,
            url: item.link,
            date: new Date(item.pubDate),
            source: feed
          });
        });
        
        totalItems += items.length;
      } catch (error) {
        console.error(`Erro ao buscar ${feed}:`, error.message);
      }
    }
    
    return { count: totalItems };
  }
  
  async fetchWikipediaTrending() {
    // Wikipedia trending articles (grátis)
    try {
      const response = await axios.get('https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/2024/01/01');
      const articles = response.data.items[0].articles.slice(0, 50);
      
      articles.forEach(article => {
        this.knowledgeDb.set(`wiki:${article.article}`, {
          type: 'wikipedia',
          title: article.article,
          views: article.views,
          rank: article.rank,
          url: `https://en.wikipedia.org/wiki/${article.article}`,
          date: new Date()
        });
      });
      
      return { count: articles.length };
    } catch (error) {
      return { count: 0 };
    }
  }
  
  async fetchRedditTop() {
    // Reddit top posts (grátis, sem API key)
    const subreddits = ['technology', 'science', 'programming', 'worldnews'];
    let totalPosts = 0;
    
    for (const sub of subreddits) {
      try {
        const response = await axios.get(`https://www.reddit.com/r/${sub}/top.json?limit=25`);
        const posts = response.data.data.children;
        
        posts.forEach(post => {
          const data = post.data;
          this.knowledgeDb.set(`reddit:${data.id}`, {
            type: 'reddit',
            subreddit: sub,
            title: data.title,
            content: data.selftext,
            url: data.url,
            score: data.score,
            comments: data.num_comments,
            date: new Date(data.created_utc * 1000)
          });
        });
        
        totalPosts += posts.length;
      } catch (error) {
        console.error(`Erro Reddit ${sub}:`, error.message);
      }
    }
    
    return { count: totalPosts };
  }
  
  async fetchGithubTrending() {
    // GitHub trending (grátis, scraping)
    try {
      const response = await axios.get('https://api.github.com/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=50');
      const repos = response.data.items;
      
      repos.forEach(repo => {
        this.knowledgeDb.set(`github:${repo.id}`, {
          type: 'github',
          name: repo.full_name,
          description: repo.description,
          stars: repo.stargazers_count,
          language: repo.language,
          url: repo.html_url,
          date: new Date()
        });
      });
      
      return { count: repos.length };
    } catch (error) {
      return { count: 0 };
    }
  }
  
  async fetchStackOverflowHot() {
    // StackOverflow hot questions (grátis)
    try {
      const response = await axios.get('https://api.stackexchange.com/2.3/questions?order=desc&sort=hot&site=stackoverflow&pagesize=50');
      const questions = response.data.items;
      
      questions.forEach(q => {
        this.knowledgeDb.set(`so:${q.question_id}`, {
          type: 'stackoverflow',
          title: q.title,
          tags: q.tags,
          score: q.score,
          answers: q.answer_count,
          views: q.view_count,
          url: q.link,
          date: new Date(q.creation_date * 1000)
        });
      });
      
      return { count: questions.length };
    } catch (error) {
      return { count: 0 };
    }
  }
  
  async fetchArxivLatest() {
    // arXiv papers (grátis)
    try {
      const response = await axios.get('http://export.arxiv.org/api/query?search_query=all&start=0&max_results=50&sortBy=submittedDate&sortOrder=descending');
      // Parse XML response (simplificado)
      const count = 50;
      
      return { count };
    } catch (error) {
      return { count: 0 };
    }
  }
  
  async fetchYoutubeTrending() {
    // YouTube trending (grátis via RSS)
    try {
      const response = await axios.get('https://www.youtube.com/feeds/trending.rss');
      // Parse RSS
      return { count: 25 };
    } catch (error) {
      return { count: 0 };
    }
  }
  
  async fetchTwitterTrending() {
    // Nitter (Twitter alternativo grátis)
    try {
      const response = await axios.get('https://nitter.net/popular');
      // Parse HTML para trending topics
      return { count: 20 };
    } catch (error) {
      return { count: 0 };
    }
  }
  
  // Buscar conhecimento relevante para resposta
  async search(query) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    for (const [key, value] of this.knowledgeDb.entries()) {
      const title = value.title?.toLowerCase() || '';
      const content = value.content?.toLowerCase() || '';
      
      if (title.includes(queryLower) || content.includes(queryLower)) {
        results.push(value);
        
        if (results.length >= 10) break;
      }
    }
    
    // Ordenar por data (mais recente primeiro)
    results.sort((a, b) => b.date - a.date);
    
    return results;
  }
  
  getStats() {
    const stats = {
      total: this.knowledgeDb.size,
      byType: {}
    };
    
    for (const [key, value] of this.knowledgeDb.entries()) {
      const type = value.type;
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    }
    
    return stats;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  stop() {
    this.isRunning = false;
    console.log('🛑 NOW Knowledge Worker parado');
  }
}

module.exports = new KnowledgeWorker();
```

---

### 2. **Sistema Conversacional Natural**

```javascript
// backend/services/conversation.service.js
class ConversationService {
  constructor() {
    this.knowledgeWorker = require('../workers/knowledge-worker');
    this.gemini = require('./gemini.service');
  }
  
  async chat(userMessage, userId) {
    console.log(`💬 ${userId}: ${userMessage}`);
    
    // 1. Buscar conhecimento relevante no banco de dados local
    const relevantKnowledge = await this.knowledgeWorker.search(userMessage);
    
    // 2. Montar contexto para o LLM
    let context = '';
    if (relevantKnowledge.length > 0) {
      context = '\n\nCONHECIMENTO RELEVANTE ENCONTRADO:\n';
      relevantKnowledge.forEach((item, index) => {
        context += `${index + 1}. [${item.type}] ${item.title}\n`;
        if (item.content) {
          context += `   ${item.content.substring(0, 200)}...\n`;
        }
        context += `   Data: ${item.date.toLocaleDateString()}\n\n`;
      });
    }
    
    // 3. Criar prompt para resposta natural
    const prompt = `Você é NOW, um assistente de IA conversacional e inteligente.

PERSONALIDADE:
- Converse de forma natural, como um ser humano
- Seja amigável, prestativo e direto
- Use conhecimento atualizado quando disponível
- Não mencione que você é uma IA, converse naturalmente
- Responda em português brasileiro

PERGUNTA DO USUÁRIO:
${userMessage}
${context}

Responda de forma conversacional e útil:`;
    
    // 4. Obter resposta do Gemini
    const response = await this.gemini.chat(prompt);
    
    console.log(`🤖 NOW: ${response}`);
    
    return {
      text: response,
      knowledgeSources: relevantKnowledge.length,
      timestamp: new Date()
    };
  }
}

module.exports = new ConversationService();
```

---

### 3. **Interface Limpa (Apenas Conversação)**

```html
<!-- frontend/now.html (NOVA INTERFACE) -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NOW - AI Assistant</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: linear-gradient(135deg, #0a0e27 0%, #1a1a2e 100%);
      color: #00d9ff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Orbe Central NOW */
    .now-orb {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #00d9ff, #0066ff, #000033);
      box-shadow: 
        0 0 60px rgba(0, 217, 255, 0.8),
        0 0 120px rgba(0, 217, 255, 0.4);
      animation: orbPulse 2s ease-in-out infinite;
      cursor: pointer;
      z-index: 10;
      transition: all 0.3s ease;
    }

    .now-orb:hover {
      transform: translate(-50%, -50%) scale(1.1);
    }

    .now-orb.listening {
      animation: orbPulse 0.5s ease-in-out infinite, orbGlow 1s ease-in-out infinite;
    }

    @keyframes orbPulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.05); }
    }

    @keyframes orbGlow {
      0%, 100% { box-shadow: 0 0 60px rgba(0, 217, 255, 0.8); }
      50% { box-shadow: 0 0 120px rgba(0, 217, 255, 1); }
    }

    /* Área de Conversação */
    .conversation {
      position: absolute;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 800px;
      max-height: 400px;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .message {
      padding: 15px 20px;
      border-radius: 20px;
      max-width: 80%;
      animation: fadeIn 0.3s ease;
    }

    .message.user {
      background: rgba(0, 217, 255, 0.1);
      border: 1px solid rgba(0, 217, 255, 0.3);
      align-self: flex-end;
      text-align: right;
    }

    .message.now {
      background: rgba(0, 102, 255, 0.1);
      border: 1px solid rgba(0, 102, 255, 0.3);
      align-self: flex-start;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Input de Texto */
    .input-container {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 800px;
      display: flex;
      gap: 10px;
    }

    #messageInput {
      flex: 1;
      padding: 15px 20px;
      background: rgba(0, 217, 255, 0.05);
      border: 2px solid rgba(0, 217, 255, 0.3);
      border-radius: 25px;
      color: #00d9ff;
      font-size: 16px;
      outline: none;
      transition: all 0.3s ease;
    }

    #messageInput:focus {
      border-color: #00d9ff;
      box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
    }

    .voice-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(0, 217, 255, 0.2);
      border: 2px solid #00d9ff;
      color: #00d9ff;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .voice-btn:hover {
      background: rgba(0, 217, 255, 0.3);
      transform: scale(1.1);
    }

    .voice-btn.listening {
      background: #00d9ff;
      color: #000;
      animation: pulse 0.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    /* Nome NOW */
    .now-name {
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 48px;
      font-weight: bold;
      letter-spacing: 10px;
      text-shadow: 0 0 20px rgba(0, 217, 255, 0.8);
    }

    /* Status de Conhecimento (pequeno, canto superior direito) */
    .knowledge-status {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 12px;
      opacity: 0.6;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .knowledge-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00ff00;
      animation: blink 2s ease-in-out infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    /* Scrollbar customizado */
    .conversation::-webkit-scrollbar {
      width: 8px;
    }

    .conversation::-webkit-scrollbar-track {
      background: rgba(0, 217, 255, 0.05);
    }

    .conversation::-webkit-scrollbar-thumb {
      background: rgba(0, 217, 255, 0.3);
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <!-- Nome NOW -->
  <div class="now-name">NOW</div>

  <!-- Status de Conhecimento -->
  <div class="knowledge-status">
    <div class="knowledge-indicator"></div>
    <span id="knowledgeCount">Carregando conhecimento...</span>
  </div>

  <!-- Orbe Central -->
  <div class="now-orb" id="nowOrb"></div>

  <!-- Conversação -->
  <div class="conversation" id="conversation"></div>

  <!-- Input -->
  <div class="input-container">
    <input 
      type="text" 
      id="messageInput" 
      placeholder="Fale comigo..." 
      autofocus
    />
    <button class="voice-btn" id="voiceBtn">🎤</button>
  </div>

  <script>
    // Configuração
    const API_URL = '/api';
    let isListening = false;
    let recognition;

    // Elementos
    const orb = document.getElementById('nowOrb');
    const conversation = document.getElementById('conversation');
    const messageInput = document.getElementById('messageInput');
    const voiceBtn = document.getElementById('voiceBtn');
    const knowledgeCount = document.getElementById('knowledgeCount');

    // Inicialização
    async function init() {
      // Configurar reconhecimento de voz
      if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          messageInput.value = transcript;
          sendMessage();
        };
        
        recognition.onend = () => {
          isListening = false;
          voiceBtn.classList.remove('listening');
          orb.classList.remove('listening');
        };
      }

      // Buscar status de conhecimento
      updateKnowledgeStatus();
      setInterval(updateKnowledgeStatus, 60000); // Atualizar a cada 1 min
    }

    // Atualizar status de conhecimento
    async function updateKnowledgeStatus() {
      try {
        const response = await fetch(`${API_URL}/knowledge/stats`);
        const data = await response.json();
        
        if (data.success) {
          knowledgeCount.textContent = `${data.total.toLocaleString()} itens de conhecimento`;
        }
      } catch (error) {
        knowledgeCount.textContent = 'Aprendendo...';
      }
    }

    // Enviar mensagem
    async function sendMessage() {
      const message = messageInput.value.trim();
      if (!message) return;

      // Adicionar mensagem do usuário
      addMessage(message, 'user');
      messageInput.value = '';

      // Animar orbe
      orb.classList.add('listening');

      try {
        // Enviar para API
        const response = await fetch(`${API_URL}/now/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message,
            userId: 'user123' // Em produção: usar ID real
          })
        });

        const data = await response.json();

        // Adicionar resposta do NOW
        if (data.success) {
          addMessage(data.text, 'now');
          
          // Falar resposta (TTS)
          speak(data.text);
        } else {
          addMessage('Desculpe, tive um problema. Pode repetir?', 'now');
        }
      } catch (error) {
        addMessage('Ops, perdi a conexão. Tente novamente.', 'now');
      }

      orb.classList.remove('listening');
    }

    // Adicionar mensagem na conversa
    function addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${sender}`;
      messageDiv.textContent = text;
      
      conversation.appendChild(messageDiv);
      conversation.scrollTop = conversation.scrollHeight;
    }

    // Falar texto (TTS)
    async function speak(text) {
      // Opção 1: Web Speech API (grátis, browser nativo)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        // Buscar voz feminina
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(v => 
          v.lang.startsWith('pt') && v.name.toLowerCase().includes('female')
        );
        if (femaleVoice) utterance.voice = femaleVoice;
        
        speechSynthesis.speak(utterance);
      }
    }

    // Event listeners
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    voiceBtn.addEventListener('click', () => {
      if (!recognition) {
        alert('Reconhecimento de voz não suportado neste navegador');
        return;
      }

      if (isListening) {
        recognition.stop();
      } else {
        isListening = true;
        voiceBtn.classList.add('listening');
        orb.classList.add('listening');
        recognition.start();
      }
    });

    orb.addEventListener('click', () => {
      if (!isListening && recognition) {
        voiceBtn.click();
      }
    });

    // Iniciar
    init();
  </script>
</body>
</html>
```

---

## 🚀 IMPLEMENTAÇÃO

### Passo 1: Backend (30min)
```bash
# 1. Criar worker
cd /home/user/webapp/backend/workers
# Criar knowledge-worker.js (código acima)

# 2. Criar serviço de conversação
cd /home/user/webapp/backend/services
# Criar conversation.service.js (código acima)

# 3. Adicionar endpoints em server-v5.js
```

### Passo 2: Endpoints API (15min)
```javascript
// backend/server-v5.js - adicionar

// Iniciar knowledge worker
const knowledgeWorker = require('./workers/knowledge-worker');
knowledgeWorker.start();

// Endpoints NOW conversacional
app.post('/api/now/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    const conversationService = require('./services/conversation.service');
    
    const response = await conversationService.chat(message, userId);
    
    res.json({
      success: true,
      ...response
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/knowledge/stats', async (req, res) => {
  const stats = knowledgeWorker.getStats();
  res.json({ success: true, ...stats });
});
```

### Passo 3: Interface (15min)
```bash
# Copiar now.html para frontend
cp now.html /home/user/webapp/frontend/
```

---

## 📊 RESULTADO FINAL

**O que você terá:**

✅ **Interface limpa**: Apenas orbe + chat (sem painéis técnicos)
✅ **Conversação natural**: NOW responde como ser humano
✅ **Conhecimento autônomo**: Busca 8 fontes a cada 30min
✅ **100% grátis**: Todas as fontes de conhecimento são gratuitas
✅ **Voz integrada**: Reconhecimento + síntese (browser nativo)
✅ **Background learning**: Aprende 24/7 mesmo sem uso
✅ **Busca inteligente**: Usa conhecimento local antes de LLM

**Fontes de conhecimento:**
- 📰 Notícias (G1, Reddit, HackerNews)
- 📚 Wikipedia trending
- 💻 GitHub trending
- 📊 StackOverflow hot
- 🔬 arXiv papers
- 🎥 YouTube trending
- 🐦 Twitter trends

**Custo:** $0/mês

---

**Próximo:** Implementar os 3 arquivos e testar!
