const axios = require('axios');

class FinanceService {
  constructor() {
    this.apiKey = process.env.YAHOO_FINANCE_API_KEY;
    this.baseURL = 'https://query1.finance.yahoo.com/v8/finance';
  }

  async getQuote(symbol) {
    try {
      const response = await axios.get(
        `${this.baseURL}/quote?symbols=${symbol}`,
        { timeout: 5000 }
      );

      const quote = response.data.quoteResponse.results[0];
      
      return {
        symbol: quote.symbol,
        name: quote.longName || quote.shortName,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        volume: quote.regularMarketVolume,
        marketCap: quote.marketCap,
        high: quote.regularMarketDayHigh,
        low: quote.regularMarketDayLow,
        open: quote.regularMarketOpen,
        previousClose: quote.regularMarketPreviousClose,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Yahoo Finance API error:', error.message);
      return this.getMockQuote(symbol);
    }
  }

  async getMultipleQuotes(symbols) {
    const symbolString = symbols.join(',');
    
    try {
      const response = await axios.get(
        `${this.baseURL}/quote?symbols=${symbolString}`,
        { timeout: 5000 }
      );

      return response.data.quoteResponse.results.map(quote => ({
        symbol: quote.symbol,
        name: quote.longName || quote.shortName,
        price: quote.regularMarketPrice,
        changePercent: quote.regularMarketChangePercent
      }));
    } catch (error) {
      console.error('Yahoo Finance API error:', error.message);
      return symbols.map(s => this.getMockQuote(s));
    }
  }

  async getMarketSummary() {
    const indices = ['^GSPC', '^DJI', '^IXIC', '^BVSP']; // S&P500, Dow, Nasdaq, Bovespa
    
    try {
      const quotes = await this.getMultipleQuotes(indices);
      return {
        success: true,
        indices: quotes,
        timestamp: new Date()
      };
    } catch (error) {
      return this.getMockMarketSummary();
    }
  }

  async getCrypto(symbol = 'BTC-USD') {
    try {
      const quote = await this.getQuote(symbol);
      return quote;
    } catch (error) {
      return this.getMockCrypto(symbol);
    }
  }

  async getTopCryptos() {
    const cryptos = ['BTC-USD', 'ETH-USD', 'BNB-USD', 'SOL-USD', 'ADA-USD'];
    
    try {
      const quotes = await this.getMultipleQuotes(cryptos);
      return {
        success: true,
        cryptos: quotes,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: true,
        cryptos: cryptos.map(c => this.getMockCrypto(c)),
        timestamp: new Date()
      };
    }
  }

  async analyzeStock(symbol) {
    try {
      const quote = await this.getQuote(symbol);
      
      // Simple analysis logic
      const changePercent = quote.changePercent;
      const volume = quote.volume;
      
      let recommendation = 'HOLD';
      let reason = 'Mercado estável';
      
      if (changePercent > 5) {
        recommendation = 'STRONG BUY';
        reason = 'Alta significativa com volume';
      } else if (changePercent > 2) {
        recommendation = 'BUY';
        reason = 'Tendência positiva';
      } else if (changePercent < -5) {
        recommendation = 'SELL';
        reason = 'Queda significativa';
      } else if (changePercent < -2) {
        recommendation = 'WEAK SELL';
        reason = 'Tendência negativa';
      }

      return {
        ...quote,
        analysis: {
          recommendation,
          reason,
          riskLevel: Math.abs(changePercent) > 3 ? 'HIGH' : 'MEDIUM'
        }
      };
    } catch (error) {
      console.error('Analysis error:', error.message);
      return null;
    }
  }

  // Mock data for when API is unavailable
  getMockQuote(symbol) {
    const mockPrices = {
      'AAPL': { name: 'Apple Inc.', price: 185.50, change: 2.3 },
      'GOOGL': { name: 'Alphabet Inc.', price: 142.30, change: 1.8 },
      'MSFT': { name: 'Microsoft Corporation', price: 425.20, change: 3.5 },
      'TSLA': { name: 'Tesla Inc.', price: 245.80, change: -1.2 },
      'BTC-USD': { name: 'Bitcoin', price: 68500, change: 3.2 },
      'ETH-USD': { name: 'Ethereum', price: 3420, change: 2.8 }
    };

    const mock = mockPrices[symbol] || { 
      name: symbol, 
      price: 100 + Math.random() * 50, 
      change: (Math.random() - 0.5) * 5 
    };

    return {
      symbol,
      name: mock.name,
      price: mock.price,
      change: mock.change,
      changePercent: (mock.change / mock.price) * 100,
      volume: Math.floor(Math.random() * 10000000),
      marketCap: mock.price * 1000000000,
      timestamp: new Date()
    };
  }

  getMockMarketSummary() {
    return {
      success: true,
      indices: [
        { symbol: '^GSPC', name: 'S&P 500', price: 5234.18, changePercent: 0.8 },
        { symbol: '^DJI', name: 'Dow Jones', price: 38654.42, changePercent: 0.5 },
        { symbol: '^IXIC', name: 'NASDAQ', price: 16523.89, changePercent: 1.2 },
        { symbol: '^BVSP', name: 'Bovespa', price: 128456.32, changePercent: -0.3 }
      ],
      timestamp: new Date()
    };
  }

  getMockCrypto(symbol) {
    const cryptos = {
      'BTC-USD': { name: 'Bitcoin', price: 68500, change: 3.2 },
      'ETH-USD': { name: 'Ethereum', price: 3420, change: 2.8 },
      'BNB-USD': { name: 'Binance Coin', price: 615, change: 1.5 },
      'SOL-USD': { name: 'Solana', price: 142, change: 5.2 },
      'ADA-USD': { name: 'Cardano', price: 0.58, change: 2.1 }
    };

    const crypto = cryptos[symbol] || { name: symbol, price: 100, change: 0 };

    return {
      symbol,
      name: crypto.name,
      price: crypto.price,
      changePercent: crypto.change,
      timestamp: new Date()
    };
  }
}

module.exports = new FinanceService();
