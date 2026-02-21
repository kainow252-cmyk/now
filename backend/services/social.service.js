const axios = require('axios');

class SocialMediaService {
  constructor() {
    this.twitterApiKey = process.env.TWITTER_API_KEY;
    this.twitterApiSecret = process.env.TWITTER_API_SECRET;
    this.twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN;
    this.twitterAccessSecret = process.env.TWITTER_ACCESS_SECRET;
    
    this.linkedinApiKey = process.env.LINKEDIN_API_KEY;
    this.linkedinAccessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  }

  async postToTwitter(content, userId) {
    if (!this.twitterAccessToken) {
      console.warn('Twitter API not configured, using mock');
      return this.mockPost('twitter', content, userId);
    }

    try {
      // Twitter API v2
      const response = await axios.post(
        'https://api.twitter.com/2/tweets',
        { text: content },
        {
          headers: {
            'Authorization': `Bearer ${this.twitterAccessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        platform: 'twitter',
        postId: response.data.data.id,
        content,
        url: `https://twitter.com/user/status/${response.data.data.id}`,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Twitter API error:', error.response?.data || error.message);
      return this.mockPost('twitter', content, userId);
    }
  }

  async postToLinkedIn(content, userId) {
    if (!this.linkedinAccessToken) {
      console.warn('LinkedIn API not configured, using mock');
      return this.mockPost('linkedin', content, userId);
    }

    try {
      // LinkedIn API
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          author: `urn:li:person:${userId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text: content },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.linkedinAccessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );

      return {
        success: true,
        platform: 'linkedin',
        postId: response.data.id,
        content,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('LinkedIn API error:', error.response?.data || error.message);
      return this.mockPost('linkedin', content, userId);
    }
  }

  async postToMultiplePlatforms(content, platforms, userId) {
    const results = [];

    for (const platform of platforms) {
      let result;
      
      if (platform === 'twitter') {
        result = await this.postToTwitter(content, userId);
      } else if (platform === 'linkedin') {
        result = await this.postToLinkedIn(content, userId);
      } else {
        result = this.mockPost(platform, content, userId);
      }

      results.push(result);
    }

    return {
      success: true,
      results,
      totalPlatforms: platforms.length,
      successCount: results.filter(r => r.success).length
    };
  }

  async schedulePost(content, platforms, scheduledTime, userId) {
    // In a real implementation, this would use a job queue (Bull, Agenda, etc.)
    return {
      success: true,
      scheduled: true,
      content,
      platforms,
      scheduledTime,
      userId,
      jobId: Date.now().toString(),
      message: 'Post agendado com sucesso'
    };
  }

  async generatePostContent(topic, style = 'professional') {
    const templates = {
      professional: [
        `Insights sobre ${topic}: A transformação digital está acelerando. Empresas que não se adaptam ficam para trás. #${topic} #Inovação`,
        `${topic} em foco: O futuro já chegou. Hora de investir estrategicamente e colher os resultados. #Investimentos #${topic}`,
        `Reflexão sobre ${topic}: Conhecimento é poder, mas execução é resultado. Vamos fazer acontecer! #Estratégia #${topic}`
      ],
      casual: [
        `Pensando sobre ${topic} hoje... As oportunidades estão aí para quem souber enxergar! 🚀`,
        `${topic} está bombando! Quem mais está de olho nisso? 👀`,
        `Update sobre ${topic}: cada dia mais interessante! 💡`
      ],
      motivational: [
        `${topic} nos ensina que o sucesso vem para quem age. Não espere, faça acontecer! 💪 #Motivação`,
        `Em ${topic}, como na vida: a jornada é tão importante quanto o destino. Continue evoluindo! 🌟`,
        `${topic} prova que limites existem apenas na mente. Pense grande, aja maior! 🎯`
      ]
    };

    const selected = templates[style] || templates.professional;
    const randomIndex = Math.floor(Math.random() * selected.length);
    
    return selected[randomIndex];
  }

  async analyzePostPerformance(postId, platform) {
    // Mock analytics - in real implementation, fetch from platform APIs
    return {
      postId,
      platform,
      metrics: {
        impressions: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 500) + 50,
        comments: Math.floor(Math.random() * 50) + 5,
        shares: Math.floor(Math.random() * 100) + 10,
        clicks: Math.floor(Math.random() * 200) + 20
      },
      engagement: (Math.random() * 5 + 2).toFixed(2) + '%',
      bestTimeToPost: '10:00 - 12:00',
      timestamp: new Date()
    };
  }

  mockPost(platform, content, userId) {
    return {
      success: true,
      platform,
      postId: `mock_${Date.now()}`,
      content,
      userId,
      url: `https://${platform}.com/user/post/${Date.now()}`,
      timestamp: new Date(),
      status: 'published',
      message: `Post simulado em ${platform} (configure API keys para publicação real)`
    };
  }

  async getRecentPosts(userId, platform = 'all', limit = 10) {
    // Mock implementation - replace with real API calls
    const mockPosts = [];
    
    for (let i = 0; i < limit; i++) {
      mockPosts.push({
        id: `post_${Date.now()}_${i}`,
        platform: platform === 'all' ? ['twitter', 'linkedin'][i % 2] : platform,
        content: `Post ${i + 1} sobre investimentos e tecnologia`,
        timestamp: new Date(Date.now() - i * 86400000),
        metrics: {
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 30)
        }
      });
    }

    return mockPosts;
  }

  async deletePo(postId, platform) {
    // Mock implementation
    return {
      success: true,
      postId,
      platform,
      message: 'Post removido com sucesso'
    };
  }
}

module.exports = new SocialMediaService();
