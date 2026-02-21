const axios = require('axios');

class LearningService {
  constructor() {
    this.knowledgeBase = new Map(); // In-memory knowledge storage
    this.sources = {
      news: [
        'https://news.google.com/rss',
        'https://www.reuters.com/news/archive',
        'https://www.bloomberg.com'
      ],
      finance: [
        'https://finance.yahoo.com',
        'https://www.marketwatch.com',
        'https://www.investing.com'
      ],
      tech: [
        'https://techcrunch.com',
        'https://www.theverge.com',
        'https://arstechnica.com'
      ],
      business: [
        'https://www.forbes.com',
        'https://www.businessinsider.com',
        'https://hbr.org'
      ]
    };
    
    this.learningStats = {
      totalArticles: 0,
      totalSources: 0,
      lastUpdate: null,
      categories: {}
    };
  }

  /**
   * Search the internet for information
   */
  async searchInternet(query, options = {}) {
    const {
      depth = 5,        // Number of results
      sources = 'all',  // 'all', 'news', 'finance', 'tech', 'business'
      realtime = false  // If true, fetch fresh data
    } = options;

    console.log(`🔍 Searching internet for: "${query}"`);

    // Check knowledge base first (cached results)
    const cached = this.getFromKnowledge(query);
    if (cached && !realtime) {
      console.log('✅ Found in knowledge base (cached)');
      return cached;
    }

    try {
      // Multiple search strategies
      const results = await Promise.all([
        this.searchGoogle(query, depth),
        this.searchNews(query),
        this.searchWikipedia(query)
      ]);

      const aggregatedResults = this.aggregateResults(results);
      
      // Store in knowledge base
      this.storeKnowledge(query, aggregatedResults);

      return {
        success: true,
        query,
        results: aggregatedResults,
        sources: aggregatedResults.length,
        cached: false,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Internet search error:', error.message);
      return this.mockSearchResults(query);
    }
  }

  /**
   * Google Custom Search (requires API key)
   */
  async searchGoogle(query, numResults = 5) {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey) {
      console.warn('Google Search API not configured');
      return [];
    }

    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: apiKey,
          cx: searchEngineId,
          q: query,
          num: numResults
        },
        timeout: 10000
      });

      return response.data.items?.map(item => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet,
        source: 'google',
        timestamp: new Date()
      })) || [];
    } catch (error) {
      console.error('Google search error:', error.message);
      return [];
    }
  }

  /**
   * Search news articles
   */
  async searchNews(query) {
    // Using free RSS feeds and public APIs
    try {
      // NewsAPI (free tier)
      const apiKey = process.env.NEWS_API_KEY;
      
      if (!apiKey) {
        return this.mockNewsResults(query);
      }

      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          apiKey: apiKey,
          pageSize: 5,
          language: 'pt',
          sortBy: 'publishedAt'
        },
        timeout: 10000
      });

      return response.data.articles?.map(article => ({
        title: article.title,
        url: article.url,
        snippet: article.description,
        source: article.source.name,
        publishedAt: article.publishedAt,
        type: 'news'
      })) || [];
    } catch (error) {
      console.error('News search error:', error.message);
      return this.mockNewsResults(query);
    }
  }

  /**
   * Search Wikipedia
   */
  async searchWikipedia(query) {
    try {
      const response = await axios.get('https://pt.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: query,
          format: 'json',
          srlimit: 3
        },
        timeout: 10000
      });

      const results = response.data.query?.search || [];
      
      return results.map(result => ({
        title: result.title,
        url: `https://pt.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
        snippet: result.snippet.replace(/<[^>]*>/g, ''), // Remove HTML tags
        source: 'wikipedia',
        type: 'encyclopedia'
      }));
    } catch (error) {
      console.error('Wikipedia search error:', error.message);
      return [];
    }
  }

  /**
   * Scrape and extract content from URL
   */
  async extractContent(url) {
    try {
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NOW-AI-Bot/1.0)'
        }
      });

      const html = response.data;
      
      // Simple text extraction (in production, use cheerio or similar)
      const text = html
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 5000); // First 5000 chars

      return {
        url,
        content: text,
        length: text.length,
        extracted: new Date()
      };
    } catch (error) {
      console.error(`Content extraction error for ${url}:`, error.message);
      return null;
    }
  }

  /**
   * Learn from multiple sources
   */
  async learnFromSources(topic, sources = ['news', 'finance', 'tech']) {
    console.log(`🎓 Learning about: ${topic}`);
    
    const learningResults = [];

    for (const source of sources) {
      try {
        const searchResults = await this.searchInternet(topic, { sources: source });
        
        if (searchResults.results && searchResults.results.length > 0) {
          // Extract detailed content from top results
          const topResults = searchResults.results.slice(0, 3);
          
          for (const result of topResults) {
            const content = await this.extractContent(result.url);
            if (content) {
              learningResults.push({
                ...result,
                fullContent: content.content
              });
            }
          }
        }
      } catch (error) {
        console.error(`Learning from ${source} failed:`, error.message);
      }
    }

    // Store learned information
    this.storeKnowledge(`learn:${topic}`, {
      topic,
      sources,
      results: learningResults,
      learnedAt: new Date(),
      totalSources: learningResults.length
    });

    this.learningStats.totalArticles += learningResults.length;
    this.learningStats.lastUpdate = new Date();

    return {
      success: true,
      topic,
      learned: learningResults.length,
      sources: learningResults.map(r => r.source),
      summary: this.summarizeLearning(learningResults)
    };
  }

  /**
   * Continuous learning - runs periodically
   */
  async continuousLearning(topics = []) {
    const defaultTopics = [
      'investimentos',
      'tecnologia',
      'inteligência artificial',
      'mercado financeiro',
      'criptomoedas',
      'startups',
      'inovação'
    ];

    const learningTopics = topics.length > 0 ? topics : defaultTopics;
    
    console.log(`🔄 Starting continuous learning for ${learningTopics.length} topics`);

    const results = [];

    for (const topic of learningTopics) {
      const learned = await this.learnFromSources(topic);
      results.push(learned);
      
      // Delay between requests to avoid rate limiting
      await this.sleep(2000);
    }

    return {
      success: true,
      topicsLearned: learningTopics.length,
      totalArticles: results.reduce((sum, r) => sum + r.learned, 0),
      results
    };
  }

  /**
   * Get knowledge from base
   */
  getFromKnowledge(query) {
    const key = query.toLowerCase();
    return this.knowledgeBase.get(key);
  }

  /**
   * Store in knowledge base
   */
  storeKnowledge(query, data) {
    const key = query.toLowerCase();
    this.knowledgeBase.set(key, {
      query,
      data,
      stored: new Date(),
      accessCount: 0
    });

    // Limit knowledge base size
    if (this.knowledgeBase.size > 1000) {
      const firstKey = this.knowledgeBase.keys().next().value;
      this.knowledgeBase.delete(firstKey);
    }
  }

  /**
   * Aggregate results from multiple sources
   */
  aggregateResults(resultArrays) {
    const allResults = resultArrays.flat().filter(Boolean);
    
    // Remove duplicates by URL
    const uniqueResults = Array.from(
      new Map(allResults.map(item => [item.url, item])).values()
    );

    // Sort by relevance (newer first)
    return uniqueResults
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.timestamp);
        const dateB = new Date(b.publishedAt || b.timestamp);
        return dateB - dateA;
      })
      .slice(0, 10); // Top 10 results
  }

  /**
   * Summarize learning
   */
  summarizeLearning(results) {
    if (results.length === 0) {
      return 'Nenhuma informação encontrada.';
    }

    const sources = [...new Set(results.map(r => r.source))];
    const topics = results.map(r => r.title).slice(0, 3);

    return `Aprendi de ${results.length} fontes (${sources.join(', ')}). Principais tópicos: ${topics.join('; ')}.`;
  }

  /**
   * Get learning statistics
   */
  getStats() {
    return {
      ...this.learningStats,
      knowledgeBaseSize: this.knowledgeBase.size,
      availableSources: Object.keys(this.sources).length
    };
  }

  /**
   * Clear knowledge base
   */
  clearKnowledge() {
    this.knowledgeBase.clear();
    this.learningStats.totalArticles = 0;
    this.learningStats.lastUpdate = null;
  }

  // Helper functions
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock results when APIs are not configured
  mockSearchResults(query) {
    return {
      success: true,
      query,
      results: [
        {
          title: `Informações sobre ${query}`,
          url: 'https://example.com',
          snippet: `Resultados sobre ${query}. Configure API keys para busca real.`,
          source: 'mock',
          type: 'mock'
        }
      ],
      cached: false,
      timestamp: new Date()
    };
  }

  mockNewsResults(query) {
    return [
      {
        title: `Notícias sobre ${query}`,
        url: 'https://example.com/news',
        snippet: `Últimas notícias sobre ${query}`,
        source: 'mock-news',
        type: 'news'
      }
    ];
  }
}

module.exports = new LearningService();
