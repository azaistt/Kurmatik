import axios from 'axios';

// import { genAuthCookies } from './utils'; // Not currently used

const validateStatus = (status: number) => status < 500;

const indicators = ['Recommend.Other', 'Recommend.All', 'Recommend.MA'];

async function fetchScanData(tickers: string[] = [], columns: string[] = []) {
  const { data } = await axios.post('https://scanner.tradingview.com/global/scan', {
    symbols: { tickers },
    columns,
  }, { validateStatus });
  return data;
}

export async function getTA(id: string): Promise<any | false> {
  const advice: { [key: string]: any } = {};
  const cols = ['1', '5', '15', '60', '240', '1D', '1W', '1M'].map((t) => indicators.map((i) => (t !== '1D' ? `${i}|${t}` : i))).flat();
  const rs = await fetchScanData([id], cols);
  if (!rs.data || !rs.data[0]) return false;
  rs.data[0].d.forEach((val: number, i: number) => {
    const [name, period] = cols[i].split('|');
    const pName = period || '1D';
    if (!advice[pName]) advice[pName] = {};
    const key = name.split('.').pop();
    if (key) {
      advice[pName][key] = Math.round(val * 1000) / 500;
    }
  });
  return advice;
}

export async function searchMarket(search: string, filter: string = ''): Promise<any[]> {
  const { data } = await axios.get('https://symbol-search.tradingview.com/symbol_search', {
    params: { text: search.replace(/ /g, '%20'), type: filter },
    headers: { origin: 'https://www.tradingview.com' },
    validateStatus,
  });
  return data.map((s: any) => {
    const exchange = s.exchange.split(' ')[0];
    const id = `${exchange}:${s.symbol}`;
    return {
      id,
      exchange,
      fullExchange: s.exchange,
      symbol: s.symbol,
      description: s.description,
      type: s.type,
      getTA: () => getTA(id),
    };
  });
}
