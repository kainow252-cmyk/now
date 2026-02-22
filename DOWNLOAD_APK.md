# 📱 Download do APK - NOW AI

## 🎯 3 Formas de Obter o APK

---

## 🚀 OPÇÃO 1: GitHub Actions (AUTOMÁTICO) ⭐ RECOMENDADO

O APK é compilado automaticamente pelo GitHub Actions a cada commit!

### Como Baixar:

#### Método A: Releases (Mais Fácil)

1. **Acesse a página de Releases:**
   ```
   https://github.com/kainow252-cmyk/now/releases
   ```

2. **Encontre a release mais recente:**
   - Procure por: `NOW AI APK - Build XXX`
   - Data mais recente

3. **Baixe o APK:**
   - Clique em `app-debug.apk` na seção **Assets**
   - Download começa automaticamente

4. **Instale no celular:**
   - Transfira o arquivo para o celular
   - Abra o arquivo APK
   - Autorize "Instalar de fontes desconhecidas"
   - Instale!

#### Método B: Actions Artifacts

1. **Acesse Actions:**
   ```
   https://github.com/kainow252-cmyk/now/actions
   ```

2. **Selecione o workflow "Build Android APK"**

3. **Escolha a execução mais recente** (com ✅ verde)

4. **Baixe o artifact:**
   - Role até o final da página
   - Seção **Artifacts**
   - Clique em `now-ai-app-debug`
   - ZIP será baixado

5. **Extraia e instale:**
   - Descompacte o ZIP
   - Transfira `app-debug.apk` para o celular
   - Instale normalmente

---

## 🛠️ OPÇÃO 2: Compilar Localmente

Se preferir compilar você mesmo:

### Pré-requisitos:
- Git
- Node.js 18+
- Android Studio
- JDK 17+

### Passo a Passo:

```bash
# 1. Clone o repositório
git clone https://github.com/kainow252-cmyk/now.git
cd now
git checkout clean-now-ai

# 2. Instale dependências
npm install --legacy-peer-deps

# 3. Sincronize Capacitor
npx cap sync

# 4. Build do APK
cd android
./gradlew assembleDebug

# 5. APK estará em:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Ou use o script automatizado:

```bash
./build-apk.sh
```

**Tempo estimado:** 5-10 minutos (primeira vez)

---

## ⚡ OPÇÃO 3: Link Direto (após primeiro build)

Após o primeiro build via GitHub Actions, o link direto será:

```
https://github.com/kainow252-cmyk/now/releases/latest/download/app-debug.apk
```

**Status:** ⏳ Aguardando primeiro build automático

---

## 📲 COMO INSTALAR O APK NO CELULAR

### Passo 1: Habilitar Fontes Desconhecidas

**Android 8+:**
1. Configurações → Segurança
2. Ative "Fontes desconhecidas"

**Android 9+:**
1. Configurações → Apps
2. Menu (⋮) → Acesso especial
3. Instalar apps desconhecidos
4. Selecione o navegador/gerenciador de arquivos
5. Ative "Permitir desta fonte"

### Passo 2: Instalar APK

**Método A: Via USB**
```bash
# No PC (com celular conectado via USB)
adb install app-debug.apk
```

**Método B: Via Transferência**
1. Copie `app-debug.apk` para o celular (via USB, email, WhatsApp, etc.)
2. No celular, abra o gerenciador de arquivos
3. Navegue até o arquivo APK
4. Toque no arquivo
5. Toque em "Instalar"
6. Aguarde a instalação
7. Toque em "Abrir" ou encontre o app "NOW AI" na tela inicial

### Passo 3: Conceder Permissões

Ao abrir o app pela primeira vez:
1. **Microfone**: Toque em "Permitir" (essencial para reconhecimento de voz)
2. **Armazenamento** (se solicitado): Toque em "Permitir"

---

## 🎤 TESTAR O APK

Após instalar:

1. **Abra o app "NOW AI"**
2. **Aguarde 1 segundo** (inicialização)
3. **Fale naturalmente:** "Olá" ou "Que horas são?"
4. **Você deve ouvir a resposta!** 🔊

### Comandos para testar:

```
👤 "Olá"                  → 🔊 "Olá! Como posso ajudar?"
👤 "Que horas são?"       → 🔊 "São XX horas e YY minutos"
👤 "Bom dia"              → 🔊 "Bom dia! Como posso ajudar?"
👤 "Qual o valor do dólar?" → 🔊 "O dólar está em..."
```

---

## 📊 DIFERENÇA: WEB vs APK

| Funcionalidade | 🌐 Web | 📱 APK |
|----------------|--------|---------|
| Reconhecimento de voz | ✅ | ✅ |
| Funciona à distância | ✅ | ✅ |
| Respostas na tela | ✅ | ✅ |
| **TTS (Voz)** | ❌ Bloqueado | ✅ **100% Funcional** |
| Voz feminina PT-BR | ❌ | ✅ **Garantida** |

---

## 🔍 VERIFICAR STATUS DO BUILD

### GitHub Actions:

Acesse: https://github.com/kainow252-cmyk/now/actions

**Legenda:**
- ✅ Verde: Build com sucesso (APK disponível)
- 🟡 Amarelo: Build em andamento (aguarde)
- ❌ Vermelho: Build falhou (veja logs)

**Tempo médio de build:** 5-8 minutos

---

## 🐛 TROUBLESHOOTING

### APK não instala?

**Erro: "App não instalado"**
- Solução: Desinstale versões antigas primeiro
- Ou: Limpe dados de instalação (Configurações → Apps → Instalador de pacotes)

**Erro: "Parse error"**
- Solução: Baixe novamente (arquivo corrompido)

### APK instala mas não abre?

**Tela preta ou fecha sozinho:**
- Solução: Limpe cache e dados do app
- Ou: Reinstale o APK

### Microfone não funciona?

**Sem reconhecimento de voz:**
1. Configurações → Apps → NOW AI → Permissões
2. Ative "Microfone"
3. Reinicie o app

### Sem voz (ainda)?

**TTS não fala:**
1. Verifique se o volume está alto (> 50%)
2. Modo silencioso desativado
3. Google TTS instalado (vem pré-instalado no Android)

---

## 📞 LINKS ÚTEIS

- **Repositório**: https://github.com/kainow252-cmyk/now
- **Branch**: `clean-now-ai`
- **Actions**: https://github.com/kainow252-cmyk/now/actions
- **Releases**: https://github.com/kainow252-cmyk/now/releases
- **Issues**: https://github.com/kainow252-cmyk/now/issues

---

## 🎉 PRONTO!

Após baixar e instalar o APK:

✅ Voz feminina portuguesa funcionando  
✅ Reconhecimento à distância  
✅ Interface limpa  
✅ 30+ APIs integradas  
✅ Respostas instantâneas  
✅ **TTS 100% FUNCIONAL!** 🎤

**Abra o app, fale "Olá" e aproveite!** 🚀

---

## 🔔 ATUALIZAÇÕES

Para receber novos APKs:

1. **Star** no repositório (⭐)
2. **Watch** → Custom → Releases
3. Você receberá notificações de novas versões

Ou verifique manualmente em:
```
https://github.com/kainow252-cmyk/now/releases
```

---

**NOW AI - Agora com voz garantida no Android!** 🎤✨
