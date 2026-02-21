# 🔑 GUIA DE CONFIGURAÇÃO DE APIs

Este guia explica como obter e configurar TODAS as chaves de API necessárias para NOW v4.0.

---

## 📋 CHECKLIST DE APIs

### ✅ Gratuitas (Free Tier)
- [ ] OpenAI API (trial credits)
- [ ] Google Search API (100 queries/dia grátis)
- [ ] News API (100 requests/dia grátis)
- [ ] Yahoo Finance (ilimitado, sem chave)
- [ ] Plaid (sandbox grátis)

### 💰 Pagas (após free tier)
- [ ] OpenAI ($0.002-0.06 por 1K tokens)
- [ ] Google Calendar ($0 até limite)
- [ ] Twitter/X API ($100-5000/mês)
- [ ] LinkedIn API (enterprise only)
- [ ] Plaid Production ($0.25-1 por transação)

---

## 1️⃣ OpenAI API (CRÍTICO)

### O que faz:
- Respostas inteligentes de IA
- Geração de conteúdo
- Vision (análise de imagens)
- Multi-Agent System
- Clone digital

### Como obter:
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma conta (ou faça login)
3. Navegue para "API Keys"
4. Clique em "Create new secret key"
5. Copie a chave (começa com `sk-proj-`)
6. **IMPORTANTE**: Guarde em local seguro (não pode recuperar depois)

### Custos:
- **GPT-4o**: $0.005/1K tokens input, $0.015/1K output
- **GPT-4 Vision**: $0.01/1K tokens
- **Créditos grátis**: $5 para novos usuários

### Configuração:
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
```

### Teste:
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## 2️⃣ Google Search API

### O que faz:
- Buscar informações na internet
- Aprendizado contínuo
- Pesquisa de mercado
- Análise de concorrência

### Como obter:
1. Acesse: https://console.cloud.google.com/
2. Crie um projeto novo
3. Habilite "Custom Search API"
4. Navegue para "Credentials" → "Create Credentials" → "API Key"
5. Copie a API Key
6. Acesse: https://programmablesearchengine.google.com/
7. Crie um Search Engine
8. Copie o "Search Engine ID"

### Custos:
- **Grátis**: 100 queries/dia
- **Pago**: $5 por 1.000 queries (após limite)

### Configuração:
```env
GOOGLE_SEARCH_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
GOOGLE_SEARCH_ENGINE_ID=xxxxxxxxxxxxxxxxxxxx
```

### Teste:
```bash
curl "https://www.googleapis.com/customsearch/v1?key=$GOOGLE_SEARCH_API_KEY&cx=$GOOGLE_SEARCH_ENGINE_ID&q=test"
```

---

## 3️⃣ Google Calendar API

### O que faz:
- Gerenciar agenda
- Criar/editar/deletar eventos
- Detectar conflitos
- Sugerir horários livres

### Como obter:
1. Acesse: https://console.cloud.google.com/
2. No mesmo projeto, habilite "Google Calendar API"
3. Navegue para "Credentials"
4. Crie "OAuth 2.0 Client ID"
5. Tipo: "Web application"
6. Adicione redirect URI: `http://localhost:3000/auth/google/callback`
7. Copie Client ID e Client Secret

### Custos:
- **Grátis**: Uso normal
- Limites: 1.000.000 queries/dia

### Configuração:
```env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
```

### Teste:
```bash
# Requer OAuth flow - testar via aplicação
curl http://localhost:3000/api/calendar/events
```

---

## 4️⃣ News API

### O que faz:
- Notícias em tempo real
- Notícias por categoria
- Análise de mercado
- Briefing diário

### Como obter:
1. Acesse: https://newsapi.org/register
2. Crie uma conta gratuita
3. Copie a API Key do dashboard

### Custos:
- **Free**: 100 requests/dia
- **Developer**: $449/mês (unlimited)

### Configuração:
```env
NEWS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Teste:
```bash
curl "https://newsapi.org/v2/top-headlines?country=us&apiKey=$NEWS_API_KEY"
```

---

## 5️⃣ Yahoo Finance (SEM CHAVE! 🎉)

### O que faz:
- Cotações de ações
- Criptomoedas
- Índices de mercado
- Dados históricos

### Como usar:
- **NÃO PRECISA DE API KEY!**
- Usa a biblioteca `yahoo-finance2` (já instalada)
- Funciona imediatamente

### Configuração:
```env
# Nenhuma configuração necessária!
```

### Teste:
```bash
curl http://localhost:3000/api/finance/quote/AAPL
```

---

## 6️⃣ Plaid (Banking)

### O que faz:
- Conectar bancos
- Listar transações
- Análise de gastos
- Gestão de portfólio

### Como obter:
1. Acesse: https://dashboard.plaid.com/signup
2. Crie uma conta
3. Vá para "Keys"
4. Copie Client ID e Secret (sandbox)
5. Para produção, precisa de aprovação

### Custos:
- **Sandbox**: Grátis (dados fake)
- **Development**: Grátis (100 itens)
- **Production**: $0.25-1 por item

### Configuração:
```env
PLAID_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxx
PLAID_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
PLAID_ENV=sandbox
```

### Teste:
```bash
curl -X POST http://localhost:3000/api/bank/connect \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123"}'
```

---

## 7️⃣ Twitter/X API

### O que faz:
- Postar tweets
- Agendar posts
- Analytics
- Responder menções

### Como obter:
1. Acesse: https://developer.twitter.com/
2. Aplique para Developer Account
3. Crie um App
4. Gere API Key, API Secret, Access Token, Access Secret

### Custos:
- **Free**: Read-only (limitado)
- **Basic**: $100/mês (write access)
- **Pro**: $5.000/mês (advanced features)

### Configuração:
```env
TWITTER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_ACCESS_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxx
```

### Teste:
```bash
curl -X POST http://localhost:3000/api/social/post \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test post from NOW AI",
    "platforms": ["twitter"]
  }'
```

---

## 8️⃣ LinkedIn API

### O que faz:
- Postar no LinkedIn
- Compartilhar artigos
- Analytics profissionais
- Network management

### Como obter:
1. Acesse: https://www.linkedin.com/developers/
2. Crie um App
3. Solicite permissões (pode levar dias/semanas)
4. Gere Client ID e Secret

### Custos:
- **Grátis**: Uso básico (após aprovação)
- Limites: Precisa de aprovação manual

### Configuração:
```env
LINKEDIN_CLIENT_ID=xxxxxxxxxxxxxxxx
LINKEDIN_CLIENT_SECRET=xxxxxxxxxxxxxxxx
```

### Teste:
```bash
curl -X POST http://localhost:3000/api/social/post \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Professional post from NOW AI",
    "platforms": ["linkedin"]
  }'
```

---

## 🚀 SETUP RÁPIDO (MÍNIMO VIÁVEL)

Para ter NOW funcionando IMEDIATAMENTE, você precisa de apenas:

### Essencial (Funcionalidade completa):
1. ✅ **OpenAI API** - Para IA funcionar de verdade
2. ✅ **Google Search API** - Para aprendizado com internet

### Opcional (Funciona com mocks):
3. ⚪ News API - Usa mock se não tiver
4. ⚪ Plaid - Usa sandbox/mock
5. ⚪ Twitter/LinkedIn - Usa mock
6. ⚪ Google Calendar - Usa mock

### Arquivo .env mínimo:
```env
PORT=3000
NODE_ENV=production
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
GOOGLE_SEARCH_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
GOOGLE_SEARCH_ENGINE_ID=xxxxxxxxxxxxxxxxxxxx
JWT_SECRET=my-super-secret-jwt-key-2026
```

---

## 💰 CUSTO MENSAL ESTIMADO

### Uso Leve (100 usuários)
- OpenAI: $50-100/mês
- Google Search: Grátis (dentro do limite)
- News API: Grátis
- Plaid: Grátis (sandbox)
- Twitter: $100/mês (Basic)
- **TOTAL: $150-200/mês**

### Uso Médio (1.000 usuários)
- OpenAI: $200-500/mês
- Google Search: $50/mês
- News API: $449/mês
- Plaid: $250/mês
- Twitter: $5.000/mês (Pro)
- **TOTAL: $5.950-6.250/mês**

### Uso Pesado (10.000 usuários)
- OpenAI: $2.000-5.000/mês
- Google Search: $500/mês
- News API: $449/mês
- Plaid: $2.500/mês
- Twitter: $5.000/mês
- **TOTAL: $10.450-13.450/mês**

---

## 🔐 SEGURANÇA DAS CHAVES

### ⚠️ NUNCA FAÇA:
- ❌ Commit de chaves no Git
- ❌ Compartilhar chaves publicamente
- ❌ Usar mesmas chaves em dev/prod
- ❌ Hardcode de chaves no código

### ✅ SEMPRE FAÇA:
- ✅ Use arquivo .env
- ✅ Adicione .env no .gitignore
- ✅ Rotacione chaves periodicamente
- ✅ Use variáveis de ambiente em produção
- ✅ Monitore uso das APIs
- ✅ Configure limites de gasto

---

## 🛠️ TROUBLESHOOTING

### Erro: "Invalid API Key"
- Verifique se copiou a chave completa
- Confirme que não tem espaços extras
- Teste a chave diretamente com curl

### Erro: "Rate Limit Exceeded"
- Você excedeu o limite da API
- Aguarde o reset (geralmente 24h)
- Considere upgrade do plano

### Erro: "Insufficient Credits"
- OpenAI: Adicione créditos em billing
- Google: Habilite billing no projeto
- News API: Upgrade para plano pago

### Serviço não funciona mesmo com chave:
- Verifique se habilitou a API no console
- Confirme que o billing está ativo
- Teste a chave isoladamente
- Veja logs do servidor para detalhes

---

## 📚 RECURSOS ÚTEIS

### Documentação Oficial:
- OpenAI: https://platform.openai.com/docs
- Google APIs: https://console.cloud.google.com/apis
- News API: https://newsapi.org/docs
- Plaid: https://plaid.com/docs/
- Twitter: https://developer.twitter.com/docs
- LinkedIn: https://docs.microsoft.com/linkedin/

### Monitoramento de Uso:
- OpenAI: https://platform.openai.com/usage
- Google: https://console.cloud.google.com/apis/dashboard
- News API: https://newsapi.org/account
- Plaid: https://dashboard.plaid.com/

---

## ✅ CHECKLIST FINAL

Antes de ir para produção, confirme:

- [ ] Todas as chaves configuradas em .env
- [ ] Arquivo .env não está no Git (.gitignore)
- [ ] Chaves testadas individualmente
- [ ] Billing configurado nas APIs pagas
- [ ] Limites de gasto configurados
- [ ] Logs de erro funcionando
- [ ] Fallbacks (mocks) funcionando se API falhar
- [ ] Monitoramento de uso ativo
- [ ] Documentação atualizada
- [ ] Equipe treinada em troubleshooting

---

## 🎉 RESULTADO FINAL

Com todas as APIs configuradas, NOW v4.0 terá:

✅ **Inteligência real** (OpenAI)
✅ **Conhecimento atualizado** (Google Search)
✅ **Notícias em tempo real** (News API)
✅ **Dados financeiros reais** (Yahoo Finance)
✅ **Gestão bancária** (Plaid)
✅ **Redes sociais** (Twitter/LinkedIn)
✅ **Agenda inteligente** (Google Calendar)

**Transformação: de MVP para produto PRODUCTION READY! 🚀**

---

*Última atualização: 2026-02-08*
*Versão: 4.0.0*
*Status: Pronto para integração*
