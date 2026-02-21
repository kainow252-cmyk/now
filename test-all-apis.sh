#!/bin/bash
BASE="http://localhost:3000/api/knowledge"
echo "🌍 Testando 13 APIs de Conhecimento Mundial - NOW v5.0"
echo "========================================================"
echo ""

echo "1️⃣  NOTÍCIAS (G1)"
curl -s "$BASE/news" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ {d['total']} artigos: {d['articles'][0]['title'][:60]}...\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo "2️⃣  LIVROS (Open Library)"
curl -s "$BASE/books?q=Harry%20Potter" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ {d['total']} livros: {d['books'][0]['title']} por {d['books'][0]['author']}\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo "3️⃣  FILMES/SÉRIES (TVMaze)"
curl -s "$BASE/movies?q=Breaking%20Bad" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ {d['total']} resultados: {d['movies'][0]['name']} ({d['movies'][0]['year']}) - Nota: {d['movies'][0]['rating']}\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo "4️⃣  MÚSICA (MusicBrainz)"
curl -s "$BASE/music?q=Beatles" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ {d['total']} artistas: {d['results'][0]['name']} ({d['results'][0]['country']})\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo "5️⃣  ESPORTES (TheSportsDB)"
curl -s "$BASE/sports?sport=soccer" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ {d['total']} jogos hoje\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo "6️⃣  ESPAÇO/NASA (APOD)"
curl -s "$BASE/space" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ {d['title'][:50]}...\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo "7️⃣  FRASES MOTIVACIONAIS (Quotable)"
curl -s "$BASE/quote" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ \\\"{d['quote'][:60]}...\\\" - {d['author']}\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo "8️⃣  FERIADOS (Nager.Date)"
curl -s "$BASE/holidays?country=BR&year=2026" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ {d['total']} feriados: {d['holidays'][0]['name']} em {d['holidays'][0]['date']}\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo "9️⃣  CLIMA (Open-Meteo)"
curl -s "$BASE/weather?lat=-23.5505&lon=-46.6333" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ {d['temperature']}°C, Vento: {d['windspeed']} km/h\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo "🔟 CRYPTO (CoinGecko)"
curl -s "$BASE/crypto/bitcoin" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ Bitcoin: \${d['price']:,.0f} USD ({d['change24h']:.2f}%)\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo "1️⃣1️⃣ CÂMBIO (ExchangeRate)"
curl -s "$BASE/exchange/USD" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ 1 USD = {d['rates']['BRL']:.2f} BRL\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo "1️⃣2️⃣ PAÍSES (REST Countries)"
curl -s "$BASE/country/Brazil" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ {d['name']} - Capital: {d['capital']}, Pop: {d['population']/1000000:.1f}M\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo "1️⃣3️⃣ CONSULTA INTELIGENTE (Auto-Detecção)"
curl -s -X POST "$BASE/query" -H "Content-Type: application/json" -d '{"question":"notícias do Brasil"}' | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"✅ Detectou: notícias, {d.get('total',0)} resultados\" if d.get('success') else f\"❌ {d.get('error')}\")"

echo ""
echo "========================================================"
echo "✅ Teste completo! 13 APIs de conhecimento mundial"
