const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Mock Database (replace with real database)
const memory = {
  userPreferences: {},
  schedule: [],
  memories: []
};

// Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// Process Voice Command
app.post('/api/command', async (req, res) => {
  try {
    const { command, userId = 'default' } = req.body;
    
    console.log(`Processing command: ${command}`);
    
    // Process command with AI (mock for now)
    const response = await processWithAI(command, userId);
    
    // Store in memory
    memory.memories.push({
      timestamp: new Date(),
      command,
      response,
      userId
    });
    
    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Command processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get User Schedule
app.get('/api/schedule/:userId?', (req, res) => {
  const userId = req.params.userId || 'default';
  
  const userSchedule = memory.schedule.filter(item => item.userId === userId);
  
  res.json({
    success: true,
    schedule: userSchedule,
    count: userSchedule.length
  });
});

// Add Schedule Item
app.post('/api/schedule', (req, res) => {
  const { title, datetime, description, userId = 'default' } = req.body;
  
  const scheduleItem = {
    id: Date.now().toString(),
    userId,
    title,
    datetime,
    description,
    created: new Date()
  };
  
  memory.schedule.push(scheduleItem);
  
  res.json({
    success: true,
    item: scheduleItem
  });
});

// Get News (mock - integrate real API)
app.get('/api/news/:category?', async (req, res) => {
  const category = req.params.category || 'general';
  
  // Mock news data (replace with real API like NewsAPI)
  const mockNews = [
    {
      title: 'Mercado de ações fecha em alta',
      source: 'Financial Times',
      summary: 'Índices principais sobem 2.5% com otimismo sobre tecnologia',
      category: 'finance',
      url: '#'
    },
    {
      title: 'Bitcoin atinge novo recorde',
      source: 'Crypto News',
      summary: 'Criptomoeda valoriza 15% em uma semana',
      category: 'finance',
      url: '#'
    },
    {
      title: 'IA transforma setor empresarial',
      source: 'Tech Today',
      summary: '75% das empresas adotam assistentes virtuais',
      category: 'technology',
      url: '#'
    }
  ];
  
  res.json({
    success: true,
    news: mockNews.filter(n => category === 'general' || n.category === category),
    category
  });
});

// Get Financial Data (mock)
app.get('/api/finance/:symbol?', async (req, res) => {
  const symbol = req.params.symbol || 'MARKET';
  
  // Mock financial data (integrate with real API like Yahoo Finance)
  const mockData = {
    symbol: symbol,
    price: 152.30,
    change: '+3.2%',
    marketCap: '2.5T',
    volume: '85M',
    timestamp: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockData
  });
});

// Social Media - Create Post (mock)
app.post('/api/social/post', async (req, res) => {
  const { content, platforms, userId = 'default' } = req.body;
  
  // Mock posting (integrate with real social media APIs)
  const post = {
    id: Date.now().toString(),
    userId,
    content,
    platforms: platforms || ['twitter', 'linkedin'],
    scheduled: new Date(),
    status: 'pending'
  };
  
  console.log('Creating social media post:', post);
  
  res.json({
    success: true,
    post,
    message: 'Post agendado com sucesso'
  });
});

// Memory - Get User Preferences
app.get('/api/memory/:userId?', (req, res) => {
  const userId = req.params.userId || 'default';
  
  res.json({
    success: true,
    preferences: memory.userPreferences[userId] || {},
    memories: memory.memories.filter(m => m.userId === userId).slice(-10)
  });
});

// Memory - Update User Preferences
app.post('/api/memory', (req, res) => {
  const { userId = 'default', preferences } = req.body;
  
  memory.userPreferences[userId] = {
    ...memory.userPreferences[userId],
    ...preferences,
    updated: new Date()
  };
  
  res.json({
    success: true,
    preferences: memory.userPreferences[userId]
  });
});

// AI Processing Function (Mock)
async function processWithAI(command, userId) {
  // This is a mock function - integrate with OpenAI, Claude, or other AI API
  const lowerCommand = command.toLowerCase();
  
  // Command patterns
  if (lowerCommand.includes('bom dia')) {
    const date = new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return `Bom dia! Hoje é ${date}. Sua agenda está organizada. Você tem 2 compromissos prioritários hoje.`;
  }
  
  if (lowerCommand.includes('agenda') || lowerCommand.includes('organiza')) {
    return 'Organizando sua agenda... Você tem reunião de estratégia às 10h e análise financeira às 15h. Deseja mais detalhes?';
  }
  
  if (lowerCommand.includes('notícia') || lowerCommand.includes('noticia') || lowerCommand.includes('investimento')) {
    return 'Analisando mercado... Bitcoin +3.2%, ações de tecnologia em alta. Detectei 2 oportunidades de investimento. Deseja relatório completo?';
  }
  
  if (lowerCommand.includes('post') || lowerCommand.includes('redes sociais')) {
    return 'Criando post sobre sua área de atuação... Sugestão pronta. Deseja revisar antes de publicar?';
  }
  
  if (lowerCommand.includes('viagem') || lowerCommand.includes('viajar')) {
    return 'Analisando suas preferências de viagem... Encontrei 3 destinos alinhados com seu perfil. Deseja detalhes?';
  }
  
  if (lowerCommand.includes('boa noite')) {
    return 'Boa noite! Hoje você completou 4 de 5 tarefas prioritárias. Amanhã sugiro focar em análise estratégica. Descanso produtivo!';
  }
  
  if (lowerCommand.includes('código') || lowerCommand.includes('site') || lowerCommand.includes('criar')) {
    return 'Posso criar código para você. Especifique: aplicativo web, API, dashboard, ou outro tipo de sistema?';
  }
  
  // Default response
  return 'Entendi sua solicitação. Estou processando e organizando as informações. Como posso ajudar especificamente?';
}

// Serve Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 NOW AI Assistant running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
});

module.exports = app;
