#!/bin/bash

# ============================================
# Script de Build - APK NOW AI
# ============================================

set -e  # Parar em caso de erro

echo "🚀 ============================================"
echo "🚀 BUILD APK - NOW AI"
echo "🚀 ============================================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto!${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Passo 1/4: Instalando dependências...${NC}"
npm install --legacy-peer-deps
echo -e "${GREEN}✅ Dependências instaladas!${NC}"
echo ""

echo -e "${BLUE}🔄 Passo 2/4: Sincronizando Capacitor...${NC}"
npx cap sync
echo -e "${GREEN}✅ Capacitor sincronizado!${NC}"
echo ""

echo -e "${BLUE}🔧 Passo 3/4: Copiando assets...${NC}"
npx cap copy android
echo -e "${GREEN}✅ Assets copiados!${NC}"
echo ""

echo -e "${BLUE}🏗️  Passo 4/4: Compilando APK...${NC}"
echo -e "${YELLOW}⚠️  Este passo requer Android Studio e pode levar 3-5 minutos...${NC}"
echo ""

# Verificar se gradlew existe
if [ ! -f "android/gradlew" ]; then
    echo -e "${RED}❌ Erro: android/gradlew não encontrado!${NC}"
    echo -e "${YELLOW}💡 Execute: npx cap add android${NC}"
    exit 1
fi

# Dar permissão de execução
chmod +x android/gradlew

# Build do APK
cd android
./gradlew assembleDebug

echo ""
echo -e "${GREEN}✅ ============================================${NC}"
echo -e "${GREEN}✅ APK COMPILADO COM SUCESSO!${NC}"
echo -e "${GREEN}✅ ============================================${NC}"
echo ""
echo -e "${BLUE}📱 Localização do APK:${NC}"
echo -e "   ${YELLOW}android/app/build/outputs/apk/debug/app-debug.apk${NC}"
echo ""
echo -e "${BLUE}📲 Para instalar no celular:${NC}"
echo -e "   1. Conecte o celular via USB (com Depuração USB ativada)"
echo -e "   2. Execute: ${YELLOW}adb install app/build/outputs/apk/debug/app-debug.apk${NC}"
echo ""
echo -e "${BLUE}📋 Ou copie o APK manualmente:${NC}"
echo -e "   1. Transfira o arquivo APK para o celular"
echo -e "   2. Abra o arquivo no celular"
echo -e "   3. Autorize instalação de fontes desconhecidas"
echo -e "   4. Instale!"
echo ""
echo -e "${GREEN}🎉 Pronto! Seu NOW AI agora tem voz 100% funcional! 🎤✨${NC}"
