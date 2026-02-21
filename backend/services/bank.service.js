const axios = require('axios');

/**
 * Bank Integration Service
 * Manages financial accounts, transactions, and payments
 */
class BankService {
  constructor() {
    // Open Banking / Banking API credentials
    this.plaidClientId = process.env.PLAID_CLIENT_ID;
    this.plaidSecret = process.env.PLAID_SECRET;
    this.stripeKey = process.env.STRIPE_SECRET_KEY;
    
    // Mock accounts database
    this.accounts = new Map();
    this.transactions = new Map();
  }

  /**
   * Connect bank account (Open Banking)
   */
  async connectAccount(userId, bankData) {
    console.log(`🏦 Connecting bank account for user ${userId}`);

    // In production: Use Plaid, Stripe, or Open Banking API
    const account = {
      id: `acc_${Date.now()}`,
      userId,
      bankName: bankData.bankName || 'Mock Bank',
      accountType: bankData.accountType || 'checking',
      balance: bankData.balance || 0,
      currency: bankData.currency || 'BRL',
      lastSync: new Date(),
      connected: true,
      status: 'active'
    };

    this.accounts.set(account.id, account);

    return {
      success: true,
      account,
      message: 'Conta conectada com sucesso'
    };
  }

  /**
   * Get all accounts for user
   */
  async getAccounts(userId) {
    const userAccounts = Array.from(this.accounts.values())
      .filter(acc => acc.userId === userId);

    const totalBalance = userAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    return {
      success: true,
      accounts: userAccounts,
      totalAccounts: userAccounts.length,
      totalBalance,
      currency: 'BRL'
    };
  }

  /**
   * Get account balance
   */
  async getBalance(accountId) {
    const account = this.accounts.get(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    return {
      success: true,
      accountId,
      balance: account.balance,
      currency: account.currency,
      lastUpdate: account.lastSync
    };
  }

  /**
   * Get transactions
   */
  async getTransactions(accountId, filters = {}) {
    const { startDate, endDate, limit = 50 } = filters;

    // Mock transactions
    const mockTransactions = this.generateMockTransactions(accountId, limit);

    return {
      success: true,
      accountId,
      transactions: mockTransactions,
      count: mockTransactions.length
    };
  }

  /**
   * Analyze spending
   */
  async analyzeSpending(userId, period = 'month') {
    console.log(`📊 Analyzing spending for user ${userId}`);

    const accounts = await this.getAccounts(userId);
    
    // Mock spending analysis
    const analysis = {
      period,
      totalSpent: 15420.50,
      categories: {
        food: { amount: 3200, percentage: 20.7 },
        transport: { amount: 1500, percentage: 9.7 },
        entertainment: { amount: 2100, percentage: 13.6 },
        bills: { amount: 4500, percentage: 29.2 },
        shopping: { amount: 2800, percentage: 18.2 },
        other: { amount: 1320.50, percentage: 8.6 }
      },
      insights: [
        'Gastos com alimentação 15% acima da média',
        'Possível economia de R$800/mês em entretenimento',
        'Contas fixas bem controladas'
      ],
      recommendations: [
        'Reduzir gastos com delivery em 20%',
        'Considerar assinaturas de streaming (3 ativas, usar apenas 1)',
        'Oportunidade de investir R$1200/mês extras'
      ],
      comparisonLastPeriod: -5.2 // 5.2% menor que período anterior
    };

    return {
      success: true,
      userId,
      ...analysis
    };
  }

  /**
   * Pay bill automatically
   */
  async payBill(userId, billData) {
    console.log(`💸 Processing payment for user ${userId}`);

    const { accountId, amount, recipient, description } = billData;

    // Validate account
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    if (account.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Process payment (mock)
    const payment = {
      id: `pay_${Date.now()}`,
      accountId,
      userId,
      amount,
      recipient,
      description,
      status: 'completed',
      processedAt: new Date()
    };

    // Update balance
    account.balance -= amount;
    this.accounts.set(accountId, account);

    return {
      success: true,
      payment,
      newBalance: account.balance,
      message: 'Pagamento realizado com sucesso'
    };
  }

  /**
   * Schedule recurring payment
   */
  async scheduleRecurringPayment(userId, paymentData) {
    const { accountId, amount, recipient, frequency, startDate } = paymentData;

    const schedule = {
      id: `schedule_${Date.now()}`,
      userId,
      accountId,
      amount,
      recipient,
      frequency, // 'daily', 'weekly', 'monthly'
      startDate,
      status: 'active',
      nextPayment: this.calculateNextPayment(startDate, frequency),
      createdAt: new Date()
    };

    return {
      success: true,
      schedule,
      message: `Pagamento recorrente agendado (${frequency})`
    };
  }

  /**
   * Detect anomalies in spending
   */
  async detectAnomalies(userId) {
    console.log(`🚨 Detecting spending anomalies for user ${userId}`);

    // Mock anomaly detection
    const anomalies = [
      {
        type: 'unusual_amount',
        severity: 'high',
        transaction: {
          id: 'txn_123',
          amount: 5000,
          merchant: 'Unknown Store',
          date: new Date()
        },
        reason: 'Transação 400% acima da média mensal',
        recommendation: 'Verificar se foi você que realizou esta transação'
      },
      {
        type: 'unusual_frequency',
        severity: 'medium',
        category: 'subscription',
        reason: '3 novas assinaturas em 1 semana',
        recommendation: 'Revisar assinaturas ativas'
      }
    ];

    return {
      success: true,
      userId,
      anomaliesDetected: anomalies.length,
      anomalies,
      timestamp: new Date()
    };
  }

  /**
   * Get investment portfolio
   */
  async getPortfolio(userId) {
    // Mock portfolio
    const portfolio = {
      totalValue: 125000,
      currency: 'BRL',
      investments: [
        {
          type: 'stocks',
          value: 60000,
          percentage: 48,
          performance: '+15.2%',
          positions: [
            { symbol: 'PETR4', value: 25000, return: '+12%' },
            { symbol: 'VALE3', value: 20000, return: '+18%' },
            { symbol: 'ITUB4', value: 15000, return: '+14%' }
          ]
        },
        {
          type: 'crypto',
          value: 35000,
          percentage: 28,
          performance: '+42.5%',
          positions: [
            { symbol: 'BTC', value: 20000, return: '+45%' },
            { symbol: 'ETH', value: 15000, return: '+38%' }
          ]
        },
        {
          type: 'fixed_income',
          value: 30000,
          percentage: 24,
          performance: '+8.5%',
          positions: [
            { type: 'CDB', value: 20000, return: '+9%' },
            { type: 'LCI', value: 10000, return: '+7.5%' }
          ]
        }
      ],
      totalReturn: '+18.3%',
      risk: 'moderate-high',
      lastRebalance: new Date('2026-01-15')
    };

    return {
      success: true,
      userId,
      portfolio,
      timestamp: new Date()
    };
  }

  /**
   * Rebalance portfolio
   */
  async rebalancePortfolio(userId, strategy = 'conservative') {
    console.log(`⚖️ Rebalancing portfolio for user ${userId} (${strategy})`);

    const strategies = {
      conservative: { stocks: 30, fixedIncome: 60, crypto: 10 },
      moderate: { stocks: 50, fixedIncome: 40, crypto: 10 },
      aggressive: { stocks: 60, fixedIncome: 20, crypto: 20 }
    };

    const targetAllocation = strategies[strategy];

    return {
      success: true,
      userId,
      strategy,
      targetAllocation,
      actions: [
        'Vender R$15k em ações',
        'Comprar R$10k em renda fixa',
        'Comprar R$5k em crypto'
      ],
      estimatedCost: 125.50, // fees
      message: 'Plano de rebalanceamento criado. Confirme para executar.'
    };
  }

  /**
   * AI financial advisor
   */
  async getFinancialAdvice(userId) {
    const accounts = await this.getAccounts(userId);
    const spending = await this.analyzeSpending(userId);
    const portfolio = await this.getPortfolio(userId);

    const advice = {
      cashFlow: {
        status: 'healthy',
        monthlyIncome: 18000,
        monthlyExpenses: 15420,
        surplus: 2580,
        savingsRate: '14.3%'
      },
      recommendations: [
        {
          priority: 'high',
          category: 'savings',
          action: 'Aumentar taxa de poupança para 20%',
          impact: '+R$1020/mês',
          difficulty: 'medium'
        },
        {
          priority: 'high',
          category: 'investment',
          action: 'Rebalancear portfólio (muito exposto a crypto)',
          impact: 'Reduzir risco',
          difficulty: 'easy'
        },
        {
          priority: 'medium',
          category: 'expenses',
          action: 'Cancelar 2 assinaturas não usadas',
          impact: '+R$89/mês',
          difficulty: 'easy'
        }
      ],
      goals: [
        {
          name: 'Reserva de emergência',
          target: 54000, // 3 meses
          current: 30000,
          progress: '55.6%',
          monthsToComplete: 9.3
        },
        {
          name: 'Investimento em startup',
          target: 100000,
          current: 0,
          progress: '0%',
          monthsToComplete: 38
        }
      ]
    };

    return {
      success: true,
      userId,
      advice,
      timestamp: new Date()
    };
  }

  // Helper methods
  generateMockTransactions(accountId, limit) {
    const transactions = [];
    const merchants = [
      'Uber', 'iFood', 'Amazon', 'Netflix', 'Spotify',
      'Mercado Local', 'Posto Shell', 'Farmácia', 'Academia'
    ];

    for (let i = 0; i < limit; i++) {
      transactions.push({
        id: `txn_${Date.now()}_${i}`,
        accountId,
        amount: -(Math.random() * 500 + 10).toFixed(2),
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        category: this.categorizeMerchant(merchants[i % merchants.length]),
        date: new Date(Date.now() - i * 86400000),
        status: 'completed'
      });
    }

    return transactions;
  }

  categorizeMerchant(merchant) {
    const categories = {
      'Uber': 'transport',
      'iFood': 'food',
      'Amazon': 'shopping',
      'Netflix': 'entertainment',
      'Spotify': 'entertainment',
      'Mercado Local': 'food',
      'Posto Shell': 'transport',
      'Farmácia': 'health',
      'Academia': 'health'
    };

    return categories[merchant] || 'other';
  }

  calculateNextPayment(startDate, frequency) {
    const date = new Date(startDate);
    
    switch(frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
    }

    return date;
  }
}

module.exports = new BankService();
