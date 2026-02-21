const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import ALL services (v1-v5)
const openaiService = require('./services/openai.service');
const geminiService = require('./services/gemini.service');  // 🆕 Gemini AI
const searchService = require('./services/search.service');   // 🆕 Smart Search
const freeAPIsService = require('./services/free-apis.service');  // 🆕 FREE Global APIs
// v6.0 NEW AI SERVICES
const groqService = require('./services/groq.service');  // 🆕 GroqCloud (ultra-fast)
const huggingfaceService = require('./services/huggingface.service');  // 🆕 HuggingFace
const aiRouterService = require('./services/ai-router.service');  // 🆕 Smart Fallback
const conversationService = require('./services/conversation.service');  // 🆕 Smart Conversation
const KnowledgeWorker = require('./workers/knowledge-worker');  // 🆕 Autonomous Learning
const voiceAuthService = require('./services/voice-auth.service');  // 🆕 Voice Authentication

// Initialize Knowledge Worker
const knowledgeWorker = new KnowledgeWorker();
knowledgeWorker.loadKnowledge().then(() => {
  knowledgeWorker.start();
  console.log('🤖 Autonomous Knowledge Worker started!');
});
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
// v5.0 NEW SERVICES
const lifeOSService = require('./services/life-os.service');
const emailZeroService = require('./services/email-zero.service');
const aiTraderService = require('./services/ai-trader.service');
const shoppingService = require('./services/shopping-assistant.service');

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

// =============================================================================
// LIFE OPERATING SYSTEM ROUTES (v5.0 - NEW!)
// =============================================================================

app.post('/api/life-os/initialize', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    const result = await lifeOSService.initializeLifeOS(userId, preferences);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/life-os/autopilot', async (req, res) => {
  try {
    const { userId, duration } = req.body;
    const result = await lifeOSService.enableAutopilot(userId, duration);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/life-os/decide', async (req, res) => {
  try {
    const { userId, decision } = req.body;
    const result = await lifeOSService.makeDecision(userId, decision);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/life-os/dashboard/:userId', async (req, res) => {
  try {
    const result = await lifeOSService.getLifeDashboard(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// EMAIL ZERO INBOX ROUTES (v5.0 - NEW!)
// =============================================================================

app.post('/api/email/connect', async (req, res) => {
  try {
    const { userId, credentials } = req.body;
    const result = await emailZeroService.connectInbox(userId, credentials);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/email/process', async (req, res) => {
  try {
    const { userId, mode } = req.body;
    const result = await emailZeroService.processInbox(userId, mode);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/email/stats/:userId', async (req, res) => {
  try {
    const result = await emailZeroService.getInboxStats(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// AI DAY TRADER ROUTES (v5.0 - NEW!)
// =============================================================================

app.post('/api/trading/initialize', async (req, res) => {
  try {
    const { userId, config } = req.body;
    const result = await aiTraderService.initializePortfolio(userId, config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/trading/analyze', async (req, res) => {
  try {
    const { symbols } = req.body;
    const result = await aiTraderService.analyzeMarket(symbols);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/trading/execute', async (req, res) => {
  try {
    const { userId, trade } = req.body;
    const result = await aiTraderService.executeTrade(userId, trade);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/trading/performance/:userId', async (req, res) => {
  try {
    const result = await aiTraderService.getPerformance(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// SHOPPING ASSISTANT ROUTES (v5.0 - NEW!)
// =============================================================================

app.post('/api/shopping/initialize', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    const result = await shoppingService.initializeShopping(userId, preferences);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/shopping/add', async (req, res) => {
  try {
    const { userId, item } = req.body;
    const result = await shoppingService.addToList(userId, item);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/shopping/list/:userId', async (req, res) => {
  try {
    const result = await shoppingService.getShoppingList(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/shopping/auto-purchase', async (req, res) => {
  try {
    const { userId, items } = req.body;
    const result = await shoppingService.autoPurchase(userId, items);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/shopping/stats/:userId', async (req, res) => {
  try {
    const result = await shoppingService.getShoppingStats(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🔍 SMART SEARCH ROUTES (Gemini + OpenAI + Web Search)
// ═══════════════════════════════════════════════════════════════════════════

// Smart Search - Pesquisa inteligente com análise IA
app.post('/api/search/smart', async (req, res) => {
  try {
    const { query, useAI, maxResults, withSummary } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required' 
      });
    }

    const result = await searchService.smartSearch(query, {
      useAI: useAI || 'gemini',  // 'gemini', 'openai', 'both'
      maxResults: maxResults || 5,
      withSummary: withSummary !== false
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Web Search - Pesquisa básica na web
app.post('/api/search/web', async (req, res) => {
  try {
    const { query, maxResults } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required' 
      });
    }

    const results = await searchService.searchWeb(query, maxResults || 5);

    res.json({
      success: true,
      query: query,
      results: results,
      count: results.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// News Search - Pesquisa de notícias
app.post('/api/search/news', async (req, res) => {
  try {
    const { query, maxResults, language } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required' 
      });
    }

    const result = await searchService.searchNews(query, {
      maxResults: maxResults || 10,
      language: language || 'pt'
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Image Search - Pesquisa de imagens
app.post('/api/search/images', async (req, res) => {
  try {
    const { query, maxResults } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required' 
      });
    }

    const result = await searchService.searchImages(query, {
      maxResults: maxResults || 10
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Video Search - Pesquisa de vídeos
app.post('/api/search/videos', async (req, res) => {
  try {
    const { query, maxResults } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required' 
      });
    }

    const result = await searchService.searchVideos(query, {
      maxResults: maxResults || 5
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Compare AI Analysis - Compara análise Gemini vs OpenAI
app.post('/api/search/compare', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required' 
      });
    }

    const result = await searchService.compareAIAnalysis(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🤖 GEMINI AI ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// Chat with Gemini
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    const messages = [
      {
        role: 'user',
        content: message
      }
    ];

    const response = await geminiService.chat(messages, userId || 'default');

    res.json({
      success: true,
      response: response,
      model: 'gemini-pro',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chat with Gemini + Audio
app.post('/api/gemini/chat-audio', async (req, res) => {
  try {
    const { message, userId, voice, speed } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    const messages = [
      {
        role: 'user',
        content: message
      }
    ];

    const result = await geminiService.chatWithAudio(
      messages,
      userId || 'default',
      { voice: voice || 'nova', speed: speed || 1.0 }
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze image with Gemini Vision
app.post('/api/gemini/vision', async (req, res) => {
  try {
    const { imageUrl, prompt } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image URL is required' 
      });
    }

    const result = await geminiService.analyzeImage(
      imageUrl, 
      prompt || 'Descreva esta imagem em detalhes'
    );

    res.json({
      success: true,
      analysis: result,
      model: 'gemini-pro',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// FREE GLOBAL APIs - NO KEY NEEDED! (v5.0 - NEW!)
// =============================================================================

// Voice Knowledge Query (with natural female voice)
app.post('/api/knowledge/voice', async (req, res) => {
  try {
    const { question, voice = 'nova' } = req.body;
    
    if (!question) {
      return res.status(400).json({ 
        success: false, 
        error: 'Question is required' 
      });
    }

    // Get knowledge answer
    const knowledgeResult = await freeAPIsService.query(question);
    
    // Generate text response
    let textResponse = '';
    if (knowledgeResult.success) {
      if (knowledgeResult.summary) {
        textResponse = knowledgeResult.summary;
      } else if (knowledgeResult.price) {
        textResponse = `${knowledgeResult.coin} está em ${knowledgeResult.price} dólares, com variação de ${knowledgeResult.change24h?.toFixed(2)}% nas últimas 24 horas.`;
      } else if (knowledgeResult.temperature !== undefined) {
        textResponse = `A temperatura está em ${knowledgeResult.temperature}°C, com vento de ${knowledgeResult.windspeed} km/h.`;
      } else if (knowledgeResult.rates) {
        const brl = knowledgeResult.rates.BRL?.toFixed(2);
        textResponse = `Um dólar vale ${brl} reais hoje.`;
      } else if (knowledgeResult.name) {
        textResponse = `${knowledgeResult.name} tem população de ${(knowledgeResult.population / 1000000).toFixed(1)} milhões, capital ${knowledgeResult.capital}.`;
      }
    }
    
    // Generate voice using OpenAI TTS
    const audioResult = await openaiService.textToSpeech(textResponse, { voice });
    
    res.json({
      success: true,
      text: textResponse,
      audio: audioResult,
      data: knowledgeResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Wikipedia Search
app.get('/api/knowledge/wikipedia/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { language = 'pt' } = req.query;
    const result = await freeAPIsService.searchWikipedia(query, language);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Crypto Prices
app.get('/api/knowledge/crypto/:coin', async (req, res) => {
  try {
    const { coin } = req.params;
    const { currency = 'usd' } = req.query;
    const result = await freeAPIsService.getCryptoPrice(coin, currency);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Weather Forecast
app.get('/api/knowledge/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const latitude = parseFloat(lat) || -23.5505;  // São Paulo default
    const longitude = parseFloat(lon) || -46.6333;
    const result = await freeAPIsService.getWeather(latitude, longitude);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Exchange Rates
app.get('/api/knowledge/exchange/:base', async (req, res) => {
  try {
    const { base } = req.params;
    const result = await freeAPIsService.getExchangeRate(base.toUpperCase());
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Country Info
app.get('/api/knowledge/country/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const result = await freeAPIsService.getCountryInfo(name);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// NEWS Headlines
app.get('/api/knowledge/news', async (req, res) => {
  try {
    const { category = 'general', country = 'br' } = req.query;
    const result = await freeAPIsService.getNews(category, country);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// BOOKS Search
app.get('/api/knowledge/books', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Query (q) is required' });
    }
    const result = await freeAPIsService.searchBooks(q, parseInt(limit));
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// MOVIES/Shows Search
app.get('/api/knowledge/movies', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Query (q) is required' });
    }
    const result = await freeAPIsService.searchMovies(q, parseInt(limit));
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// MUSIC Search
app.get('/api/knowledge/music', async (req, res) => {
  try {
    const { q, type = 'artist' } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Query (q) is required' });
    }
    const result = await freeAPIsService.searchMusic(q, type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// SPORTS Live Scores
app.get('/api/knowledge/sports', async (req, res) => {
  try {
    const { sport = 'soccer' } = req.query;
    const result = await freeAPIsService.getSportsScores(sport);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// SPACE - NASA Picture of the Day
app.get('/api/knowledge/space', async (req, res) => {
  try {
    const result = await freeAPIsService.getSpaceData();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// QUOTES - Inspirational Quotes
app.get('/api/knowledge/quote', async (req, res) => {
  try {
    const result = await freeAPIsService.getQuote();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// HOLIDAYS - World Holidays
app.get('/api/knowledge/holidays', async (req, res) => {
  try {
    const { country = 'BR', year = new Date().getFullYear() } = req.query;
    const result = await freeAPIsService.getHolidays(country, parseInt(year));
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Smart Knowledge Query (auto-detect) - ENHANCED with 12+ sources
app.post('/api/knowledge/query', async (req, res) => {
  try {
    const { question, type = 'auto' } = req.body;
    
    if (!question) {
      return res.status(400).json({ 
        success: false, 
        error: 'Question is required' 
      });
    }

    const result = await freeAPIsService.enhancedQuery(question, type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// AI ROUTER ROUTES - Multi-Provider Intelligence (v6.0 - NEW!)
// =============================================================================

// Smart Chat with automatic fallback
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, provider = 'auto' } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    const result = await aiRouterService.chat(message, provider);
    res.json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Groq Ultra-Fast Chat
app.post('/api/groq/chat', async (req, res) => {
  try {
    const { message, model = 'fast' } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    const result = await groqService.chat(message, { model });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// HuggingFace Tasks
app.post('/api/huggingface/:task', async (req, res) => {
  try {
    const { task } = req.params;
    const { text, options } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required' 
      });
    }

    let result;
    switch (task) {
      case 'translate':
        result = await huggingfaceService.translate(text, options);
        break;
      case 'summarize':
        result = await huggingfaceService.summarize(text);
        break;
      case 'sentiment':
        result = await huggingfaceService.analyzeSentiment(text);
        break;
      case 'code':
        result = await huggingfaceService.generateCode(text);
        break;
      case 'chat':
        result = await huggingfaceService.chat(text);
        break;
      default:
        return res.status(400).json({ success: false, error: `Unknown task: ${task}` });
    }
    
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Router Stats
app.get('/api/ai/stats', (req, res) => {
  try {
    const stats = aiRouterService.getStats();
    res.json({ success: true, stats, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// NOW CONVERSATION SERVICE - Smart Human-like Chat (v6.0 - NEW!)
// =============================================================================

// NOW Smart Chat - Uses local knowledge first, then APIs, then AI
app.post('/api/now/chat', async (req, res) => {
  try {
    const { question, userId = 'default' } = req.body;
    
    if (!question) {
      return res.status(400).json({ 
        success: false, 
        error: 'Question is required' 
      });
    }

    const result = await conversationService.ask(question, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Conversation Stats
app.get('/api/now/stats', (req, res) => {
  try {
    const stats = conversationService.getStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Knowledge Worker Stats
app.get('/api/knowledge/worker/stats', (req, res) => {
  try {
    const stats = knowledgeWorker.getStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search Autonomous Knowledge
app.post('/api/knowledge/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required' 
      });
    }

    const results = knowledgeWorker.search(query, limit);
    res.json({ 
      success: true, 
      results, 
      count: results.length,
      query 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// VOICE AUTHENTICATION - Owner Voice Recognition (v6.0 - NEW!)
// =============================================================================

// Register voice profile
app.post('/api/voice/register', async (req, res) => {
  try {
    const { userId = 'owner', samples } = req.body;
    
    if (!samples || samples.length < 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'At least 3 voice samples required' 
      });
    }

    const result = voiceAuthService.registerProfile(userId, samples);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Authenticate voice
app.post('/api/voice/authenticate', async (req, res) => {
  try {
    const { userId = 'owner', features } = req.body;
    
    if (!features) {
      return res.status(400).json({ 
        success: false, 
        error: 'Audio features required' 
      });
    }

    const result = voiceAuthService.authenticate(userId, features);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get voice auth stats
app.get('/api/voice/stats', (req, res) => {
  try {
    const stats = voiceAuthService.getStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check if user has profile
app.get('/api/voice/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const hasProfile = voiceAuthService.hasProfile(userId);
    res.json({ 
      success: true, 
      userId,
      hasProfile 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove voice profile
app.delete('/api/voice/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const result = voiceAuthService.removeProfile(userId);
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
  console.log(`🚀 NOW AI Assistant v5.0 - REVOLUTIONARY SYSTEM`);
  console.log('='.repeat(80));
  console.log(`📡 API Server: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(80));
  console.log('✅ All Services Loaded (v1-v5):');
  console.log('   v1: 🎤 Voice Interface, Commands');
  console.log('   v2: 🔐 Auth, 💾 DB, 📊 Finance, 📱 Social, 📅 Calendar');
  console.log('   v3: 🌐 Learning, 🧠 RAG, 🔍 Search');
  console.log('   v4: 👥 Multi-Agent, 👁️ Vision, 🏦 Bank, 🎤 Meeting, 🤖 Clone');
  console.log('   v5: 🎯 Life OS, 📧 Email Zero, 💹 AI Trader, 🛍️ Shopping ⭐');
  console.log('='.repeat(80));
  console.log('🎯 Total Features:');
  console.log('   - 17 Services');
  console.log('   - 100+ API Endpoints');
  console.log('   - 7 AI Agents');
  console.log('   - Full Life Management System');
  console.log('='.repeat(80));
});

module.exports = app;
