// src/lib/api.js - Yahoo Finance API Integration
import { fetchFxYahooCompatible } from './yahoo/fx.js';
import { fetchGoldFromYahoo, fetchXauFromYahoo } from './yahoo/gold.js';

// Yahoo Finance'i kullanarak döviz kuru çevirisi
export async function fetchFx(from = "USD", to = "TRY", amount = 1) {
  try {
    // Yahoo Finance API kullan
    const result = await fetchFxYahooCompatible(from, to, amount);
    return result;
  } catch (e) {
    console.error("Yahoo Finance FX API error:", e);
    // Fallback: TradingView veya diğer kaynak
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      if (!response.ok) throw new Error("Fallback FX API failed");
      
      const data = await response.json();
      const rate = data.rates?.[to];
      if (!rate) throw new Error("Currency not found in fallback API");

      return {
        rate: rate,
        result: rate * amount,
        date: new Date().toISOString().split('T')[0],
        source: 'Fallback API'
      };
    } catch (fallbackError) {
      console.error("All FX APIs failed:", fallbackError);
      
      // Son fallback: yaklaşık değerler
      const staticRates = {
        'USD': { 'TRY': 41.41, 'EUR': 0.92 },
        'EUR': { 'TRY': 45.20, 'USD': 1.09 },
        'TRY': { 'USD': 0.024, 'EUR': 0.022 }
      };
      
      const rate = staticRates[from]?.[to] || 1;
      return {
        rate: rate,
        result: rate * amount,
        date: new Date().toISOString().split('T')[0],
        source: 'Static Fallback'
      };
    }
  }
}

// Yahoo Finance'i kullanarak altın fiyatlarını çek ve TL'ye çevir
export async function fetchGoldToday() {
  const formatTr = (n) => {
    try {
      return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n));
    } catch {
      return String(n);
    }
  };

  try {
    // Yahoo Finance'den XAU/USD fiyatını al
    const xauData = await fetchXauFromYahoo();
    console.log('XAU/USD from Yahoo:', xauData);
    
    // USD/TRY kurunu al
    const fxData = await fetchFx('USD', 'TRY', 1);
    console.log('USD/TRY rate:', fxData);
    
    const usdToTry = fxData.rate;
    const xauUsd = xauData.price; // 1 ons altın = X USD
    const xauTry = xauUsd * usdToTry; // 1 ons altın = X TRY
    
    // Türk altınlarının gram ağırlıkları (yaklaşık)
    const gramPerOunce = 31.1034768;
    const gramTry = xauTry / gramPerOunce; // 1 gram altın = X TRY
    
    // Türk geleneksel altınları
    const ceyrekWeight = 1.75; // gram
    const yarimWeight = 3.5; // gram  
    const tamWeight = 7.216; // gram
    const cumhuriyetWeight = 7.216; // gram (Cumhuriyet altını tam altın ile aynı ağırlık)
    
    return {
      gram: {
        Alış: formatTr(gramTry * 0.995), // %0.5 spread
        Satış: formatTr(gramTry * 1.005),
        Değişim: xauData.changePercent ? `%${xauData.changePercent.toFixed(2)}` : '0.00'
      },
      ceyrek: {
        Alış: formatTr(gramTry * ceyrekWeight * 0.995),
        Satış: formatTr(gramTry * ceyrekWeight * 1.005),
        Değişim: xauData.changePercent ? `%${xauData.changePercent.toFixed(2)}` : '0.00'
      },
      yarim: {
        Alış: formatTr(gramTry * yarimWeight * 0.995),
        Satış: formatTr(gramTry * yarimWeight * 1.005),
        Değişim: xauData.changePercent ? `%${xauData.changePercent.toFixed(2)}` : '0.00'
      },
      tam: {
        Alış: formatTr(gramTry * tamWeight * 0.995),
        Satış: formatTr(gramTry * tamWeight * 1.005),
        Değişim: xauData.changePercent ? `%${xauData.changePercent.toFixed(2)}` : '0.00'
      },
      cumhuriyet: {
        Alış: formatTr(gramTry * cumhuriyetWeight * 0.995),
        Satış: formatTr(gramTry * cumhuriyetWeight * 1.005),
        Değişim: xauData.changePercent ? `%${xauData.changePercent.toFixed(2)}` : '0.00'
      },
      ons: {
        Alış: formatTr(xauTry * 0.995),
        Satış: formatTr(xauTry * 1.005),
        Değişim: xauData.changePercent ? `%${xauData.changePercent.toFixed(2)}` : '0.00'
      },
      updated: new Date().toISOString().split('T')[0],
      source: 'Yahoo Finance + Real-time FX'
    };
  } catch (e) {
    console.error("Yahoo Finance Gold API error:", e);
    
    // Fallback: TradingView Gold fiyatı
    try {
      const response = await fetch('https://api.tradingview.com/v1/symbols/XAUUSD');
      if (response.ok) {
        const data = await response.json();
        const goldPrice = data.price || 2650; // USD/ounce
        const fxData = await fetchFx('USD', 'TRY', 1);
        const goldTry = goldPrice * fxData.rate;
        const gramTry = goldTry / 31.1034768;
        
        return {
          gram: { Satış: formatTr(gramTry) },
          ceyrek: { Satış: formatTr(gramTry * 1.75) },
          yarim: { Satış: formatTr(gramTry * 3.5) },
          tam: { Satış: formatTr(gramTry * 7.216) },
          cumhuriyet: { Satış: formatTr(gramTry * 7.216) },
          ons: { Satış: formatTr(goldTry) },
          updated: new Date().toISOString().split('T')[0],
          source: 'TradingView Fallback'
        };
      }
    } catch (fallbackError) {
      console.error("TradingView fallback failed:", fallbackError);
    }
    
    // Son fallback: statik yaklaşık değerler
    return {
      gram: { Satış: "3.250,00" },
      ceyrek: { Satış: "5.687,50" },
      yarim: { Satış: "11.375,00" },
      tam: { Satış: "23.452,00" },
      cumhuriyet: { Satış: "23.452,00" },
      ons: { Satış: "135.000,00" },
      updated: new Date().toISOString().split('T')[0],
      source: 'Static Fallback'
    };
  }
}

// Yahoo Finance'i kullanarak XAU fiyatlarını çek
export async function fetchGoldXau(to = "USD") {
  try {
    // Yahoo Finance'den altın fiyatını istenilen para biriminde al
    const goldData = await fetchGoldFromYahoo(to);
    return goldData;
  } catch (e) {
    console.error("Yahoo Finance XAU error:", e);
    
    // Fallback: fetchGoldToday kullanarak TL fiyatından çevir
    try {
      const today = await fetchGoldToday();
      const onsSaleStr = today?.ons?.Satış;
      
      if (onsSaleStr) {
        let tlPerOns = Number(String(onsSaleStr).replaceAll('.', '').replace(',', '.'));
        
        if (to === 'TRY') {
          return {
            ounce: tlPerOns,
            gram: tlPerOns / 31.1034768,
            date: today.updated,
            currency: to,
            source: 'TL Fallback'
          };
        }
        
        // TL'den başka para birimine çevir
        const fx = await fetchFx('TRY', to, tlPerOns);
        return {
          ounce: fx.result,
          gram: fx.result / 31.1034768,
          date: fx.date,
          currency: to,
          source: 'TL + FX Fallback'
        };
      }
    } catch (fallbackError) {
      console.error("XAU fallback failed:", fallbackError);
    }
    
    // Son fallback: yaklaşık değerler
    const staticPrices = {
      'USD': 2650,
      'EUR': 2430,
      'TRY': 109765
    };
    
    const ounce = staticPrices[to] || staticPrices['USD'];
    
    return {
      ounce: ounce,
      gram: ounce / 31.1034768,
      date: new Date().toISOString().split('T')[0],
      currency: to,
      source: 'Static Fallback'
    };
  }
}