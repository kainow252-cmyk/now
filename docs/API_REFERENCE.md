# NOW - API Reference v2.0

## Base URL
```
http://localhost:3000/api
```

---

## 🔐 Authentication

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

---

## 🧠 AI / Commands

### Process Voice Command
```http
POST /api/command
Content-Type: application/json

{
  "command": "NOW, organize meu dia",
  "userId": "123"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Agenda organizada: Reunião às 10h, análise financeira às 15h.",
  "timestamp": "2026-02-08T14:30:00.000Z"
}
```

### Generate Content
```http
POST /api/ai/generate
Content-Type: application/json

{
  "prompt": "Criar post sobre investimentos em tecnologia",
  "type": "social_post"
}
```

**Types:**
- `social_post` - Social media posts
- `email` - Professional emails
- `report` - Executive reports
- `code` - Code generation
- `general` - General content

---

## 📅 Calendar

### Get Events
```http
GET /api/calendar/events?accessToken={token}&timeMin={iso_date}&timeMax={iso_date}
```

### Create Event
```http
POST /api/calendar/events
Content-Type: application/json

{
  "accessToken": "google_access_token",
  "eventData": {
    "title": "Reunião Estratégica",
    "description": "Planejamento Q1",
    "startTime": "2026-02-10T10:00:00-03:00",
    "endTime": "2026-02-10T11:00:00-03:00",
    "timezone": "America/Sao_Paulo",
    "attendees": ["email@example.com"]
  }
}
```

### Find Available Slots
```http
GET /api/calendar/available?accessToken={token}&date=2026-02-10&duration=60
```

### Detect Conflicts
```http
POST /api/calendar/conflicts
Content-Type: application/json

{
  "accessToken": "google_access_token",
  "proposedEvent": {
    "startTime": "2026-02-10T10:00:00-03:00",
    "endTime": "2026-02-10T11:00:00-03:00"
  }
}
```

---

## 📊 Finance

### Get Stock Quote
```http
GET /api/finance/quote/AAPL
```

**Response:**
```json
{
  "success": true,
  "quote": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 185.50,
    "change": 2.3,
    "changePercent": 1.24,
    "volume": 85000000,
    "marketCap": 2850000000000
  }
}
```

### Get Market Summary
```http
GET /api/finance/market
```

**Response:**
```json
{
  "success": true,
  "indices": [
    {
      "symbol": "^GSPC",
      "name": "S&P 500",
      "price": 5234.18,
      "changePercent": 0.8
    }
  ]
}
```

### Get Crypto Prices
```http
GET /api/finance/crypto
```

### Analyze Stock
```http
GET /api/finance/analyze/TSLA
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "symbol": "TSLA",
    "price": 245.80,
    "recommendation": "BUY",
    "reason": "Tendência positiva",
    "riskLevel": "MEDIUM"
  }
}
```

---

## 📱 Social Media

### Post to Social Media
```http
POST /api/social/post
Content-Type: application/json

{
  "content": "Insights sobre IA e investimentos #Tech",
  "platforms": ["twitter", "linkedin"],
  "userId": "123"
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "success": true,
      "platform": "twitter",
      "postId": "abc123",
      "url": "https://twitter.com/user/status/abc123"
    }
  ],
  "totalPlatforms": 2,
  "successCount": 2
}
```

### Schedule Post
```http
POST /api/social/schedule
Content-Type: application/json

{
  "content": "Post content",
  "platforms": ["twitter"],
  "scheduledTime": "2026-02-10T10:00:00Z",
  "userId": "123"
}
```

### Generate Post Content
```http
POST /api/social/generate
Content-Type: application/json

{
  "topic": "investimentos em IA",
  "style": "professional"
}
```

**Styles:**
- `professional` - Business/executive
- `casual` - Informal
- `motivational` - Inspirational

### Get Post Analytics
```http
GET /api/social/analytics/post123?platform=twitter
```

### Get Recent Posts
```http
GET /api/social/posts/user123?platform=all&limit=20
```

---

## 💾 Database / Memory

### Get User Stats
```http
GET /api/stats/user123
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalConversations": 150,
    "totalSchedules": 25,
    "totalMemories": 80,
    "totalPosts": 30
  }
}
```

### Get Memories
```http
GET /api/memory/user123?limit=10
```

### Update Preferences
```http
POST /api/preferences
Content-Type: application/json

{
  "userId": "123",
  "preferences": {
    "favoriteLocations": ["Miami", "São Paulo"],
    "workingHours": "9:00-18:00",
    "timezone": "America/Sao_Paulo",
    "language": "pt-BR"
  }
}
```

### Get Preferences
```http
GET /api/preferences/user123
```

---

## 📅 Schedule (Legacy)

### Get Schedule
```http
GET /api/schedule/user123
```

### Add Schedule Item
```http
POST /api/schedule
Content-Type: application/json

{
  "title": "Reunião",
  "datetime": "2026-02-10T10:00:00",
  "description": "Planejamento",
  "userId": "123"
}
```

---

## 📰 News (Mock)

### Get News
```http
GET /api/news/finance
```

**Categories:**
- `general` - All news
- `finance` - Financial news
- `technology` - Tech news

---

## 🏥 Health Check

### Check System Status
```http
GET /api/health
```

**Response:**
```json
{
  "status": "online",
  "timestamp": "2026-02-08T14:30:00.000Z",
  "services": {
    "openai": true,
    "database": true,
    "finance": true,
    "social": true,
    "calendar": false
  }
}
```

---

## 🔒 Authentication

Most protected endpoints require a JWT token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get token from `/api/auth/login` or `/api/auth/register`.

---

## 📝 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## 🚀 Quick Start

1. **Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"John"}'
```

2. **Send a command:**
```bash
curl -X POST http://localhost:3000/api/command \
  -H "Content-Type: application/json" \
  -d '{"command":"NOW, bom dia","userId":"default"}'
```

3. **Get market data:**
```bash
curl http://localhost:3000/api/finance/market
```

4. **Post to social:**
```bash
curl -X POST http://localhost:3000/api/social/post \
  -H "Content-Type: application/json" \
  -d '{"content":"Test post","platforms":["twitter"],"userId":"123"}'
```

---

## 📚 Additional Documentation

- See `README.md` for general information
- See `QUICK_START.md` for setup guide
- See `PROJECT_SUMMARY.md` for business overview

---

**NOW API v2.0** - Complete reference for all endpoints
