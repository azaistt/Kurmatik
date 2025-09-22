// src/lib/api.js
import { parseTr } from './format';
import { normalizeTruncgil } from './truncgil';

const FX_BASE = "https://api.exchangerate-api.com/v4/latest"; // Alternatif FX API
const TRUNC_BASE = "https://finans.truncgil.com/v4/today.json"; // Altın için şimdilik aynı
const XAU_BASE = "https://api.exchangerate.host/latest"; // Ücretsiz, anahtarsız XAU desteği varsayımı
const NOSY_BASE = "https://www.nosyapi.com/apiv2/service";

let NOSY_API_KEY = null; // İsteğe bağlı – ayarlanırsa NosyAPI kullanılabilir

export function setNosyApiKey(key) {
  NOSY_API_KEY = key || null;
}


function buildNosyHeaders(key) {
  return key ? { 'X-NSYP': key } : {};
}

export async function fetchNosyCurrencies(options = {}) {
  const key = options.apiKey || NOSY_API_KEY;
  const preferHeader = options.useHeader !== false; // varsayılan header kullan
  const url = preferHeader
    ? `${NOSY_BASE}/economy/currency/list`
    : `${NOSY_BASE}/economy/currency/list?apiKey=${encodeURIComponent(String(key || ''))}`;

  const r = await fetch(url, {
    headers: preferHeader ? buildNosyHeaders(key) : undefined,
  });
  if (!r.ok) throw new Error(`NosyAPI hata: ${r.status}`);
  const j = await r.json();

  // Muhtemel veri şemaları:
  // { data: [{ code: 'USD', buying: '...', selling: '...' }, ...] }
  // veya { currencies: [...] } / doğrudan array
  const arr = Array.isArray(j)
    ? j
    : Array.isArray(j?.data)
    ? j.data
    : Array.isArray(j?.currencies)
    ? j.currencies
    : [];

  const map = {};
  for (const it of arr) {
    const code = it?.code || it?.Code || it?.currencyCode || it?.Kod;
    if (!code) continue;
    // Fiyatlar sayı veya TR formatlı string olabilir
    const selling = it?.selling ?? it?.Sell ?? it?.satis ?? it?.Satış ?? it?.Satis;
    const buying = it?.buying ?? it?.Buy ?? it?.alis ?? it?.Alış ?? it?.Alis;
    const sellNum = typeof selling === 'number' ? selling : parseTr(selling);
    const buyNum = typeof buying === 'number' ? buying : parseTr(buying);
    map[String(code).toUpperCase()] = {
      buying: buyNum,
      selling: sellNum,
      raw: it,
    };
  }
  return { map, raw: j };
}

export async function fetchFx(from = "USD", to = "TRY", amount = 1) {
  // Önce (varsa) NosyAPI ile dene
  if (NOSY_API_KEY && from && to) {
    try {
      const { map } = await fetchNosyCurrencies();
      const F = String(from).toUpperCase();
      const T = String(to).toUpperCase();
      if (F === T) {
        return { rate: 1, result: amount, date: new Date().toISOString().split('T')[0] };
      }
      // Nosy listesi genelde TRY karşılıkları verir
      const TRY_PER_F = F === 'TRY' ? 1 : map[F]?.selling;
      const TRY_PER_T = T === 'TRY' ? 1 : map[T]?.selling;
      if (!isFinite(TRY_PER_F) || !isFinite(TRY_PER_T) || TRY_PER_F <= 0 || TRY_PER_T <= 0) {
        throw new Error('NosyAPI: kur eksik');
      }
      let rate;
      if (F === 'TRY') {
        rate = 1 / TRY_PER_T; // TRY -> T
      } else if (T === 'TRY') {
        rate = TRY_PER_F; // F -> TRY
      } else {
        rate = TRY_PER_F / TRY_PER_T; // F -> T
      }
      return {
        rate,
        result: rate * amount,
        date: new Date().toISOString().split('T')[0],
      };
    } catch (e) {
      console.warn('NosyAPI FX fallback to public API:', e?.message || e);
      // Devam edip public API'ye düşeceğiz
    }
  }

  // Public API (anahtar gerektirmez)
  try {
    const url = `${FX_BASE}/${from}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error("Döviz kuru alınamadı. İnternet bağlantınızı kontrol edin.");
    const j = await r.json();
    const rate = j.rates?.[to];
    if (!rate) throw new Error("Döviz kuru bulunamadı.");

    return {
      rate: rate,
      result: rate * amount,
      date: new Date().toISOString().split('T')[0], // Bugünün tarihi
    };
  } catch (e) {
    console.error("FX API error:", e);
    // Fallback: yaklaşık değerler
    const fallbackRates = { USD: 41.5, EUR: 45.2 };
    const rate = fallbackRates[from] || 1;
    return {
      rate: rate,
      result: rate * amount,
      date: new Date().toISOString().split('T')[0],
    };
  }
}

export async function fetchGoldToday() {
  const formatTr = (n) => {
    try {
      return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n));
    } catch {
      return String(n);
    }
  };

  // 1) NosyAPI (varsa) dene
  if (NOSY_API_KEY) {
    try {
      // Önce header ile dene
      let r = await fetch(`${NOSY_BASE}/economy/gold/list`, { headers: buildNosyHeaders(NOSY_API_KEY) });
      if (!r.ok) {
        // Query param ile ikinci deneme
        r = await fetch(`${NOSY_BASE}/economy/gold/list?apiKey=${encodeURIComponent(NOSY_API_KEY)}`);
      }
      if (r.ok) {
        const j = await r.json();
        const arr = Array.isArray(j?.data)
          ? j.data
          : Array.isArray(j?.gold)
          ? j.gold
          : Array.isArray(j?.items)
          ? j.items
          : Array.isArray(j)
          ? j
          : [];

        const pick = (needle, alts = []) => {
          const keys = [needle, ...alts];
          const findByName = () => {
            for (const it of arr) {
              const name = String(it?.name || it?.Name || it?.title || it?.Title || it?.kod || it?.Kod || '').toLowerCase();
              for (const k of keys) {
                if (name.includes(k)) return it;
              }
            }
            return null;
          };
          const byName = findByName();
          return byName;
        };

        const extract = (it) => {
          if (!it) return null;
          const selling = it?.selling ?? it?.satis ?? it?.Satış ?? it?.Satis ?? it?.Sell ?? it?.sell;
          const buying = it?.buying ?? it?.alis ?? it?.Alış ?? it?.Alis ?? it?.Buy ?? it?.buy;
          const change = it?.change ?? it?.degisim ?? it?.Değişim ?? it?.Degisim ?? it?.Change;
          const sNum = typeof selling === 'number' ? selling : parseTr(selling);
          const bNum = typeof buying === 'number' ? buying : parseTr(buying);
          return {
            Alış: isFinite(bNum) ? formatTr(bNum) : undefined,
            Satış: isFinite(sNum) ? formatTr(sNum) : undefined,
            Değişim: change != null ? String(change) : undefined,
          };
        };

        const gram = extract(pick('gram'));
        const ceyrek = extract(pick('çeyrek', ['ceyrek']))
          || extract(pick('ceyrek'));
        const yarim = extract(pick('yarım', ['yarim']))
          || extract(pick('yarim'));
        const tam = extract(pick('tam'));
        const cumhuriyet = extract(pick('cumhuriyet'));
        const ons = extract(pick('ons', ['ounce', 'xau']));

        if (gram || ceyrek || yarim || tam || cumhuriyet || ons) {
          return {
            gram,
            ceyrek,
            yarim,
            tam,
            cumhuriyet,
            ons,
            updated: j?.date || j?.time || new Date().toISOString().split('T')[0],
          };
        }
      }
    } catch (e) {
      console.warn('Nosy gold fallback to Truncgil:', e?.message || e);
    }
  }

  // 2) Truncgil (varsayılan) - normalize edilmiş yapı kullan
  try {
    const r = await fetch(TRUNC_BASE);
    if (!r.ok) throw new Error("Altın fiyatları alınamadı. İnternet bağlantınızı kontrol edin.");
    const j = await r.json();

    // Normalize with helper (supports Laravel package shape and raw Truncgil JSON)
    const nm = normalizeTruncgil(j);

    const pick = (candidates) => {
      for (const k of candidates) {
        if (nm[k]) return nm[k];
      }
      return null;
    };

    const gram = pick(['GRA', 'Gram Altın', 'GRAMALTIN']);
    const ceyrek = pick(['CEYREKALTIN', 'Çeyrek Altın', 'CEYREK']);
    const yarim = pick(['YARIMALTIN', 'Yarım Altın', 'YARIM']);
    const tam = pick(['TAMALTIN', 'Tam Altın', 'TAM']);
    const cumhuriyet = pick(['CUMHURIYETALTINI', 'Cumhuriyet Altını', 'CUMHURIYET']);
    const ons = pick(['ONS', 'Ons Altın', 'ONSALTIN']);

    return {
      gram: gram,
      ceyrek: ceyrek,
      yarim: yarim,
      tam: tam,
      cumhuriyet: cumhuriyet,
      ons: ons,
      updated: j["Update_Date"] || j.date || new Date().toISOString().split('T')[0],
    };
  } catch (e) {
    console.error("Gold API error:", e);
    // Fallback: yaklaşık altın fiyatları (TL cinsinden)
    return {
      gram: { Satış: "3200,00" },
      ceyrek: { Satış: "5200,00" },
      yarim: { Satış: "10400,00" },
      tam: { Satış: "20800,00" },
      cumhuriyet: { Satış: "21200,00" },
      ons: { Satış: "25600,00" },
      updated: new Date().toISOString().split('T')[0],
    };
  }
}

// XAU (Troy Ounce) baz alınarak seçilen para biriminde altın fiyatlarını getirir.
// Dönüş: { ounce: number, gram: number, date: string, currency: string }
export async function fetchGoldXau(to = "USD") {
  const GRAMS_PER_TROY_OUNCE = 31.1034768;
  try {
    const key = process.env.EXCHANGE_RATE_HOST_KEY || process.env.EXCHANGERATE_HOST_KEY || null;
    const qs = key ? `access_key=${encodeURIComponent(key)}&symbols=${encodeURIComponent(to)}` : `base=XAU&symbols=${encodeURIComponent(to)}`;
    const url = key ? `${XAU_BASE}?${qs}` : `${XAU_BASE}?${qs}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error("XAU fiyatı alınamadı");
    const j = await r.json();
    const rate = j?.rates?.[to]; // 1 XAU kaç 'to' eder
    if (!rate || !isFinite(rate)) throw new Error("XAU kuru bulunamadı");
    return {
      ounce: rate,
      gram: rate / GRAMS_PER_TROY_OUNCE,
      date: j?.date || new Date().toISOString().split('T')[0],
      currency: to,
    };
  } catch (e) {
    console.warn("XAU API error:", e);
    // Fallback: Truncgil 'Ons Altın' (TL) kullan, sonra FX ile hedef para birimine çevir
    try {
      const today = await fetchGoldToday();
      // Try Truncgil ons first
      const onsSaleStr = today?.ons?.Satış || today?.ons?.Satis || today?.ons?.selling || null; // TL cinsinden metin
      let tlPerOns = onsSaleStr ? Number(String(onsSaleStr).replaceAll('.', '').replace(',', '.')) : NaN;

      // If ons is missing or zero, fall back to Gram Altın * grams per troy ounce
      if (!isFinite(tlPerOns) || tlPerOns <= 0) {
        const gramSaleStr = today?.gram?.Satış || today?.gram?.Satis || today?.gram?.selling || null;
        const gramPrice = gramSaleStr ? Number(String(gramSaleStr).replaceAll('.', '').replace(',', '.')) : NaN;
        if (isFinite(gramPrice) && gramPrice > 0) {
          tlPerOns = gramPrice * GRAMS_PER_TROY_OUNCE;
        } else {
          throw new Error("Truncgil ons/gram fiyatı yok veya geçersiz");
        }
      }
      if (!isFinite(tlPerOns) || tlPerOns <= 0) throw new Error("Truncgil ons fiyatı geçersiz");
      if (to === 'TRY') {
        return {
          ounce: tlPerOns,
          gram: tlPerOns / GRAMS_PER_TROY_OUNCE,
          date: today?.updated || new Date().toISOString().split('T')[0],
          currency: to,
        };
      }
      const fx = await fetchFx('TRY', to, tlPerOns);
      const ounce = fx.result; // 1 ons TL -> hedef para birimi
      return {
        ounce,
        gram: ounce / GRAMS_PER_TROY_OUNCE,
        date: fx.date,
        currency: to,
      };
    } catch (fallbackErr) {
      console.error("XAU fallback failed:", fallbackErr);
      // Son çare: yaklaşık değer dön
      return {
        ounce: NaN,
        gram: NaN,
        date: new Date().toISOString().split('T')[0],
        currency: to,
      };
    }
  }
}