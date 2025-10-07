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
    throw error;
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
export async function fetchGoldXau(): Promise<number> {
  try {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/GC=F';
    const response = await fetch(url);
    const data = await response.json();
    
    if (data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
      return data.chart.result[0].meta.regularMarketPrice;
    }
    
    throw new Error('XAU/USD fiyatı alınamadı');
  } catch (error) {
    console.error('XAU API Error:', error);
    throw error;
  }
}