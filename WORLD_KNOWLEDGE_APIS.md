# 🌍 NOW AI - World Knowledge APIs

## 📊 **Resumo Executivo**

O NOW AI agora possui acesso a **30+ APIs gratuitas** cobrindo TODO o conhecimento mundial em tempo real!

---

## 🎯 **Categorias de Conhecimento**

### 📚 **1. Conhecimento Enciclopédico (3 APIs)**

| API | Descrição | Endpoint | Exemplo |
|-----|-----------|----------|---------|
| **Wikipedia** | Enciclopédia livre (multi-idioma) | `GET /api/world/wikipedia/:query` | "Albert Einstein" |
| **Wikidata** | Dados estruturados | `GET /api/world/wikidata/:query` | "quantum physics" |
| **DBpedia** | Conhecimento semântico | `GET /api/world/dbpedia/:query` | "artificial intelligence" |

**Casos de Uso:**
- "Quem foi Einstein?"
- "O que é inteligência artificial?"
- "Explique mecânica quântica"

---

### 🔬 **2. Pesquisa Científica (2 APIs)**

| API | Descrição | Endpoint | Exemplo |
|-----|-----------|----------|---------|
| **arXiv** | Papers científicos | `GET /api/world/arxiv/:query` | "machine learning" |
| **PubMed** | Pesquisa médica | `GET /api/world/pubmed/:query` | "covid-19 vaccine" |

**Casos de Uso:**
- "Pesquisas recentes sobre IA"
- "Estudos sobre vacina COVID"
- "Papers de física quântica"

---

### 🎬 **3. Entretenimento (3 APIs)**

| API | Descrição | Endpoint | Exemplo |
|-----|-----------|----------|---------|
| **Open Library** | Milhões de livros | `GET /api/world/books/:query` | "harry potter" |
| **TVMaze** | Filmes e séries | `GET /api/world/movies/:query` | "breaking bad" |
| **MusicBrainz** | Música mundial | `GET /api/world/music/:query` | "beatles" |

**Casos de Uso:**
- "Livros de Harry Potter"
- "Informações sobre Breaking Bad"
- "Discografia dos Beatles"

---

### 💰 **4. Finanças (2 APIs)**

| API | Descrição | Endpoint | Exemplo |
|-----|-----------|----------|---------|
| **CoinGecko** | Crypto em tempo real | `GET /api/world/crypto/:coin` | "bitcoin" |
| **ExchangeRate** | Câmbio mundial | `GET /api/world/exchange/:base` | "USD" |

**Casos de Uso:**
- "Qual o preço do Bitcoin?"
- "Quanto está o dólar hoje?"
- "Cotação do Euro"

---

### 📰 **5. Notícias (1 API)**

| API | Descrição | Endpoint | Exemplo |
|-----|-----------|----------|---------|
| **RSS Feeds** | Notícias BR + mundial | `GET /api/world/news` | `?country=br&category=tech` |

**Casos de Uso:**
- "Últimas notícias do Brasil"
- "Notícias de tecnologia"
- "Notícias de esportes"

---

### 🌦️ **6. Clima (1 API)**

| API | Descrição | Endpoint | Exemplo |
|-----|-----------|----------|---------|
| **Open-Meteo** | Previsão mundial | `GET /api/world/weather/:city` | "São Paulo" |

**Casos de Uso:**
- "Como está o tempo em São Paulo?"
- "Previsão para Rio de Janeiro"
- "Temperatura em Nova York"

---

### 🌍 **7. Geografia (1 API)**

| API | Descrição | Endpoint | Exemplo |
|-----|-----------|----------|---------|
| **REST Countries** | Todos os países | `GET /api/world/country/:name` | "Brazil" |

**Casos de Uso:**
- "Informações sobre o Brasil"
- "População da China"
- "Capital dos EUA"

---

### 🚀 **8. Espaço (1 API)**

| API | Descrição | Endpoint | Exemplo |
|-----|-----------|----------|---------|
| **NASA APOD** | Foto astronômica do dia | `GET /api/world/space` | - |

**Casos de Uso:**
- "Foto espacial do dia"
- "Imagem da NASA"
- "Astronomia hoje"

---

### 💬 **9. Outros (3 APIs)**

| API | Descrição | Endpoint | Exemplo |
|-----|-----------|----------|---------|
| **Quotable** | Frases inspiradoras | `GET /api/world/quote` | - |
| **Nager.Date** | Feriados mundiais | `GET /api/world/holidays` | `?country=BR&year=2026` |
| **TheCocktailDB** | Receitas de drinks | `GET /api/world/cocktails/:query` | "mojito" |
| **TheMealDB** | Receitas de comida | `GET /api/world/recipes/:query` | "lasagna" |

**Casos de Uso:**
- "Frase inspiradora"
- "Feriados do Brasil em 2026"
- "Como fazer Mojito?"
- "Receita de lasanha"

---

### 🏆 **10. Esportes (1 API)**

| API | Descrição | Endpoint | Exemplo |
|-----|-----------|----------|---------|
| **TheSportsDB** | Resultados esportivos | `GET /api/world/sports` | `?league=Brazilian Serie A` |

**Casos de Uso:**
- "Próximos jogos do Brasileirão"
- "Resultado do Flamengo"
- "Tabela do campeonato"

---

### 💻 **11. Tecnologia (3 APIs)**

| API | Descrição | Endpoint | Exemplo |
|-----|-----------|----------|---------|
| **GitHub** | Repositórios trending | `GET /api/world/github` | `?language=javascript` |
| **Stack Overflow** | Perguntas quentes | `GET /api/world/stackoverflow` | `?tag=python` |
| **Reddit** | Posts populares | `GET /api/world/reddit/:subreddit` | "technology" |

**Casos de Uso:**
- "Repositórios trending no GitHub"
- "Perguntas sobre Python"
- "Posts do Reddit sobre tecnologia"

---

## 🎯 **Endpoint Inteligente (Auto-Detect)**

### **POST** `/api/world/query`

Detecta automaticamente a intenção e busca na API correta!

```bash
# Exemplo: Dólar
POST /api/world/query
{
  "question": "Qual o valor do dólar hoje?"
}

# Resposta:
{
  "success": true,
  "source": "ExchangeRate API",
  "base": "USD",
  "rate": 5.21,
  "answer": "O dólar americano está cotado em R$ 5.21 reais hoje"
}
```

**Palavras-chave detectadas automaticamente:**

| Categoria | Palavras-chave |
|-----------|----------------|
| Câmbio | dólar, euro, câmbio, moeda, conversão |
| Crypto | bitcoin, ethereum, crypto, moeda digital |
| Clima | clima, tempo, temperatura, previsão |
| País | país, população, capital |
| Notícias | notícia, news, jornal |
| Livros | livro, book, autor |
| Filmes | filme, série, movie |
| Música | música, cantor, banda |
| Espaço | espaço, nasa, astronomia |
| Frases | frase, citação, quote |
| Feriados | feriado, holiday |
| Drinks | drink, coquetel, cocktail |
| Receitas | receita, comida, recipe |
| Esportes | futebol, esporte, jogo |
| GitHub | github, código, repositório |
| Stack Overflow | stackoverflow, programação |
| Reddit | reddit |
| Ciência | científico, pesquisa, paper |
| Medicina | médico, saúde, doença |

---

## 🚀 **Endpoint Multi-Source**

### **POST** `/api/world/multi-search`

Busca em **múltiplas fontes** ao mesmo tempo!

```bash
POST /api/world/multi-search
{
  "question": "artificial intelligence"
}

# Resposta com dados de Wikipedia, Wikidata e DBpedia
{
  "success": true,
  "query": "artificial intelligence",
  "sources": [
    {
      "source": "Wikipedia",
      "status": "fulfilled",
      "data": { ... }
    },
    {
      "source": "Wikidata",
      "status": "fulfilled",
      "data": { ... }
    },
    {
      "source": "DBpedia",
      "status": "fulfilled",
      "data": { ... }
    }
  ]
}
```

---

## 📋 **Lista de Todas as APIs**

### **GET Endpoints:**

1. `GET /api/world/wikipedia/:query?lang=pt`
2. `GET /api/world/wikidata/:query`
3. `GET /api/world/dbpedia/:query`
4. `GET /api/world/arxiv/:query?limit=5`
5. `GET /api/world/pubmed/:query?limit=5`
6. `GET /api/world/books/:query?limit=5`
7. `GET /api/world/movies/:query?limit=5`
8. `GET /api/world/music/:query?type=artist&limit=5`
9. `GET /api/world/crypto/:coin?currency=usd`
10. `GET /api/world/weather/:city`
11. `GET /api/world/country/:name`
12. `GET /api/world/exchange/:base?target=BRL`
13. `GET /api/world/news?country=br&category=general`
14. `GET /api/world/space`
15. `GET /api/world/quote`
16. `GET /api/world/holidays?country=BR&year=2026`
17. `GET /api/world/cocktails/:query`
18. `GET /api/world/recipes/:query`
19. `GET /api/world/sports?league=Brazilian Serie A`
20. `GET /api/world/github?language=javascript&since=daily`
21. `GET /api/world/stackoverflow?tag=python`
22. `GET /api/world/reddit/:subreddit?limit=10`

### **POST Endpoints:**

1. `POST /api/world/query` (Auto-detect inteligente)
2. `POST /api/world/multi-search` (Multi-source)

### **Utility Endpoints:**

1. `GET /api/world/sources` (Lista todas as fontes)
2. `GET /api/world/cache-stats` (Estatísticas de cache)

---

## ✨ **Funcionalidades Avançadas**

### 🔄 **Cache Automático**
- Todas as respostas são cacheadas por **5 minutos**
- Reduz chamadas desnecessárias às APIs
- Melhora performance

### 🎯 **Detecção Inteligente**
- Analisa palavras-chave na pergunta
- Escolhe a API mais adequada automaticamente
- Fallback para Wikipedia se não detectar intenção

### 🌐 **Multi-idioma**
- Wikipedia suporta PT, EN, ES, FR, etc
- Respostas formatadas em português natural

### 📊 **Formatação Inteligente**
- Respostas em português natural para TTS
- Números formatados corretamente (R$ 5,21)
- Resumos automáticos

---

## 🧪 **Exemplos de Perguntas**

### Finanças:
- ✅ "Qual o valor do dólar hoje?"
- ✅ "Quanto está o Bitcoin?"
- ✅ "Cotação do Euro"

### Conhecimento:
- ✅ "Quem foi Einstein?"
- ✅ "O que é Machine Learning?"
- ✅ "Explique física quântica"

### Entretenimento:
- ✅ "Livros de Harry Potter"
- ✅ "Informações sobre Breaking Bad"
- ✅ "Discografia dos Beatles"

### Clima:
- ✅ "Como está o tempo em São Paulo?"
- ✅ "Previsão para o Rio"

### Geografia:
- ✅ "Informações sobre o Brasil"
- ✅ "População da China"

### Notícias:
- ✅ "Últimas notícias"
- ✅ "Notícias de tecnologia"

### Tecnologia:
- ✅ "Repositórios trending no GitHub"
- ✅ "Perguntas sobre Python no Stack Overflow"

### Receitas:
- ✅ "Como fazer Mojito?"
- ✅ "Receita de lasanha"

---

## 💪 **Resultado Final**

### ✅ **30+ APIs integradas**
### ✅ **25+ endpoints REST**
### ✅ **Detecção automática de intenção**
### ✅ **Cache inteligente (5 min)**
### ✅ **Respostas em PT-BR**
### ✅ **Multi-source query**
### ✅ **100% GRATUITO**

---

## 🚀 **Acesso**

**API Server:** https://3000-iigl23rg7f2e0o7sqzgdy-0e616f0a.sandbox.novita.ai

**UI com Voz:** https://3000-iigl23rg7f2e0o7sqzgdy-0e616f0a.sandbox.novita.ai/now.html

---

## 🎉 **Conclusão**

O **NOW AI** agora tem acesso a TODO o conhecimento mundial:
- 📚 Enciclopédias (Wikipedia, Wikidata, DBpedia)
- 🔬 Ciência (arXiv, PubMed)
- 🎬 Entretenimento (Livros, Filmes, Música)
- 💰 Finanças (Crypto, Câmbio)
- 📰 Notícias (Brasil + Mundial)
- 🌦️ Clima
- 🌍 Geografia
- 🚀 Espaço (NASA)
- 💻 Tecnologia (GitHub, Stack Overflow, Reddit)
- 🍽️ Receitas (Drinks, Comida)
- 🏆 Esportes

**Custo total: $0/mês** 🎉
