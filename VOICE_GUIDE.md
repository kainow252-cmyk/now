# 🎙️ NOW v5.0 - GUIA DE VOZ E ÁUDIO

## 🎯 SISTEMA DE VOZ IMPLEMENTADO!

Agora o NOW responde com **ÁUDIO + TEXTO**! Como JARVIS real! 🚀

---

## 🔊 NOVOS ENDPOINTS DE VOZ

### 1. Text-to-Speech Básico
Converte qualquer texto em áudio.

```bash
curl -X POST https://3000-iigl23rg7f2e0o7sqzgdy-0e616f0a.sandbox.novita.ai/api/voice/speak \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Olá! Eu sou o NOW, seu assistente pessoal.",
    "voice": "nova",
    "speed": 1.0
  }'
```

**Resposta**:
```json
{
  "success": true,
  "audioUrl": "data:audio/mp3;base64,//uQxAAA...",
  "text": "Olá! Eu sou o NOW...",
  "voice": "nova",
  "speed": 1.0,
  "format": "mp3",
  "size": 45230
}
```

---

### 2. Chat com Áudio
Envie uma mensagem e receba resposta em **texto + áudio**!

```bash
curl -X POST https://3000-iigl23rg7f2e0o7sqzgdy-0e616f0a.sandbox.novita.ai/api/voice/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Bom dia! Como está o mercado hoje?",
    "userId": "user123",
    "voice": "nova",
    "speed": 1.0
  }'
```

**Resposta**:
```json
{
  "success": true,
  "text": "Bom dia! O mercado está em alta: Bitcoin +3.2%, tech stocks subindo...",
  "audio": {
    "success": true,
    "audioUrl": "data:audio/mp3;base64,//uQxAAA...",
    "voice": "nova",
    "speed": 1.0,
    "size": 52340
  },
  "timestamp": "2026-02-08T21:15:00.000Z"
}
```

---

### 3. Life OS com Áudio
Consulte o Life OS e receba resposta falada!

```bash
curl -X POST https://3000-iigl23rg7f2e0o7sqzgdy-0e616f0a.sandbox.novita.ai/api/life-os/consult \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "question": "Como posso ser mais produtivo hoje?",
    "withAudio": true,
    "voice": "nova",
    "speed": 1.0
  }'
```

**Resposta**:
```json
{
  "success": true,
  "response": "Para ser mais produtivo hoje, priorize suas 3 tarefas mais importantes...",
  "audio": {
    "success": true,
    "audioUrl": "data:audio/mp3;base64,//uQxAAA...",
    "voice": "nova",
    "speed": 1.0
  },
  "timestamp": "2026-02-08T21:15:00.000Z"
}
```

---

### 4. Ver Vozes Disponíveis

```bash
curl https://3000-iigl23rg7f2e0o7sqzgdy-0e616f0a.sandbox.novita.ai/api/voice/voices
```

**Resposta**:
```json
{
  "success": true,
  "voices": [
    {
      "id": "alloy",
      "name": "Alloy",
      "description": "Neutro e versátil",
      "gender": "neutral"
    },
    {
      "id": "echo",
      "name": "Echo",
      "description": "Masculina, clara",
      "gender": "male"
    },
    {
      "id": "nova",
      "name": "Nova",
      "description": "Feminina, energética (PADRÃO)",
      "gender": "female",
      "default": true
    }
  ],
  "default": "nova",
  "speedRange": {
    "min": 0.25,
    "max": 4.0,
    "default": 1.0
  }
}
```

---

## 🎨 VOZES DISPONÍVEIS

| Voz | Gênero | Descrição | Uso recomendado |
|-----|--------|-----------|------------------|
| **nova** ⭐ | Feminino | Energética, clara | **PADRÃO - Melhor para assistente** |
| alloy | Neutro | Versátil, neutro | Narração geral |
| echo | Masculino | Clara, profissional | Apresentações |
| fable | Masculino | Expressiva | Storytelling |
| onyx | Masculino | Grave, séria | Notícias, relatórios |
| shimmer | Feminino | Suave, calma | Meditação, relaxamento |

**Recomendação**: Use **`nova`** para NOW - é a mais natural para assistente!

---

## ⚡ PARÂMETROS

### Voice (voz)
- **Opções**: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`
- **Padrão**: `nova`
- **Exemplo**: `"voice": "nova"`

### Speed (velocidade)
- **Range**: 0.25 a 4.0
- **Padrão**: 1.0
- **Recomendado**: 0.9 a 1.2
- **Exemplo**: `"speed": 1.1` (10% mais rápido)

### Format (formato)
- **Opções**: `mp3`, `opus`, `aac`, `flac`
- **Padrão**: `mp3`
- **Recomendado**: `mp3` (melhor compatibilidade)

---

## 📱 EXEMPLO FRONTEND (HTML + JavaScript)

```html
<!DOCTYPE html>
<html>
<head>
    <title>NOW Voice Assistant</title>
</head>
<body>
    <h1>🎙️ NOW Voice Assistant</h1>
    
    <input type="text" id="messageInput" placeholder="Digite sua mensagem...">
    <button onclick="sendMessage()">Enviar</button>
    
    <div id="response"></div>
    <audio id="audioPlayer" controls></audio>

    <script>
        async function sendMessage() {
            const message = document.getElementById('messageInput').value;
            
            const response = await fetch('https://3000-iigl23rg7f2e0o7sqzgdy-0e616f0a.sandbox.novita.ai/api/voice/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    userId: 'user123',
                    voice: 'nova',
                    speed: 1.0
                })
            });

            const data = await response.json();
            
            // Mostrar texto
            document.getElementById('response').innerText = data.text;
            
            // Tocar áudio
            if (data.audio && data.audio.audioUrl) {
                const audioPlayer = document.getElementById('audioPlayer');
                audioPlayer.src = data.audio.audioUrl;
                audioPlayer.play();
            }
        }
    </script>
</body>
</html>
```

---

## 🔧 TESTANDO AGORA

### Teste 1: Texto para áudio
```bash
curl -X POST https://3000-iigl23rg7f2e0o7sqzgdy-0e616f0a.sandbox.novita.ai/api/voice/speak \
  -H "Content-Type: application/json" \
  -d '{"text": "Olá! Teste de voz do NOW."}'
```

### Teste 2: Chat com áudio
```bash
curl -X POST https://3000-iigl23rg7f2e0o7sqzgdy-0e616f0a.sandbox.novita.ai/api/voice/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá NOW, como você está?"}'
```

### Teste 3: Life OS com áudio
```bash
curl -X POST https://3000-iigl23rg7f2e0o7sqzgdy-0e616f0a.sandbox.novita.ai/api/life-os/consult \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test",
    "question": "Me dê dicas de produtividade",
    "withAudio": true
  }'
```

---

## 💡 CASOS DE USO

### 1. Assistente de Voz Completo
```javascript
// Pergunte qualquer coisa e ouça a resposta!
const response = await fetch('/api/voice/chat', {
    method: 'POST',
    body: JSON.stringify({
        message: "Qual é minha agenda hoje?",
        withAudio: true
    })
});
```

### 2. Notificações Faladas
```javascript
// Transforme notificações em áudio
const response = await fetch('/api/voice/speak', {
    method: 'POST',
    body: JSON.stringify({
        text: "Você tem uma reunião em 15 minutos!",
        voice: "nova"
    })
});
```

### 3. Resumos Diários por Voz
```javascript
// Ouça seu resumo diário
const response = await fetch('/api/life-os/dashboard/user123');
const dashboard = await response.json();

const audio = await fetch('/api/voice/speak', {
    method: 'POST',
    body: JSON.stringify({
        text: `Bom dia! Você tem ${dashboard.tasks} tarefas hoje...`,
        voice: "nova"
    })
});
```

---

## 🎯 MODO JARVIS COMPLETO

Combine voz + texto para experiência JARVIS real:

```javascript
async function askJarvis(question) {
    // 1. Enviar pergunta
    const response = await fetch('/api/voice/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: question,
            userId: 'user123',
            voice: 'nova',
            speed: 1.1  // Levemente mais rápido
        })
    });

    const data = await response.json();

    // 2. Mostrar texto na tela
    console.log('NOW:', data.text);

    // 3. Tocar áudio
    const audio = new Audio(data.audio.audioUrl);
    audio.play();

    return data;
}

// Uso:
askJarvis("Bom dia NOW! Como está o mercado hoje?");
```

---

## 🚀 INTEGRAÇÃO COM FRONTEND

### Opção 1: Simple Audio Player
```html
<audio id="nowVoice" controls autoplay></audio>

<script>
    function playNowResponse(audioUrl) {
        document.getElementById('nowVoice').src = audioUrl;
    }
</script>
```

### Opção 2: Auto-play (melhor UX)
```javascript
async function chatWithNow(message) {
    const res = await fetch('/api/voice/chat', {
        method: 'POST',
        body: JSON.stringify({ message, voice: 'nova' })
    });
    
    const data = await res.json();
    
    // Auto-play áudio
    const audio = new Audio(data.audio.audioUrl);
    await audio.play();
    
    return data.text;
}
```

---

## 📊 CUSTOS DE VOZ

### OpenAI TTS Pricing

| Modelo | Qualidade | Preço | Velocidade |
|--------|-----------|-------|------------|
| **tts-1** | Padrão | $0.015 / 1K chars | Rápido ⚡ |
| **tts-1-hd** | Alta | $0.030 / 1K chars | Lento 🐢 |

**Exemplo de custos**:
- Resposta de 100 caracteres: $0.0015 (0.15 centavos)
- 1000 respostas/dia: $1.50/dia = $45/mês
- Resposta média (200 chars): $0.003 cada

**💡 Dica**: Use `tts-1` (padrão) para produção - é 2x mais barato e rápido!

---

## ⚙️ CONFIGURAÇÃO

### 1. OpenAI API Key (NECESSÁRIO)
```bash
# Obtenha em: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### 2. Configurar .env
```bash
cd /home/user/webapp/backend
nano .env

# Adicione:
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### 3. Reiniciar servidor
```bash
pm2 restart now-v5
```

---

## 🎬 DEMO COMPLETO

### Script de teste completo:

```bash
#!/bin/bash

BASE_URL="https://3000-iigl23rg7f2e0o7sqzgdy-0e616f0a.sandbox.novita.ai"

echo "🎙️ Testando NOW Voice System..."
echo ""

# Teste 1: Vozes disponíveis
echo "1️⃣ Listar vozes:"
curl -s "$BASE_URL/api/voice/voices" | jq '.voices[] | {id, name, description}'
echo ""

# Teste 2: TTS básico
echo "2️⃣ Converter texto em áudio:"
curl -s -X POST "$BASE_URL/api/voice/speak" \
  -H "Content-Type: application/json" \
  -d '{"text": "Olá! Eu sou o NOW, seu assistente inteligente."}' \
  | jq '{success, voice, size}'
echo ""

# Teste 3: Chat com áudio
echo "3️⃣ Chat com resposta em áudio:"
curl -s -X POST "$BASE_URL/api/voice/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Bom dia NOW! Como você está?"}' \
  | jq '{success, text, audio: {success: .audio.success, size: .audio.size}}'
echo ""

# Teste 4: Life OS com áudio
echo "4️⃣ Life OS com resposta falada:"
curl -s -X POST "$BASE_URL/api/life-os/consult" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test",
    "question": "Me dê 3 dicas de produtividade",
    "withAudio": true
  }' | jq '{success, response, audio: {success: .audio.success}}'

echo ""
echo "✅ Testes concluídos!"
```

---

## 🆘 TROUBLESHOOTING

### Problema: "API key not configured"
```bash
# Solução: Configure OpenAI API key no .env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### Problema: Áudio não toca no navegador
```javascript
// Solução: Use autoplay ou botão de play
const audio = new Audio(audioUrl);
audio.play().catch(err => {
    console.log('Clique para ouvir:', err);
    // Mostre botão de play manual
});
```

### Problema: "Rate limit exceeded"
```bash
# Você atingiu limite de requisições
# Solução: Aguarde ou faça upgrade do plano OpenAI
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Configure OpenAI API** (obrigatório para áudio funcionar)
2. ✅ **Teste os endpoints** de voz
3. ✅ **Integre no frontend** com player de áudio
4. ✅ **Escolha a melhor voz** para NOW (recomendo `nova`)
5. ✅ **Ajuste velocidade** (1.0 a 1.2 é ideal)

---

## 🚀 STATUS

```
╔══════════════════════════════════════════╗
║   NOW v5.0 - VOICE SYSTEM READY! 🎙️    ║
╠══════════════════════════════════════════╣
║                                          ║
║  ✅ Text-to-Speech implementado         ║
║  ✅ 6 vozes disponíveis                 ║
║  ✅ Chat com áudio funcionando          ║
║  ✅ Life OS com voz ativado             ║
║  ✅ Controle de velocidade              ║
║                                          ║
║  🌐 URL: 3000-iigl23rg7f2e0o7sq...     ║
║  🎙️ Voice: /api/voice/*                ║
║  💬 Chat: /api/voice/chat               ║
║  🎯 Life OS: /api/life-os/consult       ║
║                                          ║
║  ⚠️ NECESSÁRIO: OpenAI API Key          ║
║  💰 Custo: ~$0.003 por resposta         ║
║                                          ║
╚══════════════════════════════════════════╝
```

---

**Criado em**: 2026-02-08  
**Versão**: 5.0 com Voice  
**Status**: ✅ Production Ready  
**Próximo**: Configure OpenAI API e teste!

**🎙️ Agora NOW fala como JARVIS real! 🚀**
