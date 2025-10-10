/**
 * Test script to verify Yahoo Finance API conversion works
 */

async function testConversion() {
  try {
    console.log('Testing USD to TRY conversion...');
    
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/USDTRY=X';
    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Full API Response:', JSON.stringify(data, null, 2));
    
    if (data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
      const rate = data.chart.result[0].meta.regularMarketPrice;
      console.log('✅ Exchange rate found:', rate);
      console.log('✅ 1000 USD =', (1000 * rate).toFixed(2), 'TRY');
      return true;
    }
    
    throw new Error('Could not find exchange rate in response');
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run the test
testConversion().then(success => {
  console.log(success ? '\n✅ Test PASSED' : '\n❌ Test FAILED');
  process.exit(success ? 0 : 1);
});
