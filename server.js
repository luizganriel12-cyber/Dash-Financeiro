const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const BRAPI_TOKEN = 'fLXTMdbG8sw69r7DZGiEjM';
const TICKERS = 'PETR4,VALE3,ITUB4,BBDC4,ABEV3,WEGE3,LREN3,MGLU3';
const CAMBIO_PAIRS = 'USD-BRL,EUR-BRL,GBP-BRL,JPY-BRL,ARS-BRL,CAD-BRL';

app.get('/api/acoes', async (req, res) => {
  try {
    const r = await fetch(`https://brapi.dev/api/quote/${TICKERS}`, {
      headers: { Authorization: `Bearer ${BRAPI_TOKEN}` }
    });
    const d = await r.json();
    res.json(d);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar ações' });
  }
});

app.get('/api/cripto', async (req, res) => {
  try {
    const r = await fetch(
      'https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,solana,ripple,cardano,dogecoin'
    );
    const d = await r.json();
    // formata igual ao CoinGecko pra não mudar o frontend
    const result = {};
    const map = {
      bitcoin: 'bitcoin', ethereum: 'ethereum', solana: 'solana',
      ripple: 'ripple', cardano: 'cardano', dogecoin: 'dogecoin'
    };
    if (d.data) {
      d.data.forEach(c => {
        result[c.id] = {
          usd: parseFloat(c.priceUsd),
          usd_24h_change: parseFloat(c.changePercent24Hr)
        };
      });
    }
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar cripto' });
  }
});

app.get('/api/cambio', async (req, res) => {
  try {
    const r = await fetch(`https://economia.awesomeapi.com.br/last/${CAMBIO_PAIRS}`);
    const d = await r.json();
    res.json(d);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar câmbio' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
