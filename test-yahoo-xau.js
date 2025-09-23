// Yahoo Finance XAU API basit test
console.log('🧪 Yahoo Finance XAU Test...');

// Basit Yahoo Finance test'i
async function testYahooXau() {
  try {
    console.log('📡 Yahoo Finance XAU API test ediliyor...');
    const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const result = data?.chart?.result?.[0];
    
    if (!result) {
      throw new Error('Invalid response format');
    }
    
    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const previousClose = meta.previousClose;
    const change = price - previousClose;
    const changePercent = ((change / previousClose) * 100);
    
    console.log('✅ Yahoo Finance XAU başarılı:');
    console.log(`   Sembol: ${meta.symbol}`);
    console.log(`   Güncel Fiyat: $${price.toFixed(2)}`);
    console.log(`   Önceki Kapanış: $${previousClose.toFixed(2)}`);
    console.log(`   Değişim: $${change.toFixed(2)} (${changePercent.toFixed(2)}%)`);
    console.log(`   Market Durumu: ${meta.marketState}`);
    console.log(`   Para Birimi: ${meta.currency}`);
    
    // Gram fiyatını hesapla
    const GRAMS_PER_TROY_OUNCE = 31.1034768;
    const pricePerGram = price / GRAMS_PER_TROY_OUNCE;
    console.log(`   Gram Başına: $${pricePerGram.toFixed(2)}`);
    
    // TL'ye çevir (yaklaşık 34 TL/USD)
    const approximateUsdToTry = 34;
    const priceInTry = price * approximateUsdToTry;
    const gramPriceInTry = pricePerGram * approximateUsdToTry;
    
    console.log('\n💰 Yaklaşık TL Fiyatları:');
    console.log(`   Ons: ₺${priceInTry.toFixed(2)}`);
    console.log(`   Gram: ₺${gramPriceInTry.toFixed(2)}`);
    
    return {
      success: true,
      price,
      change,
      changePercent,
      pricePerGram,
      currency: meta.currency
    };
    
  } catch (error) {
    console.log('❌ Yahoo Finance XAU hatası:', error.message);
    return { success: false, error: error.message };
  }
}

// Test'i çalıştır
if (require.main === module) {
  testYahooXau().catch(console.error);
}