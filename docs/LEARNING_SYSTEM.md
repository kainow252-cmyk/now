# 🎓 NOW - Sistema de Aprendizado com Internet

## 🌐 Visão Geral

NOW v3.0 agora pode **aprender continuamente** da internet, buscando informações em tempo real e mantendo-se sempre atualizada!

---

## 🧠 Funcionalidades de Aprendizado

### 1. **Internet Search (Busca na Internet)**
Busca informações em múltiplas fontes:
- Google (Custom Search API)
- News APIs
- Wikipedia
- RSS Feeds
- Websites especializados

### 2. **Continuous Learning (Aprendizado Contínuo)**
NOW aprende automaticamente sobre:
- Investimentos
- Tecnologia
- Inteligência Artificial
- Mercado Financeiro
- Criptomoedas
- Startups
- Inovação

### 3. **RAG (Retrieval-Augmented Generation)**
Combina busca na internet + IA para respostas precisas:
- Busca contexto relevante
- Passa para IA
- Gera resposta informada
- Cita fontes

### 4. **Smart Search (Busca Inteligente)**
Busca + Resumo executivo automático

### 5. **Market Intelligence**
Análise de mercado em tempo real com dados da internet

---

## 📡 Novos Endpoints (v3.0)

### **Internet Search**
```http
POST /api/learn/search
Content-Type: application/json

{
  "query": "investimentos em IA 2026",
  "depth": 5,
  "sources": "all",
  "realtime": false
}
```

**Response:**
```json
{
  "success": true,
  "query": "investimentos em IA 2026",
  "results": [
    {
      "title": "IA atrai R$ 10 bilhões em investimentos",
      "url": "https://...",
      "snippet": "Mercado de IA...",
      "source": "news",
      "timestamp": "2026-02-08"
    }
  ],
  "sources": 5,
  "cached": false
}
```

---

### **Learn Topic (Aprender Tópico)**
```http
POST /api/learn/topic
Content-Type: application/json

{
  "topic": "criptomoedas",
  "sources": ["news", "finance", "tech"]
}
```

**Response:**
```json
{
  "success": true,
  "topic": "criptomoedas",
  "learned": 8,
  "summary": "Aprendi de 8 fontes..."
}
```

---

### **Continuous Learning (Aprendizado Contínuo)**
```http
POST /api/learn/continuous
Content-Type: application/json

{
  "topics": [
    "inteligência artificial",
    "investimentos",
    "tecnologia"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "topicsLearned": 3,
  "totalArticles": 24,
  "results": [...]
}
```

---

### **RAG Answer (Resposta com Contexto)**
```http
POST /api/rag/answer
Content-Type: application/json

{
  "question": "Qual a melhor criptomoeda para investir agora?",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Baseado nas informações atuais...",
  "sources": [
    {
      "title": "Bitcoin sobe 15%",
      "url": "https://...",
      "source": "financial-news"
    }
  ],
  "contextUsed": true,
  "timestamp": "2026-02-08T14:00:00Z"
}
```

---

### **Smart Search (Busca + Resumo)**
```http
POST /api/rag/smart-search
Content-Type: application/json

{
  "query": "tendências IA 2026",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "IA está crescendo em: 1) Automação empresarial...",
  "results": [...],
  "sources": 5
}
```

---

### **Market Intelligence (Inteligência de Mercado)**
```http
POST /api/rag/market-intelligence
Content-Type: application/json

{
  "symbol": "AAPL",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "symbol": "AAPL",
  "analysis": "Apple mostra forte crescimento...",
  "sources": [...]
}
```

---

### **Start Training (Iniciar Treinamento)**
```http
POST /api/rag/train
Content-Type: application/json

{
  "schedule": "hourly"
}
```

**Schedules:**
- `realtime` - A cada 10 minutos
- `hourly` - A cada hora (padrão)
- `daily` - Uma vez por dia

**Response:**
```json
{
  "success": true,
  "schedule": "hourly",
  "interval": "3600s",
  "topics": 7,
  "message": "Training iniciado..."
}
```

---

### **Enhanced Command (Comando Melhorado)**
```http
POST /api/command/enhanced
Content-Type: application/json

{
  "command": "Me fale sobre investimentos em IA",
  "userId": "user123",
  "useRag": true
}
```

**Com `useRag: true`:**
- Busca informações atualizadas na internet
- Usa contexto real
- Cita fontes

**Com `useRag: false`:**
- Usa apenas conhecimento da IA
- Mais rápido
- Sem fontes externas

---

### **Learning Stats**
```http
GET /api/learn/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalArticles": 245,
    "totalSources": 12,
    "lastUpdate": "2026-02-08T14:00:00Z",
    "knowledgeBaseSize": 180
  }
}
```

---

### **RAG Stats**
```http
GET /api/rag/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "cacheSize": 85,
    "vectorStoreSize": 120,
    "learningStats": {...}
  }
}
```

---

## 🔑 Configuração de APIs

Para ativar aprendizado REAL (não mock), configure no `.env`:

```bash
# Google Custom Search
GOOGLE_SEARCH_API_KEY=your_api_key
GOOGLE_SEARCH_ENGINE_ID=your_engine_id

# News API
NEWS_API_KEY=your_news_api_key

# OpenAI (para RAG)
OPENAI_API_KEY=your_openai_key
```

### Como obter API Keys:

**1. Google Custom Search:**
- Acesse: https://developers.google.com/custom-search
- Crie um projeto
- Ative Custom Search API
- Crie credenciais
- **Custo:** 100 buscas grátis/dia, depois $5 por 1000 buscas

**2. News API:**
- Acesse: https://newsapi.org
- Registre-se (free tier disponível)
- Obtenha API key
- **Custo:** 100 requests/dia grátis

**3. OpenAI:**
- Acesse: https://platform.openai.com
- Crie conta e adicione billing
- Gere API key
- **Custo:** Pay-as-you-go

---

## 💡 Exemplos de Uso

### **Exemplo 1: Pesquisa Básica**
```bash
curl -X POST https://3000-xxx.sandbox.novita.ai/api/learn/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "bitcoin preço hoje",
    "depth": 5
  }'
```

### **Exemplo 2: Aprender Sobre Tópico**
```bash
curl -X POST https://3000-xxx.sandbox.novita.ai/api/learn/topic \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "inteligência artificial",
    "sources": ["news", "tech"]
  }'
```

### **Exemplo 3: Pergunta com Contexto (RAG)**
```bash
curl -X POST https://3000-xxx.sandbox.novita.ai/api/rag/answer \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Quais são as melhores startups de IA em 2026?",
    "userId": "default"
  }'
```

### **Exemplo 4: Iniciar Treinamento Contínuo**
```bash
curl -X POST https://3000-xxx.sandbox.novita.ai/api/rag/train \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": "hourly"
  }'
```

---

## 🎯 Como Funciona (Arquitetura)

### **Learning Service (`learning.service.js`)**
1. Busca em múltiplas fontes (Google, News, Wikipedia)
2. Extrai conteúdo de URLs
3. Armazena em knowledge base
4. Gerencia cache

### **RAG Service (`rag.service.js`)**
1. Recebe pergunta
2. Busca contexto relevante (Learning Service)
3. Monta prompt com contexto
4. Passa para OpenAI
5. Retorna resposta + fontes

### **Fluxo RAG:**
```
User Question
    ↓
Search Internet (Learning Service)
    ↓
Extract Context
    ↓
Build Prompt with Context
    ↓
OpenAI Chat (with context)
    ↓
Enhanced Answer + Sources
```

---

## 📊 Fontes de Dados

### **Configuradas:**
- ✅ Google Custom Search
- ✅ News API
- ✅ Wikipedia API
- ✅ Yahoo Finance (módulo finance)
- ✅ RSS Feeds

### **Planejadas:**
- ⏳ Twitter/X API
- ⏳ LinkedIn API
- ⏳ Reddit API
- ⏳ ArXiv (papers científicos)
- ⏳ GitHub Trending

---

## 🚀 Performance

### **Cache:**
- Resultados são cacheados por 1 hora
- Knowledge base mantém últimas 1000 consultas
- Busca em cache primeiro = resposta instantânea

### **Rate Limiting:**
- Delay de 2s entre requests
- Evita ban de APIs
- Respeita limites gratuitos

---

## 🎓 Modos de Aprendizado

### **Light (Leve)**
- 3 artigos
- 1 fonte (news)
- Rápido

### **Medium (Médio)** - Padrão
- 5 artigos
- 2 fontes (news + tech)
- Balanceado

### **Deep (Profundo)**
- 10 artigos
- 4 fontes (news + tech + finance + business)
- Completo

---

## 🔒 Segurança

- User-Agent personalizado
- Timeout em requests (10-15s)
- Rate limiting embutido
- Cache para reduzir requests
- Sanitização de HTML

---

## 💰 Custos Estimados

### **Com APIs Grátis:**
- Google: 100 buscas/dia grátis
- News API: 100 requests/dia grátis
- **CUSTO: $0/mês**

### **Com APIs Pagas:**
- Google: ~$50/mês (10k buscas)
- News API: ~$50/mês (business plan)
- OpenAI: ~$100/mês (RAG usage)
- **CUSTO TOTAL: ~$200/mês**

---

## 📈 Benefícios

✅ **Respostas Atualizadas** - Sempre com dados recentes  
✅ **Fontes Citadas** - Transparência total  
✅ **Context-Aware** - Entende contexto real  
✅ **Multi-Source** - Várias fontes = mais confiável  
✅ **Continuous Learning** - Sempre aprendendo  

---

## 🎊 Resultado Final

NOW agora é uma **IA conectada à internet** que:
- ✅ Aprende continuamente
- ✅ Busca informações atualizadas
- ✅ Cita fontes
- ✅ Entende contexto real
- ✅ Toma decisões informadas

**NOW não é mais uma IA offline - é uma IA com acesso ao conhecimento do mundo!** 🌍🧠

---

**Documentação criada em:** 08 de Fevereiro de 2026  
**Versão:** 3.0 (Internet Learning Edition)
