const yf = require('yahoo-finance2').default;

// Simple Vercel serverless endpoint: /api/fx?from=USD&to=TRY
// Caches last result in-memory for short time to reduce Yahoo calls.
let cache = {
  key: null,
  ts: 0,
  data: null
};
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

module.exports = async function (req, res) {
  try {
    const from = (req.query.from || req.query.f || 'USD').toUpperCase();
    const to = (req.query.to || req.query.t || 'TRY').toUpperCase();
    const symbol = `${from}${to}=X`;

    const now = Date.now();
    const cacheKey = `${symbol}`;
    if (cache.key === cacheKey && now - cache.ts < CACHE_TTL_MS) {
      return res.json({ cached: true, source: cache.data.source, data: cache.data });
    }

    // yahoo-finance2 doğrudan quote() kullanarak daha basit
    const quote = await yf.quote(symbol);
    
    if (!quote || !quote.regularMarketPrice) {
      return res.status(404).json({ error: 'symbol_not_found', symbol });
    }

    const data = {
      symbol,
      rate: quote.regularMarketPrice,
      previousClose: quote.regularMarketPreviousClose || quote.previousClose,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      timestamp: Date.now(),
      source: 'yahoo-finance2'
    };

    cache = { key: cacheKey, ts: now, data };
    return res.json({ cached: false, source: data.source, data });
  } catch (err) {
    console.error('api/fx error:', err?.message || err);
    return res.status(500).json({ error: 'internal_error', message: String(err) });
  }
};
