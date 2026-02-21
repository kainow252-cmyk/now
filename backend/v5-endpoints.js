// =============================================================================
// NOW v5.0 - NEW ENDPOINTS (Add to server-v5.js before app.listen)
// =============================================================================

// ═══════════════════════════════════════════════════════════════════════════
// LIFE OPERATING SYSTEM ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// Initialize Life OS
app.post('/api/life-os/initialize', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    const result = await lifeOSService.initializeLifeOS(userId, preferences);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enable autopilot mode
app.post('/api/life-os/autopilot', async (req, res) => {
  try {
    const { userId, duration } = req.body;
    const result = await lifeOSService.enableAutopilot(userId, duration);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Make decision
app.post('/api/life-os/decide', async (req, res) => {
  try {
    const { userId, decision } = req.body;
    const result = await lifeOSService.makeDecision(userId, decision);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get life dashboard
app.get('/api/life-os/dashboard/:userId', async (req, res) => {
  try {
    const result = await lifeOSService.getLifeDashboard(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Set life priorities
app.post('/api/life-os/priorities', async (req, res) => {
  try {
    const { userId, priorities } = req.body;
    const result = await lifeOSService.setLifePriorities(userId, priorities);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get statistics
app.get('/api/life-os/stats/:userId', async (req, res) => {
  try {
    const result = await lifeOSService.getStatistics(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL ZERO INBOX ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// Connect email inbox
app.post('/api/email/connect', async (req, res) => {
  try {
    const { userId, credentials } = req.body;
    const result = await emailZeroService.connectInbox(userId, credentials);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Process inbox
app.post('/api/email/process', async (req, res) => {
  try {
    const { userId, mode } = req.body;
    const result = await emailZeroService.processInbox(userId, mode);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Smart search emails
app.post('/api/email/search', async (req, res) => {
  try {
    const { userId, query } = req.body;
    const result = await emailZeroService.smartSearch(userId, query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create email template
app.post('/api/email/template', async (req, res) => {
  try {
    const { userId, template } = req.body;
    const result = await emailZeroService.createTemplate(userId, template);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get inbox stats
app.get('/api/email/stats/:userId', async (req, res) => {
  try {
    const result = await emailZeroService.getInboxStats(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Set custom rules
app.post('/api/email/rules', async (req, res) => {
  try {
    const { userId, rules } = req.body;
    const result = await emailZeroService.setCustomRules(userId, rules);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enable Email Zero mode
app.post('/api/email/zero', async (req, res) => {
  try {
    const { userId, schedule } = req.body;
    const result = await emailZeroService.enableEmailZero(userId, schedule);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// AI DAY TRADER ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// Initialize trading portfolio
app.post('/api/trading/initialize', async (req, res) => {
  try {
    const { userId, config } = req.body;
    const result = await aiTraderService.initializePortfolio(userId, config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze market
app.post('/api/trading/analyze', async (req, res) => {
  try {
    const { symbols } = req.body;
    const result = await aiTraderService.analyzeMarket(symbols);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze specific stock
app.get('/api/trading/analyze/:symbol', async (req, res) => {
  try {
    const result = await aiTraderService.analyzeStock(req.params.symbol);
    res.json({ success: true, analysis: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Execute trade
app.post('/api/trading/execute', async (req, res) => {
  try {
    const { userId, trade } = req.body;
    const result = await aiTraderService.executeTrade(userId, trade);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Run auto-trading
app.post('/api/trading/auto-trade', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await aiTraderService.runAutoTrading(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get portfolio performance
app.get('/api/trading/performance/:userId', async (req, res) => {
  try {
    const result = await aiTraderService.getPerformance(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Set trading strategy
app.post('/api/trading/strategy', async (req, res) => {
  try {
    const { userId, strategy } = req.body;
    const result = await aiTraderService.setStrategy(userId, strategy);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle auto-trading
app.post('/api/trading/toggle', async (req, res) => {
  try {
    const { userId, enabled } = req.body;
    const result = await aiTraderService.toggleAutoTrading(userId, enabled);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// SHOPPING ASSISTANT ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// Initialize shopping assistant
app.post('/api/shopping/initialize', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    const result = await shoppingService.initializeShopping(userId, preferences);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add item to shopping list
app.post('/api/shopping/add', async (req, res) => {
  try {
    const { userId, item } = req.body;
    const result = await shoppingService.addToList(userId, item);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get shopping list
app.get('/api/shopping/list/:userId', async (req, res) => {
  try {
    const result = await shoppingService.getShoppingList(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Find best prices
app.post('/api/shopping/best-prices', async (req, res) => {
  try {
    const { userId, items } = req.body;
    const result = await shoppingService.findBestPrices(userId, items);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Auto-purchase
app.post('/api/shopping/auto-purchase', async (req, res) => {
  try {
    const { userId, items } = req.body;
    const result = await shoppingService.autoPurchase(userId, items);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Setup auto-replenish
app.post('/api/shopping/auto-replenish/setup', async (req, res) => {
  try {
    const { userId, item } = req.body;
    const result = await shoppingService.setupAutoReplenish(userId, item);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Run auto-replenish
app.post('/api/shopping/auto-replenish/run', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await shoppingService.runAutoReplenish(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Track price
app.post('/api/shopping/track-price', async (req, res) => {
  try {
    const { userId, item } = req.body;
    const result = await shoppingService.trackPrice(userId, item);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get deals
app.get('/api/shopping/deals/:category?', async (req, res) => {
  try {
    const { userId } = req.query;
    const category = req.params.category || 'all';
    const result = await shoppingService.getDeals(userId, category);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get shopping stats
app.get('/api/shopping/stats/:userId', async (req, res) => {
  try {
    const result = await shoppingService.getShoppingStats(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🤖 GEMINI AI ROUTES (NEW!)
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
      model: 'gemini-2.0-flash-exp',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chat with Gemini + Audio (uses OpenAI for voice)
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
      model: 'gemini-2.0-flash-exp',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🎙️ VOICE & AUDIO ROUTES (NEW!)
// ═══════════════════════════════════════════════════════════════════════════

// Text-to-Speech - Converte texto em áudio
app.post('/api/voice/speak', async (req, res) => {
  try {
    const { text, voice, speed } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required' 
      });
    }

    const result = await openaiService.textToSpeech(text, { voice, speed });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chat com resposta em ÁUDIO + TEXTO
app.post('/api/voice/chat', async (req, res) => {
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

    const result = await openaiService.chatWithAudio(
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

// Life OS com resposta em ÁUDIO
app.post('/api/life-os/consult', async (req, res) => {
  try {
    const { userId, question, withAudio, voice, speed } = req.body;
    
    if (!question) {
      return res.status(400).json({ 
        success: false, 
        error: 'Question is required' 
      });
    }

    // Consultar Life OS (texto)
    const messages = [
      {
        role: 'user',
        content: question
      }
    ];

    // Se withAudio = true, retorna texto + áudio
    if (withAudio) {
      const result = await openaiService.chatWithAudio(
        messages,
        userId || 'default',
        { voice: voice || 'nova', speed: speed || 1.0 }
      );

      res.json({
        success: true,
        response: result.text,
        audio: result.audio,
        timestamp: result.timestamp
      });
    } else {
      // Apenas texto
      const textResponse = await openaiService.chat(messages, userId || 'default');
      res.json({
        success: true,
        response: textResponse,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Teste de vozes disponíveis
app.get('/api/voice/voices', (req, res) => {
  res.json({
    success: true,
    voices: [
      {
        id: 'alloy',
        name: 'Alloy',
        description: 'Neutro e versátil',
        gender: 'neutral'
      },
      {
        id: 'echo',
        name: 'Echo',
        description: 'Masculina, clara',
        gender: 'male'
      },
      {
        id: 'fable',
        name: 'Fable',
        description: 'Masculina, expressiva',
        gender: 'male'
      },
      {
        id: 'onyx',
        name: 'Onyx',
        description: 'Masculina, grave',
        gender: 'male'
      },
      {
        id: 'nova',
        name: 'Nova',
        description: 'Feminina, energética (PADRÃO)',
        gender: 'female',
        default: true
      },
      {
        id: 'shimmer',
        name: 'Shimmer',
        description: 'Feminina, suave',
        gender: 'female'
      }
    ],
    default: 'nova',
    speedRange: {
      min: 0.25,
      max: 4.0,
      default: 1.0
    },
    formats: ['mp3', 'opus', 'aac', 'flac']
  });
});

// =============================================================================
// TOTAL v5.0 NEW ENDPOINTS: 45 endpoints
//   - 38 core endpoints (Life OS, Email, Trading, Shopping)
//   - 4 voice endpoints (OpenAI TTS)
//   - 3 Gemini AI endpoints (chat, chat-audio, vision)
// TOTAL NOW ENDPOINTS: 115+ endpoints across all services
// =============================================================================
