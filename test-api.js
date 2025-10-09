// test-api.js
async function testAPIs() {
  console.log('Testing APIs...\n');

  try {
    // FX API test (matches app's FX provider)
    console.log('1. Testing FX API...');
    const apiKey = '620385908ec18f8768c5da93'; // ExchangeRate-API v6 anahtarı
    const fxResponse = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
    console.log('FX status:', fxResponse.status);
    const fxData = await fxResponse.json();
    console.log('USD->TRY rate:', fxData?.conversion_rates?.TRY);
    console.log('Updated:', fxData?.time_last_update || fxData?.time_last_update_utc || fxData?.date);
  } catch (e) {
    console.log('FX API Error:', e.message);
  }

  try {
    // Gold API test
    console.log('\n2. Testing Gold API...');
    const goldResponse = await fetch('https://finans.truncgil.com/v4/today.json');
    console.log('Gold status:', goldResponse.status);
      const goldData = await goldResponse.json();
      console.log('Gold keys:', Object.keys(goldData));
      const gram = goldData['Gram Altın'] || goldData['GRA'];
      const ceyrek = goldData['Çeyrek Altın'] || goldData['CEYREKALTIN'] || goldData['CEYREK'];
      const ons = goldData['Ons Altın'] || goldData['ONS'];

      const getSelling = (it) => {
        if (!it) return undefined;
        return (
          it?.Satış ?? it?.Satis ?? it?.selling ?? it?.Selling ?? it?.Sell ?? it?.SELL ?? it?.selling
        );
      };

      console.log('Gram Altın Satış:', getSelling(gram));
      console.log('Çeyrek Altın Satış:', getSelling(ceyrek));
      console.log('Ons Altın Satış:', getSelling(ons));
  } catch (e) {
    console.log('Gold API Error:', e.message);
  }

  try {
    // XAU via exchangerate.host
    console.log('\n3. Testing XAU via exchangerate.host...');
    const xauRes = await fetch('https://api.exchangerate.host/latest?base=XAU&symbols=USD,TRY,EUR');
    console.log('XAU status:', xauRes.status);
    const xau = await xauRes.json();
    if (xau?.rates) {
      console.log('XAU->USD (1 oz):', xau.rates.USD);
      console.log('XAU->TRY (1 oz):', xau.rates.TRY);
      console.log('XAU->EUR (1 oz):', xau.rates.EUR);
    } else {
      console.log('XAU response JSON:', xau);
    }
  } catch (e) {
    console.log('XAU API Error:', e.message);
  }
  
    try {
      // NosyAPI currencies (optional)
      console.log('\n4. Testing NosyAPI (optional)...');
      const key = process.env.NOSY_API_KEY;
      if (!key) {
        console.log('NOSY_API_KEY not set, skipping.');
      } else {
        // Header usage
        const r1 = await fetch('https://www.nosyapi.com/apiv2/service/economy/currency/list', {
          headers: { 'X-NSYP': key },
        });
        const j1 = await r1.json();
        const count1 = Array.isArray(j1?.data) ? j1.data.length : (Array.isArray(j1) ? j1.length : 0);
        console.log('Nosy (header) count:', count1);

        // Query param usage
        const r2 = await fetch(`https://www.nosyapi.com/apiv2/service/economy/currency/list?apiKey=${encodeURIComponent(key)}`);
        const j2 = await r2.json();
        const count2 = Array.isArray(j2?.data) ? j2.data.length : (Array.isArray(j2) ? j2.length : 0);
        console.log('Nosy (query) count:', count2);

        // Gold list test
        const rg = await fetch('https://www.nosyapi.com/apiv2/service/economy/gold/list', {
          headers: { 'X-NSYP': key },
        });
        const jg = await rg.json();
        const goldCount = Array.isArray(jg?.data) ? jg.data.length : (Array.isArray(jg) ? jg.length : 0);
        console.log('Nosy gold (header) count:', goldCount);
      }
    } catch (e) {
      console.log('NosyAPI Error:', e.message);
    }
}

testAPIs();