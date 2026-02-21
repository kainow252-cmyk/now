#!/usr/bin/env node

/**
 * NOW AI - Autonomous Knowledge Worker
 * 
 * Busca conhecimento autonomamente a cada 30 minutos de 8 fontes gratuitas:
 * 1. G1 News (RSS)
 * 2. Wikipedia Trending
 * 3. Reddit Top Posts
 * 4. GitHub Trending
 * 5. StackOverflow Hot Questions
 * 6. arXiv Latest Papers
 * 7. YouTube Trending
 * 8. Twitter Trends (via Nitter)
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class KnowledgeWorker {
  constructor() {
    this.knowledge = [];
    this.updateInterval = 30 * 60 * 1000; // 30 minutos
    this.dataPath = path.join(__dirname, '../data/autonomous-knowledge.json');
    this.isRunning = false;
  }

  /**
   * Inicia o worker autônomo
   */
  async start() {
    console.log('🚀 NOW AI Knowledge Worker iniciado!');
    console.log(`📊 Atualizando conhecimento a cada ${this.updateInterval / 60000} minutos\n`);

    this.isRunning = true;

    // Primeira atualização imediata
    await this.updateKnowledge();

    // Loop contínuo
    setInterval(async () => {
      if (this.isRunning) {
        await this.updateKnowledge();
      }
    }, this.updateInterval);
  }

  /**
   * Para o worker
   */
  stop() {
    this.isRunning = false;
    console.log('⏹️  Knowledge Worker parado');
  }

  /**
   * Atualiza conhecimento de todas as fontes
   */
  async updateKnowledge() {
    console.log(`\n⏰ [${new Date().toLocaleString('pt-BR')}] Atualizando conhecimento...`);

    const sources = [
      this.fetchG1News(),
      this.fetchWikipediaTrending(),
      this.fetchRedditTop(),
      this.fetchGitHubTrending(),
      this.fetchStackOverflowHot(),
      this.fetchArxivLatest(),
      this.fetchYouTubeTrending(),
      this.fetchTwitterTrends()
    ];

    try {
      const results = await Promise.allSettled(sources);
      
      let totalItems = 0;
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          totalItems += result.value.length;
        }
      });

      await this.saveKnowledge();
      
      console.log(`✅ Conhecimento atualizado: ${totalItems} novos itens`);
      console.log(`📦 Total em cache: ${this.knowledge.length} itens\n`);

    } catch (error) {
      console.error('❌ Erro ao atualizar conhecimento:', error.message);
    }
  }

  /**
   * 1. G1 - Notícias Brasil
   */
  async fetchG1News() {
    try {
      // G1 não tem RSS público direto, usa NewsAPI ou scraping
      const response = await axios.get('https://news.google.com/rss/search?q=when:1d+allinurl:g1.globo.com&hl=pt-BR&gl=BR&ceid=BR:pt-419', {
        timeout: 5000
      });
      
      this.addToKnowledge('news', 'G1', this.parseRSS(response.data));
      return this.knowledge.filter(k => k.source === 'G1');
    } catch (error) {
      console.log('⚠️  G1: não disponível');
      return [];
    }
  }

  /**
   * 2. Wikipedia - Artigos em alta
   */
  async fetchWikipediaTrending() {
    try {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');
      const response = await axios.get(
        `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/pt.wikipedia/all-access/${today.replace(/\//g, '/')}`,
        { timeout: 5000 }
      );

      const items = response.data.items[0]?.articles.slice(0, 10).map(a => ({
        title: a.article,
        views: a.views,
        url: `https://pt.wikipedia.org/wiki/${a.article}`
      })) || [];

      this.addToKnowledge('trending', 'Wikipedia', items);
      return items;
    } catch (error) {
      console.log('⚠️  Wikipedia: não disponível');
      return [];
    }
  }

  /**
   * 3. Reddit - Top Posts
   */
  async fetchRedditTop() {
    try {
      const response = await axios.get('https://www.reddit.com/r/popular/top.json?limit=10', {
        timeout: 5000,
        headers: { 'User-Agent': 'NOW-AI/1.0' }
      });

      const items = response.data.data.children.map(child => ({
        title: child.data.title,
        score: child.data.score,
        url: child.data.url,
        subreddit: child.data.subreddit
      }));

      this.addToKnowledge('social', 'Reddit', items);
      return items;
    } catch (error) {
      console.log('⚠️  Reddit: não disponível');
      return [];
    }
  }

  /**
   * 4. GitHub - Trending Repos
   */
  async fetchGitHubTrending() {
    try {
      const response = await axios.get('https://api.github.com/search/repositories?q=created:>2024-01-01&sort=stars&order=desc&per_page=10', {
        timeout: 5000,
        headers: { 'User-Agent': 'NOW-AI/1.0' }
      });

      const items = response.data.items.map(repo => ({
        name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        url: repo.html_url
      }));

      this.addToKnowledge('tech', 'GitHub', items);
      return items;
    } catch (error) {
      console.log('⚠️  GitHub: não disponível');
      return [];
    }
  }

  /**
   * 5. StackOverflow - Hot Questions
   */
  async fetchStackOverflowHot() {
    try {
      const response = await axios.get('https://api.stackexchange.com/2.3/questions?order=desc&sort=hot&site=stackoverflow&pagesize=10', {
        timeout: 5000
      });

      const items = response.data.items.map(q => ({
        title: q.title,
        score: q.score,
        url: q.link,
        tags: q.tags
      }));

      this.addToKnowledge('tech', 'StackOverflow', items);
      return items;
    } catch (error) {
      console.log('⚠️  StackOverflow: não disponível');
      return [];
    }
  }

  /**
   * 6. arXiv - Latest Papers
   */
  async fetchArxivLatest() {
    try {
      const response = await axios.get('http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=lastUpdatedDate&sortOrder=descending&max_results=10', {
        timeout: 5000
      });

      const items = this.parseArxivXML(response.data);
      this.addToKnowledge('science', 'arXiv', items);
      return items;
    } catch (error) {
      console.log('⚠️  arXiv: não disponível');
      return [];
    }
  }

  /**
   * 7. YouTube Trending (via Invidious)
   */
  async fetchYouTubeTrending() {
    try {
      const response = await axios.get('https://invidious.io.lol/api/v1/trending', {
        timeout: 5000
      });

      const items = response.data.slice(0, 10).map(video => ({
        title: video.title,
        views: video.viewCount,
        author: video.author,
        url: `https://youtube.com/watch?v=${video.videoId}`
      }));

      this.addToKnowledge('video', 'YouTube', items);
      return items;
    } catch (error) {
      console.log('⚠️  YouTube: não disponível');
      return [];
    }
  }

  /**
   * 8. Twitter Trends (via Nitter)
   */
  async fetchTwitterTrends() {
    try {
      // Nitter public instances
      const response = await axios.get('https://nitter.net/search?f=tweets&q=trending', {
        timeout: 5000
      });

      // Parsing básico - idealmente usar um HTML parser
      const trends = [];
      this.addToKnowledge('social', 'Twitter', trends);
      return trends;
    } catch (error) {
      console.log('⚠️  Twitter: não disponível');
      return [];
    }
  }

  /**
   * Adiciona itens ao conhecimento
   */
  addToKnowledge(category, source, items) {
    const timestamp = Date.now();
    
    items.forEach(item => {
      this.knowledge.push({
        category,
        source,
        ...item,
        timestamp,
        id: `${source}-${Date.now()}-${Math.random()}`
      });
    });

    // Limita a 10.000 itens
    if (this.knowledge.length > 10000) {
      this.knowledge = this.knowledge.slice(-10000);
    }
  }

  /**
   * Salva conhecimento em arquivo
   */
  async saveKnowledge() {
    try {
      const dir = path.dirname(this.dataPath);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.writeFile(
        this.dataPath,
        JSON.stringify({
          lastUpdate: new Date().toISOString(),
          totalItems: this.knowledge.length,
          knowledge: this.knowledge
        }, null, 2)
      );
    } catch (error) {
      console.error('❌ Erro ao salvar conhecimento:', error.message);
    }
  }

  /**
   * Carrega conhecimento salvo
   */
  async loadKnowledge() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      const parsed = JSON.parse(data);
      this.knowledge = parsed.knowledge || [];
      console.log(`📂 Conhecimento carregado: ${this.knowledge.length} itens`);
    } catch (error) {
      console.log('📂 Nenhum conhecimento anterior encontrado');
    }
  }

  /**
   * Parse simples de RSS
   */
  parseRSS(xml) {
    const items = [];
    const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>/g;
    const linkRegex = /<link>(.*?)<\/link>/g;
    
    let match;
    const titles = [];
    const links = [];
    
    while ((match = titleRegex.exec(xml)) !== null) {
      titles.push(match[1]);
    }
    
    while ((match = linkRegex.exec(xml)) !== null) {
      links.push(match[1]);
    }
    
    for (let i = 0; i < Math.min(titles.length, links.length, 10); i++) {
      items.push({
        title: titles[i],
        url: links[i]
      });
    }
    
    return items;
  }

  /**
   * Parse simples de arXiv XML
   */
  parseArxivXML(xml) {
    const items = [];
    const entries = xml.split('<entry>').slice(1, 11);
    
    entries.forEach(entry => {
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1]?.trim();
      const link = entry.match(/<id>(.*?)<\/id>/)?.[1];
      
      if (title && link) {
        items.push({ title, url: link });
      }
    });
    
    return items;
  }

  /**
   * Busca no conhecimento
   */
  search(query, limit = 10) {
    const q = query.toLowerCase();
    
    return this.knowledge
      .filter(item => {
        const searchText = `${item.title} ${item.description || ''} ${item.source}`.toLowerCase();
        return searchText.includes(q);
      })
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Estatísticas do worker
   */
  getStats() {
    const bySource = {};
    const byCategory = {};
    
    this.knowledge.forEach(item => {
      bySource[item.source] = (bySource[item.source] || 0) + 1;
      byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    });

    return {
      total: this.knowledge.length,
      bySource,
      byCategory,
      isRunning: this.isRunning,
      lastUpdate: this.knowledge[this.knowledge.length - 1]?.timestamp
    };
  }
}

// Inicia o worker se executado diretamente
if (require.main === module) {
  const worker = new KnowledgeWorker();
  
  worker.loadKnowledge().then(() => {
    worker.start();
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando Knowledge Worker...');
    worker.stop();
    process.exit(0);
  });
}

module.exports = KnowledgeWorker;
