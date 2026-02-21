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
const learningService = require('./services/learning.service');
const ragService = require('./services/rag.service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// =============================================================================
// LEARNING & TRAINING ROUTES (NEW!)
// =============================================================================

// Search internet
app.post('/api/learn/search', async (req, res) => {
  try {
    const { query, depth, sources, realtime } = req.body;
    
    const results = await learningService.searchInternet(query, {
      depth: depth || 5,
      sources: sources || 'all',
      realtime: realtime || false
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Learn from sources
app.post('/api/learn/topic', async (req, res) => {
  try {
    const { topic, sources } = req.body;
    
    const result = await learningService.learnFromSources(
      topic,
      sources || ['news', 'tech']
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Continuous learning
app.post('/api/learn/continuous', async (req, res) => {
  try {
    const { topics } = req.body;
    
    const result = await learningService.continuousLearning(topics);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get learning stats
app.get('/api/learn/stats', (req, res) => {
  const stats = learningService.getStats();
  res.json({ success: true, stats });
});

// Clear knowledge base
app.delete('/api/learn/knowledge', (req, res) => {
  learningService.clearKnowledge();
  res.json({ success: true, message: 'Knowledge base cleared' });
});

// =============================================================================
// RAG (Retrieval-Augmented Generation) ROUTES
// =============================================================================

// Answer with internet context (RAG)
app.post('/api/rag/answer', async (req, res) => {
  try {
    const { question, userId } = req.body;
    
    const answer = await ragService.answerWithContext(question, userId || 'default');
    
    res.json({
      success: true,
      ...answer
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Smart search with AI summary
app.post('/api/rag/smart-search', async (req, res) => {
  try {
    const { query, userId } = req.body;
    
    const result = await ragService.smartSearch(query, userId || 'default');
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Market intelligence with real-time data
app.post('/api/rag/market-intelligence', async (req, res) => {
  try {
    const { symbol, userId } = req.body;
    
    const intelligence = await ragService.getMarketIntelligence(symbol, userId || 'default');
    
    res.json({
      success: true,
      ...intelligence
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Learn specific topic (deep learning)
app.post('/api/rag/learn', async (req, res) => {
  try {
    const { topic, depth } = req.body;
    
    const result = await ragService.learnTopic(topic, depth || 'medium');
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Batch learning
app.post('/api/rag/batch-learn', async (req, res) => {
  try {
    const { topics } = req.body;
    
    const result = await ragService.batchLearn(topics);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start training mode
app.post('/api/rag/train', async (req, res) => {
  try {
    const { schedule } = req.body;
    
    const result = await ragService.startTraining(schedule || 'hourly');
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get RAG stats
app.get('/api/rag/stats', (req, res) => {
  const stats = ragService.getStats();
  res.json({ success: true, stats });
});

// Clear RAG cache
app.delete('/api/rag/cache', (req, res) => {
  ragService.clearCache();
  res.json({ success: true, message: 'RAG cache cleared' });
});

// =============================================================================
// ENHANCED COMMAND (with RAG)
// =============================================================================

// Process Voice Command with RAG
app.post('/api/command/enhanced', async (req, res) => {
  try {
    const { command, userId = 'default', useRag = true } = req.body;
    
    console.log(`Processing enhanced command: ${command}`);
    
    let response;
    
    if (useRag) {
      // Use RAG for better, context-aware responses
      const ragResponse = await ragService.answerWithContext(command, userId);
      response = ragResponse.answer;
      
      // Save conversation with sources
      await databaseService.saveConversation(userId, command, response);
      
      res.json({
        success: true,
        response,
        sources: ragResponse.sources,
        contextUsed: ragResponse.contextUsed,
        timestamp: new Date().toISOString()
      });
    } else {
      // Use simple AI without internet context
      const history = await databaseService.getConversations(userId, 5);
      const messages = history.map(h => ({
        role: 'user',
        content: h.message
      }));
      
      messages.push({
        role: 'user',
        content: command
      });
      
      response = await openaiService.chat(messages, userId);
      await databaseService.saveConversation(userId, command, response);
      
      res.json({
        success: true,
        response,
        contextUsed: false,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Enhanced command error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =============================================================================
// ALL PREVIOUS ROUTES FROM v2 (keeping compatibility)
// =============================================================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    version: 'v3.0',
    timestamp: new Date().toISOString(),
    services: {
      openai: !!process.env.OPENAI_API_KEY,
      database: databaseService.connected,
      finance: true,
      social: true,
      calendar: !!process.env.GOOGLE_CLIENT_ID,
      learning: true,      // NEW
      rag: true            // NEW
    },
    features: {
      internetSearch: true,
      continuousLearning: true,
      ragAnswers: true,
      smartSearch: true,
      marketIntelligence: true
    }
  });
});

// Authentication routes (from v2)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});

app.get('/api/auth/me', authService.authMiddleware(), async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Command (original - still works)
app.post('/api/command', async (req, res) => {
  try {
    const { command, userId = 'default' } = req.body;
    
    const history = await databaseService.getConversations(userId, 5);
    const messages = history.map(h => ({
      role: 'user',
      content: h.message
    }));
    
    messages.push({
      role: 'user',
      content: command
    });
    
    const response = await openaiService.chat(messages, userId);
    await databaseService.saveConversation(userId, command, response);
    
    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Finance routes (from v2)
app.get('/api/finance/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await financeService.getQuote(symbol);
    res.json({ success: true, quote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/finance/market', async (req, res) => {
  try {
    const summary = await financeService.getMarketSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/finance/crypto', async (req, res) => {
  try {
    const cryptos = await financeService.getTopCryptos();
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Social media routes (from v2)
app.post('/api/social/post', async (req, res) => {
  try {
    const { content, platforms, userId = 'default' } = req.body;
    const result = await socialService.postToMultiplePlatforms(content, platforms, userId);
    await databaseService.saveSocialPost(userId, { content, platforms, result });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Calendar routes (from v2)
app.get('/api/calendar/events', async (req, res) => {
  try {
    const { accessToken, timeMin, timeMax } = req.query;
    const result = await calendarService.getEvents(accessToken, timeMin, timeMax);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ... (include all other v2 routes here for compatibility)

// Serve Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log('='.repeat(70));
  console.log('🚀 NOW AI Assistant v3.0 - WITH INTERNET LEARNING');
  console.log('='.repeat(70));
  console.log(`📡 API Server: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(70));
  console.log('✅ All Services Loaded:');
  console.log('   🧠 OpenAI Integration');
  console.log('   🔐 Authentication (JWT)');
  console.log('   💾 Database Service');
  console.log('   📊 Finance API (Yahoo)');
  console.log('   📱 Social Media API');
  console.log('   📅 Google Calendar');
  console.log('   🌐 Internet Learning (NEW!)');
  console.log('   🎓 RAG System (NEW!)');
  console.log('   🔍 Smart Search (NEW!)');
  console.log('='.repeat(70));
  console.log('🎓 Learning Features:');
  console.log('   - Search entire internet');
  console.log('   - Continuous learning');
  console.log('   - Context-aware answers (RAG)');
  console.log('   - Market intelligence');
  console.log('   - Smart summaries');
  console.log('='.repeat(70));
});

module.exports = app;
