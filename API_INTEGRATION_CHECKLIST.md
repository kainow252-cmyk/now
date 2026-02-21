# 🔌 API INTEGRATION CHECKLIST - NOW v5.0

## 📋 CHECKLIST COMPLETO DE INTEGRAÇÃO

Este documento guia você passo-a-passo para conectar TODAS as APIs do NOW v5.0 e deixá-lo 100% funcional.

---

## 🎯 VISÃO GERAL

**Status Atual**: NOW v5.0 está rodando com mocks (dados simulados)  
**Objetivo**: Conectar APIs reais e tornar todas as funcionalidades operacionais  
**Tempo estimado**: 2-4 horas para configuração completa  
**Custo mensal estimado**: $200-500 (dependendo do uso)

---

## 📊 PRIORIZAÇÃO DE APIS

### 🔴 CRÍTICAS (Implementar AGORA)
- OpenAI API - Cérebro do sistema
- Yahoo Finance API - Dados financeiros
- Google Gmail API - Email Zero Inbox

### 🟡 IMPORTANTES (Esta semana)
- Plaid API - Banking integration
- Alpha Vantage API - Trading data
- News API - Notícias

### 🟢 OPCIONAIS (Quando necessário)
- Twitter/X API - Social media
- LinkedIn API - Professional network
- Google Calendar API - Agenda

---

## 1️⃣ OPENAI API (CRÍTICO)

### Por que precisa?
- Essencial para TODOS os recursos de IA
- Processamento de linguagem natural
- Análises inteligentes

### Como obter:

```bash
# 1. Acesse: https://platform.openai.com/signup
# 2. Crie uma conta (cartão necessário)
# 3. Vá para: https://platform.openai.com/api-keys
# 4. Clique em "Create new secret key"
# 5. Copie a chave (começa com "sk-")
```

### Configuração:

```bash
# Abra o arquivo .env
nano /home/user/webapp/backend/.env

# Adicione:
OPENAI_API_KEY=sk-proj-SEU_TOKEN_AQUI_xxxxxxxxxxxxx
```

### Custo estimado:
- **Tier Free**: $5 grátis (teste)
- **Pay-as-you-go**: ~$0.002 por 1k tokens
- **Estimativa mensal**: $50-150 (uso moderado)

### Teste:
```bash
curl -X POST https://SEU_DOMINIO/api/life-os/consult \
  -H "Content-Type: application/json" \
  -d '{"userId": "test", "question": "Como está meu dia hoje?"}'
```

---

## 2️⃣ YAHOO FINANCE API (CRÍTICO)

### Por que precisa?
- Cotações de ações em tempo real
- Dados de mercado
- AI Day Trader

### Como obter:

**Opção A: Yahoo Finance API (RapidAPI) - RECOMENDADO**

```bash
# 1. Acesse: https://rapidapi.com/sparior/api/yahoo-finance15
# 2. Cadastre-se grátis
# 3. Subscribe no plano Basic (grátis - 500 req/mês)
# 4. Copie sua chave API
```

```bash
# Configure no .env:
YAHOO_FINANCE_API_KEY=SUA_CHAVE_RAPIDAPI_AQUI
YAHOO_FINANCE_API_HOST=yahoo-finance15.p.rapidapi.com
```

**Opção B: Alpha Vantage (Alternativa)**

```bash
# 1. Acesse: https://www.alphavantage.co/support/#api-key
# 2. Preencha o formulário (grátis)
# 3. Receba a chave por email
```

```bash
# Configure no .env:
ALPHA_VANTAGE_API_KEY=SUA_CHAVE_AQUI
```

### Custo:
- **RapidAPI Basic**: GRÁTIS (500 req/mês)
- **RapidAPI Pro**: $9.99/mês (10k req)
- **Alpha Vantage**: GRÁTIS (500 req/dia)

### Teste:
```bash
curl https://SEU_DOMINIO/api/finance/quote/AAPL
```

---

## 3️⃣ GOOGLE GMAIL API (CRÍTICO)

### Por que precisa?
- Email Zero Inbox
- Leitura/envio de emails
- Automação de respostas

### Como obter:

```bash
# 1. Acesse: https://console.cloud.google.com/
# 2. Crie um novo projeto: "NOW Assistant"
# 3. Ative a Gmail API:
#    - API & Services > Library
#    - Procure "Gmail API" > Enable
# 4. Crie credenciais OAuth 2.0:
#    - API & Services > Credentials
#    - Create Credentials > OAuth client ID
#    - Application type: Web application
#    - Authorized redirect URIs: https://SEU_DOMINIO/api/email/auth/callback
# 5. Baixe o JSON de credenciais
```

### Configuração:

```bash
# Configure no .env:
GOOGLE_CLIENT_ID=SEU_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=SEU_CLIENT_SECRET
GOOGLE_REDIRECT_URI=https://SEU_DOMINIO/api/email/auth/callback
```

### Custo:
- **GRÁTIS**: 250 quota units/usuário/segundo
- Suficiente para milhares de emails/dia

### Teste:
```bash
# 1. Abra o navegador:
https://SEU_DOMINIO/api/email/auth

# 2. Autorize o acesso
# 3. Teste inbox:
curl https://SEU_DOMINIO/api/email/inbox
```

---

## 4️⃣ PLAID API (IMPORTANTE)

### Por que precisa?
- Bank Integration
- Sincronização de contas bancárias
- Transações automáticas

### Como obter:

```bash
# 1. Acesse: https://dashboard.plaid.com/signup
# 2. Crie uma conta (grátis para desenvolvimento)
# 3. Vá para: Keys
# 4. Copie: client_id, secret (sandbox)
```

### Configuração:

```bash
# Configure no .env:
PLAID_CLIENT_ID=SEU_CLIENT_ID
PLAID_SECRET=SEU_SECRET_SANDBOX
PLAID_ENV=sandbox  # depois mude para production
```

### Custo:
- **Sandbox**: GRÁTIS (desenvolvimento)
- **Production**: $0.30 por verificação
- **Estimativa**: $30-100/mês (100-300 usuários)

### Teste:
```bash
curl -X POST https://SEU_DOMINIO/api/bank/create-link-token \
  -H "Content-Type: application/json" \
  -d '{"userId": "test123"}'
```

---

## 5️⃣ NEWS API (IMPORTANTE)

### Por que precisa?
- Notícias em tempo real
- Market Intelligence
- Análise de sentimento

### Como obter:

```bash
# 1. Acesse: https://newsapi.org/register
# 2. Crie uma conta grátis
# 3. Copie sua API key
```

### Configuração:

```bash
# Configure no .env:
NEWS_API_KEY=SUA_CHAVE_AQUI
```

### Custo:
- **Developer**: GRÁTIS (100 req/dia)
- **Business**: $449/mês (25k req/dia)

### Teste:
```bash
curl "https://newsapi.org/v2/everything?q=technology&apiKey=SUA_CHAVE"
```

---

## 6️⃣ GOOGLE CALENDAR API (OPCIONAL)

### Por que precisa?
- Sincronização de agenda
- Agendamento automático
- Lembretes inteligentes

### Como obter:

```bash
# Mesmo processo do Gmail API (mesmo projeto Google Cloud)
# 1. Console Google Cloud > API & Services
# 2. Enable "Google Calendar API"
# 3. Usar as mesmas credenciais OAuth
```

### Custo:
- **GRÁTIS**: 1 milhão de requisições/dia

---

## 7️⃣ TWITTER/X API (OPCIONAL)

### Por que precisa?
- Postar tweets por voz
- Monitorar menções
- Análise de tendências

### Como obter:

```bash
# 1. Acesse: https://developer.twitter.com/
# 2. Apply for API access (pode demorar dias)
# 3. Crie um app
# 4. Copie: API Key, API Secret, Bearer Token
```

### Custo:
- **Free**: LIMITADO (muito restrito)
- **Basic**: $100/mês
- **Pro**: $5,000/mês

⚠️ **NOTA**: Twitter API está muito cara agora. Considere alternativas.

---

## 🔧 CONFIGURAÇÃO FINAL

### Arquivo .env completo:

```bash
# =====================================
# NOW v5.0 - Production Configuration
# =====================================

# Server
PORT=3000
NODE_ENV=production

# OpenAI (CRÍTICO)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx

# Finance APIs
YAHOO_FINANCE_API_KEY=xxxxxxxxxxxxxxxxxxxxx
YAHOO_FINANCE_API_HOST=yahoo-finance15.p.rapidapi.com
ALPHA_VANTAGE_API_KEY=xxxxxxxxxxxxxxxxxxxxx

# Google Services
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://SEUDOMINIO.com/api/email/auth/callback

# Banking
PLAID_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxx
PLAID_SECRET=xxxxxxxxxxxxxxxxxxxxx
PLAID_ENV=sandbox  # mude para 'production' quando pronto

# News
NEWS_API_KEY=xxxxxxxxxxxxxxxxxxxxx

# Database (quando migrar do in-memory)
DATABASE_URL=postgresql://user:pass@host:5432/nowai

# Security
JWT_SECRET=seu_secret_super_seguro_aqui_mude_em_producao
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Depois de configurar todas as APIs, valide cada uma:

### 1. OpenAI
```bash
curl -X POST https://SEU_DOMINIO/api/life-os/consult \
  -H "Content-Type: application/json" \
  -d '{"userId": "test", "question": "teste"}'

# ✅ Deve retornar resposta inteligente
```

### 2. Finance
```bash
curl https://SEU_DOMINIO/api/finance/quote/AAPL

# ✅ Deve retornar cotação real da Apple
```

### 3. Email
```bash
curl https://SEU_DOMINIO/api/email/inbox

# ✅ Deve retornar seus emails (após auth)
```

### 4. Banking
```bash
curl -X POST https://SEU_DOMINIO/api/bank/create-link-token \
  -H "Content-Type: application/json" \
  -d '{"userId": "test"}'

# ✅ Deve retornar link_token válido
```

### 5. AI Trader
```bash
curl https://SEU_DOMINIO/api/ai-trader/portfolio

# ✅ Deve retornar portfolio (mesmo vazio)
```

---

## 📈 MONITORAMENTO DE CUSTOS

### Setup de monitoramento:

```bash
# 1. Configure alertas em cada plataforma:
# - OpenAI: https://platform.openai.com/account/billing/overview
# - RapidAPI: https://rapidapi.com/developer/billing
# - Plaid: https://dashboard.plaid.com/billing

# 2. Defina limites de gastos:
# - OpenAI: $100/mês (para começar)
# - RapidAPI: Free tier primeiro
# - Plaid: Sandbox grátis até testar
```

### Dashboard recomendado:

Crie um script de monitoramento:

```javascript
// backend/scripts/monitor-api-usage.js
const monitorAPIs = async () => {
  // Consultar uso de cada API
  // Enviar relatório diário
  // Alertar se passar de 80% do limite
};

// Rodar diariamente (cron)
```

---

## 🚀 PRÓXIMOS PASSOS

### Ordem de implementação:

1. **Hoje (2-3 horas)**:
   - ✅ OpenAI API (essencial)
   - ✅ Yahoo Finance API (trading)
   - ✅ Testar endpoints principais

2. **Esta semana**:
   - ✅ Gmail API (email automation)
   - ✅ Plaid API (banking)
   - ✅ News API (market intel)

3. **Mês 1**:
   - ✅ Migrar de in-memory para PostgreSQL
   - ✅ Deploy em produção (Vercel/Heroku)
   - ✅ Domínio customizado
   - ✅ SSL/HTTPS

4. **Mês 2-3**:
   - ✅ Twitter/LinkedIn APIs (se necessário)
   - ✅ Google Calendar API
   - ✅ Monitoramento completo
   - ✅ Primeiros beta users

---

## 🆘 TROUBLESHOOTING

### Problema: "API key inválida"
```bash
# 1. Verifique se a chave está correta no .env
# 2. Reinicie o servidor: pm2 restart now-v5
# 3. Verifique logs: pm2 logs now-v5
```

### Problema: "Rate limit exceeded"
```bash
# Você atingiu o limite de requisições
# Solução: Upgrade do plano ou aguardar reset
```

### Problema: "CORS error"
```bash
# Adicione seu domínio frontend ao CORS:
# server-v5.js:
app.use(cors({
  origin: ['https://SEUDOMINIO.com', 'http://localhost:3000']
}));
```

---

## 💰 RESUMO DE CUSTOS

### Setup inicial (mês 1):
- OpenAI: $50 (teste)
- Yahoo Finance: GRÁTIS
- Gmail API: GRÁTIS
- Plaid: GRÁTIS (sandbox)
- News API: GRÁTIS
- **TOTAL: ~$50**

### Produção (mês 2+):
- OpenAI: $100-200
- Yahoo Finance: $10 (RapidAPI Pro)
- Gmail API: GRÁTIS
- Plaid: $30-100
- News API: GRÁTIS
- Servidor: $50-100
- **TOTAL: ~$200-400/mês**

### Escala (100+ usuários):
- OpenAI: $500-1000
- APIs: $200-300
- Servidor: $200-500
- Database: $100-200
- **TOTAL: ~$1000-2000/mês**

---

## 📞 SUPORTE

### Recursos úteis:

- **OpenAI Docs**: https://platform.openai.com/docs
- **Plaid Quickstart**: https://plaid.com/docs/quickstart/
- **Google API Docs**: https://developers.google.com/apis-explorer
- **News API Docs**: https://newsapi.org/docs

### Comunidades:

- OpenAI Discord: https://discord.gg/openai
- Plaid Community: https://community.plaid.com/
- Stack Overflow: #openai #plaid #gmail-api

---

## ✨ QUANDO TUDO ESTIVER PRONTO

### Validação final:

```bash
# Execute o health check completo:
curl https://SEU_DOMINIO/api/health

# Deve retornar:
# {
#   "status": "online",
#   "services": {
#     "openai": true,      ← ✅
#     "finance": true,     ← ✅
#     "email": true,       ← ✅
#     "banking": true,     ← ✅
#     "trader": true       ← ✅
#   }
# }
```

### Comemorar! 🎉

Você agora tem:
- ✅ NOW v5.0 100% funcional
- ✅ Todas APIs conectadas
- ✅ Sistema revolucionário pronto
- ✅ Pronto para primeiros usuários!

---

**Criado em**: 2026-02-08  
**Versão**: 1.0  
**Status**: Ready for Production 🚀

