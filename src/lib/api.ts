import { CURRENCY_LIST, GOLD_LIST } from '../../constants/currencies';

// Herhangi bir para/altın biriminden tüm diğerlerine çapraz dönüşüm
export async function convertAnyToAll(amount: number, fromCode: string) {
  // Sonuç: { code, label, value, type }
  const results: Array<{ code: string; label: string; value: number | string; type: string }> = [];

  // Altın birimlerini bul
  const isGold = GOLD_LIST.some(g => g.code === fromCode);

  // Eğer kaynak altın ise önce gram karşılığını bul
  let amountInGram = amount;
  if (isGold) {
    const goldInfo = GOLD_LIST.find(g => g.code === fromCode);
    if (goldInfo) amountInGram = amount * goldInfo.gram;
  }

  // Altın fiyatlarını Yahoo Finance'den çek (TRY cinsinden)
  let goldData: any = null;
  try {
    goldData = await fetchGoldPrice('TRY');
  } catch (e) {
    console.error('Gold price fetch error:', e);
  }

  // Tüm altın türleri için dönüşüm
  for (const gold of GOLD_LIST) {
    let value = '-';
    try {
      if (goldData?.gram) {
        // Kaynak altın ise
        if (isGold) {
          // Gram cinsinden değeri hesapla ve hedef altın türüne çevir
          const valueInGrams = amountInGram / gold.gram;
          const valueInTRY = valueInGrams * goldData.gram;
          value = valueInTRY.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
        } else {
          // Kaynak para birimi ise, para biriminden altına çevir
          // Önce kaynaktan TRY'ye çevir
          let tryValue = amount;
          if (fromCode !== 'TRY') {
            const fx = await fetchFx(fromCode, 'TRY', amount);
            tryValue = fx.result;
          }
          // Sonra TRY'den altına çevir
          const goldAmount = tryValue / goldData.gram; // Kaç gram altın alınabilir
          value = (goldAmount * gold.gram).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
        }
      }
    } catch (e) {
      console.error(`Gold conversion error for ${gold.code}:`, e);
    }
    results.push({ code: gold.code, label: gold.label, value, type: 'gold' });
  }

  // Tüm para birimleri için dönüşüm
  for (const cur of CURRENCY_LIST) {
    let value = '-';
    try {
      if (isGold && goldData?.gram) {
        // Altından para birimine: önce TRY'ye çevir
        const tryValue = amountInGram * goldData.gram;
        if (cur.code === 'TRY') {
          value = tryValue.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
        } else {
          const fx = await fetchFx('TRY', cur.code, tryValue);
          value = fx.result.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
        }
      } else {
        // Para biriminden diğer para birimlerine
        if (cur.code === fromCode) {
          value = amount.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
        } else {
          const fx = await fetchFx(fromCode, cur.code, amount);
          value = fx.result.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
        }
      }
    } catch (e) {
      console.error(`Currency conversion error for ${cur.code}:`, e);
    }
    results.push({ code: cur.code, label: cur.label, value, type: 'fiat' });
  }

  return results;
}
/**
 * API functions for Kurmatik finance data
 * All data is fetched from Yahoo Finance API (100% free, no API key required)
 */

export interface FxResponse {
  result: number;
  rate: number;
}

export interface GoldPriceResponse {
  ounce: number;
  gram: number;
  currency: string;
  date: string;
}

// Fetch currency exchange rate using Yahoo Finance
// Development: Direct API call | Production: Vercel proxy
export async function fetchFx(from: string, to: string, amount: number): Promise<FxResponse> {
  try {
    // Development mode: Direct Yahoo Finance call
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${from}${to}=X`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Yahoo Finance API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
        const rate = data.chart.result[0].meta.regularMarketPrice;
        return {
          result: rate * amount,
          rate: rate
        };
      }
      
      throw new Error('Yahoo Finance\'den kur bilgisi alınamadı');
    }
    
    // Production mode: Use Vercel API endpoint to avoid CORS issues
    const url = `/api/fx?from=${from}&to=${to}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const json = await response.json();
    
    if (json?.data?.rate) {
      const rate = json.data.rate;
      return {
        result: rate * amount,
        rate: rate
      };
    }
    
    throw new Error('Kur bilgisi alınamadı');
  } catch (error) {
    console.error('FX API Error:', error);
    throw error;
  }
}

/**
 * Fetch gold prices from Yahoo Finance
 * Development: Direct API | Production: Vercel proxy
 * Returns gold price per ounce and per gram
 * @param currency - Currency code (default: 'USD', can convert to 'TRY')
 */
export async function fetchGoldPrice(currency = 'USD'): Promise<GoldPriceResponse> {
  try {
    // Development mode: Direct Yahoo Finance call
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      const url = 'https://query1.finance.yahoo.com/v8/finance/chart/GC=F';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Yahoo Finance Gold API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
        const ouncePrice = data.chart.result[0].meta.regularMarketPrice;
        const gramPrice = ouncePrice / 31.1035;
        
        // If requesting TRY conversion
        if (currency === 'TRY') {
          try {
            const usdTry = await fetchFx('USD', 'TRY', 1);
            return {
              ounce: ouncePrice * usdTry.rate,
              gram: gramPrice * usdTry.rate,
              currency: 'TRY',
              date: new Date().toLocaleString('tr-TR')
            };
          } catch (error) {
            console.error('TRY conversion error:', error);
            return { 
              ounce: ouncePrice, 
              gram: gramPrice,
              currency: 'USD',
              date: new Date().toLocaleString('en-US')
            };
          }
        }
        
        return { 
          ounce: ouncePrice, 
          gram: gramPrice,
          currency: 'USD',
          date: new Date().toLocaleString('en-US')
        };
      }
      
      throw new Error('Yahoo Finance\'den altın fiyatı alınamadı');
    }
    
    // Production mode: Use Vercel API endpoint to avoid CORS issues
    const url = '/api/gold';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Gold API responded with status: ${response.status}`);
    }
    
    const json = await response.json();
    
    if (json?.data?.ounce && json?.data?.gram) {
      const ouncePrice = json.data.ounce;
      const gramPrice = json.data.gram;
      
      // If requesting TRY conversion
      if (currency === 'TRY') {
        try {
          const usdTry = await fetchFx('USD', 'TRY', 1);
          return {
            ounce: ouncePrice * usdTry.rate,
            gram: gramPrice * usdTry.rate,
            currency: 'TRY',
            date: new Date().toLocaleString('tr-TR')
          };
        } catch (error) {
          console.error('TRY conversion error:', error);
          return { 
            ounce: ouncePrice, 
            gram: gramPrice,
            currency: 'USD',
            date: new Date().toLocaleString('en-US')
          };
        }
      }
      
      return { 
        ounce: ouncePrice, 
        gram: gramPrice,
        currency: 'USD',
        date: new Date().toLocaleString('en-US')
      };
    }
    
    throw new Error('Altın fiyatı alınamadı');
  } catch (error) {
    console.error('Gold API Error:', error);
    throw error;
  }
}

// Legacy alias for backward compatibility (deprecated)
export const fetchGoldXau = fetchGoldPrice;