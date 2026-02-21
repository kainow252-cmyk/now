class DatabaseService {
  constructor() {
    this.connected = false;
    this.dbType = process.env.DATABASE_TYPE || 'memory'; // 'memory', 'postgres', 'mongodb'
    
    // In-memory storage (replace with real DB)
    this.store = {
      users: new Map(),
      schedules: new Map(),
      memories: new Map(),
      preferences: new Map(),
      conversations: new Map(),
      posts: new Map()
    };

    this.init();
  }

  async init() {
    if (this.dbType === 'postgres') {
      // TODO: Initialize PostgreSQL
      console.log('PostgreSQL connection would be initialized here');
    } else if (this.dbType === 'mongodb') {
      // TODO: Initialize MongoDB
      console.log('MongoDB connection would be initialized here');
    } else {
      console.log('Using in-memory database');
    }
    this.connected = true;
  }

  // User operations
  async createUser(userData) {
    const id = Date.now().toString();
    const user = { id, ...userData, createdAt: new Date() };
    this.store.users.set(id, user);
    return user;
  }

  async getUserById(userId) {
    return this.store.users.get(userId);
  }

  async updateUser(userId, updates) {
    const user = this.store.users.get(userId);
    if (!user) return null;
    
    const updated = { ...user, ...updates, updatedAt: new Date() };
    this.store.users.set(userId, updated);
    return updated;
  }

  // Schedule operations
  async createSchedule(userId, scheduleData) {
    const id = Date.now().toString();
    const schedule = { 
      id, 
      userId, 
      ...scheduleData, 
      createdAt: new Date() 
    };
    
    if (!this.store.schedules.has(userId)) {
      this.store.schedules.set(userId, []);
    }
    
    this.store.schedules.get(userId).push(schedule);
    return schedule;
  }

  async getSchedules(userId, filters = {}) {
    const userSchedules = this.store.schedules.get(userId) || [];
    
    if (filters.date) {
      return userSchedules.filter(s => 
        s.datetime.startsWith(filters.date)
      );
    }
    
    return userSchedules;
  }

  async updateSchedule(scheduleId, updates) {
    for (const [userId, schedules] of this.store.schedules.entries()) {
      const index = schedules.findIndex(s => s.id === scheduleId);
      if (index !== -1) {
        schedules[index] = { 
          ...schedules[index], 
          ...updates, 
          updatedAt: new Date() 
        };
        return schedules[index];
      }
    }
    return null;
  }

  async deleteSchedule(scheduleId) {
    for (const [userId, schedules] of this.store.schedules.entries()) {
      const index = schedules.findIndex(s => s.id === scheduleId);
      if (index !== -1) {
        schedules.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  // Memory/Preferences operations
  async saveMemory(userId, memoryData) {
    const id = Date.now().toString();
    const memory = { 
      id, 
      userId, 
      ...memoryData, 
      timestamp: new Date() 
    };
    
    if (!this.store.memories.has(userId)) {
      this.store.memories.set(userId, []);
    }
    
    this.store.memories.get(userId).push(memory);
    
    // Keep only last 100 memories per user
    const memories = this.store.memories.get(userId);
    if (memories.length > 100) {
      memories.shift();
    }
    
    return memory;
  }

  async getMemories(userId, limit = 10) {
    const memories = this.store.memories.get(userId) || [];
    return memories.slice(-limit).reverse();
  }

  async updatePreferences(userId, preferences) {
    const existing = this.store.preferences.get(userId) || {};
    const updated = { 
      ...existing, 
      ...preferences, 
      updatedAt: new Date() 
    };
    this.store.preferences.set(userId, updated);
    return updated;
  }

  async getPreferences(userId) {
    return this.store.preferences.get(userId) || {};
  }

  // Conversation operations
  async saveConversation(userId, message, response) {
    const id = Date.now().toString();
    const conversation = {
      id,
      userId,
      message,
      response,
      timestamp: new Date()
    };

    if (!this.store.conversations.has(userId)) {
      this.store.conversations.set(userId, []);
    }

    this.store.conversations.get(userId).push(conversation);

    // Keep only last 50 conversations
    const conversations = this.store.conversations.get(userId);
    if (conversations.length > 50) {
      conversations.shift();
    }

    return conversation;
  }

  async getConversations(userId, limit = 10) {
    const conversations = this.store.conversations.get(userId) || [];
    return conversations.slice(-limit);
  }

  // Social media posts
  async saveSocialPost(userId, postData) {
    const id = Date.now().toString();
    const post = {
      id,
      userId,
      ...postData,
      createdAt: new Date()
    };

    if (!this.store.posts.has(userId)) {
      this.store.posts.set(userId, []);
    }

    this.store.posts.get(userId).push(post);
    return post;
  }

  async getSocialPosts(userId, limit = 20) {
    const posts = this.store.posts.get(userId) || [];
    return posts.slice(-limit).reverse();
  }

  // Stats
  async getStats(userId) {
    return {
      totalConversations: (this.store.conversations.get(userId) || []).length,
      totalSchedules: (this.store.schedules.get(userId) || []).length,
      totalMemories: (this.store.memories.get(userId) || []).length,
      totalPosts: (this.store.posts.get(userId) || []).length
    };
  }

  // Helper: Clear user data (GDPR compliance)
  async deleteUserData(userId) {
    this.store.users.delete(userId);
    this.store.schedules.delete(userId);
    this.store.memories.delete(userId);
    this.store.preferences.delete(userId);
    this.store.conversations.delete(userId);
    this.store.posts.delete(userId);
    return true;
  }
}

module.exports = new DatabaseService();
