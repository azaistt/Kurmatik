// Yahoo Finance'dan XAU (Gold) verilerini çekmek için yardımcı fonksiyonlar
// Yahoo Finance API ücretsiz ve API key gerektirmez

/**
 * Yahoo Finance'den altın futures (GC=F) fiyatını çeker
 * @returns {Promise<{price: number, previousClose: number, change: number, changePercent: number, currency: string, timestamp: number}>}
 */
export async function fetchXauFromYahoo() {
  try {
    // GC=F = Gold Futures, XAUUSD=X = Gold Spot
    const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F');
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }
    
    const data = await response.json();
    const result = data?.chart?.result?.[0];
    
    if (!result) {
      throw new Error('Yahoo Finance: Invalid response format');
    }
    
    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const previousClose = meta.previousClose;
    const change = price - previousClose;
    const changePercent = ((change / previousClose) * 100);
    
    return {
      price: price,
      previousClose: previousClose,
      change: change,
      changePercent: changePercent,
      currency: 'USD',
      timestamp: Date.now(),
      symbol: meta.symbol,
      marketState: meta.marketState,
      source: 'Yahoo Finance'
    };
  } catch (error) {
    console.error('Yahoo Finance XAU fetch error:', error);
    throw error;
  }
}

/**
 * XAU fiyatını istenen para birimine çevirir
 * @param {string} toCurrency - Hedef para birimi (USD, EUR, TRY vs.)
 * @returns {Promise<{ounce: number, gram: number, date: string, currency: string}>}
 */
export async function fetchGoldFromYahoo(toCurrency = 'USD') {
  const GRAMS_PER_TROY_OUNCE = 31.1034768;
  
  try {
    // Yahoo Finance'den XAU/USD fiyatını al
    const xauData = await fetchXauFromYahoo();
    let priceInTargetCurrency = xauData.price;
    
    // Eğer hedef para birimi USD değilse, döviz çevirisi yap
    if (toCurrency !== 'USD') {
      // fetchFx kullanarak USD'den hedef para birimine çevir
      const { fetchFx } = await import('../api.js');
      const fxData = await fetchFx('USD', toCurrency, xauData.price);
      priceInTargetCurrency = fxData.result;
    }
    
    return {
      ounce: priceInTargetCurrency,
      gram: priceInTargetCurrency / GRAMS_PER_TROY_OUNCE,
      date: new Date().toISOString().split('T')[0],
      currency: toCurrency,
      source: 'Yahoo Finance',
      rawData: xauData
    };
  } catch (error) {
    console.error('Yahoo Finance Gold fetch error:', error);
    throw error;
  }
}