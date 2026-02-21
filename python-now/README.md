# 🎙️ NOW - Python Voice Assistant

Assistente de voz pessoal estilo JARVIS construído do zero em Python.

## 🚀 Início Rápido

### 1. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 2. Configurar API Keys

Crie um arquivo `.env`:

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
ELEVENLABS_API_KEY=xxxxxxxxxxxxxxxxxxxxx  # Opcional
```

### 3. Testar Módulos

```bash
# Testar ouvido (speech-to-text)
python ears.py

# Testar cérebro (IA)
python brain.py

# Testar voz (text-to-speech)
python mouth.py

# Testar ações
python actions.py
```

### 4. Iniciar NOW

```bash
python now.py
```

## 📁 Estrutura

```
python-now/
├── ears.py          # Ouvido (Speech-to-Text)
├── brain.py         # Cérebro (IA com OpenAI)
├── mouth.py         # Voz (Text-to-Speech)
├── actions.py       # Ações (controlar PC, web)
├── memory.py        # Memória (contexto)
├── now.py           # Orquestrador principal
├── requirements.txt # Dependências
└── .env             # API keys (criar)
```

## 🎮 Como Usar

1. **Inicie NOW**: `python now.py`
2. **Diga "NOW"** para ativar
3. **Dê comandos**:
   - "Abra o Chrome"
   - "Pesquise sobre Python"
   - "Qual é a previsão do tempo?"
   - "Me ajude a ser mais produtivo"

## 🔧 Customização

### Mudar Voz

Edite `mouth.py`:

```python
# Voz de robô (grátis)
mouth = Mouth(use_elevenlabs=False)

# Voz realista (paga - ElevenLabs)
mouth = Mouth(use_elevenlabs=True)

# Voz OpenAI (melhor qualidade)
mouth.speak_openai("Olá!")
```

### Mudar Wake Word

Edite `now.py`:

```python
self.wake_word = "jarvis"  # Ou "friday", "alfred", etc
```

### Adicionar Ações

Edite `actions.py`:

```python
def new_action(self, param):
    """Sua nova ação"""
    # Seu código aqui
    return "Ação executada!"
```

## 💰 Custos

- **Google Speech Recognition**: Grátis
- **OpenAI Whisper**: $0.006 / minuto
- **OpenAI GPT-4**: $0.03 / 1k tokens
- **OpenAI TTS**: $0.015 / 1k caracteres
- **ElevenLabs**: $5/mês (10k caracteres)

**Estimativa**: $10-20/mês para uso moderado

## 🐛 Troubleshooting

### Erro: "PyAudio not found"

**Linux**:
```bash
sudo apt-get install portaudio19-dev
pip install pyaudio
```

**macOS**:
```bash
brew install portaudio
pip install pyaudio
```

**Windows**:
```bash
pip install pipwin
pipwin install pyaudio
```

### Erro: "Microphone not found"

Verifique se o microfone está conectado:
```python
import speech_recognition as sr
print(sr.Microphone.list_microphone_names())
```

### Erro: "OpenAI API key invalid"

Verifique se a chave está correta no `.env`:
```bash
cat .env
# Deve mostrar: OPENAI_API_KEY=sk-proj-xxxxx
```

## 📚 Recursos

- [Documentação OpenAI](https://platform.openai.com/docs)
- [SpeechRecognition Docs](https://github.com/Uberi/speech_recognition)
- [PyAutoGUI Docs](https://pyautogui.readthedocs.io/)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - Veja LICENSE para detalhes

---

**Criado em**: 2026-02-09  
**Versão**: 1.0  
**Status**: ✅ Funcional

**🎙️ Divirta-se construindo seu JARVIS! 🚀**
