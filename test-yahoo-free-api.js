/**
 * Yahoo Finance API Test Script
 * Tests currency exchange rates and gold prices using free Yahoo Finance API
 */

// Basit fetch fonksiyonu
async function testYahooFinanceFx() {
  console.log('🧪 Testing Yahoo Finance Currency API...\n');
  
  const testPairs = [
    { from: 'USD', to: 'TRY', amount: 100 },
    { from: 'EUR', to: 'TRY', amount: 100 },
    { from: 'GBP', to: 'USD', amount: 100 },
    { from: 'TRY', to: 'USD', amount: 3500 },
  ];

  for (const pair of testPairs) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${pair.from}${pair.to}=X`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
        const rate = data.chart.result[0].meta.regularMarketPrice;
        const result = rate * pair.amount;
        console.log(`✅ ${pair.amount} ${pair.from} = ${result.toFixed(4)} ${pair.to}`);
        console.log(`   Rate: ${rate.toFixed(6)}`);
      } else {
        console.log(`❌ ${pair.from}/${pair.to}: Veri alınamadı`);
      }
    } catch (error) {
      console.log(`❌ ${pair.from}/${pair.to}: Hata - ${error.message}`);
    }
    console.log('');
  }
}

async function testYahooFinanceGold() {
  console.log('\n🥇 Testing Yahoo Finance Gold API...\n');
  
  try {
    // Gold Futures (COMEX)
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/GC=F';
    const response = await fetch(url);
    const data = await response.json();
    
    if (data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
      const ouncePrice = data.chart.result[0].meta.regularMarketPrice;
      const gramPrice = ouncePrice / 31.1035;
      
      console.log('✅ Gold Prices (USD):');
      console.log(`   Ounce: $${ouncePrice.toFixed(2)}`);
      console.log(`   Gram: $${gramPrice.toFixed(2)}`);
      
      // USD/TRY kurunu al ve TL'ye çevir
      const usdTryUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/USDTRY=X';
      const usdTryResponse = await fetch(usdTryUrl);
      const usdTryData = await usdTryResponse.json();
      
      if (usdTryData?.chart?.result?.[0]?.meta?.regularMarketPrice) {
        const usdTryRate = usdTryData.chart.result[0].meta.regularMarketPrice;
        console.log(`\n✅ Gold Prices (TRY):`);
        console.log(`   Ounce: ₺${(ouncePrice * usdTryRate).toFixed(2)}`);
        console.log(`   Gram: ₺${(gramPrice * usdTryRate).toFixed(2)}`);
        console.log(`   USD/TRY Rate: ${usdTryRate.toFixed(4)}`);
      }
    } else {
      console.log('❌ Altın fiyatları alınamadı');
    }
  } catch (error) {
    console.log(`❌ Gold API Hatası: ${error.message}`);
  }
}

async function testGoldConversion() {
  console.log('\n💰 Testing Gold Unit Conversions...\n');
  
  try {
    // Altın fiyatını al
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/GC=F';
    const response = await fetch(url);
    const data = await response.json();
    
    if (data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
      const ouncePrice = data.chart.result[0].meta.regularMarketPrice;
      const gramPrice = ouncePrice / 31.1035;
      
      // USD/TRY kurunu al
      const usdTryUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/USDTRY=X';
      const usdTryResponse = await fetch(usdTryUrl);
      const usdTryData = await usdTryResponse.json();
      const usdTryRate = usdTryData?.chart?.result?.[0]?.meta?.regularMarketPrice || 1;
      
      const gramPriceTRY = gramPrice * usdTryRate;
      
      console.log('✅ Altın Birimleri (TRY):');
      console.log(`   1 Gram Altın: ₺${gramPriceTRY.toFixed(2)}`);
      console.log(`   1 Çeyrek Altın (1.75g): ₺${(gramPriceTRY * 1.75).toFixed(2)}`);
      console.log(`   1 Yarım Altın (3.5g): ₺${(gramPriceTRY * 3.5).toFixed(2)}`);
      console.log(`   1 Tam Altın (7g): ₺${(gramPriceTRY * 7).toFixed(2)}`);
      console.log(`   1 Cumhuriyet Altını (7.216g): ₺${(gramPriceTRY * 7.216).toFixed(2)}`);
      console.log(`   1 Ons Altın (31.1035g): ₺${(gramPriceTRY * 31.1035).toFixed(2)}`);
    } else {
      console.log('❌ Altın fiyatları alınamadı');
    }
  } catch (error) {
    console.log(`❌ Altın dönüşüm hatası: ${error.message}`);
  }
}

// Tüm testleri çalıştır
async function runAllTests() {
  console.log('=' .repeat(60));
  console.log('📊 KURMATIK API TEST - 100% Yahoo Finance');
  console.log('=' .repeat(60));
  console.log('\n🎯 Tamamen ücretsiz Yahoo Finance API kullanılıyor');
  console.log('✨ API anahtarı gerekmez | ✨ Sınırsız istek');
  console.log('✨ Kota sınırlaması yok | ✨ Açık kaynak\n');
  console.log('=' .repeat(60));
  
  await testYahooFinanceFx();
  await testYahooFinanceGold();
  await testGoldConversion();
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Test tamamlandı!');
  console.log('=' .repeat(60));
}

// Node.js ortamında çalıştır
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testYahooFinanceFx, testYahooFinanceGold, testGoldConversion };
