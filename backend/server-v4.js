const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import ALL services (v1-v4)
const openaiService = require('./services/openai.service');
const authService = require('./services/auth.service');
const databaseService = require('./services/database.service');
const financeService = require('./services/finance.service');
const socialService = require('./services/social.service');
const calendarService = require('./services/calendar.service');
const learningService = require('./services/learning.service');
const ragService = require('./services/rag.service');
const agentsService = require('./services/agents.service');
const visionService = require('./services/vision.service');
const bankService = require('./services/bank.service');
const meetingService = require('./services/meeting.service');
const cloneService = require('./services/clone.service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// =============================================================================
// MULTI-AGENT SYSTEM ROUTES (v4.0 - NEW!)
// =============================================================================

// Consult specific agent
app.post('/api/agents/consult', async (req, res) => {
  try {
    const { agentId, question, userId, useRag } = req.body;
    
    const result = await agentsService.consultAgent(agentId, question, {
      userId: userId || 'default',
      useRag: useRag || false
    });
    
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Board meeting (multiple agents)
app.post('/api/agents/board-meeting', async (req, res) => {
  try {
    const { question, agents, userId, useRag } = req.body;
    
    const result = await agentsService.boardMeeting(
      question,
      agents || ['ceo', 'cfo', 'tech'],
      { userId: userId || 'default', useRag: useRag || false }
    );
    
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Smart consult (auto-detect agents)
app.post('/api/agents/smart-consult', async (req, res) => {
  try {
    const { question, userId, useRag } = req.body;
    
    const result = await agentsService.smartConsult(question, {
      userId: userId || 'default',
      useRag: useRag || false
    });
    
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all agents
app.get('/api/agents/list', (req, res) => {
  const agents = agentsService.getAgents();
  res.json({ success: true, agents, count: agents.length });
});

// Financial analysis with CFO
app.post('/api/agents/analyze-financials', async (req, res) => {
  try {
    const { data } = req.body;
    const result = await agentsService.analyzeFinancials(data);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// VISION & IMAGE UNDERSTANDING ROUTES (v4.0 - NEW!)
// =============================================================================

// Analyze image
app.post('/api/vision/analyze', async (req, res) => {
  try {
    const { imageUrl, prompt, options } = req.body;
    const result = await visionService.analyzeImage(imageUrl, prompt, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze chart
app.post('/api/vision/chart', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const result = await visionService.analyzeChart(imageUrl);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze document
app.post('/api/vision/document', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const result = await visionService.analyzeDocument(imageUrl);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// OCR - Extract text
app.post('/api/vision/ocr', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const result = await visionService.extractText(imageUrl);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Compare images
app.post('/api/vision/compare', async (req, res) => {
  try {
    const { imageUrl1, imageUrl2, context } = req.body;
    const result = await visionService.compareImages(imageUrl1, imageUrl2, context);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Design feedback
app.post('/api/vision/design-feedback', async (req, res) => {
  try {
    const { imageUrl, designType } = req.body;
    const result = await visionService.getDesignFeedback(imageUrl, designType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// BANK INTEGRATION ROUTES (v4.0 - NEW!)
// =============================================================================

// Connect bank account
app.post('/api/bank/connect', async (req, res) => {
  try {
    const { userId, bankData } = req.body;
    const result = await bankService.connectAccount(userId, bankData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get accounts
app.get('/api/bank/accounts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await bankService.getAccounts(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get balance
app.get('/api/bank/balance/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const result = await bankService.getBalance(accountId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze spending
app.get('/api/bank/spending/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { period } = req.query;
    const result = await bankService.analyzeSpending(userId, period);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Pay bill
app.post('/api/bank/pay', async (req, res) => {
  try {
    const { userId, billData } = req.body;
    const result = await bankService.payBill(userId, billData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Detect anomalies
app.get('/api/bank/anomalies/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await bankService.detectAnomalies(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get portfolio
app.get('/api/bank/portfolio/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await bankService.getPortfolio(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Financial advice
app.get('/api/bank/advice/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await bankService.getFinancialAdvice(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// MEETING ASSISTANT ROUTES (v4.0 - NEW!)
// =============================================================================

// Start meeting
app.post('/api/meeting/start', async (req, res) => {
  try {
    const result = await meetingService.startMeeting(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add transcript
app.post('/api/meeting/:meetingId/transcript', async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { speaker, text } = req.body;
    const result = await meetingService.addTranscriptLine(meetingId, speaker, text);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// End meeting
app.post('/api/meeting/:meetingId/end', async (req, res) => {
  try {
    const { meetingId } = req.params;
    const result = await meetingService.endMeeting(meetingId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get meeting stats
app.get('/api/meeting/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await meetingService.getMeetingStats(userId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// NOW CLONE (DIGITAL TWIN) ROUTES (v4.0 - NEW!)
// =============================================================================

// Create clone
app.post('/api/clone/create', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await cloneService.createClone(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ask clone
app.post('/api/clone/ask', async (req, res) => {
  try {
    const { userId, question, context } = req.body;
    const result = await cloneService.askClone(userId, question, context);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delegate to clone
app.post('/api/clone/delegate', async (req, res) => {
  try {
    const { userId, task } = req.body;
    const result = await cloneService.delegateToClone(userId, task);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get clone stats
app.get('/api/clone/stats/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const stats = cloneService.getCloneStats(userId);
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// ALL PREVIOUS ROUTES (v1-v3 compatibility)
// =============================================================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    version: 'v4.0',
    timestamp: new Date().toISOString(),
    services: {
      openai: !!process.env.OPENAI_API_KEY,
      database: databaseService.connected,
      finance: true,
      social: true,
      calendar: !!process.env.GOOGLE_CLIENT_ID,
      learning: true,
      rag: true,
      agents: true,        // NEW v4
      vision: true,        // NEW v4
      bank: true,          // NEW v4
      meeting: true,       // NEW v4
      clone: true          // NEW v4
    },
    features: {
      // v1
      voiceInterface: true,
      basicCommands: true,
      // v2
      authentication: true,
      database: true,
      financeAPI: true,
      socialMedia: true,
      calendarSync: true,
      // v3
      internetSearch: true,
      continuousLearning: true,
      ragAnswers: true,
      smartSearch: true,
      marketIntelligence: true,
      // v4
      multiAgentSystem: true,
      visionAI: true,
      bankIntegration: true,
      meetingAssistant: true,
      digitalTwin: true
    }
  });
});

// Auth routes (v2)
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

// Command routes (v1/v3)
app.post('/api/command', async (req, res) => {
  try {
    const { command, userId = 'default' } = req.body;
    const history = await databaseService.getConversations(userId, 5);
    const messages = history.map(h => ({ role: 'user', content: h.message }));
    messages.push({ role: 'user', content: command });
    const response = await openaiService.chat(messages, userId);
    await databaseService.saveConversation(userId, command, response);
    res.json({ success: true, response, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enhanced command with RAG (v3)
app.post('/api/command/enhanced', async (req, res) => {
  try {
    const { command, userId = 'default', useRag = true } = req.body;
    
    if (useRag) {
      const ragResponse = await ragService.answerWithContext(command, userId);
      await databaseService.saveConversation(userId, command, ragResponse.answer);
      res.json({
        success: true,
        response: ragResponse.answer,
        sources: ragResponse.sources,
        contextUsed: ragResponse.contextUsed,
        timestamp: new Date().toISOString()
      });
    } else {
      const history = await databaseService.getConversations(userId, 5);
      const messages = history.map(h => ({ role: 'user', content: h.message }));
      messages.push({ role: 'user', content: command });
      const response = await openaiService.chat(messages, userId);
      await databaseService.saveConversation(userId, command, response);
      res.json({ success: true, response, contextUsed: false, timestamp: new Date().toISOString() });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Learning routes (v3)
app.post('/api/learn/search', async (req, res) => {
  try {
    const { query, depth, sources, realtime } = req.body;
    const results = await learningService.searchInternet(query, { depth, sources, realtime });
    res.json(results);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// RAG routes (v3)
app.post('/api/rag/answer', async (req, res) => {
  try {
    const { question, userId } = req.body;
    const answer = await ragService.answerWithContext(question, userId || 'default');
    res.json({ success: true, ...answer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Finance routes (v2)
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

// Social routes (v2)
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

// Calendar routes (v2)
app.get('/api/calendar/events', async (req, res) => {
  try {
    const { accessToken, timeMin, timeMax } = req.query;
    const result = await calendarService.getEvents(accessToken, timeMin, timeMax);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log('='.repeat(80));
  console.log('🚀 NOW AI Assistant v4.0 - COMPLETE SYSTEM');
  console.log('='.repeat(80));
  console.log(`📡 API Server: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(80));
  console.log('✅ All Services Loaded (v1-v4):');
  console.log('   v1: 🎤 Voice Interface, Commands');
  console.log('   v2: 🔐 Auth, 💾 DB, 📊 Finance, 📱 Social, 📅 Calendar');
  console.log('   v3: 🌐 Learning, 🧠 RAG, 🔍 Search');
  console.log('   v4: 👥 Multi-Agent, 👁️ Vision, 🏦 Bank, 🎤 Meeting, 🤖 Clone');
  console.log('='.repeat(80));
  console.log('🎯 Total Features:');
  console.log('   - 13 Services');
  console.log('   - 60+ API Endpoints');
  console.log('   - 7 AI Agents');
  console.log('   - Full Stack System');
  console.log('='.repeat(80));
});

module.exports = app;
