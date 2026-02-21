# 🌍 APIS ESSENCIAIS PARA CONHECIMENTO GLOBAL NO NOW

## 📋 ÍNDICE

1. [Notícias & Informação Mundial](#noticias)
2. [Dados Financeiros & Economia](#financeiro)
3. [Clima & Meio Ambiente](#clima)
4. [Tradução & Idiomas](#traducao)
5. [Conhecimento Geral](#conhecimento)
6. [Redes Sociais & Tendências](#social)
7. [Localização & Mapas](#mapas)
8. [Dados Científicos](#ciencia)

---

## 📰 NOTÍCIAS & INFORMAÇÃO MUNDIAL {#noticias}

### 1️⃣ News API ⭐ ESSENCIAL
**O que faz:** Notícias de 80.000+ fontes mundiais em tempo real

**Recursos:**
- Notícias de todo o mundo
- 80.000+ fontes confiáveis
- Filtros por país, categoria, idioma
- Busca histórica

**Planos:**
```
Free: 100 requisições/dia
Developer: $449/mês (250.000 req)
Business: $1,999/mês (1M req)
```

**Como obter:**
1. Acesse: https://newsapi.org/register
2. Crie conta gratuita
3. Copie API Key
4. Configure no .env: `NEWS_API_KEY=sua-chave`

**Exemplo de uso no NOW:**
```javascript
// Notícias mundiais sobre IA
const news = await newsAPI.get('/v2/everything', {
  q: 'artificial intelligence',
  language: 'pt',
  sortBy: 'publishedAt'
});
```

---

### 2️⃣ The Guardian API
**O que faz:** Notícias do jornal The Guardian

**Recursos:**
- Notícias de qualidade
- Artigos desde 1999
- Grátis (até 5.000 req/dia)

**Como obter:**
1. Acesse: https://open-platform.theguardian.com/access/
2. Registre-se
3. API Key gratuita

---

### 3️⃣ Associated Press (AP) News API
**O que faz:** Notícias da agência AP

**Recursos:**
- Notícias verificadas
- Cobertura global
- Fotos e vídeos

**Como obter:**
1. Acesse: https://developer.ap.org/
2. Contato comercial

---

## 💰 DADOS FINANCEIROS & ECONOMIA {#financeiro}

### 1️⃣ Alpha Vantage ⭐ ESSENCIAL
**O que faz:** Dados financeiros e de criptomoedas

**Recursos:**
- Ações, Forex, Cripto
- Dados históricos
- Indicadores técnicos
- Notícias financeiras

**Planos:**
```
Free: 25 requisições/dia
$49/mês: 75 req/min
$149/mês: 150 req/min
$499/mês: 600 req/min
```

**Como obter:**
1. Acesse: https://www.alphavantage.co/support/#api-key
2. Email gratuito para chave
3. Configure: `ALPHA_VANTAGE_KEY=sua-chave`

**Exemplo:**
```javascript
// Preço de ações em tempo real
const stock = await alphaVantage.get('/query', {
  function: 'GLOBAL_QUOTE',
  symbol: 'AAPL'
});
```

---

### 2️⃣ Yahoo Finance (via RapidAPI) ⭐
**O que faz:** Dados financeiros completos

**Recursos:**
- Ações, ETFs, Fundos
- Histórico de preços
- Notícias financeiras
- Análises e recomendações

**Planos:**
```
Free: 500 requisições/mês
Basic: $9.99/mês (15.000 req)
Pro: $49.99/mês (150.000 req)
```

**Como obter:**
1. Acesse: https://rapidapi.com/sparior/api/yahoo-finance15
2. Subscribe (free tier)
3. Copie API Key
4. Configure: `YAHOO_FINANCE_KEY=sua-chave`

---

### 3️⃣ CoinGecko API (Cripto)
**O que faz:** Dados de criptomoedas

**Recursos:**
- 10.000+ criptomoedas
- Preços em tempo real
- Histórico completo
- 100% GRÁTIS

**Como obter:**
1. Acesse: https://www.coingecko.com/en/api
2. Documentação pública
3. Sem necessidade de chave

**Exemplo:**
```javascript
// Preço do Bitcoin
const btc = await axios.get(
  'https://api.coingecko.com/api/v3/simple/price',
  { params: { ids: 'bitcoin', vs_currencies: 'usd,brl' } }
);
```

---

### 4️⃣ World Bank API
**O que faz:** Dados econômicos mundiais

**Recursos:**
- PIB de países
- Indicadores econômicos
- Desenvolvimento mundial
- 100% GRÁTIS

**Como usar:**
```javascript
// PIB do Brasil
const gdp = await axios.get(
  'https://api.worldbank.org/v2/country/BR/indicator/NY.GDP.MKTP.CD',
  { params: { format: 'json' } }
);
```

---

## 🌤️ CLIMA & MEIO AMBIENTE {#clima}

### 1️⃣ OpenWeatherMap ⭐ ESSENCIAL
**O que faz:** Clima mundial em tempo real

**Recursos:**
- Clima atual e previsão
- 200.000+ cidades
- Alertas climáticos
- Dados históricos

**Planos:**
```
Free: 1.000 requisições/dia
$40/mês: 2.000 req/dia
$350/mês: 25.000 req/dia
```

**Como obter:**
1. Acesse: https://openweathermap.org/api
2. Sign up gratuito
3. API Key na conta
4. Configure: `OPENWEATHER_KEY=sua-chave`

**Exemplo:**
```javascript
// Clima em São Paulo
const weather = await openWeather.get('/data/2.5/weather', {
  q: 'São Paulo,BR',
  units: 'metric',
  lang: 'pt_br'
});
```

---

### 2️⃣ AirVisual API (Qualidade do Ar)
**O que faz:** Poluição do ar mundial

**Recursos:**
- Índice de qualidade do ar
- Previsão de poluição
- Dados de 10.000+ cidades

**Planos:**
```
Free: 1.000 requisições/dia
$29/mês: 10.000 req/dia
```

**Como obter:**
1. Acesse: https://www.iqair.com/air-pollution-data-api
2. Registre-se
3. API Key gratuita

---

## 🗣️ TRADUÇÃO & IDIOMAS {#traducao}

### 1️⃣ DeepL API ⭐ MELHOR QUALIDADE
**O que faz:** Tradução de alta qualidade

**Recursos:**
- 31 idiomas
- Melhor que Google Translate
- Tradução de documentos

**Planos:**
```
Free: 500.000 caracteres/mês
Pro: €5.49/milhão caracteres
```

**Como obter:**
1. Acesse: https://www.deepl.com/pro-api
2. Crie conta Free
3. API Key na conta
4. Configure: `DEEPL_KEY=sua-chave`

**Exemplo:**
```javascript
// Traduzir para inglês
const translation = await deepl.translate(
  'Olá mundo!',
  { target_lang: 'EN' }
);
```

---

### 2️⃣ Google Cloud Translation API
**O que faz:** Tradução automática

**Recursos:**
- 100+ idiomas
- Detecção automática de idioma
- Tradução em lote

**Planos:**
```
$20 por milhão de caracteres
```

**Como obter:**
1. Acesse: https://cloud.google.com/translate
2. Ative API no console
3. Crie credenciais

---

## 📚 CONHECIMENTO GERAL {#conhecimento}

### 1️⃣ Wikipedia API ⭐ GRÁTIS
**O que faz:** Acesso à Wikipedia

**Recursos:**
- 6 milhões+ artigos em português
- 60 milhões+ artigos total
- Busca e extração de conteúdo
- 100% GRÁTIS

**Exemplo:**
```javascript
// Buscar artigo
const wiki = await axios.get(
  'https://pt.wikipedia.org/w/api.php',
  {
    params: {
      action: 'query',
      titles: 'Inteligência Artificial',
      prop: 'extracts',
      format: 'json'
    }
  }
);
```

---

### 2️⃣ Wolfram Alpha API
**O que faz:** Conhecimento computacional

**Recursos:**
- Matemática, ciência, geografia
- Dados enciclopédicos
- Cálculos complexos

**Planos:**
```
$0 - 2.000 requisições/mês
$20 - 10.000 requisições/mês
```

**Como obter:**
1. Acesse: https://products.wolframalpha.com/api/
2. Crie conta
3. App ID gratuito

---

### 3️⃣ DBpedia API
**O que faz:** Dados estruturados da Wikipedia

**Recursos:**
- Dados RDF/SPARQL
- Conhecimento estruturado
- 100% GRÁTIS

---

## 📱 REDES SOCIAIS & TENDÊNCIAS {#social}

### 1️⃣ Twitter API v2
**O que faz:** Dados do Twitter/X

**Recursos:**
- Tweets em tempo real
- Trending topics
- Análise de sentimento

**Planos:**
```
Free: 1.500 tweets/mês
Basic: $100/mês (10.000 tweets)
Pro: $5.000/mês (1M tweets)
```

**Como obter:**
1. Acesse: https://developer.twitter.com/
2. Crie app
3. Bearer token

---

### 2️⃣ Reddit API
**O que faz:** Dados do Reddit

**Recursos:**
- Posts e comentários
- Subreddits
- Trending topics
- GRÁTIS

**Como obter:**
1. Acesse: https://www.reddit.com/prefs/apps
2. Crie app
3. Client ID + Secret

---

### 3️⃣ YouTube Data API
**O que faz:** Dados do YouTube

**Recursos:**
- Vídeos e canais
- Estatísticas
- Comentários

**Planos:**
```
10.000 unidades/dia GRÁTIS
```

**Como obter:**
1. Google Cloud Console
2. Ative YouTube Data API
3. Crie credenciais

---

## 🗺️ LOCALIZAÇÃO & MAPAS {#mapas}

### 1️⃣ Google Maps Platform ⭐
**O que faz:** Mapas e localização

**Recursos:**
- Geocoding
- Rotas e direções
- Places (locais)
- Street View

**Planos:**
```
$200 créditos/mês GRÁTIS
Depois: pay-as-you-go
```

**Como obter:**
1. Google Cloud Console
2. Ative Maps API
3. API Key

---

### 2️⃣ Mapbox API
**O que faz:** Mapas e localização

**Recursos:**
- Mapas customizáveis
- Geocoding
- Navegação

**Planos:**
```
50.000 requisições/mês GRÁTIS
```

---

## 🔬 DADOS CIENTÍFICOS {#ciencia}

### 1️⃣ NASA API ⭐
**O que faz:** Dados da NASA

**Recursos:**
- Imagens espaciais
- Dados de missões
- Asteroides próximos
- 100% GRÁTIS

**Como obter:**
1. Acesse: https://api.nasa.gov/
2. Registre-se
3. API Key gratuita

**Exemplo:**
```javascript
// Foto astronômica do dia
const apod = await axios.get('https://api.nasa.gov/planetary/apod', {
  params: { api_key: 'DEMO_KEY' }
});
```

---

### 2️⃣ arXiv API (Artigos Científicos)
**O que faz:** Artigos científicos

**Recursos:**
- 2 milhões+ artigos
- Física, matemática, CS
- 100% GRÁTIS

---

## 🎯 PRIORIZAÇÃO PARA NOW

### ⭐ ESSENCIAIS (Implementar PRIMEIRO)

1. **News API** - Notícias mundiais
2. **Alpha Vantage** - Dados financeiros
3. **OpenWeatherMap** - Clima global
4. **DeepL** - Tradução de qualidade
5. **Wikipedia API** - Conhecimento geral

### 🌟 IMPORTANTES (Implementar DEPOIS)

6. **Yahoo Finance** - Dados de mercado
7. **CoinGecko** - Criptomoedas
8. **Google Maps** - Localização
9. **Twitter API** - Tendências
10. **NASA API** - Dados espaciais

### ⚡ OPCIONAIS (Futuro)

11. **World Bank** - Dados econômicos
12. **Reddit API** - Discussões
13. **YouTube API** - Vídeos
14. **Wolfram Alpha** - Cálculos

---

## 📊 RESUMO DE CUSTOS

### Grátis (Tier Free)
```
News API          → 100 req/dia
Alpha Vantage     → 25 req/dia
OpenWeatherMap    → 1.000 req/dia
Wikipedia         → Ilimitado
CoinGecko         → Ilimitado
NASA API          → Ilimitado
```

### Custo Mensal Recomendado
```
News API (Dev)         → $449/mês
Alpha Vantage (Basic)  → $49/mês
OpenWeatherMap (Pro)   → $40/mês
DeepL (Pro)            → ~$6/mês
Total estimado         → $544/mês
```

### Alternativa Econômica
```
Usar só tiers GRÁTIS   → $0/mês
Gemini AI para análise → $0/mês
OpenAI só para voz     → ~$20/mês
Total econômico        → $20/mês
```

---

## 🔧 CONFIGURAÇÃO NO NOW

### 1. Adicionar no .env
```env
# Notícias
NEWS_API_KEY=sua-chave-news-api
GUARDIAN_API_KEY=sua-chave-guardian

# Financeiro
ALPHA_VANTAGE_KEY=sua-chave-alphavantage
YAHOO_FINANCE_KEY=sua-chave-yahoo

# Clima
OPENWEATHER_KEY=sua-chave-openweather
AIRVISUAL_KEY=sua-chave-airvisual

# Tradução
DEEPL_KEY=sua-chave-deepl
GOOGLE_TRANSLATE_KEY=sua-chave-google

# Conhecimento
WOLFRAM_ALPHA_KEY=sua-chave-wolfram
NASA_API_KEY=sua-chave-nasa

# Social
TWITTER_BEARER_TOKEN=seu-token-twitter
REDDIT_CLIENT_ID=seu-client-reddit
REDDIT_CLIENT_SECRET=seu-secret-reddit

# Mapas
GOOGLE_MAPS_KEY=sua-chave-google-maps
MAPBOX_KEY=sua-chave-mapbox
```

### 2. Criar serviço integrado
```javascript
// backend/services/global-knowledge.service.js
class GlobalKnowledgeService {
  async getWorldNews(topic, country = 'br') {
    // Integra News API + Guardian + AP
  }
  
  async getFinancialData(symbol) {
    // Integra Alpha Vantage + Yahoo Finance
  }
  
  async getWeather(location) {
    // Integra OpenWeatherMap + AirVisual
  }
  
  async translate(text, targetLang) {
    // Usa DeepL
  }
  
  async searchKnowledge(query) {
    // Integra Wikipedia + Wolfram Alpha
  }
}
```

---

## 🚀 PRÓXIMOS PASSOS

### Semana 1: APIs Essenciais
1. Obter chaves gratuitas:
   - News API
   - Alpha Vantage
   - OpenWeatherMap
   - Wikipedia (sem chave)
   - CoinGecko (sem chave)

2. Configurar .env

3. Criar serviço `global-knowledge.service.js`

4. Testar endpoints

### Semana 2: Integração NOW
1. Comandos de voz:
   - "NOW, notícias sobre IA"
   - "NOW, clima em São Paulo"
   - "NOW, preço do Bitcoin"

2. Frontend visual:
   - Cards de notícias
   - Gráficos financeiros
   - Mapas de clima

### Semana 3: APIs Avançadas
1. Tradução automática
2. Tendências sociais
3. Dados científicos

---

## 💡 COMANDOS VOZ SUGERIDOS

```
🌍 Conhecimento Global:
"NOW, notícias do Brasil"
"NOW, o que está acontecendo no mundo?"
"NOW, últimas notícias de tecnologia"

💰 Financeiro:
"NOW, preço do Bitcoin"
"NOW, como está a bolsa?"
"NOW, dólar hoje"

🌤️ Clima:
"NOW, clima em Nova York"
"NOW, vai chover hoje?"
"NOW, qualidade do ar"

📚 Conhecimento:
"NOW, o que é blockchain?"
"NOW, quem é Steve Jobs?"
"NOW, traduzir 'hello' para português"

🚀 Ciência:
"NOW, foto do espaço hoje"
"NOW, asteroides próximos"
```

---

## 🎯 RESULTADO ESPERADO

Com essas APIs, NOW terá:

✅ Acesso a notícias mundiais em tempo real  
✅ Dados financeiros de todo mercado  
✅ Clima de qualquer cidade do mundo  
✅ Tradução para 100+ idiomas  
✅ Conhecimento da Wikipedia  
✅ Dados científicos da NASA  
✅ Tendências de redes sociais  
✅ Localização e mapas globais  

**NOW se tornará um assistente com conhecimento GLOBAL e ATUALIZADO em tempo real! 🌍**

---

**Documentação:** /home/user/webapp/GLOBAL_APIS_GUIDE.md  
**Versão:** 1.0  
**Criado:** 2026-02-09
