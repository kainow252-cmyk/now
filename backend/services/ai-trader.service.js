/**
 * AI Day Trader Service
 * Trading automático de ações com IA
 */

class AITraderService {
  constructor() {
    this.portfolios = new Map();
    this.strategies = new Map();
    this.trades = new Map();
    this.watchlists = new Map();
  }

  /**
   * Inicializa portfolio de trading
   */
  async initializePortfolio(userId, config) {
    const portfolio = {
      userId,
      balance: config.initialBalance || 10000,
      invested: 0,
      totalValue: config.initialBalance || 10000,
      positions: [],
      trades: [],
      strategy: config.strategy || 'balanced',
      riskTolerance: config.riskTolerance || 'medium', // low, medium, high, aggressive
      autoTrade: config.autoTrade || false,
      stopLoss: config.stopLoss || 0.05, // 5% stop loss
      takeProfit: config.takeProfit || 0.15, // 15% take profit
      maxPositionSize: config.maxPositionSize || 0.2, // 20% do portfolio
      created: new Date().toISOString(),
      performance: {
        totalReturn: 0,
        dailyReturn: 0,
        winRate: 0,
        sharpeRatio: 0
      }
    };

    this.portfolios.set(userId, portfolio);

    return {
      success: true,
      portfolio,
      message: 'AI Trading portfolio initialized'
    };
  }

  /**
   * Analisa mercado e retorna oportunidades
   */
  async analyzeMarket(symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA']) {
    const opportunities = [];

    for (const symbol of symbols) {
      const analysis = await this.analyzeStock(symbol);
      
      if (analysis.recommendation !== 'hold') {
        opportunities.push(analysis);
      }
    }

    // Ordena por confiança
    opportunities.sort((a, b) => b.confidence - a.confidence);

    return {
      success: true,
      opportunities: opportunities.slice(0, 5), // Top 5
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Analisa uma ação específica
   */
  async analyzeStock(symbol) {
    // Simula análise técnica e fundamental
    const price = 150 + Math.random() * 50;
    const change = (Math.random() - 0.5) * 10;
    
    const indicators = {
      rsi: Math.random() * 100, // Relative Strength Index
      macd: (Math.random() - 0.5) * 5, // MACD
      movingAvg50: price * (0.95 + Math.random() * 0.1),
      movingAvg200: price * (0.90 + Math.random() * 0.15),
      volume: Math.random() * 10000000,
      volatility: Math.random() * 0.5
    };

    // Lógica de recomendação
    let recommendation = 'hold';
    let confidence = 0.5;
    let reasoning = [];

    if (indicators.rsi < 30) {
      recommendation = 'buy';
      confidence += 0.2;
      reasoning.push('RSI indicates oversold');
    } else if (indicators.rsi > 70) {
      recommendation = 'sell';
      confidence += 0.2;
      reasoning.push('RSI indicates overbought');
    }

    if (price > indicators.movingAvg50 && price > indicators.movingAvg200) {
      if (recommendation === 'buy') confidence += 0.15;
      reasoning.push('Price above both moving averages (bullish)');
    }

    if (indicators.macd > 0 && recommendation === 'buy') {
      confidence += 0.1;
      reasoning.push('MACD positive (momentum)');
    }

    return {
      symbol,
      price,
      change,
      changePercent: (change / price) * 100,
      indicators,
      recommendation,
      confidence: Math.min(confidence, 0.95),
      reasoning,
      targetPrice: recommendation === 'buy' ? price * 1.15 : price * 0.85,
      stopLoss: recommendation === 'buy' ? price * 0.95 : price * 1.05,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Executa trade automaticamente
   */
  async executeTrade(userId, trade) {
    const portfolio = this.portfolios.get(userId);
    
    if (!portfolio) {
      return { success: false, error: 'Portfolio not found' };
    }

    const analysis = await this.analyzeStock(trade.symbol);
    
    // Validações
    if (trade.type === 'buy') {
      const cost = analysis.price * trade.quantity;
      
      if (cost > portfolio.balance) {
        return {
          success: false,
          error: 'Insufficient balance',
          required: cost,
          available: portfolio.balance
        };
      }

      // Executa compra
      portfolio.balance -= cost;
      portfolio.invested += cost;
      
      portfolio.positions.push({
        symbol: trade.symbol,
        quantity: trade.quantity,
        entryPrice: analysis.price,
        currentPrice: analysis.price,
        value: cost,
        pnl: 0,
        pnlPercent: 0,
        stopLoss: analysis.stopLoss,
        takeProfit: analysis.targetPrice,
        timestamp: new Date().toISOString()
      });

    } else if (trade.type === 'sell') {
      const positionIndex = portfolio.positions.findIndex(p => p.symbol === trade.symbol);
      
      if (positionIndex === -1) {
        return { success: false, error: 'Position not found' };
      }

      const position = portfolio.positions[positionIndex];
      const proceeds = analysis.price * position.quantity;
      const pnl = proceeds - (position.entryPrice * position.quantity);
      
      portfolio.balance += proceeds;
      portfolio.invested -= (position.entryPrice * position.quantity);
      portfolio.positions.splice(positionIndex, 1);

      portfolio.trades.push({
        type: 'sell',
        symbol: trade.symbol,
        quantity: position.quantity,
        entryPrice: position.entryPrice,
        exitPrice: analysis.price,
        pnl,
        pnlPercent: (pnl / (position.entryPrice * position.quantity)) * 100,
        timestamp: new Date().toISOString()
      });
    }

    // Atualiza valor total
    portfolio.totalValue = portfolio.balance + portfolio.invested;

    return {
      success: true,
      trade: {
        type: trade.type,
        symbol: trade.symbol,
        quantity: trade.quantity,
        price: analysis.price,
        total: analysis.price * trade.quantity,
        timestamp: new Date().toISOString()
      },
      portfolio: {
        balance: portfolio.balance,
        invested: portfolio.invested,
        totalValue: portfolio.totalValue
      }
    };
  }

  /**
   * Executa estratégia de trading automaticamente
   */
  async runAutoTrading(userId) {
    const portfolio = this.portfolios.get(userId);
    
    if (!portfolio || !portfolio.autoTrade) {
      return { success: false, error: 'Auto-trading not enabled' };
    }

    const opportunities = await this.analyzeMarket();
    const actions = [];

    for (const opp of opportunities.opportunities) {
      // Decisão de trading baseada em confiança e estratégia
      if (opp.recommendation === 'buy' && opp.confidence > 0.75) {
        const positionSize = portfolio.totalValue * portfolio.maxPositionSize;
        const quantity = Math.floor(positionSize / opp.price);

        if (quantity > 0) {
          const result = await this.executeTrade(userId, {
            type: 'buy',
            symbol: opp.symbol,
            quantity
          });

          if (result.success) {
            actions.push(result);
          }
        }
      }
    }

    // Verifica stop-loss e take-profit em posições existentes
    for (const position of portfolio.positions) {
      const current = await this.analyzeStock(position.symbol);
      
      // Stop loss
      if (current.price <= position.stopLoss) {
        const result = await this.executeTrade(userId, {
          type: 'sell',
          symbol: position.symbol,
          quantity: position.quantity
        });
        
        if (result.success) {
          actions.push({ ...result, reason: 'stop_loss_triggered' });
        }
      }
      
      // Take profit
      if (current.price >= position.takeProfit) {
        const result = await this.executeTrade(userId, {
          type: 'sell',
          symbol: position.symbol,
          quantity: position.quantity
        });
        
        if (result.success) {
          actions.push({ ...result, reason: 'take_profit_triggered' });
        }
      }
    }

    return {
      success: true,
      actionsExecuted: actions.length,
      actions,
      portfolio: {
        balance: portfolio.balance,
        invested: portfolio.invested,
        totalValue: portfolio.totalValue,
        positions: portfolio.positions.length
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Obtém performance do portfolio
   */
  async getPerformance(userId) {
    const portfolio = this.portfolios.get(userId);
    
    if (!portfolio) {
      return { success: false, error: 'Portfolio not found' };
    }

    // Calcula métricas
    const initialBalance = 10000; // valor inicial (deveria vir do config)
    const currentValue = portfolio.totalValue;
    const totalReturn = ((currentValue - initialBalance) / initialBalance) * 100;

    const winningTrades = portfolio.trades.filter(t => t.pnl > 0).length;
    const totalTrades = portfolio.trades.length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    return {
      success: true,
      performance: {
        initialBalance,
        currentValue,
        totalReturn: totalReturn.toFixed(2),
        totalReturnUSD: (currentValue - initialBalance).toFixed(2),
        winRate: winRate.toFixed(2),
        totalTrades,
        winningTrades,
        losingTrades: totalTrades - winningTrades,
        avgWin: this.calculateAvgWin(portfolio.trades),
        avgLoss: this.calculateAvgLoss(portfolio.trades),
        sharpeRatio: (Math.random() * 2).toFixed(2), // Simulado
        maxDrawdown: (Math.random() * 10).toFixed(2) // Simulado
      },
      positions: portfolio.positions,
      recentTrades: portfolio.trades.slice(-10)
    };
  }

  calculateAvgWin(trades) {
    const wins = trades.filter(t => t.pnl > 0);
    if (wins.length === 0) return 0;
    return (wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length).toFixed(2);
  }

  calculateAvgLoss(trades) {
    const losses = trades.filter(t => t.pnl < 0);
    if (losses.length === 0) return 0;
    return (losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length).toFixed(2);
  }

  /**
   * Define estratégia de trading
   */
  async setStrategy(userId, strategy) {
    const portfolio = this.portfolios.get(userId);
    
    if (!portfolio) {
      return { success: false, error: 'Portfolio not found' };
    }

    const strategies = {
      conservative: { risk: 'low', stopLoss: 0.03, takeProfit: 0.08, maxPosition: 0.1 },
      balanced: { risk: 'medium', stopLoss: 0.05, takeProfit: 0.15, maxPosition: 0.2 },
      aggressive: { risk: 'high', stopLoss: 0.08, takeProfit: 0.25, maxPosition: 0.3 },
      dayTrader: { risk: 'high', stopLoss: 0.02, takeProfit: 0.05, maxPosition: 0.4 }
    };

    const selectedStrategy = strategies[strategy];
    
    if (!selectedStrategy) {
      return { success: false, error: 'Invalid strategy' };
    }

    portfolio.strategy = strategy;
    portfolio.stopLoss = selectedStrategy.stopLoss;
    portfolio.takeProfit = selectedStrategy.takeProfit;
    portfolio.maxPositionSize = selectedStrategy.maxPosition;

    return {
      success: true,
      strategy: selectedStrategy,
      message: `Strategy set to ${strategy}`
    };
  }

  /**
   * Ativa/desativa auto-trading
   */
  async toggleAutoTrading(userId, enabled) {
    const portfolio = this.portfolios.get(userId);
    
    if (!portfolio) {
      return { success: false, error: 'Portfolio not found' };
    }

    portfolio.autoTrade = enabled;

    return {
      success: true,
      autoTrade: enabled,
      message: enabled ? 'Auto-trading enabled' : 'Auto-trading disabled'
    };
  }
}

module.exports = new AITraderService();
