const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'now-secret-key-change-in-production';
    this.JWT_EXPIRY = '7d';
    
    // Mock user database (replace with real DB)
    this.users = new Map();
  }

  async register(email, password, name) {
    if (this.users.has(email)) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date(),
      preferences: {},
      subscription: 'free'
    };

    this.users.set(email, user);

    const token = this.generateToken(user);
    const userResponse = this.sanitizeUser(user);

    return { user: userResponse, token };
  }

  async login(email, password) {
    const user = this.users.get(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    const userResponse = this.sanitizeUser(user);

    return { user: userResponse, token };
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.name 
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRY }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  sanitizeUser(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(userId, updates) {
    for (const [email, user] of this.users.entries()) {
      if (user.id === userId) {
        const updatedUser = { ...user, ...updates };
        this.users.set(email, updatedUser);
        return this.sanitizeUser(updatedUser);
      }
    }
    throw new Error('User not found');
  }

  async getUserById(userId) {
    for (const user of this.users.values()) {
      if (user.id === userId) {
        return this.sanitizeUser(user);
      }
    }
    return null;
  }

  // Middleware for protected routes
  authMiddleware() {
    return (req, res, next) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false, 
          error: 'No token provided' 
        });
      }

      const token = authHeader.substring(7);

      try {
        const decoded = this.verifyToken(token);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid token' 
        });
      }
    };
  }
}

module.exports = new AuthService();
