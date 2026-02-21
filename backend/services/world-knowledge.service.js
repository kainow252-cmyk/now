/**
 * WORLD KNOWLEDGE SERVICE - 30+ FREE APIs
 * Conhecimento Mundial em Tempo Real - 100% Gratuito
 */

const axios = require('axios');

class WorldKnowledgeService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutos
  }

  // === CACHE HELPER ===
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  setCached(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // === 1. WIKIPEDIA (Multi-idioma) ===
  async searchWikipedia(query, lang = 'pt') {
    const cacheKey = `wiki:${lang}:${query}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      const result = {
        success: true,
        source: 'Wikipedia',
        title: response.data.title,
        summary: response.data.extract,
        url: response.data.content_urls?.desktop?.page,
        thumbnail: response.data.thumbnail?.source
      };
      this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 2. WIKIDATA (Dados estruturados) ===
  async searchWikidata(query) {
    try {
      const url = `https://www.wikidata.org/w/api.php`;
      const response = await axios.get(url, {
        params: {
          action: 'wbsearchentities',
          search: query,
          language: 'pt',
          format: 'json',
          limit: 5
        }
      });
      return {
        success: true,
        source: 'Wikidata',
        results: response.data.search.map(item => ({
          id: item.id,
          label: item.label,
          description: item.description,
          url: item.concepturi
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 3. DBPEDIA (Conhecimento estruturado) ===
  async searchDBpedia(query) {
    try {
      const url = 'https://lookup.dbpedia.org/api/search';
      const response = await axios.get(url, {
        params: { query, format: 'json', maxResults: 5 }
      });
      return {
        success: true,
        source: 'DBpedia',
        results: response.data.docs?.map(doc => ({
          label: doc.label?.[0],
          description: doc.comment?.[0],
          url: doc.resource?.[0]
        })) || []
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 4. ARXIV (Pesquisas científicas) ===
  async searchArxiv(query, maxResults = 5) {
    try {
      const url = 'http://export.arxiv.org/api/query';
      const response = await axios.get(url, {
        params: { search_query: `all:${query}`, max_results: maxResults }
      });
      // Parse XML response (simplified)
      const entries = response.data.match(/<entry>(.*?)<\/entry>/gs) || [];
      const results = entries.slice(0, maxResults).map(entry => {
        const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || '';
        const summary = entry.match(/<summary>(.*?)<\/summary>/)?.[1] || '';
        const published = entry.match(/<published>(.*?)<published>/)?.[1] || '';
        return { title, summary: summary.substring(0, 200), published };
      });
      return {
        success: true,
        source: 'arXiv',
        query,
        results,
        total: results.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 5. PUBMED (Pesquisas médicas) ===
  async searchPubMed(query, limit = 5) {
    try {
      const searchUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
      const searchRes = await axios.get(searchUrl, {
        params: { db: 'pubmed', term: query, retmode: 'json', retmax: limit }
      });
      const ids = searchRes.data.esearchresult?.idlist || [];
      
      if (ids.length === 0) {
        return { success: true, source: 'PubMed', results: [] };
      }

      const summaryUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
      const summaryRes = await axios.get(summaryUrl, {
        params: { db: 'pubmed', id: ids.join(','), retmode: 'json' }
      });

      const results = ids.map(id => {
        const article = summaryRes.data.result?.[id];
        return {
          title: article?.title || 'N/A',
          authors: article?.authors?.slice(0, 3).map(a => a.name).join(', ') || 'N/A',
          pubdate: article?.pubdate || 'N/A',
          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
        };
      });

      return {
        success: true,
        source: 'PubMed',
        query,
        results,
        total: results.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 6. OPEN LIBRARY (Livros) ===
  async searchBooks(query, limit = 5) {
    const cacheKey = `books:${query}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = 'https://openlibrary.org/search.json';
      const response = await axios.get(url, { params: { q: query, limit } });
      const result = {
        success: true,
        source: 'Open Library',
        query,
        books: response.data.docs.slice(0, limit).map(book => ({
          title: book.title,
          author: book.author_name?.[0] || 'Desconhecido',
          year: book.first_publish_year,
          isbn: book.isbn?.[0],
          cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null
        })),
        total: response.data.numFound
      };
      this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 7. TVMAZE (Filmes e Séries) ===
  async searchMovies(query, limit = 5) {
    try {
      const url = 'https://api.tvmaze.com/search/shows';
      const response = await axios.get(url, { params: { q: query } });
      return {
        success: true,
        source: 'TVMaze',
        query,
        shows: response.data.slice(0, limit).map(item => ({
          name: item.show.name,
          year: item.show.premiered?.substring(0, 4),
          rating: item.show.rating.average || 'N/A',
          genres: item.show.genres,
          summary: item.show.summary?.replace(/<[^>]*>/g, '').substring(0, 200),
          image: item.show.image?.medium
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 8. MUSICBRAINZ (Música) ===
  async searchMusic(query, type = 'artist', limit = 5) {
    try {
      const url = `https://musicbrainz.org/ws/2/${type}`;
      const response = await axios.get(url, {
        params: { query, fmt: 'json', limit },
        headers: { 'User-Agent': 'NOW-Assistant/6.0' }
      });
      const items = response.data[type + 's'] || [];
      return {
        success: true,
        source: 'MusicBrainz',
        query,
        type,
        results: items.slice(0, limit).map(item => ({
          name: item.name,
          country: item.country || item.area?.name,
          type: item.type,
          score: item.score
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 9. COINGECKO (Crypto) ===
  async getCryptoPrice(coinId = 'bitcoin', currency = 'usd') {
    const cacheKey = `crypto:${coinId}:${currency}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = 'https://api.coingecko.com/api/v3/simple/price';
      const response = await axios.get(url, {
        params: {
          ids: coinId,
          vs_currencies: currency,
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true
        }
      });
      const data = response.data[coinId];
      const result = {
        success: true,
        source: 'CoinGecko',
        coin: coinId,
        price: data[currency],
        change24h: data[`${currency}_24h_change`],
        marketCap: data[`${currency}_market_cap`],
        volume24h: data[`${currency}_24h_vol`]
      };
      this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 10. OPEN-METEO (Clima) ===
  async getWeather(city = 'São Paulo') {
    const coords = this.getCityCoords(city);
    const cacheKey = `weather:${city}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = 'https://api.open-meteo.com/v1/forecast';
      const response = await axios.get(url, {
        params: {
          latitude: coords.lat,
          longitude: coords.lon,
          current_weather: true,
          timezone: 'auto',
          daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum'
        }
      });
      const result = {
        success: true,
        source: 'Open-Meteo',
        city,
        current: response.data.current_weather,
        forecast: response.data.daily
      };
      this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getCityCoords(city) {
    const cities = {
      'São Paulo': { lat: -23.5505, lon: -46.6333 },
      'Rio de Janeiro': { lat: -22.9068, lon: -43.1729 },
      'Brasília': { lat: -15.7801, lon: -47.9292 },
      'London': { lat: 51.5074, lon: -0.1278 },
      'New York': { lat: 40.7128, lon: -74.0060 }
    };
    return cities[city] || cities['São Paulo'];
  }

  // === 11. RESTCOUNTRIES (Países) ===
  async getCountryInfo(countryName) {
    const cacheKey = `country:${countryName}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`;
      const response = await axios.get(url);
      const country = response.data[0];
      const result = {
        success: true,
        source: 'REST Countries',
        name: country.name.common,
        capital: country.capital?.[0],
        population: country.population,
        area: country.area,
        region: country.region,
        subregion: country.subregion,
        languages: Object.values(country.languages || {}),
        currencies: Object.values(country.currencies || {}).map(c => c.name),
        flag: country.flags.svg
      };
      this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 12. EXCHANGERATE-API (Câmbio) ===
  async getExchangeRate(base = 'USD', target = 'BRL') {
    const cacheKey = `exchange:${base}:${target}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = `https://api.exchangerate-api.com/v4/latest/${base}`;
      const response = await axios.get(url);
      const result = {
        success: true,
        source: 'ExchangeRate API',
        base: response.data.base,
        date: response.data.date,
        rate: response.data.rates[target],
        allRates: response.data.rates
      };
      this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 13. RSS2JSON (Notícias) ===
  async getNews(country = 'br', category = 'general') {
    const cacheKey = `news:${country}:${category}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const feeds = {
        br: {
          general: 'https://g1.globo.com/rss/g1/',
          tech: 'https://www.tecmundo.com.br/rss',
          sports: 'https://ge.globo.com/rss/feed.xml'
        },
        us: {
          general: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
          tech: 'https://techcrunch.com/feed/'
        }
      };
      
      const feedUrl = feeds[country]?.[category] || feeds.br.general;
      const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
      const response = await axios.get(url);
      
      const result = {
        success: true,
        source: 'News RSS',
        country,
        category,
        articles: response.data.items?.slice(0, 10).map(item => ({
          title: item.title,
          description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200),
          link: item.link,
          pubDate: item.pubDate,
          thumbnail: item.thumbnail
        })) || []
      };
      this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 14. NASA APOD (Espaço) ===
  async getSpaceData() {
    const cacheKey = 'space:apod';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = 'https://api.nasa.gov/planetary/apod';
      const response = await axios.get(url, {
        params: { api_key: 'DEMO_KEY', count: 1 }
      });
      const result = {
        success: true,
        source: 'NASA APOD',
        title: response.data[0]?.title || response.data.title,
        explanation: response.data[0]?.explanation || response.data.explanation,
        url: response.data[0]?.url || response.data.url,
        date: response.data[0]?.date || response.data.date
      };
      this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 15. QUOTABLE (Frases) ===
  async getQuote() {
    try {
      const url = 'https://api.quotable.io/random';
      const response = await axios.get(url);
      return {
        success: true,
        source: 'Quotable',
        quote: response.data.content,
        author: response.data.author,
        tags: response.data.tags
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 16. NAGER.DATE (Feriados) ===
  async getHolidays(country = 'BR', year = new Date().getFullYear()) {
    const cacheKey = `holidays:${country}:${year}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`;
      const response = await axios.get(url);
      const result = {
        success: true,
        source: 'Nager.Date',
        country,
        year,
        holidays: response.data.map(h => ({
          name: h.name,
          localName: h.localName,
          date: h.date,
          global: h.global,
          counties: h.counties
        }))
      };
      this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 17. THECOCKTAILDB (Receitas de drinks) ===
  async searchCocktails(query) {
    try {
      const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php';
      const response = await axios.get(url, { params: { s: query } });
      return {
        success: true,
        source: 'TheCocktailDB',
        query,
        cocktails: response.data.drinks?.slice(0, 5).map(drink => ({
          name: drink.strDrink,
          category: drink.strCategory,
          glass: drink.strGlass,
          instructions: drink.strInstructions,
          thumbnail: drink.strDrinkThumb
        })) || []
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 18. THEMEALDB (Receitas de comida) ===
  async searchRecipes(query) {
    try {
      const url = 'https://www.themealdb.com/api/json/v1/1/search.php';
      const response = await axios.get(url, { params: { s: query } });
      return {
        success: true,
        source: 'TheMealDB',
        query,
        recipes: response.data.meals?.slice(0, 5).map(meal => ({
          name: meal.strMeal,
          category: meal.strCategory,
          area: meal.strArea,
          instructions: meal.strInstructions,
          thumbnail: meal.strMealThumb,
          youtube: meal.strYoutube
        })) || []
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 19. THESPORTSDB (Esportes) ===
  async getSportsScores(league = 'Brazilian Serie A') {
    try {
      const url = 'https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php';
      const response = await axios.get(url, {
        params: { id: '4351' } // Brazilian Serie A ID
      });
      return {
        success: true,
        source: 'TheSportsDB',
        league,
        events: response.data.events?.slice(0, 10).map(event => ({
          date: event.dateEvent,
          time: event.strTime,
          home: event.strHomeTeam,
          away: event.strAwayTeam,
          venue: event.strVenue
        })) || []
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 20. GITHUB TRENDING ===
  async getGitHubTrending(language = '', since = 'daily') {
    try {
      const url = 'https://api.github.com/search/repositories';
      const date = new Date();
      date.setDate(date.getDate() - 7);
      const dateStr = date.toISOString().split('T')[0];
      
      const response = await axios.get(url, {
        params: {
          q: `created:>${dateStr}${language ? ` language:${language}` : ''}`,
          sort: 'stars',
          order: 'desc',
          per_page: 10
        }
      });
      
      return {
        success: true,
        source: 'GitHub',
        language: language || 'all',
        since,
        repositories: response.data.items.map(repo => ({
          name: repo.full_name,
          description: repo.description,
          stars: repo.stargazers_count,
          language: repo.language,
          url: repo.html_url
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 21. STACKOVERFLOW HOT QUESTIONS ===
  async getStackOverflowQuestions(tag = '') {
    try {
      const url = 'https://api.stackexchange.com/2.3/questions';
      const response = await axios.get(url, {
        params: {
          order: 'desc',
          sort: 'hot',
          tagged: tag,
          site: 'stackoverflow',
          pagesize: 10
        }
      });
      
      return {
        success: true,
        source: 'Stack Overflow',
        tag: tag || 'all',
        questions: response.data.items.map(q => ({
          title: q.title,
          score: q.score,
          answers: q.answer_count,
          views: q.view_count,
          link: q.link,
          tags: q.tags
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === 22. REDDIT HOT POSTS ===
  async getRedditPosts(subreddit = 'technology', limit = 10) {
    try {
      const url = `https://www.reddit.com/r/${subreddit}/hot.json`;
      const response = await axios.get(url, {
        params: { limit },
        headers: { 'User-Agent': 'NOW-Assistant/6.0' }
      });
      
      return {
        success: true,
        source: 'Reddit',
        subreddit,
        posts: response.data.data.children.map(post => ({
          title: post.data.title,
          author: post.data.author,
          score: post.data.score,
          comments: post.data.num_comments,
          url: `https://reddit.com${post.data.permalink}`
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === INTELLIGENT AUTO-QUERY ===
  async intelligentQuery(question) {
    const q = question.toLowerCase();
    
    // Detecta intenção baseada em palavras-chave
    const intents = [
      { keywords: ['bitcoin', 'ethereum', 'crypto', 'moeda digital'], method: 'getCryptoPrice', args: ['bitcoin'] },
      { keywords: ['clima', 'tempo', 'temperatura', 'previsão'], method: 'getWeather', args: ['São Paulo'] },
      { keywords: ['dólar', 'euro', 'câmbio', 'moeda', 'conversão'], method: 'getExchangeRate', args: ['USD', 'BRL'] },
      { keywords: ['país', 'população', 'capital'], method: 'getCountryInfo', args: ['Brazil'] },
      { keywords: ['notícia', 'news', 'jornal'], method: 'getNews', args: ['br', 'general'] },
      { keywords: ['livro', 'book', 'autor'], method: 'searchBooks', args: [q] },
      { keywords: ['filme', 'série', 'movie'], method: 'searchMovies', args: [q] },
      { keywords: ['música', 'cantor', 'banda'], method: 'searchMusic', args: [q] },
      { keywords: ['espaço', 'nasa', 'astronomia'], method: 'getSpaceData', args: [] },
      { keywords: ['frase', 'citação', 'quote'], method: 'getQuote', args: [] },
      { keywords: ['feriado', 'holiday'], method: 'getHolidays', args: ['BR'] },
      { keywords: ['drink', 'coquetel', 'cocktail'], method: 'searchCocktails', args: [q] },
      { keywords: ['receita', 'comida', 'recipe'], method: 'searchRecipes', args: [q] },
      { keywords: ['futebol', 'esporte', 'jogo'], method: 'getSportsScores', args: [] },
      { keywords: ['github', 'código', 'repositório'], method: 'getGitHubTrending', args: [''] },
      { keywords: ['stackoverflow', 'programação', 'código'], method: 'getStackOverflowQuestions', args: [''] },
      { keywords: ['reddit'], method: 'getRedditPosts', args: ['technology'] },
      { keywords: ['científico', 'pesquisa', 'paper'], method: 'searchArxiv', args: [q] },
      { keywords: ['médico', 'saúde', 'doença'], method: 'searchPubMed', args: [q] }
    ];

    // Encontra a primeira intenção que corresponde
    for (const intent of intents) {
      if (intent.keywords.some(kw => q.includes(kw))) {
        return await this[intent.method](...intent.args);
      }
    }

    // Fallback: busca na Wikipedia
    return await this.searchWikipedia(question, 'pt');
  }

  // === MULTI-SOURCE QUERY (busca em várias fontes) ===
  async multiSourceQuery(question) {
    const results = await Promise.allSettled([
      this.searchWikipedia(question, 'pt'),
      this.searchWikidata(question),
      this.searchDBpedia(question)
    ]);

    return {
      success: true,
      query: question,
      sources: results.map((result, index) => ({
        source: ['Wikipedia', 'Wikidata', 'DBpedia'][index],
        status: result.status,
        data: result.status === 'fulfilled' ? result.value : { error: result.reason }
      }))
    };
  }

  // === GET ALL SOURCES ===
  getAvailableSources() {
    return {
      knowledge: ['Wikipedia', 'Wikidata', 'DBpedia'],
      science: ['arXiv', 'PubMed'],
      entertainment: ['Open Library', 'TVMaze', 'MusicBrainz'],
      finance: ['CoinGecko', 'ExchangeRate API'],
      news: ['RSS News Feeds'],
      weather: ['Open-Meteo'],
      geography: ['REST Countries'],
      space: ['NASA APOD'],
      quotes: ['Quotable'],
      holidays: ['Nager.Date'],
      food: ['TheCocktailDB', 'TheMealDB'],
      sports: ['TheSportsDB'],
      tech: ['GitHub', 'Stack Overflow', 'Reddit']
    };
  }

  // === CACHE STATS ===
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      expiryMinutes: this.cacheExpiry / 60000
    };
  }
}

module.exports = new WorldKnowledgeService();
