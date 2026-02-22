# 📱 GUIA SIMPLES - Baixar APK NOW AI

## ⚠️ SITUAÇÃO ATUAL

O APK ainda **NÃO ESTÁ DISPONÍVEL** no GitHub porque o GitHub Actions precisa ser ativado primeiro.

---

## 🎯 SOLUÇÃO RÁPIDA (3 Opções)

---

## 🚀 OPÇÃO 1: Ativar GitHub Actions (5 Minutos)

### No seu computador (Windows/Mac/Linux):

#### Passo 1: Instalar Git (se não tiver)
- **Windows**: https://git-scm.com/download/win
- **Mac**: `brew install git` ou baixe em https://git-scm.com/download/mac
- **Linux**: `sudo apt install git` (Ubuntu/Debian)

#### Passo 2: Clonar o repositório

Abra o terminal (CMD, PowerShell, Terminal) e execute:

```bash
# 1. Clone o repositório
git clone https://github.com/kainow252-cmyk/now.git

# 2. Entre na pasta
cd now

# 3. Mude para a branch correta
git checkout clean-now-ai
```

#### Passo 3: Ativar o GitHub Actions

```bash
# 4. Crie a pasta de workflows
mkdir .github
mkdir .github/workflows

# Windows (PowerShell):
Copy-Item build-apk-workflow.yml .github/workflows/build-apk.yml

# Mac/Linux:
cp build-apk-workflow.yml .github/workflows/build-apk.yml
```

#### Passo 4: Fazer commit e push

```bash
# 5. Adicione o arquivo
git add .github/workflows/build-apk.yml

# 6. Faça commit
git commit -m "chore: Ativar GitHub Actions para build do APK"

# 7. Faça push
git push origin clean-now-ai
```

**Se pedir usuário/senha:**
- Usuário: `kainow252-cmyk`
- Senha: Use um **Personal Access Token** do GitHub
  - Gere em: https://github.com/settings/tokens
  - Selecione: `repo` e `workflow`

#### Passo 5: Aguardar e Baixar

1. **Aguarde 5-8 minutos** (primeira vez pode demorar mais)

2. **Acesse**: https://github.com/kainow252-cmyk/now/releases

3. **Baixe o APK**: Clique na release mais recente → `app-debug.apk`

4. **Instale no celular!**

---

## 🛠️ OPÇÃO 2: Compilar Você Mesmo (30 Minutos)

### Pré-requisitos:
- Windows/Mac/Linux
- 5 GB de espaço livre
- Conexão com internet

### Passo 1: Instalar Android Studio

1. **Baixe**: https://developer.android.com/studio
2. **Instale** (aceite tudo padrão)
3. **Aguarde** instalar Android SDK (automático)

### Passo 2: Instalar Node.js

1. **Baixe**: https://nodejs.org/ (versão LTS)
2. **Instale** (aceite tudo padrão)

### Passo 3: Clonar e Preparar

Abra o terminal:

```bash
# 1. Clone
git clone https://github.com/kainow252-cmyk/now.git
cd now
git checkout clean-now-ai

# 2. Instale dependências
npm install --legacy-peer-deps

# 3. Sincronize Capacitor
npx cap sync
```

### Passo 4: Compilar APK

#### Opção A: Via Android Studio (Mais Fácil)

```bash
# Abrir no Android Studio
npx cap open android
```

No Android Studio:
1. Aguarde o "Gradle Sync" terminar (~5 min)
2. Menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Aguarde (~5 min)
4. Clique em "locate" quando terminar
5. APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Opção B: Via Terminal

```bash
# No diretório do projeto
cd android
./gradlew assembleDebug

# APK estará em:
# android/app/build/outputs/apk/debug/app-debug.apk
```

**Windows PowerShell:**
```powershell
cd android
.\gradlew.bat assembleDebug
```

---

## 📞 OPÇÃO 3: Pedir Ajuda (1 Minuto)

Se você não quer compilar, pode:

1. **Abrir uma Issue** no GitHub:
   - https://github.com/kainow252-cmyk/now/issues/new
   - Título: "Solicitar APK compilado"
   - Descrição: "Preciso do APK compilado, não consigo fazer build localmente"

2. **Ou me avisar** que você quer que eu ative o GitHub Actions remotamente
   - Eu preciso de permissão de `workflow` no repositório
   - Ou você pode me dar acesso temporário

---

## 📲 DEPOIS DE TER O APK

### Como Instalar no Android:

1. **Copie o APK para o celular**
   - Via USB, email, WhatsApp, Google Drive, etc.

2. **No celular, habilite "Fontes Desconhecidas"**:
   - Android 8-12: Configurações → Segurança → Fontes desconhecidas
   - Android 13+: Sistema pedirá ao tentar instalar

3. **Abra o arquivo APK** no celular

4. **Toque em "Instalar"**

5. **Abra o app "NOW AI"**

6. **Conceda permissão de microfone**

7. **Fale "Olá"** e ouça a resposta! 🔊

---

## 🎯 RESUMO DAS OPÇÕES

| Opção | Tempo | Dificuldade | Requer |
|-------|-------|-------------|--------|
| **1. GitHub Actions** | 10 min | ⭐ Fácil | Git |
| **2. Compilar Local** | 30 min | ⭐⭐ Médio | Android Studio + Node.js |
| **3. Pedir Ajuda** | 1 min | ⭐ Muito Fácil | Nada |

---

## 💡 RECOMENDAÇÃO

**Se você sabe usar Git:** → Opção 1 (GitHub Actions)  
**Se não sabe Git:** → Opção 3 (Pedir ajuda)  
**Se quer aprender:** → Opção 2 (Compilar local)

---

## 🐛 PROBLEMAS COMUNS

### "git: command not found"
**Solução:** Instale o Git primeiro (links acima)

### "npm: command not found"
**Solução:** Instale o Node.js primeiro (https://nodejs.org)

### "Permission denied" ao fazer push
**Solução:** 
1. Configure suas credenciais do GitHub
2. Ou use HTTPS com Personal Access Token

### "Gradle sync failed"
**Solução:**
```bash
cd android
./gradlew clean
./gradlew build
```

### APK não instala no celular
**Solução:**
1. Certifique-se que habilitou "Fontes desconhecidas"
2. Se der "App não instalado", desinstale versões antigas primeiro

---

## 📞 LINKS ÚTEIS

- **Repositório**: https://github.com/kainow252-cmyk/now
- **Branch**: https://github.com/kainow252-cmyk/now/tree/clean-now-ai
- **Issues (Pedir Ajuda)**: https://github.com/kainow252-cmyk/now/issues
- **Download Git**: https://git-scm.com/downloads
- **Download Node.js**: https://nodejs.org/
- **Download Android Studio**: https://developer.android.com/studio

---

## 🎉 RESULTADO FINAL

Após instalar o APK:

✅ Voz feminina em português  
✅ Reconhecimento à distância  
✅ Interface limpa  
✅ 30+ APIs integradas  
✅ **TTS 100% funcional!** 🔊

**Sem bloqueio "not-allowed" do Chrome!** 🎤✨

---

## 📝 NOTA

O APK ainda não está nas Releases porque o GitHub Actions precisa ser ativado primeiro.

**Assim que você ativar (Opção 1), o APK ficará disponível em:**
```
https://github.com/kainow252-cmyk/now/releases/latest/download/app-debug.apk
```

---

**Escolha uma das 3 opções acima e em breve você terá o APK funcionando!** 🚀
