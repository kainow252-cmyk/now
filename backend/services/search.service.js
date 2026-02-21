const axios = require('axios');
const geminiService = require('./gemini.service');
const openaiService = require('./openai.service');

class SearchService {
  constructor() {
    this.geminiKey = process.env.GEMINI_API_KEY;
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.googleSearchKey = process.env.GOOGLE_SEARCH_API_KEY;
    this.googleSearchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  }

  // 🔍 PESQUISA INTELIGENTE - Combina pesquisa real + análise IA
  async smartSearch(query, options = {}) {
    const {
      useAI = 'gemini',  // 'gemini', 'openai', ou 'both'
      maxResults = 5,
      language = 'pt-BR',
      withSummary = true,
      aiOnly = false  // ✅ NOVO: permite pesquisa apenas com IA
    } = options;

    try {
      console.log(`🔍 Pesquisando: "${query}" (AI: ${useAI}, AI-Only: ${aiOnly})`);

      // 1. Se aiOnly=true, pular pesquisa web
      let searchResults = [];
      if (!aiOnly) {
        searchResults = await this.searchWeb(query, maxResults, language);
      }

      // Se não tem resultados E não é AI-only, retornar erro
      if (!aiOnly && (!searchResults || searchResults.length === 0)) {
        // Tentar modo AI-only como fallback
        console.log('⚠️ Sem resultados web, tentando AI-only...');
        return await this.smartSearch(query, { ...options, aiOnly: true });
      }

      // 2. Se summary desativado E tem resultados, retornar apenas resultados
      if (!withSummary && searchResults.length > 0) {
        return {
          success: true,
          query: query,
          results: searchResults,
          source: 'google_search'
        };
      }

      // 3. Criar contexto para IA analisar
      let context;
      if (aiOnly || searchResults.length === 0) {
        // Modo AI-only: IA responde direto sem pesquisa web
        context = `O usuário perguntou sobre: "${query}"
        
Como você não tem acesso à internet agora, responda com base no seu conhecimento até 2026.
Seja objetivo, direto e útil. Máximo 3 parágrafos.`;
      } else {
        context = this.formatResultsForAI(searchResults);
      }

      // 4. Análise com IA
      let analysis;
      if (useAI === 'gemini') {
        analysis = await this.analyzeWithGemini(query, context);
      } else if (useAI === 'openai') {
        analysis = await this.analyzeWithOpenAI(query, context);
      } else if (useAI === 'both') {
        const [geminiAnalysis, openaiAnalysis] = await Promise.all([
          this.analyzeWithGemini(query, context),
          this.analyzeWithOpenAI(query, context)
        ]);
        analysis = {
          gemini: geminiAnalysis,
          openai: openaiAnalysis,
          combined: `${geminiAnalysis}\n\n---\n\n${openaiAnalysis}`
        };
      }

      return {
        success: true,
        query: query,
        summary: analysis,
        results: searchResults,
        aiModel: useAI,
        mode: aiOnly ? 'ai_only' : 'web_search',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        query: query,
        error: error.message,
        results: []
      };
    }
  }

  // 🌐 PESQUISA NA WEB (Google Custom Search API)
  async searchWeb(query, maxResults = 5, language = 'pt-BR') {
    // Se não tiver Google API, usar DuckDuckGo scraping
    if (!this.googleSearchKey || !this.googleSearchEngineId) {
      return await this.searchDuckDuckGo(query, maxResults);
    }

    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: this.googleSearchKey,
          cx: this.googleSearchEngineId,
          q: query,
          num: maxResults,
          lr: `lang_${language.split('-')[0]}`
        }
      });

      if (!response.data.items) {
        return [];
      }

      return response.data.items.map(item => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet,
        displayUrl: item.displayLink,
        image: item.pagemap?.cse_thumbnail?.[0]?.src
      }));

    } catch (error) {
      console.error('Google Search error:', error.message);
      // Fallback para DuckDuckGo
      return await this.searchDuckDuckGo(query, maxResults);
    }
  }

  // 🦆 PESQUISA DUCKDUCKGO (Fallback gratuito)
  async searchDuckDuckGo(query, maxResults = 5) {
    try {
      const response = await axios.get('https://api.duckduckgo.com/', {
        params: {
          q: query,
          format: 'json',
          no_html: 1,
          skip_disambig: 1
        },
        timeout: 5000
      });

      const results = [];

      // Abstract (resposta instantânea)
      if (response.data.Abstract) {
        results.push({
          title: response.data.Heading || 'Resposta Instantânea',
          url: response.data.AbstractURL,
          snippet: response.data.Abstract,
          displayUrl: 'DuckDuckGo',
          type: 'instant_answer'
        });
      }

      // Related Topics
      if (response.data.RelatedTopics) {
        response.data.RelatedTopics.slice(0, maxResults - 1).forEach(topic => {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0],
              url: topic.FirstURL,
              snippet: topic.Text,
              displayUrl: new URL(topic.FirstURL).hostname,
              icon: topic.Icon?.URL
            });
          }
        });
      }

      return results.slice(0, maxResults);

    } catch (error) {
      console.error('DuckDuckGo error:', error.message);
      // Fallback para resultados mock
      return this.getMockResults(query);
    }
  }

  // 🤖 ANÁLISE COM GEMINI
  async analyzeWithGemini(query, context) {
    const prompt = `Você é NOW, um assistente inteligente. O usuário perguntou: "${query}"

Aqui estão os resultados da pesquisa na internet:
${context}

Sua tarefa:
1. Analise os resultados
2. Resuma as informações principais em 2-3 parágrafos
3. Seja objetivo e direto
4. Use português brasileiro
5. Cite fontes quando relevante

Resposta:`;

    try {
      const messages = [{ role: 'user', content: prompt }];
      return await geminiService.chat(messages);
    } catch (error) {
      console.error('Gemini analysis error:', error);
      return 'Análise indisponível no momento.';
    }
  }

  // 🤖 ANÁLISE COM OPENAI
  async analyzeWithOpenAI(query, context) {
    const prompt = `Você é NOW, um assistente inteligente. O usuário perguntou: "${query}"

Aqui estão os resultados da pesquisa na internet:
${context}

Sua tarefa:
1. Analise os resultados
2. Resuma as informações principais em 2-3 parágrafos
3. Seja objetivo e direto
4. Use português brasileiro
5. Cite fontes quando relevante

Resposta:`;

    try {
      const messages = [{ role: 'user', content: prompt }];
      return await openaiService.chat(messages);
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      return 'Análise indisponível no momento.';
    }
  }

  // 📝 FORMATAR RESULTADOS PARA IA
  formatResultsForAI(results) {
    return results.map((result, index) => {
      return `[${index + 1}] ${result.title}
URL: ${result.url}
Resumo: ${result.snippet}
---`;
    }).join('\n\n');
  }

  // 🎯 PESQUISA ESPECÍFICA (notícias, imagens, vídeos)
  async searchSpecific(query, type = 'web', options = {}) {
    switch (type) {
      case 'news':
        return await this.searchNews(query, options);
      case 'images':
        return await this.searchImages(query, options);
      case 'videos':
        return await this.searchVideos(query, options);
      default:
        return await this.smartSearch(query, options);
    }
  }

  // 📰 PESQUISA DE NOTÍCIAS
  async searchNews(query, options = {}) {
    const { maxResults = 10, language = 'pt' } = options;

    // Se tiver News API
    const newsApiKey = process.env.NEWS_API_KEY;
    if (newsApiKey) {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: query,
            language: language,
            pageSize: maxResults,
            sortBy: 'publishedAt',
            apiKey: newsApiKey
          }
        });

        return {
          success: true,
          query: query,
          articles: response.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt,
            image: article.urlToImage,
            author: article.author
          })),
          totalResults: response.data.totalResults
        };

      } catch (error) {
        console.error('News API error:', error.message);
      }
    }

    // Fallback para Google News via pesquisa
    const newsQuery = `${query} site:news.google.com OR site:g1.com.br OR site:folha.uol.com.br`;
    const results = await this.searchWeb(newsQuery, maxResults);

    return {
      success: true,
      query: query,
      articles: results,
      source: 'web_scraping'
    };
  }

  // 🖼️ PESQUISA DE IMAGENS
  async searchImages(query, options = {}) {
    const { maxResults = 10 } = options;

    if (!this.googleSearchKey || !this.googleSearchEngineId) {
      return {
        success: false,
        message: 'Google API key não configurada',
        images: []
      };
    }

    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: this.googleSearchKey,
          cx: this.googleSearchEngineId,
          q: query,
          searchType: 'image',
          num: maxResults
        }
      });

      return {
        success: true,
        query: query,
        images: response.data.items?.map(item => ({
          title: item.title,
          url: item.link,
          thumbnail: item.image.thumbnailLink,
          width: item.image.width,
          height: item.image.height,
          context: item.image.contextLink
        })) || []
      };

    } catch (error) {
      console.error('Image search error:', error);
      return {
        success: false,
        error: error.message,
        images: []
      };
    }
  }

  // 🎥 PESQUISA DE VÍDEOS (YouTube)
  async searchVideos(query, options = {}) {
    const { maxResults = 5 } = options;

    // Pesquisar site:youtube.com
    const videoQuery = `${query} site:youtube.com`;
    const results = await this.searchWeb(videoQuery, maxResults);

    return {
      success: true,
      query: query,
      videos: results.map(result => ({
        title: result.title,
        url: result.url,
        snippet: result.snippet,
        thumbnail: result.image,
        source: 'YouTube'
      }))
    };
  }

  // 🎯 RESULTADOS MOCK (para testes sem API)
  getMockResults(query) {
    return [
      {
        title: `Resultados sobre: ${query}`,
        url: 'https://www.google.com/search?q=' + encodeURIComponent(query),
        snippet: `Informações encontradas sobre "${query}". Configure Google Search API para resultados reais.`,
        displayUrl: 'google.com',
        type: 'mock'
      },
      {
        title: `${query} - Wikipédia`,
        url: 'https://pt.wikipedia.org/wiki/' + encodeURIComponent(query),
        snippet: `Artigo da Wikipédia sobre ${query}`,
        displayUrl: 'wikipedia.org',
        type: 'mock'
      }
    ];
  }

  // 📊 PESQUISA COM ANÁLISE COMPARATIVA
  async compareAIAnalysis(query) {
    const results = await this.searchWeb(query, 5);
    const context = this.formatResultsForAI(results);

    const [geminiAnalysis, openaiAnalysis] = await Promise.all([
      this.analyzeWithGemini(query, context),
      this.analyzeWithOpenAI(query, context)
    ]);

    return {
      success: true,
      query: query,
      results: results,
      analysis: {
        gemini: {
          text: geminiAnalysis,
          model: 'gemini-pro',
          cost: 'GRÁTIS'
        },
        openai: {
          text: openaiAnalysis,
          model: 'gpt-4',
          cost: '~$0.03'
        }
      },
      recommendation: 'Gemini oferece análise gratuita de qualidade similar',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new SearchService();
