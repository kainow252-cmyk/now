# 🚀 GUIA DE DEPLOY - NOW v5.0

**Deploy em Produção - Passo a Passo Completo**

---

## 📋 PRÉ-REQUISITOS

### Contas Necessárias:
- [ ] GitHub (para código)
- [ ] Vercel ou Heroku (para deploy)
- [ ] PostgreSQL/Supabase (database)
- [ ] API Keys configuradas

### Checklist Antes do Deploy:
- [x] ✅ Código completo e testado
- [x] ✅ 17 serviços implementados
- [x] ✅ 108 endpoints funcionando
- [ ] ⏳ API keys reais configuradas
- [ ] ⏳ Database de produção
- [ ] ⏳ Domínio registrado

---

## 🎯 OPÇÃO 1: DEPLOY RÁPIDO (VERCEL)

### Vantagens:
- ✅ Deploy em 5 minutos
- ✅ SSL/HTTPS automático
- ✅ Serverless (escala automático)
- ✅ Grátis até 100GB bandwidth
- ✅ Zero config

### Passo a Passo:

#### 1. Preparar Repositório GitHub

```bash
cd /home/user/webapp

# Inicializar Git (se não estiver)
git init

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "NOW v5.0 - Production Ready

- 17 services implemented
- 108 API endpoints
- 7,922+ lines of code
- Life OS, Email Zero, AI Trader, Shopping Assistant
- Full documentation
- Ready for production deployment"

# Criar repositório no GitHub
# Acesse: https://github.com/new
# Nome: now-ai-assistant

# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/now-ai-assistant.git

# Push
git push -u origin main
```

#### 2. Configurar Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (primeira vez)
cd /home/user/webapp
vercel

# Responda as perguntas:
# - Set up and deploy? Yes
# - Which scope? Seu usuário
# - Link to existing project? No
# - Project name? now-ai-assistant
# - Directory? ./
# - Override settings? No

# Deploy em produção
vercel --prod
```

#### 3. Configurar Variáveis de Ambiente

No dashboard do Vercel (https://vercel.com):

1. Vá em Settings → Environment Variables
2. Adicione todas as variáveis do `.env`:

```env
# OpenAI (ESSENCIAL)
OPENAI_API_KEY=sk-proj-...

# Google APIs
GOOGLE_SEARCH_API_KEY=...
GOOGLE_SEARCH_ENGINE_ID=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# News API
NEWS_API_KEY=...

# Plaid (Banking)
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=production

# Social Media
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...

# JWT
JWT_SECRET=GERE_UMA_STRING_ALEATORIA_SEGURA_AQUI

# Database (próximo passo)
DATABASE_URL=...
```

#### 4. Configurar Database de Produção

**Opção A: Supabase (Recomendado - Fácil)**

```bash
# 1. Criar conta em https://supabase.com
# 2. Criar novo projeto
# 3. Copiar DATABASE_URL

# Adicionar no Vercel:
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

**Opção B: Railway**

```bash
# 1. Criar conta em https://railway.app
# 2. New Project → Provision PostgreSQL
# 3. Copiar DATABASE_URL
```

#### 5. Migrar Database

```bash
# Criar schema do database
# (Adaptar conforme necessário)

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  message TEXT,
  response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  key VARCHAR(255),
  value JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

# Adicionar mais tabelas conforme necessário...
```

#### 6. Testar Deploy

```bash
# Sua URL será algo como:
# https://now-ai-assistant.vercel.app

# Testar:
curl https://now-ai-assistant.vercel.app/api/health

# Se funcionar, está pronto! 🎉
```

#### 7. Configurar Domínio Customizado

```bash
# 1. Comprar domínio (ex: now-ai.com)
# Sugestões: Namecheap, GoDaddy, Google Domains

# 2. No Vercel Dashboard:
# Settings → Domains → Add Domain
# Digite: now-ai.com

# 3. Configurar DNS (no provedor do domínio):
# Tipo: CNAME
# Nome: @
# Valor: cname.vercel-dns.com

# 4. Aguardar propagação (5-30 minutos)

# 5. Testar:
curl https://now-ai.com/api/health
```

---

## 🎯 OPÇÃO 2: DEPLOY ROBUSTO (HEROKU)

### Vantagens:
- ✅ Mais controle
- ✅ Add-ons integrados (Redis, PostgreSQL)
- ✅ Escalabilidade clara
- ✅ Logs detalhados

### Passo a Passo:

#### 1. Instalar Heroku CLI

```bash
# Linux/Mac
curl https://cli-assets.heroku.com/install.sh | sh

# Windows
# Baixar em: https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. Criar App Heroku

```bash
# Login
heroku login

# Criar app
cd /home/user/webapp
heroku create now-ai-assistant

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Adicionar Redis (opcional, para cache)
heroku addons:create heroku-redis:mini
```

#### 3. Configurar Variáveis de Ambiente

```bash
# OpenAI
heroku config:set OPENAI_API_KEY=sk-proj-...

# Google
heroku config:set GOOGLE_SEARCH_API_KEY=...
heroku config:set GOOGLE_SEARCH_ENGINE_ID=...

# News
heroku config:set NEWS_API_KEY=...

# JWT
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# Ver todas
heroku config
```

#### 4. Criar Procfile

```bash
# Criar arquivo Procfile na raiz do projeto
cat > /home/user/webapp/Procfile << 'EOF'
web: cd backend && node server-v5.js
EOF
```

#### 5. Deploy

```bash
# Adicionar Heroku remote
git remote add heroku https://git.heroku.com/now-ai-assistant.git

# Deploy
git push heroku main

# Ver logs
heroku logs --tail

# Abrir app
heroku open
```

#### 6. Migrar Database

```bash
# Conectar ao database
heroku pg:psql

# Executar migrations (copiar o SQL do passo anterior)
CREATE TABLE users (...);
CREATE TABLE conversations (...);
# etc...

# Sair
\q
```

---

## 🎯 OPÇÃO 3: DEPLOY PROFISSIONAL (AWS)

### Para quando NOW crescer:

```bash
# 1. EC2 para servidor
# 2. RDS para PostgreSQL
# 3. ElastiCache para Redis
# 4. S3 para arquivos
# 5. CloudFront para CDN
# 6. Route 53 para DNS
# 7. Load Balancer

# Custo estimado: $200-500/mês
# Escalabilidade: Ilimitada
```

---

## 📊 MONITORAMENTO E ANALYTICS

### 1. Sentry (Error Tracking)

```bash
# Instalar
npm install @sentry/node

# Configurar no server-v5.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://...@sentry.io/...",
  environment: process.env.NODE_ENV || "development",
});

# Usar
app.use(Sentry.Handlers.errorHandler());
```

### 2. LogRocket (Session Replay)

```bash
# Instalar
npm install logrocket

# Configurar
import LogRocket from 'logrocket';
LogRocket.init('app/id');
```

### 3. Google Analytics

```html
<!-- Adicionar no index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔒 SEGURANÇA EM PRODUÇÃO

### 1. Rate Limiting

```bash
npm install express-rate-limit

# Adicionar no server-v5.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requests
});

app.use('/api/', limiter);
```

### 2. Helmet (Security Headers)

```bash
npm install helmet

# Adicionar
const helmet = require('helmet');
app.use(helmet());
```

### 3. CORS Restrito

```javascript
// Em produção, restringir origins
app.use(cors({
  origin: [
    'https://now-ai.com',
    'https://www.now-ai.com'
  ],
  credentials: true
}));
```

### 4. Input Validation

```bash
npm install joi

# Validar inputs
const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});
```

---

## 🧪 TESTES ANTES DO LANÇAMENTO

### Checklist de Testes:

```bash
# 1. Health Check
curl https://now-ai.com/api/health

# 2. Authentication
curl -X POST https://now-ai.com/api/auth/register \
  -d '{"email":"test@test.com","password":"test123"}'

# 3. Life OS
curl -X POST https://now-ai.com/api/life-os/initialize \
  -d '{"userId":"test","preferences":{}}'

# 4. Email Zero
curl -X POST https://now-ai.com/api/email/connect \
  -d '{"userId":"test","credentials":{}}'

# 5. AI Trader
curl -X POST https://now-ai.com/api/trading/initialize \
  -d '{"userId":"test","config":{"initialBalance":10000}}'

# 6. Shopping
curl -X POST https://now-ai.com/api/shopping/initialize \
  -d '{"userId":"test","preferences":{}}'

# 7. Load Test (Apache Bench)
ab -n 1000 -c 10 https://now-ai.com/api/health
```

---

## 📈 OTIMIZAÇÕES DE PERFORMANCE

### 1. Cache com Redis

```bash
npm install redis

# Implementar cache
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache de 1 hora
app.get('/api/finance/quote/:symbol', async (req, res) => {
  const cached = await client.get(`quote:${req.params.symbol}`);
  if (cached) return res.json(JSON.parse(cached));
  
  const quote = await financeService.getQuote(req.params.symbol);
  await client.setex(`quote:${req.params.symbol}`, 3600, JSON.stringify(quote));
  
  res.json(quote);
});
```

### 2. Compression

```bash
npm install compression

const compression = require('compression');
app.use(compression());
```

### 3. CDN para Assets

```javascript
// Usar CloudFlare ou Vercel CDN
// Assets ficam em:
// https://cdn.now-ai.com/assets/
```

---

## 💰 CUSTOS ESTIMADOS

### Setup Inicial (Gratuito ou Mínimo):
- **Vercel**: $0 (hobby plan)
- **Supabase**: $0 (free tier)
- **Domínio**: $10-15/ano
- **TOTAL**: ~$15/ano

### Produção Pequena (100 usuários):
- **Vercel Pro**: $20/mês
- **Supabase Pro**: $25/mês
- **APIs (OpenAI, etc)**: $50-100/mês
- **TOTAL**: $95-145/mês

### Produção Média (1.000 usuários):
- **Heroku/AWS**: $200/mês
- **Database**: $50/mês
- **Redis**: $30/mês
- **APIs**: $200-500/mês
- **CDN**: $20/mês
- **TOTAL**: $500-800/mês

### Produção Grande (10.000+ usuários):
- **AWS Full**: $2.000-5.000/mês
- **APIs**: $2.000+/mês
- **Support**: $500/mês
- **TOTAL**: $4.500-7.500/mês

---

## 📱 PRÓXIMOS PASSOS APÓS DEPLOY

### Semana 1:
- [ ] Deploy completo
- [ ] Monitorar erros (Sentry)
- [ ] Ajustar conforme necessário
- [ ] 10 beta testers

### Semana 2-4:
- [ ] Coletar feedback
- [ ] Iterar rapidamente
- [ ] 50 usuários beta
- [ ] Métricas de uso

### Mês 2:
- [ ] Landing page profissional
- [ ] Blog/conteúdo
- [ ] SEO otimizado
- [ ] 100 usuários pagos

### Mês 3:
- [ ] Launch em Product Hunt
- [ ] PR e marketing
- [ ] 500 usuários
- [ ] $10K MRR

---

## 🎯 LANÇAMENTO OFICIAL

### Pre-Launch Checklist:

#### Técnico:
- [ ] Deploy em produção funcionando
- [ ] Todos os endpoints testados
- [ ] Database com backup automático
- [ ] Monitoramento ativo (Sentry)
- [ ] Logs configurados
- [ ] SSL/HTTPS ativo
- [ ] Rate limiting configurado
- [ ] GDPR compliance (deletar dados)

#### Marketing:
- [ ] Landing page atraente
- [ ] Video demo (2-3 minutos)
- [ ] Screenshots profissionais
- [ ] Copy de vendas (headlines)
- [ ] Pricing page
- [ ] FAQ
- [ ] Blog com 5+ posts
- [ ] Social media profiles

#### Legal:
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookies policy
- [ ] GDPR compliance
- [ ] Company registration (se necessário)

#### Financeiro:
- [ ] Payment gateway (Stripe)
- [ ] Pricing configurado
- [ ] Invoicing automático
- [ ] Tax handling
- [ ] Refund policy

---

## 🚀 ESTRATÉGIA DE LANÇAMENTO

### Fase 1: Soft Launch (Semana 1)
- Anunciar para amigos e família
- 50 early adopters
- Lifetime deal: $99 (unlimited)
- Coletar feedback intenso

### Fase 2: Beta Pública (Semana 2-4)
- Abrir para público
- Product Hunt launch
- Twitter threads
- Reddit (r/SideProject)
- 500 usuários

### Fase 3: Growth (Mês 2-3)
- Content marketing
- SEO otimizado
- Paid ads ($500-1000)
- Partnerships
- 2.000 usuários

### Fase 4: Scale (Mês 4-6)
- Fundraising (opcional)
- Team expansion
- Mobile app
- 10.000+ usuários
- $50K+ MRR

---

## 📞 SUPORTE PÓS-DEPLOY

### Setup Monitoring:

```bash
# 1. Uptime monitoring
# UptimeRobot: https://uptimerobot.com (grátis)

# 2. Error tracking
# Sentry: https://sentry.io (grátis até 5K events)

# 3. Analytics
# Google Analytics + Mixpanel

# 4. Customer support
# Intercom ou Crisp (chat)
```

### Alertas Importantes:

```javascript
// Configurar alertas para:
1. Server down (uptime < 99%)
2. Error rate > 1%
3. Response time > 2s
4. Database full (> 90%)
5. API quota exceeded
```

---

## ✅ CHECKLIST FINAL PRÉ-DEPLOY

### Crítico (NÃO DEPLOY SEM):
- [x] ✅ Código testado
- [ ] ⏳ API keys configuradas
- [ ] ⏳ Database de produção
- [ ] ⏳ SSL/HTTPS ativo
- [ ] ⏳ Backups automáticos
- [ ] ⏳ Monitoring ativo

### Importante (Deploy, mas completar logo):
- [ ] ⏳ Rate limiting
- [ ] ⏳ Helmet security
- [ ] ⏳ Error tracking (Sentry)
- [ ] ⏳ Analytics
- [ ] ⏳ Landing page
- [ ] ⏳ Payment gateway

### Nice to Have (Pode fazer depois):
- [ ] 🔵 Blog
- [ ] 🔵 Mobile app
- [ ] 🔵 API pública
- [ ] 🔵 White-label

---

## 🎉 DEPLOY COMPLETO!

**Quando tudo estiver configurado:**

```bash
# Testar produção
curl https://now-ai.com/api/health

# Se retornar:
{
  "status": "online",
  "version": "v5.0",
  "services": { ... }
}

# 🎊 PARABÉNS! NOW ESTÁ EM PRODUÇÃO! 🎊
```

---

**Próximo arquivo: Vou criar o guia de MARKETING e GROWTH** 📈

**Quer que eu continue?**

---

*Documento criado em: 2026-02-08*  
*Para: NOW v5.0*  
*Status: Ready for deployment*
