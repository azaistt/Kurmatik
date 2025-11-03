// TradingView'den altın (XAU) verilerini çekmek için yardımcı fonksiyonlar
import TradingViewClient from './client';

/**
 * TradingView'den XAU/USD (altın/dolar) fiyatını çeker
 * @param {string} symbol - Varsayılan 'XAUUSD' 
 * @returns {Promise<{price: number, currency: string, timestamp: number}>}
 */
export async function fetchXauFromTradingView(symbol = 'XAUUSD') {
  return new Promise((resolve, reject) => {
    const client = new TradingViewClient();
    let resolved = false;
    
    // Timeout ekle
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        client.end();
        reject(new Error('TradingView timeout'));
      }
    }, 10000);

    client.onError((error) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        client.end();
        reject(new Error(`TradingView error: ${error}`));
      }
    });

    client.onLogged(() => {
      const session = new client.Session.Quote();
      
      session.onData((data) => {
        if (data.type === 'symbol_resolved' && data.data && data.data[1]) {
          const symbolData = data.data[1];
          if (symbolData.lp !== undefined) { // lp = last price
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              client.end();
              resolve({
                price: symbolData.lp,
                currency: 'USD',
                timestamp: Date.now(),
                symbol: symbol,
                volume: symbolData.volume || null,
                change: symbolData.ch || null,
                changePercent: symbolData.chp || null
              });
            }
          }
        }
      });

      // XAU/USD sembolünü dinle
      session.resolveSymbol(symbol);
    });
  });
}

/**
 * XAU fiyatını istenen para birimine çevirir
 * @param {string} toCurrency - Hedef para birimi (USD, EUR, TRY vs.)
 * @returns {Promise<{ounce: number, gram: number, date: string, currency: string}>}
 */
export async function fetchGoldFromTradingView(toCurrency = 'USD') {
  const GRAMS_PER_TROY_OUNCE = 31.1034768;
  
  try {
    // XAU/USD fiyatını al
    const xauData = await fetchXauFromTradingView('XAUUSD');
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
      source: 'TradingView',
      rawData: xauData
    };
  } catch (error) {
    console.error('TradingView XAU fetch error:', error);
    throw error;
  }
}