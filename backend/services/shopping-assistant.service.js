/**
 * Shopping Assistant Service
 * Compras inteligentes automatizadas
 */

class ShoppingAssistantService {
  constructor() {
    this.userPreferences = new Map();
    this.shoppingLists = new Map();
    this.autoReplenish = new Map();
    this.priceTracking = new Map();
  }

  /**
   * Inicializa assistente de compras
   */
  async initializeShopping(userId, preferences = {}) {
    const profile = {
      userId,
      preferences: {
        budget: preferences.budget || { monthly: 500 },
        categories: preferences.categories || ['groceries', 'household', 'personal'],
        stores: preferences.stores || ['Amazon', 'Walmart', 'Target'],
        autoReplenish: preferences.autoReplenish !== false,
        priceAlerts: preferences.priceAlerts !== false,
        ecoFriendly: preferences.ecoFriendly || false,
        deliveryPreference: preferences.deliveryPreference || 'standard'
      },
      pantry: [],
      wishlist: [],
      purchaseHistory: [],
      savings: {
        total: 0,
        thisMonth: 0
      },
      initialized: new Date().toISOString()
    };

    this.userPreferences.set(userId, profile);

    return {
      success: true,
      profile,
      message: 'Shopping Assistant initialized'
    };
  }

  /**
   * Adiciona item à lista de compras
   */
  async addToList(userId, item) {
    let list = this.shoppingLists.get(userId) || [];
    
    const newItem = {
      id: `item_${Date.now()}`,
      name: item.name,
      quantity: item.quantity || 1,
      category: item.category || 'general',
      priority: item.priority || 'normal',
      estimatedPrice: item.estimatedPrice || 0,
      autoReplenish: item.autoReplenish || false,
      added: new Date().toISOString()
    };

    list.push(newItem);
    this.shoppingLists.set(userId, list);

    return {
      success: true,
      item: newItem,
      totalItems: list.length
    };
  }

  /**
   * Obtém lista de compras
   */
  async getShoppingList(userId) {
    const list = this.shoppingLists.get(userId) || [];
    const profile = this.userPreferences.get(userId);

    const categorized = this.categorizeItems(list);
    const totalEstimated = list.reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0);

    return {
      success: true,
      list,
      categorized,
      summary: {
        totalItems: list.length,
        estimatedTotal: totalEstimated.toFixed(2),
        urgent: list.filter(i => i.priority === 'high').length,
        autoReplenish: list.filter(i => i.autoReplenish).length
      },
      budget: profile?.preferences.budget
    };
  }

  /**
   * Categoriza items da lista
   */
  categorizeItems(list) {
    const categories = {};
    
    for (const item of list) {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    }

    return categories;
  }

  /**
   * Busca melhores preços
   */
  async findBestPrices(userId, items) {
    const results = [];

    for (const item of items) {
      const prices = await this.comparePrices(item.name);
      results.push({
        item: item.name,
        quantity: item.quantity,
        bestDeal: prices[0],
        alternatives: prices.slice(1, 3),
        savings: prices.length > 1 ? (prices[1].price - prices[0].price) * item.quantity : 0
      });
    }

    const totalSavings = results.reduce((sum, r) => sum + r.savings, 0);

    return {
      success: true,
      results,
      totalSavings: totalSavings.toFixed(2),
      recommendation: 'Buy from multiple stores to maximize savings'
    };
  }

  /**
   * Compara preços entre lojas
   */
  async comparePrices(itemName) {
    const stores = ['Amazon', 'Walmart', 'Target', 'Costco'];
    const prices = [];

    for (const store of stores) {
      prices.push({
        store,
        price: (5 + Math.random() * 20).toFixed(2),
        shipping: Math.random() > 0.5 ? 0 : 5.99,
        availability: Math.random() > 0.2 ? 'In Stock' : 'Out of Stock',
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        reviews: Math.floor(Math.random() * 1000)
      });
    }

    // Ordena por preço (incluindo shipping)
    prices.sort((a, b) => {
      const totalA = parseFloat(a.price) + a.shipping;
      const totalB = parseFloat(b.price) + b.shipping;
      return totalA - totalB;
    });

    return prices;
  }

  /**
   * Realiza compra automaticamente
   */
  async autoPurchase(userId, items = null) {
    const profile = this.userPreferences.get(userId);
    const list = items || this.shoppingLists.get(userId) || [];

    if (list.length === 0) {
      return { success: false, error: 'Shopping list is empty' };
    }

    // Busca melhores preços
    const bestDeals = await this.findBestPrices(userId, list);

    const purchases = [];
    let totalSpent = 0;

    for (const deal of bestDeals.results) {
      const purchase = {
        item: deal.item,
        quantity: deal.quantity,
        store: deal.bestDeal.store,
        price: deal.bestDeal.price,
        total: (deal.bestDeal.price * deal.quantity).toFixed(2),
        orderNumber: `ORD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        estimatedDelivery: this.calculateDelivery(),
        timestamp: new Date().toISOString()
      };

      purchases.push(purchase);
      totalSpent += parseFloat(purchase.total);
    }

    // Atualiza economia
    if (profile) {
      profile.savings.total += parseFloat(bestDeals.totalSavings);
      profile.savings.thisMonth += parseFloat(bestDeals.totalSavings);
      profile.purchaseHistory.push(...purchases);
    }

    // Limpa lista após compra
    this.shoppingLists.set(userId, []);

    return {
      success: true,
      purchases,
      summary: {
        itemsPurchased: purchases.length,
        totalSpent: totalSpent.toFixed(2),
        saved: bestDeals.totalSavings,
        orders: purchases.map(p => p.orderNumber)
      },
      message: 'Purchases completed successfully'
    };
  }

  calculateDelivery() {
    const days = Math.floor(Math.random() * 5) + 2;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  /**
   * Configura auto-replenishment
   */
  async setupAutoReplenish(userId, item) {
    let replenishList = this.autoReplenish.get(userId) || [];

    const config = {
      id: `replenish_${Date.now()}`,
      item: item.name,
      quantity: item.quantity || 1,
      threshold: item.threshold || 0.2, // Compra quando estiver com 20% ou menos
      frequency: item.frequency || 'monthly', // weekly, monthly, biweekly
      lastPurchase: new Date().toISOString(),
      nextPurchase: this.calculateNextPurchase(item.frequency),
      active: true
    };

    replenishList.push(config);
    this.autoReplenish.set(userId, replenishList);

    return {
      success: true,
      config,
      message: `Auto-replenish configured for ${item.name}`
    };
  }

  calculateNextPurchase(frequency) {
    const date = new Date();
    switch (frequency) {
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'biweekly':
        date.setDate(date.getDate() + 14);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
    }
    return date.toISOString();
  }

  /**
   * Executa auto-replenishment
   */
  async runAutoReplenish(userId) {
    const replenishList = this.autoReplenish.get(userId) || [];
    const itemsToBuy = [];

    for (const config of replenishList) {
      if (!config.active) continue;

      const now = new Date();
      const nextPurchase = new Date(config.nextPurchase);

      if (now >= nextPurchase) {
        itemsToBuy.push({
          name: config.item,
          quantity: config.quantity,
          category: 'auto-replenish',
          priority: 'normal',
          estimatedPrice: 0,
          autoReplenish: true
        });

        // Atualiza próxima compra
        config.lastPurchase = now.toISOString();
        config.nextPurchase = this.calculateNextPurchase(config.frequency);
      }
    }

    if (itemsToBuy.length === 0) {
      return {
        success: true,
        itemsReplenished: 0,
        message: 'No items need replenishment yet'
      };
    }

    // Realiza compra automática
    const purchase = await this.autoPurchase(userId, itemsToBuy);

    return {
      success: true,
      itemsReplenished: itemsToBuy.length,
      purchase,
      nextScheduled: replenishList
        .filter(c => c.active)
        .map(c => ({ item: c.item, nextPurchase: c.nextPurchase }))
    };
  }

  /**
   * Rastreia preços de items na wishlist
   */
  async trackPrice(userId, item) {
    let tracking = this.priceTracking.get(userId) || [];

    const config = {
      id: `track_${Date.now()}`,
      item: item.name,
      targetPrice: item.targetPrice,
      currentPrice: item.currentPrice || (5 + Math.random() * 50).toFixed(2),
      notifyWhen: item.notifyWhen || 'below', // below, above, change
      active: true,
      priceHistory: [],
      alerts: []
    };

    tracking.push(config);
    this.priceTracking.set(userId, tracking);

    return {
      success: true,
      tracking: config,
      message: `Price tracking enabled for ${item.name}`
    };
  }

  /**
   * Obtém deals e promoções
   */
  async getDeals(userId, category = 'all') {
    const deals = [
      {
        id: 'deal_1',
        item: 'Echo Dot (5th Gen)',
        regularPrice: 49.99,
        salePrice: 24.99,
        discount: 50,
        store: 'Amazon',
        category: 'electronics',
        endDate: '2026-02-15',
        rating: 4.7,
        reviews: 45230
      },
      {
        id: 'deal_2',
        item: 'Organic Coffee Beans 2lb',
        regularPrice: 29.99,
        salePrice: 19.99,
        discount: 33,
        store: 'Whole Foods',
        category: 'groceries',
        endDate: '2026-02-12',
        rating: 4.8,
        reviews: 2341
      },
      {
        id: 'deal_3',
        item: 'Wireless Headphones',
        regularPrice: 199.99,
        salePrice: 99.99,
        discount: 50,
        store: 'Best Buy',
        category: 'electronics',
        endDate: '2026-02-20',
        rating: 4.5,
        reviews: 8921
      }
    ];

    const filtered = category === 'all' 
      ? deals 
      : deals.filter(d => d.category === category);

    return {
      success: true,
      deals: filtered,
      savings: filtered.reduce((sum, d) => sum + (d.regularPrice - d.salePrice), 0).toFixed(2)
    };
  }

  /**
   * Obtém estatísticas de compras
   */
  async getShoppingStats(userId) {
    const profile = this.userPreferences.get(userId);
    
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    return {
      success: true,
      stats: {
        totalPurchases: profile.purchaseHistory.length,
        totalSpent: profile.purchaseHistory.reduce((sum, p) => sum + parseFloat(p.total), 0).toFixed(2),
        totalSaved: profile.savings.total.toFixed(2),
        savedThisMonth: profile.savings.thisMonth.toFixed(2),
        avgOrderValue: profile.purchaseHistory.length > 0 
          ? (profile.purchaseHistory.reduce((sum, p) => sum + parseFloat(p.total), 0) / profile.purchaseHistory.length).toFixed(2)
          : 0,
        autoReplenishActive: (this.autoReplenish.get(userId) || []).filter(r => r.active).length,
        priceTracking: (this.priceTracking.get(userId) || []).filter(t => t.active).length,
        topCategories: this.getTopCategories(profile.purchaseHistory),
        topStores: this.getTopStores(profile.purchaseHistory)
      }
    };
  }

  getTopCategories(history) {
    const categories = {};
    for (const purchase of history) {
      categories[purchase.category] = (categories[purchase.category] || 0) + 1;
    }
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }

  getTopStores(history) {
    const stores = {};
    for (const purchase of history) {
      stores[purchase.store] = (stores[purchase.store] || 0) + parseFloat(purchase.total);
    }
    return Object.entries(stores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, spent]) => ({ name, spent: spent.toFixed(2) }));
  }
}

module.exports = new ShoppingAssistantService();
