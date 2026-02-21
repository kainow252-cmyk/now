#!/bin/bash
BASE_URL="http://localhost:3000/api/knowledge"

echo "🧪 Testando APIs GRÁTIS (sem chave necessária)"
echo "============================================="
echo ""

echo "1️⃣ Wikipedia - Inteligência Artificial"
curl -s "$BASE_URL/wikipedia/Inteligência%20Artificial" | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('success'):
    print(f'✅ {d[\"title\"]}\n   {d[\"summary\"][:100]}...')
else:
    print(f'❌ {d.get(\"error\")}')" || echo "❌ Erro"
echo ""

echo "2️⃣ Crypto - Bitcoin"
curl -s "$BASE_URL/crypto/bitcoin" | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('success'):
    print(f'✅ Bitcoin: ${d[\"price\"]:,.2f} USD (24h: {d[\"change24h\"]:.2f}%)')
else:
    print(f'❌ {d.get(\"error\")}')" || echo "❌ Erro"
echo ""

echo "3️⃣ Clima - São Paulo"
curl -s "$BASE_URL/weather?lat=-23.5505&lon=-46.6333" | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('success'):
    print(f'✅ Temperatura: {d[\"temperature\"]}°C, Vento: {d[\"windspeed\"]} km/h')
else:
    print(f'❌ {d.get(\"error\")}')" || echo "❌ Erro"
echo ""

echo "4️⃣ Câmbio - USD"
curl -s "$BASE_URL/exchange/USD" | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('success'):
    brl = d['rates'].get('BRL', 0)
    print(f'✅ 1 USD = {brl:.2f} BRL')
else:
    print(f'❌ {d.get(\"error\")}')" || echo "❌ Erro"
echo ""

echo "5️⃣ País - Brasil"
curl -s "$BASE_URL/country/Brazil" | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('success'):
    pop = d['population'] / 1000000
    print(f'✅ {d[\"name\"]} - Capital: {d[\"capital\"]}, População: {pop:.1f}M')
else:
    print(f'❌ {d.get(\"error\")}')" || echo "❌ Erro"
echo ""

echo "6️⃣ Consulta Inteligente - O que é Bitcoin?"
curl -s -X POST "$BASE_URL/query" \
  -H "Content-Type: application/json" \
  -d '{"question":"O que é Bitcoin?"}' | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('success'):
    print(f'✅ {d.get(\"title\", \"Resposta\")}\n   {d.get(\"summary\", str(d))[:150]}...')
else:
    print(f'❌ {d.get(\"error\")}')" || echo "❌ Erro"
echo ""
echo "✅ Todos os testes concluídos!"
