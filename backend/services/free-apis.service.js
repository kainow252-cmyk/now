/**
 * FREE APIs Service - NO API KEY NEEDED
 * 12+ Global Knowledge Sources - 100% Free
 */

const axios = require('axios');

class FreeAPIsService {
  constructor() {
    this.apis = {
      wikipedia: 'https://en.wikipedia.org/api/rest_v1',
      coingecko: 'https://api.coingecko.com/api/v3',
      worldbank: 'https://api.worldbank.org/v2',
      openmeteo: 'https://api.open-meteo.com/v1',
      restcountries: 'https://restcountries.com/v3.1',
      exchangerate: 'https://api.exchangerate-api.com/v4/latest'
    };
  }

  // === ORIGINAL 5 APIs ===
  
  async searchWikipedia(query, language = 'pt') {
    try {
      const url = `https://${language}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      return {
        success: true,
        title: response.data.title,
        summary: response.data.extract,
        url: response.data.content_urls?.desktop?.page
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCryptoPrice(coinId = 'bitcoin', currency = 'usd') {
    try {
      const url = `${this.apis.coingecko}/simple/price`;
      const response = await axios.get(url, {
        params: { ids: coinId, vs_currencies: currency, include_24hr_change: true }
      });
      const data = response.data[coinId];
      return {
        success: true,
        coin: coinId,
        price: data[currency],
        change24h: data[`${currency}_24h_change`]
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getWeather(latitude, longitude) {
    try {
      const url = `${this.apis.openmeteo}/forecast`;
      const response = await axios.get(url, {
        params: { latitude, longitude, current_weather: true, timezone: 'auto' }
      });
      const weather = response.data.current_weather;
      return {
        success: true,
        temperature: weather.temperature,
        windspeed: weather.windspeed,
        weathercode: weather.weathercode,
        time: weather.time
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getExchangeRate(base = 'USD') {
    try {
      const url = `${this.apis.exchangerate}/${base}`;
      const response = await axios.get(url);
      return {
        success: true,
        base: response.data.base,
        date: response.data.date,
        rates: response.data.rates
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCountryInfo(countryName) {
    try {
      const url = `${this.apis.restcountries}/name/${encodeURIComponent(countryName)}`;
      const response = await axios.get(url);
      const country = response.data[0];
      return {
        success: true,
        name: country.name.common,
        capital: country.capital?.[0],
        population: country.population,
        region: country.region,
        languages: Object.values(country.languages || {})
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === NEW 8 APIs - WORLD KNOWLEDGE ===

  async getNews(category = 'general', country = 'br') {
    try {
      const rssFeeds = {
        br: { general: 'https://g1.globo.com/rss/g1/', tech: 'https://www.tecmundo.com.br/rss' }
      };
      const feedUrl = rssFeeds[country]?.[category] || rssFeeds.br.general;
      const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
      const response = await axios.get(url);
      
      if (response.data.status === 'ok') {
        const items = response.data.items.slice(0, 5).map(item => ({
          title: item.title,
          description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200),
          link: item.link
        }));
        return { success: true, category, country, articles: items, total: items.length };
      }
      return { success: false, error: 'No news available' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async searchBooks(query, limit = 5) {
    try {
      const url = 'https://openlibrary.org/search.json';
      const response = await axios.get(url, { params: { q: query, limit } });
      const books = response.data.docs.slice(0, limit).map(book => ({
        title: book.title,
        author: book.author_name?.[0] || 'Unknown',
        year: book.first_publish_year
      }));
      return { success: true, query, books, total: books.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async searchMovies(query, limit = 5) {
    try {
      const url = 'https://api.tvmaze.com/search/shows';
      const response = await axios.get(url, { params: { q: query } });
      const movies = response.data.slice(0, limit).map(item => ({
        name: item.show.name,
        year: item.show.premiered?.substring(0, 4),
        rating: item.show.rating.average,
        genres: item.show.genres
      }));
      return { success: true, query, movies, total: movies.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async searchMusic(query, type = 'artist') {
    try {
      const url = `https://musicbrainz.org/ws/2/${type}`;
      const response = await axios.get(url, {
        params: { query, fmt: 'json', limit: 5 },
        headers: { 'User-Agent': 'NOW-Assistant/5.0' }
      });
      const items = response.data[type + 's'] || [];
      const results = items.slice(0, 5).map(item => ({
        name: item.name,
        country: item.country,
        score: item.score
      }));
      return { success: true, query, type, results, total: results.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getSportsScores(sport = 'soccer') {
    try {
      const today = new Date().toISOString().split('T')[0];
      const url = 'https://www.thesportsdb.com/api/v1/json/3/eventsday.php';
      const response = await axios.get(url, { params: { d: today, s: sport } });
      const events = response.data.events?.slice(0, 5).map(event => ({
        league: event.strLeague,
        home: event.strHomeTeam,
        away: event.strAwayTeam,
        score: `${event.intHomeScore || 0} - ${event.intAwayScore || 0}`
      })) || [];
      return { success: true, sport, date: today, events, total: events.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getSpaceData() {
    try {
      const url = 'https://api.nasa.gov/planetary/apod';
      const response = await axios.get(url, { params: { api_key: 'DEMO_KEY' } });
      return {
        success: true,
        title: response.data.title,
        explanation: response.data.explanation,
        url: response.data.url,
        date: response.data.date
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getQuote() {
    try {
      const url = 'https://api.quotable.io/random';
      const response = await axios.get(url);
      return {
        success: true,
        quote: response.data.content,
        author: response.data.author
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getHolidays(country = 'BR', year = new Date().getFullYear()) {
    try {
      const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`;
      const response = await axios.get(url);
      const holidays = response.data.slice(0, 10).map(h => ({
        name: h.name,
        date: h.date,
        global: h.global
      }));
      return { success: true, country, year, holidays, total: holidays.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // === AUTO-DETECT QUERY ===

  async query(question, type = 'auto') {
    const lowerQ = question.toLowerCase();
    
    if (type === 'auto') {
      if (lowerQ.includes('bitcoin') || lowerQ.includes('crypto') || lowerQ.includes('ethereum')) type = 'crypto';
      else if (lowerQ.includes('clima') || lowerQ.includes('tempo')) type = 'weather';
      else if (lowerQ.includes('país') || lowerQ.includes('country')) type = 'country';
      else if (lowerQ.includes('câmbio') || lowerQ.includes('dólar')) type = 'exchange';
      else type = 'wikipedia';
    }

    switch (type) {
      case 'crypto':
        const coinMatch = lowerQ.match(/bitcoin|ethereum|cardano|solana/);
        return await this.getCryptoPrice(coinMatch ? coinMatch[0] : 'bitcoin');
      case 'weather':
        return await this.getWeather(-23.5505, -46.6333);
      case 'exchange':
        return await this.getExchangeRate('USD');
      case 'country':
        const countryMatch = lowerQ.match(/brasil|brazil|usa|china|japan/);
        return await this.getCountryInfo(countryMatch ? countryMatch[0] : 'Brazil');
      case 'wikipedia':
      default:
        return await this.searchWikipedia(question, 'pt');
    }
  }

  async enhancedQuery(question, type = 'auto') {
    const lowerQ = question.toLowerCase();
    
    if (type === 'auto') {
      if (lowerQ.includes('notícia') || lowerQ.includes('news')) type = 'news';
      else if (lowerQ.includes('livro') || lowerQ.includes('book')) type = 'books';
      else if (lowerQ.includes('filme') || lowerQ.includes('série')) type = 'movies';
      else if (lowerQ.includes('música') || lowerQ.includes('cantor')) type = 'music';
      else if (lowerQ.includes('esporte') || lowerQ.includes('futebol')) type = 'sports';
      else if (lowerQ.includes('espaço') || lowerQ.includes('nasa')) type = 'space';
      else if (lowerQ.includes('frase') || lowerQ.includes('quote')) type = 'quote';
      else if (lowerQ.includes('feriado')) type = 'holidays';
      else return await this.query(question, type);
    }

    switch (type) {
      case 'news': return await this.getNews('general', 'br');
      case 'books': return await this.searchBooks(lowerQ.match(/livro\s+(.+)|book\s+(.+)/)?.[1] || 'best sellers');
      case 'movies': return await this.searchMovies(lowerQ.match(/filme\s+(.+)|série\s+(.+)/)?.[1] || 'Breaking Bad');
      case 'music': return await this.searchMusic(lowerQ.match(/música\s+(.+)|cantor\s+(.+)/)?.[1] || 'Beatles');
      case 'sports': return await this.getSportsScores('soccer');
      case 'space': return await this.getSpaceData();
      case 'quote': return await this.getQuote();
      case 'holidays': return await this.getHolidays('BR');
      default: return await this.query(question, type);
    }
  }
}

module.exports = new FreeAPIsService();
