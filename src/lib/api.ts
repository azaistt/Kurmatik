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

  // Altın fiyatlarını çek
  let goldToday: any = null;
  let goldXau: any = null;
  try {
    goldToday = await fetchGoldToday();
    goldXau = await fetchGoldXau('TRY');
  } catch (e) {}

  // Tüm altın türleri için dönüşüm
  for (const gold of GOLD_LIST) {
    let value = '-';
    if (gold.code === 'GA' && goldToday?.gram?.Satış) {
      // Gram altın fiyatı doğrudan
      value = ((isGold ? amountInGram : amount) * parseFloat((goldToday.gram?.Satış || '0').replace(',', '.')) / gold.gram).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
    } else if (gold.code === 'ONS' && goldXau?.ounce) {
      // Ons altın fiyatı
      value = (((isGold ? amountInGram : amount) / 31.1035) * goldXau.ounce).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
    } else if (goldToday && goldToday[gold.label?.toLowerCase()]) {
      // Diğer altın türleri (çeyrek, tam, cumhuriyet, reşat)
      const altin = goldToday[gold.label?.toLowerCase()];
      if (altin?.Satış) {
        value = (((isGold ? amountInGram : amount) / gold.gram) * parseFloat((altin.Satış || '0').replace(',', '.'))).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
      }
    }
    results.push({ code: gold.code, label: gold.label, value, type: 'gold' });
  }

  // Tüm para birimleri için dönüşüm
  for (const cur of CURRENCY_LIST) {
    let value = '-';
    try {
      if (isGold && goldToday?.gram?.Satış) {
        // Altından para birimine: önce TL'ye çevir, sonra hedefe
        const tlValue = amountInGram * parseFloat((goldToday.gram?.Satış || '0').replace(',', '.'));
        if (cur.code === 'TRY') {
          value = tlValue.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
        } else {
          const fx = await fetchFx('TRY', cur.code, tlValue);
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
    } catch (e) {}
    results.push({ code: cur.code, label: cur.label, value, type: 'fiat' });
  }

  return results;
}
// API functions for Kurmatik finance data
export interface FxResponse {
  result: number;
  rate: number;
}

export interface GoldResponse {
  gram: {
    Satış: string;
    Alış: string;
  };
}

// Fetch currency exchange rate
export async function fetchFx(from: string, to: string, amount: number): Promise<FxResponse> {
  try {
    // Yahoo Finance API for currency conversion
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${from}${to}=X`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
      const rate = data.chart.result[0].meta.regularMarketPrice;
      return {
        result: rate * amount,
        rate: rate
      };
    }
    
    throw new Error('Kur bilgisi alınamadı');
  } catch (error) {
    console.error('FX API Error:', error);
    
    // Fallback: ExchangeRate API v6
    try {
      // ExchangeRate-API v6 ile API anahtarı kullanımı (Ücretli/Premium sürüm)
      const apiKey = '620385908ec18f8768c5da93'; // API anahtarınız
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`);
      if (!response.ok) throw new Error("Fallback FX API failed");
      
      const data = await response.json();
      const rate = data.conversion_rates?.[to];
      if (!rate) throw new Error("Currency not found in fallback API");

      return {
        rate: rate,
        result: rate * amount
      };
    } catch (fallbackError) {
      console.error("All FX APIs failed:", fallbackError);
      throw error; // Orijinal hatayı fırlat
    }
  }
}

// Fetch gold prices (Turkish market)
export async function fetchGoldToday(): Promise<GoldResponse> {
  try {
    // Truncgil API for Turkish gold prices
    const response = await fetch('https://api.truncgil.com/today.json');
    const data = await response.json();
    
    if (data?.gram) {
      return data;
    }
    
    throw new Error('Altın fiyatları alınamadı');
  } catch (error) {
    console.error('Gold API Error:', error);
    throw error;
  }
}

// XAU/USD gold price
export async function fetchGoldXau(currency = 'USD'): Promise<any> {
  try {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/GC=F';
    const response = await fetch(url);
    const data = await response.json();
    
    if (data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
      const ouncePrice = data.chart.result[0].meta.regularMarketPrice;
      const gramPrice = ouncePrice / 31.1035; // Convert troy ounce to gram
      
      // If requesting TRY conversion
      if (currency === 'TRY') {
        try {
          const usdTry = await fetchFx('USD', 'TRY', 1);
          return {
            ounce: ouncePrice * usdTry.rate,
            gram: gramPrice * usdTry.rate,
            date: new Date().toLocaleString('tr-TR')
          };
        } catch (error) {
          console.error('TRY conversion error:', error);
          return { ounce: ouncePrice, gram: gramPrice };
        }
      }
      
      return { 
        ounce: ouncePrice, 
        gram: gramPrice,
        date: new Date().toLocaleString('en-US')
      };
    }
    
    throw new Error('XAU/USD fiyatı alınamadı');
  } catch (error) {
    console.error('XAU API Error:', error);
    throw error;
  }
}