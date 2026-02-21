# 🚀 NOW - Quick Start Guide

## ⚡ Acesso Rápido

**URL da Aplicação:**
```
https://3000-iigl23rg7f2e0o7sqzgdy-0e616f0a.sandbox.novita.ai
```

## 🎤 Como Usar

### 1. Abrir a Aplicação
- Clique no link acima
- Permita acesso ao microfone quando solicitado

### 2. Ativar Comando de Voz
- Clique no **orbe azul** (microfone central)
- Aguarde o indicador "Ouvindo..."

### 3. Comandos de Voz

#### Rotina Diária
```
"NOW, bom dia"
"NOW, boa noite"
```

#### Agenda
```
"NOW, organize meu dia"
"NOW, mostra minha agenda"
```

#### Investimentos
```
"NOW, notícias sobre investimentos"
"NOW, analisa o mercado financeiro"
```

#### Redes Sociais
```
"NOW, cria um post"
"NOW, publica nas redes sociais"
```

#### Pesquisa
```
"NOW, pesquisa sobre IA"
"NOW, investiga esse mercado"
```

#### Viagens
```
"NOW, sugere destinos"
"NOW, organiza viagem"
```

#### Código
```
"NOW, cria um site"
"NOW, gera código"
```

## 🔧 Tecnologias

- **Frontend:** HTML5 + CSS3 + JavaScript
- **Backend:** Node.js + Express.js
- **Voz:** Web Speech API
- **Cloud:** Servidor ativo 24/7

## 📁 Estrutura Local

```bash
# Iniciar servidor local
cd backend
npm install
npm start

# Acessar
http://localhost:3000
```

## 🌐 API Endpoints

```
GET  /api/health           # Status do servidor
POST /api/command          # Processar comando
GET  /api/schedule         # Obter agenda
POST /api/schedule         # Adicionar compromisso
GET  /api/news/:category   # Obter notícias
GET  /api/finance/:symbol  # Dados financeiros
POST /api/social/post      # Criar post social
GET  /api/memory/:userId   # Obter memória/preferências
POST /api/memory           # Atualizar preferências
```

## 🔐 Configuração (Produção)

Para uso profissional, configure as APIs no arquivo `.env`:

```bash
# OpenAI (IA avançada)
OPENAI_API_KEY=sua_chave

# Google Calendar
GOOGLE_CLIENT_ID=sua_id
GOOGLE_CLIENT_SECRET=seu_secret

# News API
NEWS_API_KEY=sua_chave

# Social Media
TWITTER_API_KEY=sua_chave
LINKEDIN_API_KEY=sua_chave
```

## 💡 Dicas

✅ **Melhor navegador:** Chrome ou Edge
✅ **Microfone:** Necessário para comando de voz
✅ **Mobile:** Funciona em celulares também
✅ **Botões rápidos:** Use os atalhos para testar

## 🆘 Problemas Comuns

**Microfone não funciona?**
- Verifique permissões do navegador
- Teste em modo HTTPS

**Sem resposta de voz?**
- Verifique volume do dispositivo
- Alguns navegadores precisam de interação inicial

**Servidor offline?**
```bash
cd backend
npm start
```

## 📞 Suporte

Abra uma issue no repositório para questões técnicas.

---

**NOW** - Sua assistente inteligente pronta para trabalhar! 🤖⚡
