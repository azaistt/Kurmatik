// Vercel serverless endpoint for gold prices: /api/gold
const yf = require('yahoo-finance2').default;

let cache = {
  ts: 0,
  data: null
};
const CACHE_TTL_MS = 60 * 1000; // 60 seconds for gold

module.exports = async function (req, res) {
  try {
    const now = Date.now();
    if (cache.data && now - cache.ts < CACHE_TTL_MS) {
      return res.json({ cached: true, source: 'yahoo-finance2', data: cache.data });
    }

    // GC=F: Gold Futures (COMEX) - price per troy ounce in USD
    const quote = await yf.quote('GC=F');
    
    if (!quote || !quote.regularMarketPrice) {
      return res.status(404).json({ error: 'gold_price_not_found' });
    }

    const ouncePrice = quote.regularMarketPrice;
    const gramPrice = ouncePrice / 31.1035; // Convert troy ounce to gram

    const data = {
      ounce: ouncePrice,
      gram: gramPrice,
      currency: 'USD',
      timestamp: Date.now(),
      source: 'yahoo-finance2 GC=F'
    };

    cache = { ts: now, data };
    return res.json({ cached: false, source: data.source, data });
  } catch (err) {
    console.error('api/gold error:', err?.message || err);
    return res.status(500).json({ error: 'internal_error', message: String(err) });
  }
};
