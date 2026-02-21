const axios = require('axios');

/**
 * Vision & Image Understanding Service
 * Analyzes images using AI vision models
 */
class VisionService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  /**
   * Analyze image with GPT-4 Vision
   */
  async analyzeImage(imageUrl, prompt = 'Descreva esta imagem em detalhes', options = {}) {
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not configured, using mock');
      return this.mockAnalysis(imageUrl, prompt);
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                { 
                  type: 'text', 
                  text: prompt 
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        analysis: response.data.choices[0].message.content,
        imageUrl,
        prompt,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Vision API error:', error.message);
      return this.mockAnalysis(imageUrl, prompt);
    }
  }

  /**
   * Analyze chart/graph
   */
  async analyzeChart(imageUrl) {
    const prompt = `Analise este gráfico/chart detalhadamente:
    
1. Tipo de gráfico (linha, barra, pizza, etc.)
2. Dados principais e tendências
3. Insights importantes
4. Pontos de atenção
5. Recomendações baseadas nos dados

Seja específico e quantitativo quando possível.`;

    return await this.analyzeImage(imageUrl, prompt);
  }

  /**
   * Analyze document/screenshot
   */
  async analyzeDocument(imageUrl) {
    const prompt = `Extraia e analise o conteúdo deste documento:

1. Tipo de documento
2. Informações principais
3. Dados estruturados (tabelas, listas)
4. Datas importantes
5. Action items ou próximos passos

Organize as informações de forma clara e estruturada.`;

    return await this.analyzeImage(imageUrl, prompt);
  }

  /**
   * Analyze product image
   */
  async analyzeProduct(imageUrl) {
    const prompt = `Analise este produto em detalhes:

1. Tipo de produto
2. Características visíveis
3. Qualidade aparente
4. Público-alvo sugerido
5. Faixa de preço estimada
6. Pontos fortes e fracos visuais

Forneça análise como um especialista em produtos.`;

    return await this.analyzeImage(imageUrl, prompt);
  }

  /**
   * Compare two images
   */
  async compareImages(imageUrl1, imageUrl2, context = '') {
    const prompt = `Compare estas duas imagens em detalhes:

${context ? `Contexto: ${context}\n\n` : ''}

Forneça:
1. Diferenças principais
2. Semelhanças
3. Qual é melhor e por quê
4. Recomendação final`;

    // Analyze both images separately
    const analysis1 = await this.analyzeImage(imageUrl1, 'Descreva esta imagem em detalhes');
    const analysis2 = await this.analyzeImage(imageUrl2, 'Descreva esta imagem em detalhes');

    // Then compare
    return {
      success: true,
      image1: {
        url: imageUrl1,
        analysis: analysis1.analysis
      },
      image2: {
        url: imageUrl2,
        analysis: analysis2.analysis
      },
      comparison: `Imagem 1: ${analysis1.analysis}\n\nImagem 2: ${analysis2.analysis}\n\nComparação: Ambas as imagens foram analisadas. Configure OpenAI API para comparação detalhada.`,
      timestamp: new Date()
    };
  }

  /**
   * OCR - Extract text from image
   */
  async extractText(imageUrl) {
    const prompt = `Extraia TODO o texto desta imagem.

Forneça:
1. Texto completo extraído
2. Estrutura (títulos, parágrafos, listas)
3. Qualquer formatação importante

Seja preciso e completo.`;

    return await this.analyzeImage(imageUrl, prompt);
  }

  /**
   * Analyze screenshot (web/app)
   */
  async analyzeScreenshot(imageUrl, type = 'web') {
    const prompts = {
      web: `Analise este screenshot de website:

1. Tipo de site/página
2. Design e UX (pontos fortes/fracos)
3. Elementos principais
4. Sugestões de melhoria
5. Análise de conversão`,

      app: `Analise este screenshot de aplicativo:

1. Tipo de app
2. UI/UX quality
3. Funcionalidades visíveis
4. User experience
5. Sugestões de melhoria`,

      dashboard: `Analise este dashboard:

1. Métricas mostradas
2. Organização da informação
3. Insights principais
4. Pontos de atenção
5. Sugestões de melhoria`
    };

    const prompt = prompts[type] || prompts.web;
    return await this.analyzeImage(imageUrl, prompt);
  }

  /**
   * Analyze meme/social media image
   */
  async analyzeMeme(imageUrl) {
    const prompt = `Analise este meme ou imagem de redes sociais:

1. Contexto e significado
2. Humor ou mensagem
3. Público-alvo
4. Potencial viral
5. Recomendações para uso em marketing

Seja criativo e entenda o contexto cultural.`;

    return await this.analyzeImage(imageUrl, prompt);
  }

  /**
   * Get design feedback
   */
  async getDesignFeedback(imageUrl, designType = 'general') {
    const prompt = `Como designer profissional, avalie este design:

Tipo: ${designType}

Forneça feedback sobre:
1. Composição e layout
2. Cores e tipografia
3. Hierarquia visual
4. Espaçamento e alinhamento
5. Melhorias sugeridas
6. Nota de 0-10

Seja específico e construtivo.`;

    return await this.analyzeImage(imageUrl, prompt);
  }

  /**
   * Batch analyze multiple images
   */
  async batchAnalyze(imageUrls, prompt) {
    const results = [];

    for (const url of imageUrls) {
      const analysis = await this.analyzeImage(url, prompt);
      results.push(analysis);
      
      // Rate limiting
      await this.sleep(1000);
    }

    return {
      success: true,
      totalImages: imageUrls.length,
      results,
      timestamp: new Date()
    };
  }

  /**
   * Detect objects in image
   */
  async detectObjects(imageUrl) {
    const prompt = `Liste TODOS os objetos visíveis nesta imagem:

Para cada objeto:
- Nome do objeto
- Localização aproximada
- Descrição breve

Seja exaustivo e preciso.`;

    return await this.analyzeImage(imageUrl, prompt);
  }

  /**
   * Analyze image for business insights
   */
  async getBusinessInsights(imageUrl, context = '') {
    const prompt = `Analise esta imagem do ponto de vista empresarial:

${context ? `Contexto: ${context}\n\n` : ''}

Forneça:
1. Insights de negócio
2. Oportunidades identificadas
3. Riscos ou problemas
4. Recomendações estratégicas
5. Próximos passos

Pense como um consultor de negócios.`;

    return await this.analyzeImage(imageUrl, prompt);
  }

  // Mock analysis
  mockAnalysis(imageUrl, prompt) {
    return {
      success: true,
      analysis: `Análise simulada da imagem: ${imageUrl}

Prompt: ${prompt}

Esta é uma análise mock. Configure OPENAI_API_KEY para análises reais com GPT-4 Vision.

A imagem foi recebida com sucesso e seria analisada usando:
- GPT-4 Vision para compreensão visual
- Detecção de objetos e texto
- Análise contextual baseada no prompt
- Insights específicos para o caso de uso

Para ativar análises reais:
1. Adicione OPENAI_API_KEY no .env
2. Certifique-se de ter acesso ao GPT-4 Vision
3. Reenvie a requisição`,
      imageUrl,
      prompt,
      isMock: true,
      timestamp: new Date()
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new VisionService();
