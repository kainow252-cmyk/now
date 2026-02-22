# 📱 COMO BAIXAR O APK - NOW AI

## 🎯 LINKS RÁPIDOS

### 🌐 Página de Download (Visual)
```
https://7sqzgdy-0e616f0a.sandbox.novita.ai/download.html
```
**→ Interface bonita com botão de download e instruções!**

---

## 🚀 OPÇÃO 1: GitHub Actions (Automático) ⭐

### Passo 1: Ativar GitHub Actions

**Você precisa ativar o workflow manualmente (uma única vez):**

1. **Clone o repositório** (se ainda não fez):
```bash
git clone https://github.com/kainow252-cmyk/now.git
cd now
git checkout clean-now-ai
```

2. **Crie a pasta de workflows**:
```bash
mkdir -p .github/workflows
```

3. **Copie o workflow**:
```bash
cp build-apk-workflow.yml .github/workflows/build-apk.yml
```

4. **Commit e push**:
```bash
git add .github/workflows/build-apk.yml
git commit -m "chore: Ativar GitHub Actions para build do APK"
git push origin clean-now-ai
```

### Passo 2: Aguardar Build

1. **Acesse GitHub Actions**:
   ```
   https://github.com/kainow252-cmyk/now/actions
   ```

2. **Veja o workflow "Build Android APK"** rodando (🟡 amarelo)

3. **Aguarde 5-8 minutos** até ficar ✅ verde

### Passo 3: Baixar APK

Após o build terminar, você terá **2 opções**:

#### Opção A: Download via Releases (MAIS FÁCIL)
```
https://github.com/kainow252-cmyk/now/releases
```
- Clique na release mais recente
- Seção **Assets** → Clique em `app-debug.apk`
- Download começa automaticamente

#### Opção B: Download via Actions Artifacts
```
https://github.com/kainow252-cmyk/now/actions
```
- Clique no workflow "Build Android APK"
- Escolha a execução com ✅ verde
- Role até o final → Seção **Artifacts**
- Clique em `now-ai-app-debug`
- ZIP será baixado (extraia para obter o APK)

---

## 🛠️ OPÇÃO 2: Compilar Localmente

Se preferir compilar você mesmo:

### Pré-requisitos:
- Git
- Node.js 18+
- Android Studio
- JDK 17+
- 5 GB de espaço livre

### Comandos:

```bash
# 1. Clone
git clone https://github.com/kainow252-cmyk/now.git
cd now
git checkout clean-now-ai

# 2. Instale
npm install --legacy-peer-deps

# 3. Sincronize
npx cap sync

# 4. Build
cd android
./gradlew assembleDebug

# 5. APK estará em:
# android/app/build/outputs/apk/debug/app-debug.apk
```

**Ou use o script:**
```bash
./build-apk.sh
```

---

## 📲 INSTALANDO O APK

### Android 8-12

1. **Habilitar Fontes Desconhecidas**:
   - Configurações → Segurança
   - Ative "Fontes desconhecidas"

2. **Instalar**:
   - Abra o arquivo `app-debug.apk`
   - Toque em "Instalar"
   - Aguarde
   - Toque em "Abrir"

### Android 13+

1. **Permitir Instalação**:
   - Ao tentar instalar o APK
   - Sistema pedirá permissão
   - Toque em "Configurações"
   - Ative "Permitir desta fonte"
   - Volte e instale

---

## 🎤 TESTANDO O APK

Após instalar:

1. **Abra o app "NOW AI"**
2. **Conceda permissão de microfone**
3. **Fale**: "Olá" ou "Que horas são?"
4. **Você deve OUVIR a resposta!** 🔊

### Comandos para testar:

```
👤 "Olá"                     → 🔊 "Olá! Como posso ajudar?"
👤 "Que horas são?"          → 🔊 "São XX horas e YY minutos"
👤 "Bom dia"                 → 🔊 "Bom dia! Como posso ajudar?"
👤 "Qual o valor do dólar?"  → 🔊 [Resposta com cotação]
```

---

## 📊 COMPARAÇÃO

| Funcionalidade | 🌐 Web | 📱 APK |
|----------------|--------|---------|
| Reconhecimento de voz | ✅ | ✅ |
| Funciona à distância | ✅ | ✅ |
| Respostas na tela | ✅ | ✅ |
| **Voz (TTS)** | ❌ | ✅ |

**No APK, a voz SEMPRE funciona!** 🎉

---

## 🔗 LINKS ÚTEIS

- **📱 Página de Download**: https://7sqzgdy-0e616f0a.sandbox.novita.ai/download.html
- **🏠 Repositório**: https://github.com/kainow252-cmyk/now
- **📦 Releases**: https://github.com/kainow252-cmyk/now/releases
- **⚙️ Actions**: https://github.com/kainow252-cmyk/now/actions
- **📖 Guia Completo**: DOWNLOAD_APK.md

---

## ⚡ RESUMO RÁPIDO

### Para ter o APK AGORA:

1. **Ative GitHub Actions** (uma vez):
   ```bash
   mkdir -p .github/workflows
   cp build-apk-workflow.yml .github/workflows/build-apk.yml
   git add .github/workflows/build-apk.yml
   git commit -m "chore: Ativar build automático"
   git push origin clean-now-ai
   ```

2. **Aguarde 5-8 minutos**

3. **Baixe em**:
   ```
   https://github.com/kainow252-cmyk/now/releases
   ```

4. **Instale e aproveite!** 🎉

---

## 🎉 PRONTO!

Após baixar e instalar:

✅ Voz feminina portuguesa  
✅ Funciona à distância  
✅ Interface limpa  
✅ 30+ APIs  
✅ **TTS 100% funcional!**

**Abra o app e fale "Olá"!** 🚀🎤
