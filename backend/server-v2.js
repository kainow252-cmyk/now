const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import all services
const openaiService = require('./services/openai.service');
const authService = require('./services/auth.service');
const databaseService = require('./services/database.service');
const financeService = require('./services/finance.service');
const socialService = require('./services/social.service');
const calendarService = require('./services/calendar.service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// =============================================================================
// AUTHENTICATION ROUTES
// =============================================================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});

// Get current user (protected)
app.get('/api/auth/me', authService.authMiddleware(), async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// AI / COMMAND ROUTES
// =============================================================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    services: {
      openai: !!process.env.OPENAI_API_KEY,
      database: databaseService.connected,
      finance: true,
      social: true,
      calendar: !!process.env.GOOGLE_CLIENT_ID
    }
  });
});

// Process Voice Command (with AI)
app.post('/api/command', async (req, res) => {
  try {
    const { command, userId = 'default' } = req.body;
    
    console.log(`Processing command: ${command}`);
    
    // Get conversation history for context
    const history = await databaseService.getConversations(userId, 5);
    const messages = history.map(h => ({
      role: 'user',
      content: h.message
    }));
    
    messages.push({
      role: 'user',
      content: command
    });
    
    // Get AI response
    const response = await openaiService.chat(messages, userId);
    
    // Save conversation
    await databaseService.saveConversation(userId, command, response);
    
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

// Generate Content (for social media, emails, etc.)
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, type } = req.body;
    const content = await openaiService.generateContent(prompt, type);
    
    res.json({
      success: true,
      content,
      type
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// CALENDAR ROUTES
// =============================================================================

// Get events
app.get('/api/calendar/events', async (req, res) => {
  try {
    const { accessToken, timeMin, timeMax } = req.query;
    const result = await calendarService.getEvents(accessToken, timeMin, timeMax);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create event
app.post('/api/calendar/events', async (req, res) => {
  try {
    const { accessToken, eventData } = req.body;
    const result = await calendarService.createEvent(accessToken, eventData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Find available slots
app.get('/api/calendar/available', async (req, res) => {
  try {
    const { accessToken, date, duration } = req.query;
    const result = await calendarService.findAvailableSlots(accessToken, date, parseInt(duration));
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Detect conflicts
app.post('/api/calendar/conflicts', async (req, res) => {
  try {
    const { accessToken, proposedEvent } = req.body;
    const result = await calendarService.detectConflicts(accessToken, proposedEvent);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// FINANCE ROUTES
// =============================================================================

// Get stock quote
app.get('/api/finance/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await financeService.getQuote(symbol);
    res.json({ success: true, quote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get market summary
app.get('/api/finance/market', async (req, res) => {
  try {
    const summary = await financeService.getMarketSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get crypto prices
app.get('/api/finance/crypto', async (req, res) => {
  try {
    const cryptos = await financeService.getTopCryptos();
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze stock
app.get('/api/finance/analyze/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const analysis = await financeService.analyzeStock(symbol);
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// SOCIAL MEDIA ROUTES
// =============================================================================

// Post to social media
app.post('/api/social/post', async (req, res) => {
  try {
    const { content, platforms, userId = 'default' } = req.body;
    const result = await socialService.postToMultiplePlatforms(content, platforms, userId);
    
    // Save to database
    await databaseService.saveSocialPost(userId, {
      content,
      platforms,
      result
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Schedule post
app.post('/api/social/schedule', async (req, res) => {
  try {
    const { content, platforms, scheduledTime, userId = 'default' } = req.body;
    const result = await socialService.schedulePost(content, platforms, scheduledTime, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate post content
app.post('/api/social/generate', async (req, res) => {
  try {
    const { topic, style = 'professional' } = req.body;
    const content = await socialService.generatePostContent(topic, style);
    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get post analytics
app.get('/api/social/analytics/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { platform } = req.query;
    const analytics = await socialService.analyzePostPerformance(postId, platform);
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get recent posts
app.get('/api/social/posts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { platform, limit } = req.query;
    const posts = await databaseService.getSocialPosts(userId, parseInt(limit) || 20);
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// DATABASE / MEMORY ROUTES
// =============================================================================

// Get user stats
app.get('/api/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await databaseService.getStats(userId);
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get memories
app.get('/api/memory/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    const memories = await databaseService.getMemories(userId, parseInt(limit) || 10);
    res.json({ success: true, memories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update preferences
app.post('/api/preferences', async (req, res) => {
  try {
    const { userId = 'default', preferences } = req.body;
    const updated = await databaseService.updatePreferences(userId, preferences);
    res.json({ success: true, preferences: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get preferences
app.get('/api/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await databaseService.getPreferences(userId);
    res.json({ success: true, preferences });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// LEGACY ROUTES (backwards compatibility)
// =============================================================================

// Get User Schedule
app.get('/api/schedule/:userId?', async (req, res) => {
  try {
    const userId = req.params.userId || 'default';
    const schedules = await databaseService.getSchedules(userId);
    res.json({ success: true, schedule: schedules, count: schedules.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add Schedule Item
app.post('/api/schedule', async (req, res) => {
  try {
    const { title, datetime, description, userId = 'default' } = req.body;
    const schedule = await databaseService.createSchedule(userId, {
      title,
      datetime,
      description
    });
    res.json({ success: true, item: schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get News
app.get('/api/news/:category?', async (req, res) => {
  const category = req.params.category || 'general';
  
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

// =============================================================================
// SERVE FRONTEND
// =============================================================================

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// =============================================================================
// START SERVER
// =============================================================================

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 NOW AI Assistant v2.0 - FULL STACK');
  console.log('='.repeat(60));
  console.log(`📡 API Server: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(60));
  console.log('✅ Services Loaded:');
  console.log('   🧠 OpenAI Integration');
  console.log('   🔐 Authentication (JWT)');
  console.log('   💾 Database Service');
  console.log('   📊 Finance API (Yahoo)');
  console.log('   📱 Social Media API');
  console.log('   📅 Google Calendar');
  console.log('='.repeat(60));
});

module.exports = app;
