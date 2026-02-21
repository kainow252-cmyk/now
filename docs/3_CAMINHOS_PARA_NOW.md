# 🎯 3 CAMINHOS PARA TER SEU PRÓPRIO NOW

## 🌟 Escolha seu Caminho

Existem **3 formas** de ter o NOW funcionando, dependendo do seu nível técnico e necessidades:

1. **🎨 Sem Programação** - Personalize IAs existentes (5 minutos)
2. **🏠 Maker/Automação** - Controle sua casa inteligente (1-2 horas)
3. **💻 Programador** - Crie do zero com Python (1 dia)

---

## 1️⃣ CAMINHO "SEM PROGRAMAÇÃO" ⚡

### 🎯 Para quem?
- Quer NOW **hoje mesmo**
- Não sabe programar
- Quer respostas inteligentes imediatamente

### ✅ Como fazer

#### Opção A: ChatGPT Custom GPT

**Passo 1**: Vá para https://chat.openai.com

**Passo 2**: Clique em "Explore GPTs" → "Create"

**Passo 3**: Configure seu NOW:

```
Nome: NOW - Your Personal AI Assistant

Descrição: 
Assistente pessoal estilo JARVIS para produtividade e negócios

Instruções:
Você é NOW, um assistente digital inteligente estilo JARVIS.

PERSONALIDADE:
- Tom: [ESCOLHA: Profissional | Sarcástico | Amigável | Ultra-formal]
- Estilo: Direto, objetivo, estratégico
- Idioma: Português brasileiro

SUAS FUNÇÕES:
1. Organizar agenda e tarefas
2. Analisar investimentos e mercado financeiro
3. Criar posts para redes sociais
4. Resumir documentos e PDFs
5. Pesquisar informações na internet
6. Dar conselhos estratégicos de negócios
7. Ajudar com produtividade

COMPORTAMENTO:
- Seja proativo: sugira melhorias
- Seja estratégico: pense a longo prazo
- Seja conciso: respostas em 2-3 frases
- Use emojis relevantes: 📊 📅 💡 🎯

FORMATO DE RESPOSTA:
Sempre estruture assim:
1. Resposta direta
2. Análise ou insight
3. Próxima ação recomendada

EXEMPLOS:
User: "Como está o mercado hoje?"
NOW: "📊 Mercado em alta: Bitcoin +3.2%, tech stocks valorizando. 
Oportunidade: AAPL próxima de suporte em $180. 
Ação: Considere entry position se romper resistência."

User: "Organize meu dia"
NOW: "📅 Prioridades definidas: 
1) Reunião financeira 10h (CRÍTICO)
2) Análise de propostas 15h (ALTO)
3) Review semanal 17h (MÉDIO)
Sugestão: Bloqueie 30min antes de cada para preparação."

Conhecimento Adicional (opcional):
- [Cole aqui informações sobre você, sua empresa, preferências]
- [Suas metas, objetivos, áreas de interesse]

Conversação:
- Inicie sempre com "Entendido." ou variação
- Termine sempre com pergunta de follow-up
- Memorize contexto de conversas anteriores
```

**Passo 4**: Salve e use!

**Custo**: $20/mês (ChatGPT Plus)

---

#### Opção B: Google Gemini Gem

**Passo 1**: Vá para https://gemini.google.com

**Passo 2**: Clique em "Gems" → "Create New Gem"

**Passo 3**: Configure:

```
Nome: NOW Assistant

Instruções:
Você é NOW, meu assistente pessoal estilo JARVIS.

Personalidade: [Profissional, direto, estratégico]
Tom: Objetivo e produtivo
Idioma: Português brasileiro

Funções principais:
- Organizar agenda e tarefas
- Analisar dados e mercado
- Resumir documentos
- Criar conteúdo profissional
- Dar insights estratégicos

Estilo de resposta:
1. Conciso (2-3 frases)
2. Acionável
3. Estratégico

Use emojis: 📊 📅 💡 🎯 ✅
```

**Passo 4**: Ative o Gem

**Custo**: Grátis (Gemini Basic) ou $20/mês (Gemini Advanced)

---

#### Opção C: Claude Projects

**Passo 1**: Acesse https://claude.ai

**Passo 2**: Crie um "Project" chamado "NOW"

**Passo 3**: Adicione Custom Instructions:

```
# NOW - Personal AI Assistant

Você é NOW, assistente digital estilo JARVIS.

## Comportamento
- Profissional e estratégico
- Respostas em 2-3 frases
- Sempre sugere próximos passos

## Áreas de Expertise
- Produtividade e gestão de tempo
- Análise financeira e investimentos
- Estratégia de negócios
- Criação de conteúdo

## Formato
Estruture respostas em:
1. Resposta direta
2. Insight estratégico
3. Ação recomendada
```

**Custo**: $20/mês (Claude Pro)

---

### ✅ Prós
- ✅ **Rápido**: Pronto em 5 minutos
- ✅ **Inteligente**: IA de ponta (GPT-4, Gemini, Claude)
- ✅ **Sem código**: Zero programação
- ✅ **Sempre atualizado**: Modelos melhoram automaticamente
- ✅ **Multi-plataforma**: Web, mobile, API

### ❌ Contras
- ❌ Preso dentro do app (ChatGPT, Gemini, Claude)
- ❌ Precisa abrir navegador/app
- ❌ Não controla computador/casa
- ❌ Depende de internet
- ❌ Custo mensal ($20)

---

## 2️⃣ CAMINHO "MAKER" (AUTOMAÇÃO) 🏠

### 🎯 Para quem?
- Quer controlar luzes, PC, casa
- Gosta de DIY e automação
- Tem Raspberry Pi ou PC velho
- Quer resposta por voz em casa

### ✅ Como fazer

#### Hardware Necessário

**Opção A: Raspberry Pi** (Recomendado)
- Raspberry Pi 4 (4GB RAM) - ~$55
- Cartão microSD 32GB - ~$10
- Fonte de alimentação - ~$10
- **Total: ~$75**

**Opção B: PC Velho**
- Qualquer computador com 4GB RAM
- Windows, Linux ou macOS
- **Total: $0** (se você já tiver)

---

#### Software: Home Assistant

**Passo 1: Instalar Home Assistant**

**No Raspberry Pi**:
```bash
# 1. Baixe imagem oficial
# https://www.home-assistant.io/installation/raspberrypi

# 2. Grave no cartão SD com Etcher
# https://www.balena.io/etcher/

# 3. Insira no Raspberry Pi e ligue

# 4. Acesse: http://homeassistant.local:8123
```

**No PC/Windows**:
```bash
# 1. Baixe e instale VirtualBox
# https://www.virtualbox.org/

# 2. Baixe imagem Home Assistant
# https://www.home-assistant.io/installation/windows

# 3. Importe no VirtualBox e inicie

# 4. Acesse: http://localhost:8123
```

**No Linux**:
```bash
# Instalação via Docker
docker run -d \
  --name homeassistant \
  --privileged \
  --restart=unless-stopped \
  -p 8123:8123 \
  -v /PATH_TO_YOUR_CONFIG:/config \
  ghcr.io/home-assistant/home-assistant:stable
```

---

**Passo 2: Configurar Assistente de Voz**

1. Acesse Home Assistant: http://homeassistant.local:8123

2. Vá em **Settings** → **Voice Assistants**

3. Clique em **Add Assistant**

4. Configure:
```yaml
Nome: NOW
Idioma: Português (BR)
Text-to-Speech: Google Cloud TTS (ou Piper)
Speech-to-Text: Whisper (ou Google Cloud STT)
Conversation Agent: ChatGPT / Gemini
Wake Word: "NOW" ou "Hey NOW"
```

---

**Passo 3: Integrar ChatGPT ou Gemini**

**Opção A: ChatGPT**

1. Instale integração Extended OpenAI Conversation
```
HACS → Integrations → Extended OpenAI Conversation
```

2. Configure API Key:
```yaml
# configuration.yaml
openai_conversation:
  api_key: "sk-proj-xxxxxxxxxxxxx"
  model: "gpt-4"
  prompt: |
    Você é NOW, um assistente doméstico inteligente.
    Você controla luzes, termostato, música e mais.
    Seja objetivo e útil.
```

**Opção B: Google Gemini**

1. Instale integração Google Generative AI
```
HACS → Integrations → Google Generative AI Conversation
```

2. Configure:
```yaml
# configuration.yaml
google_generative_ai_conversation:
  api_key: "YOUR_GEMINI_API_KEY"
  prompt: |
    Você é NOW, assistente doméstico.
```

---

**Passo 4: Wake Word "NOW"**

1. Instale Porcupine Wake Word
```
Settings → Add-ons → Porcupine
```

2. Configure wake word customizado:
```yaml
# Grave você dizendo "NOW" 3 vezes
# Upload para gerar modelo customizado
# Configure no Home Assistant
```

3. Conecte microfone USB ou use ESP32

---

**Passo 5: Automações**

Crie automações para NOW controlar tudo:

```yaml
# automations.yaml

# NOW acende a luz
- alias: "NOW - Acender Luz"
  trigger:
    - platform: conversation
      command: "acenda a luz"
  action:
    - service: light.turn_on
      target:
        entity_id: light.sala
    - service: tts.speak
      data:
        message: "Luz da sala acesa"

# NOW inicia PC
- alias: "NOW - Ligar PC"
  trigger:
    - platform: conversation
      command: "ligue o computador"
  action:
    - service: wake_on_lan.send_magic_packet
      data:
        mac: "XX:XX:XX:XX:XX:XX"
    - service: tts.speak
      data:
        message: "Iniciando computador"

# NOW toca música
- alias: "NOW - Tocar Música"
  trigger:
    - platform: conversation
      command:
        - "toque música"
        - "coloque uma música"
  action:
    - service: media_player.play_media
      target:
        entity_id: media_player.spotify
      data:
        media_content_type: playlist
        media_content_id: "spotify:playlist:xxxxx"
```

---

### ✅ Prós
- ✅ **Controle total** da casa
- ✅ **Offline**: Funciona sem internet
- ✅ **Customizável**: 100% personalizável
- ✅ **Integrações**: +2000 dispositivos suportados
- ✅ **Wake word**: "NOW" ativa o assistente
- ✅ **Custo único**: Sem mensalidade

### ❌ Contras
- ❌ Requer hardware (Raspberry Pi ou PC)
- ❌ Setup inicial complexo (1-2 horas)
- ❌ Precisa aprender Home Assistant
- ❌ Manutenção técnica necessária

---

## 3️⃣ CAMINHO "PROGRAMADOR" 💻

### 🎯 Para quem?
- Sabe programar (Python)
- Quer 100% de controle
- Quer customizar tudo
- Gosta de criar do zero

### ✅ Como fazer

#### Estrutura Básica

```
NOW/
├── ears.py          # Ouvido (Speech-to-Text)
├── brain.py         # Cérebro (IA)
├── mouth.py         # Voz (Text-to-Speech)
├── actions.py       # Ações (controlar PC, web, etc)
├── memory.py        # Memória (contexto, preferências)
└── now.py           # Orquestrador principal
```

---

#### Código Completo

**1. Instalar dependências**:
```bash
pip install openai speechrecognition pyttsx3 pyaudio
pip install elevenlabs  # Para voz ultra-realista
pip install pyautogui  # Para controlar PC
```

---

**2. ears.py - Ouvido (Speech-to-Text)**:
```python
import speech_recognition as sr

class Ears:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.mic = sr.Microphone()
        
    def listen(self):
        """Ouve e transforma em texto"""
        with self.mic as source:
            print("🎤 NOW ouvindo...")
            self.recognizer.adjust_for_ambient_noise(source)
            audio = self.recognizer.listen(source)
            
        try:
            text = self.recognizer.recognize_google(audio, language='pt-BR')
            print(f"👤 Você: {text}")
            return text
        except sr.UnknownValueError:
            return None
        except sr.RequestError:
            return None

    def listen_whisper(self):
        """Versão com Whisper OpenAI (melhor qualidade)"""
        import openai
        
        with self.mic as source:
            print("🎤 NOW ouvindo...")
            audio = self.recognizer.listen(source)
            
        # Salvar áudio temporariamente
        with open("temp_audio.wav", "wb") as f:
            f.write(audio.get_wav_data())
            
        # Transcrever com Whisper
        with open("temp_audio.wav", "rb") as audio_file:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
            
        return transcript['text']
```

---

**3. brain.py - Cérebro (IA)**:
```python
import openai

class Brain:
    def __init__(self, api_key):
        openai.api_key = api_key
        self.conversation_history = [
            {
                "role": "system",
                "content": """Você é NOW, um assistente digital inteligente estilo JARVIS.
                
                Personalidade:
                - Profissional, estratégico, objetivo
                - Tom: Direto e produtivo
                - Idioma: Português brasileiro
                
                Funções:
                1. Organizar agenda e tarefas
                2. Analisar dados e mercado
                3. Controlar computador
                4. Pesquisar informações
                5. Dar conselhos estratégicos
                
                Formato de resposta:
                - Conciso (2-3 frases)
                - Acionável
                - Sempre sugira próximo passo
                
                Use emojis: 📊 📅 💡 🎯 ✅
                """
            }
        ]
        
    def think(self, user_input):
        """Processa pergunta e retorna resposta"""
        # Adiciona pergunta do usuário ao histórico
        self.conversation_history.append({
            "role": "user",
            "content": user_input
        })
        
        # Chama API OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=self.conversation_history,
            temperature=0.7,
            max_tokens=150
        )
        
        # Extrai resposta
        assistant_message = response.choices[0].message.content
        
        # Adiciona resposta ao histórico
        self.conversation_history.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        print(f"🤖 NOW: {assistant_message}")
        return assistant_message
        
    def think_with_tools(self, user_input):
        """Versão avançada com function calling"""
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "open_app",
                    "description": "Abre um aplicativo no computador",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "app_name": {"type": "string", "description": "Nome do app"}
                        },
                        "required": ["app_name"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "search_web",
                    "description": "Pesquisa informação na internet",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "Termo de busca"}
                        },
                        "required": ["query"]
                    }
                }
            }
        ]
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=self.conversation_history + [{"role": "user", "content": user_input}],
            tools=tools,
            tool_choice="auto"
        )
        
        return response
```

---

**4. mouth.py - Voz (Text-to-Speech)**:
```python
import pyttsx3
from elevenlabs import generate, play

class Mouth:
    def __init__(self, use_elevenlabs=False, elevenlabs_api_key=None):
        self.use_elevenlabs = use_elevenlabs
        
        if not use_elevenlabs:
            # Voz de robô (grátis)
            self.engine = pyttsx3.init()
            self.engine.setProperty('rate', 150)  # Velocidade
            self.engine.setProperty('volume', 0.9)
            
            # Tentar voz em português
            voices = self.engine.getProperty('voices')
            for voice in voices:
                if 'brazil' in voice.name.lower() or 'portuguese' in voice.name.lower():
                    self.engine.setProperty('voice', voice.id)
                    break
        else:
            # Voz ultra-realista (paga)
            from elevenlabs import set_api_key
            set_api_key(elevenlabs_api_key)
            
    def speak(self, text):
        """Fala o texto"""
        print(f"🔊 NOW falando...")
        
        if not self.use_elevenlabs:
            # Voz de robô
            self.engine.say(text)
            self.engine.runAndWait()
        else:
            # Voz realista ElevenLabs
            audio = generate(
                text=text,
                voice="Bella",  # ou "Antoni", "Elli", "Josh", etc
                model="eleven_multilingual_v2"
            )
            play(audio)
            
    def speak_openai(self, text):
        """Voz OpenAI TTS (melhor qualidade)"""
        import openai
        from pathlib import Path
        import pygame
        
        # Gerar áudio
        response = openai.audio.speech.create(
            model="tts-1",
            voice="nova",  # alloy, echo, fable, onyx, nova, shimmer
            input=text
        )
        
        # Salvar e tocar
        speech_file = Path("temp_speech.mp3")
        response.stream_to_file(speech_file)
        
        # Tocar áudio
        pygame.mixer.init()
        pygame.mixer.music.load("temp_speech.mp3")
        pygame.mixer.music.play()
        
        # Aguardar término
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)
```

---

**5. actions.py - Ações (Controlar PC)**:
```python
import pyautogui
import subprocess
import webbrowser

class Actions:
    def open_app(self, app_name):
        """Abre aplicativo"""
        apps = {
            'chrome': 'google-chrome',
            'firefox': 'firefox',
            'spotify': 'spotify',
            'vscode': 'code',
            'terminal': 'gnome-terminal'
        }
        
        if app_name.lower() in apps:
            subprocess.Popen([apps[app_name.lower()]])
            return f"✅ Abrindo {app_name}"
        return f"❌ Aplicativo {app_name} não encontrado"
        
    def search_web(self, query):
        """Pesquisa no Google"""
        url = f"https://www.google.com/search?q={query}"
        webbrowser.open(url)
        return f"🔍 Pesquisando: {query}"
        
    def type_text(self, text):
        """Digita texto automaticamente"""
        pyautogui.write(text)
        return f"⌨️ Texto digitado"
        
    def take_screenshot(self):
        """Tira screenshot"""
        screenshot = pyautogui.screenshot()
        screenshot.save('screenshot.png')
        return "📸 Screenshot salvo"
        
    def control_volume(self, action):
        """Controla volume"""
        if action == 'up':
            pyautogui.press('volumeup')
        elif action == 'down':
            pyautogui.press('volumedown')
        elif action == 'mute':
            pyautogui.press('volumemute')
        return f"🔊 Volume {action}"
```

---

**6. memory.py - Memória**:
```python
import json
from datetime import datetime

class Memory:
    def __init__(self, file_path='memory.json'):
        self.file_path = file_path
        self.load()
        
    def load(self):
        """Carrega memória do arquivo"""
        try:
            with open(self.file_path, 'r') as f:
                self.data = json.load(f)
        except FileNotFoundError:
            self.data = {
                'preferences': {},
                'history': [],
                'context': {}
            }
            
    def save(self):
        """Salva memória no arquivo"""
        with open(self.file_path, 'w') as f:
            json.dump(self.data, f, indent=2)
            
    def remember(self, key, value):
        """Guarda informação"""
        self.data['context'][key] = {
            'value': value,
            'timestamp': datetime.now().isoformat()
        }
        self.save()
        
    def recall(self, key):
        """Recupera informação"""
        return self.data['context'].get(key, {}).get('value')
        
    def add_to_history(self, interaction):
        """Adiciona à história de interações"""
        self.data['history'].append({
            'interaction': interaction,
            'timestamp': datetime.now().isoformat()
        })
        self.save()
```

---

**7. now.py - Orquestrador Principal**:
```python
from ears import Ears
from brain import Brain
from mouth import Mouth
from actions import Actions
from memory import Memory
import os

class NOW:
    def __init__(self):
        # Carregar API keys do ambiente
        openai_key = os.getenv('OPENAI_API_KEY')
        elevenlabs_key = os.getenv('ELEVENLABS_API_KEY')
        
        # Inicializar componentes
        self.ears = Ears()
        self.brain = Brain(openai_key)
        self.mouth = Mouth(use_elevenlabs=False)  # Mude para True para voz realista
        self.actions = Actions()
        self.memory = Memory()
        
        self.wake_word = "now"
        self.is_active = False
        
    def start(self):
        """Inicia NOW"""
        print("🚀 NOW ativado!")
        self.mouth.speak("Olá! NOW ativado e pronto para ajudar.")
        
        while True:
            # Ouve comando
            command = self.ears.listen()
            
            if command is None:
                continue
                
            # Verifica wake word
            if not self.is_active:
                if self.wake_word in command.lower():
                    self.is_active = True
                    self.mouth.speak("Sim, como posso ajudar?")
                continue
            
            # Processa comando
            self.process_command(command)
            
    def process_command(self, command):
        """Processa comando do usuário"""
        # Adiciona à memória
        self.memory.add_to_history({'user': command})
        
        # Detecta ações
        if "abra" in command.lower() or "abre" in command.lower():
            # Extrair nome do app
            app_name = command.lower().replace("abra", "").replace("abre", "").strip()
            result = self.actions.open_app(app_name)
            self.mouth.speak(result)
            
        elif "pesquisa" in command.lower() or "pesquise" in command.lower():
            query = command.lower().replace("pesquisa", "").replace("pesquise", "").strip()
            result = self.actions.search_web(query)
            self.mouth.speak(result)
            
        else:
            # Pergunta para a IA
            response = self.brain.think(command)
            self.mouth.speak(response)
            
        # Adiciona resposta à memória
        self.memory.add_to_history({'now': response if 'response' in locals() else 'action_executed'})

if __name__ == "__main__":
    # Configurar API keys
    os.environ['OPENAI_API_KEY'] = 'sk-proj-xxxxx'  # Sua chave OpenAI
    # os.environ['ELEVENLABS_API_KEY'] = 'xxxxx'  # Opcional: para voz realista
    
    # Iniciar NOW
    now = NOW()
    now.start()
```

---

### ✅ Usar NOW

```bash
# 1. Instalar dependências
pip install -r requirements.txt

# 2. Configurar API keys
export OPENAI_API_KEY="sk-proj-xxxxx"

# 3. Iniciar NOW
python now.py

# 4. Falar "NOW" para ativar
# 5. Dar comandos!
```

---

### ✅ Prós
- ✅ **100% customizável**: Código é seu
- ✅ **Offline possível**: Pode usar modelos locais
- ✅ **Sem limites**: Adicione qualquer funcionalidade
- ✅ **Aprende programação**: Projeto educacional
- ✅ **Grátis**: Sem mensalidade (exceto APIs)

### ❌ Contras
- ❌ Requer programação em Python
- ❌ Setup inicial complexo (1 dia)
- ❌ Manutenção contínua necessária
- ❌ Você é responsável por bugs
- ❌ APIs custam dinheiro (OpenAI, ElevenLabs)

---

## 📊 COMPARAÇÃO FINAL

| Característica | Sem Código | Maker | Programador |
|----------------|------------|-------|-------------|
| **Tempo setup** | 5 min | 1-2h | 1 dia |
| **Custo inicial** | $0 | $75 | $0 |
| **Custo mensal** | $20 | $0 | $5-20 |
| **Programação** | ❌ Não | ⚠️ Básico | ✅ Sim |
| **Controle casa** | ❌ Não | ✅ Sim | ⚠️ Possível |
| **Customização** | ⭐ Baixa | ⭐⭐⭐ Alta | ⭐⭐⭐⭐⭐ Total |
| **Inteligência** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Offline** | ❌ Não | ✅ Sim | ⚠️ Possível |
| **Voz realista** | ✅ Sim | ⚠️ Config | ✅ Sim |
| **Melhor para** | Iniciantes | Makers | Devs |

---

## 🎯 QUAL ESCOLHER?

### Escolha "Sem Programação" se:
- ✅ Quer NOW **hoje**
- ✅ Não sabe programar
- ✅ Foco em produtividade e respostas inteligentes
- ✅ Não precisa controlar dispositivos

### Escolha "Maker" se:
- ✅ Quer controlar casa/PC
- ✅ Tem Raspberry Pi ou PC velho
- ✅ Gosta de automação residencial
- ✅ Quer wake word "NOW"

### Escolha "Programador" se:
- ✅ Sabe Python
- ✅ Quer 100% de controle
- ✅ Quer aprender e customizar
- ✅ Tem tempo para desenvolver

---

## 🚀 RECOMENDAÇÃO

**Comece simples, evolua depois:**

1. **Semana 1**: Use GPT customizado (5 min)
2. **Semana 2**: Se gostar, adicione Home Assistant (1-2h)
3. **Mês 1**: Se quiser mais, programe do zero (1 dia)

**Ou combine os 3!**
- GPT para IA inteligente
- Home Assistant para casa
- Python para customizações

---

**Criado em**: 2026-02-09  
**Versão**: 1.0  
**Escolha seu caminho e comece hoje! 🚀**
