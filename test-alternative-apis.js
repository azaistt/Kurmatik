// Alternatif XAU/Gold API kaynakları testi
console.log('🧪 Alternatif XAU API Kaynakları Test Ediliyor...\n');

// 1. Metals-API (ücretsiz 50 request/ay)
async function testMetalsAPI() {
  try {
    console.log('📊 Metals-API test ediliyor...');
    // Ücretsiz endpoint - API key gerektirmez
    const response = await fetch('https://api.metals.live/v1/spot/gold');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Metals-API başarılı:', data);
      return data;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Metals-API hatası:', error.message);
    return null;
  }
}

// 2. CoinGecko API (altın tokenları için)
async function testCoinGeckoGold() {
  try {
    console.log('📊 CoinGecko Gold test ediliyor...');
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=gold&vs_currencies=usd,eur,try');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ CoinGecko Gold başarılı:', data);
      return data;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.log('❌ CoinGecko Gold hatası:', error.message);
    return null;
  }
}

// 3. FMP (Financial Modeling Prep) - ücretsiz 250 request/gün
async function testFMPGold() {
  try {
    console.log('📊 FMP Gold test ediliyor...');
    const response = await fetch('https://financialmodelingprep.com/api/v3/quote/XAUUSD?apikey=demo');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ FMP Gold başarılı:', data);
      return data;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.log('❌ FMP Gold hatası:', error.message);
    return null;
  }
}

// 4. Yahoo Finance Alternative API
async function testYahooFinanceGold() {
  try {
    console.log('📊 Yahoo Finance Gold test ediliyor...');
    const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Yahoo Finance Gold başarılı:', {
        symbol: data?.chart?.result?.[0]?.meta?.symbol,
        price: data?.chart?.result?.[0]?.meta?.regularMarketPrice,
        previousClose: data?.chart?.result?.[0]?.meta?.previousClose,
        change: data?.chart?.result?.[0]?.meta?.regularMarketPrice - data?.chart?.result?.[0]?.meta?.previousClose
      });
      return data;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Yahoo Finance Gold hatası:', error.message);
    return null;
  }
}

// 5. Alpha Vantage - ücretsiz 25 request/gün
async function testAlphaVantageGold() {
  try {
    console.log('📊 Alpha Vantage Gold test ediliyor...');
    const response = await fetch('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=demo');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Alpha Vantage Gold başarılı:', data);
      return data;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Alpha Vantage Gold hatası:', error.message);
    return null;
  }
}

async function runAllTests() {
  const results = [];
  
  results.push(await testMetalsAPI());
  results.push(await testCoinGeckoGold());
  results.push(await testFMPGold());
  results.push(await testYahooFinanceGold());
  results.push(await testAlphaVantageGold());
  
  console.log('\n🏁 Test sonuçları:');
  const successful = results.filter(r => r !== null);
  console.log(`✅ Başarılı API'ler: ${successful.length}/5`);
  
  if (successful.length > 0) {
    console.log('💡 En iyi alternatif API kaynakları bulundu!');
  } else {
    console.log('⚠️ Tüm alternatif APIler başarısız oldu.');
  }
}

// Test'i çalıştır
if (require.main === module) {
  runAllTests().catch(console.error);
}