// Yahoo Finance Kapsamlı Test - Tüm finans verilerini test et
console.log('🧪 Yahoo Finance Kapsamlı Test Başlıyor...\n');

// Yardımcı fonksiyonlar
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiting için yardımcı fonksiyon
async function fetchWithRetry(url, retries = 3, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      if (i > 0) {
        await delay(delayMs * i); // Her denemede bekleme süresini artır
      }
      const response = await fetch(url);
      if (response.status === 429) { // Too Many Requests
        throw new Error('Rate limit exceeded');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // Son deneme ise hatayı fırlat
      console.log(`Yeniden deneniyor (${i + 1}/${retries})...`);
    }
  }
}

// 1. XAU (Altın) Test
async function testYahooXau() {
  try {
    console.log('📊 Yahoo Finance XAU test ediliyor...');
    const data = await fetchWithRetry('https://query1.finance.yahoo.com/v8/finance/chart/GC=F');
    const result = data?.chart?.result?.[0];
    const meta = result.meta;
    
    console.log('✅ XAU/USD:', {
      price: `$${meta.regularMarketPrice.toFixed(2)}`,
      change: `${((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100).toFixed(2)}%`,
      symbol: meta.symbol
    });
    return { success: true, data: meta };
  } catch (error) {
    console.log('❌ XAU hatası:', error.message);
    return { success: false };
  }
}

// 2. FX (Döviz) Test
async function testYahooFx() {
  const pairs = ['USDTRY=X', 'EURTRY=X', 'GBPTRY=X'];
  const results = [];
  
  for (const pair of pairs) {
    try {
      console.log(`📊 ${pair} test ediliyor...`);
      await delay(1000); // Her istek arasında 1 saniye bekle
      const data = await fetchWithRetry(`https://query1.finance.yahoo.com/v8/finance/chart/${pair}`);
      const result = data?.chart?.result?.[0];
      const meta = result.meta;
      
      const rate = meta.regularMarketPrice;
      const change = ((rate - meta.previousClose) / meta.previousClose * 100);
      
      console.log(`✅ ${pair}:`, {
        rate: rate.toFixed(4),
        change: `${change.toFixed(2)}%`
      });
      
      results.push({ pair, rate, change, success: true });
    } catch (error) {
      console.log(`❌ ${pair} hatası:`, error.message);
      results.push({ pair, success: false });
    }
  }
  
  return results;
}

// 3. Çoklu Kur Test  
async function testMultipleCurrencies() {
  try {
    console.log('📊 Çoklu döviz kuru test ediliyor...');
    const currencies = ['USD', 'EUR', 'GBP'];
    const symbols = currencies.map(curr => `${curr}TRY=X`);
    
    const promises = symbols.map(async symbol => {
      try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
        const data = await response.json();
        const meta = data?.chart?.result?.[0]?.meta;
        return {
          symbol,
          rate: meta.regularMarketPrice,
          success: true
        };
      } catch (error) {
        return { symbol, success: false, error: error.message };
      }
    });
    
    const results = await Promise.all(promises);
    console.log('✅ Çoklu kur sonuçları:', results.filter(r => r.success));
    return results;
  } catch (error) {
    console.log('❌ Çoklu kur hatası:', error.message);
    return [];
  }
}

// 4. Performans Test
async function testPerformance() {
  console.log('\n⚡ Performans testi...');
  const startTime = Date.now();
  
  // Paralel olarak tüm API'leri çağır
  const promises = [
    fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F'),
    fetch('https://query1.finance.yahoo.com/v8/finance/chart/USDTRY=X'),
    fetch('https://query1.finance.yahoo.com/v8/finance/chart/EURTRY=X')
  ];
  
  try {
    await Promise.all(promises);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Paralel API çağrıları ${duration}ms'de tamamlandı`);
    return { duration, success: true };
  } catch (error) {
    console.log('❌ Performans testi hatası:', error.message);
    return { success: false };
  }
}

// Ana test fonksiyonu
async function runYahooFinanceTests() {
  console.log('🚀 Yahoo Finance Kapsamlı Test\n');
  
  const xauResult = await testYahooXau();
  console.log('');
  
  const fxResults = await testYahooFx();
  console.log('');
  
  const multiResult = await testMultipleCurrencies();
  console.log('');
  
  const perfResult = await testPerformance();
  console.log('');
  
  // Özet
  console.log('📈 TEST ÖZETİ:');
  console.log(`   XAU (Altın): ${xauResult.success ? '✅' : '❌'}`);
  console.log(`   FX (Döviz): ${fxResults.filter(r => r.success).length}/${fxResults.length} ✅`);
  console.log(`   Çoklu Kur: ${multiResult.filter(r => r.success).length}/${multiResult.length} ✅`);
  console.log(`   Performans: ${perfResult.success ? '✅' : '❌'} ${perfResult.duration || 'N/A'}ms`);
  
  const totalSuccess = (xauResult.success ? 1 : 0) + 
                      fxResults.filter(r => r.success).length + 
                      multiResult.filter(r => r.success).length + 
                      (perfResult.success ? 1 : 0);
  const totalTests = 1 + fxResults.length + multiResult.length + 1;
  
  console.log(`\n🎯 SONUÇ: ${totalSuccess}/${totalTests} test başarılı`);
  
  if (totalSuccess === totalTests) {
    console.log('🎉 TÜM TESTLER BAŞARILI! Yahoo Finance entegrasyonu hazır.');
  } else {
    console.log('⚠️ Bazı testler başarısız. Lütfen kontrol edin.');
  }
}

// Test'i çalıştır
if (require.main === module) {
  runYahooFinanceTests().catch(console.error);
}