// Yahoo Finance'dan döviz kurlarını çekmek için yardımcı fonksiyonlar
// Yahoo Finance FX API - yfinance kütüphanesi mantığını JavaScript'e uyarlama

let yfClient = null;
try {
  // try to load yahoo-finance2 for server-side reliability
  // (install with: npm install yahoo-finance2)
  yfClient = require('yahoo-finance2').default;
} catch (e) {
  yfClient = null;
}

/**
 * Yahoo Finance'den döviz kurunu çeker
 * @param {string} fromCurrency - Kaynak para birimi (USD, EUR, etc.)
 * @param {string} toCurrency - Hedef para birimi (TRY, USD, etc.)
 * @returns {Promise<{rate: number, previousClose: number, change: number, changePercent: number, timestamp: number}>}
 */
export async function fetchFxFromYahoo(fromCurrency, toCurrency) {
  const symbol = `${fromCurrency}${toCurrency}=X`; // USDTRY=X, EURTRY=X format
  console.log(`Yahoo FX fetching symbol: ${symbol}`);

  try {
    // If yahoo-finance2 client available (Node), use it for more reliable responses
    if (yfClient && typeof yfClient.chart === 'function') {
      const res = await yfClient.chart(symbol);
      const result = res?.chart?.result?.[0] || res?.result?.[0];
      if (!result) throw new Error('Yahoo Finance FX: Invalid response format');
      const meta = result.meta || res?.meta;
      const rate = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      const change = rate - previousClose;
      const changePercent = previousClose ? ((change / previousClose) * 100) : 0;
      return {
        rate: rate,
        previousClose: previousClose,
        change: change,
        changePercent: changePercent,
        timestamp: Date.now(),
        symbol: symbol,
        marketState: meta.marketState,
        source: 'Yahoo Finance (yfClient)'
      };
    }

    // Fallback to HTTP fetch (used in React Native environment)
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    if (!response.ok) {
      throw new Error(`Yahoo Finance FX API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];

    if (!result) {
      throw new Error('Yahoo Finance FX: Invalid response format');
    }

    const meta = result.meta;
    const rate = meta.regularMarketPrice;
    const previousClose = meta.previousClose;
    const change = rate - previousClose;
    const changePercent = previousClose ? ((change / previousClose) * 100) : 0;

    return {
      rate: rate,
      previousClose: previousClose,
      change: change,
      changePercent: changePercent,
      timestamp: Date.now(),
      symbol: symbol,
      marketState: meta.marketState,
      source: 'Yahoo Finance (fetch)'
    };
  } catch (error) {
    console.error(`Yahoo Finance FX fetch error (${symbol}):`, error.message || error);
    // rethrow so callers can use fallback logic
    throw error;
  }
}

/**
 * Popüler döviz kurlarını toplu olarak çeker
 * @param {string} baseCurrency - Baz para birimi (varsayılan USD)
 * @returns {Promise<Object>} Döviz kurları objesi
 */
export async function fetchMultipleFxFromYahoo(baseCurrency = 'USD') {
  const currencies = ['TRY', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'RUB'];
  const promises = [];
  
  // Baz para birimini listeden çıkar
  const targetCurrencies = currencies.filter(curr => curr !== baseCurrency);
  
  // Paralel olarak tüm kurları çek
  for (const currency of targetCurrencies) {
    promises.push(
      fetchFxFromYahoo(baseCurrency, currency)
        .then(data => ({ currency, data }))
        .catch(error => ({ currency, error: error.message || String(error) }))
    );
  }
  
  const results = await Promise.all(promises);
  const rates = {};
  
  // Sonuçları organize et
  for (const result of results) {
    if (result.error) {
      console.warn(`Failed to fetch ${baseCurrency}/${result.currency}:`, result.error);
      rates[result.currency] = null;
    } else {
      rates[result.currency] = result.data;
    }
  }
  
  return {
    base: baseCurrency,
    rates: rates,
    timestamp: Date.now(),
    source: 'Yahoo Finance'
  };
}

/**
 * Ters kur hesaplama (USD/TRY -> TRY/USD)
 * @param {number} rate - Orijinal kur
 * @returns {number} Ters kur
 */
export function invertFxRate(rate) {
  if (!rate || rate <= 0) {
    throw new Error('Invalid rate for inversion');
  }
  return 1 / rate;
}

/**
 * Çapraz kur hesaplama (EUR/USD ve USD/TRY kullanarak EUR/TRY hesapla)
 * @param {number} rate1 - İlk kur (örn: EUR/USD)
 * @param {number} rate2 - İkinci kur (örn: USD/TRY)
 * @returns {number} Çapraz kur (EUR/TRY)
 */
export function calculateCrossRate(rate1, rate2) {
  if (!rate1 || !rate2 || rate1 <= 0 || rate2 <= 0) {
    throw new Error('Invalid rates for cross calculation');
  }
  return rate1 * rate2;
}

/**
 * Yahoo Finance FX verilerini fetchFx format'ına dönüştür
 * @param {string} from - Kaynak para birimi
 * @param {string} to - Hedef para birimi  
 * @param {number} amount - Miktar
 * @returns {Promise<{rate: number, result: number, date: string}>}
 */
export async function fetchFxYahooCompatible(from, to, amount = 1) {
  try {
    if (from === to) {
      return {
        rate: 1,
        result: amount,
        date: new Date().toISOString().split('T')[0],
        source: 'Same Currency'
      };
    }
    
    const fxData = await fetchFxFromYahoo(from, to);
    
    return {
      rate: fxData.rate,
      result: fxData.rate * amount,
      date: new Date().toISOString().split('T')[0],
      source: 'Yahoo Finance',
      rawData: fxData
    };
  } catch (error) {
    console.error('Yahoo FX compatible fetch error:', error);
    throw error;
  }
}