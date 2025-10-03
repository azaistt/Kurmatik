// src/screens/HomeScreen.js
import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AdEventType, BannerAd, BannerAdSize, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import CurrencyPicker from '../components/CurrencyPicker';
import { fetchFx, fetchGoldToday, fetchGoldXau } from '../lib/api';
import { num, parseTr } from '../lib/format';

const BANNER_ID = TestIds.BANNER; // Test banner during development
// Interstitial: use test id during development
const INTERSTITIAL_ID = TestIds.INTERSTITIAL;
const SHOW_AFTER = 5; // show interstitial after this many successful conversions

const CURRENCIES = [
  { label: 'Türk Lirası (TRY)', value: 'TRY' },
  { label: 'Amerikan Doları (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'Gram Altın', value: 'GOLD_GRAM' },
  { label: 'Çeyrek Altın', value: 'GOLD_CEYREK' },
  { label: 'Yarım Altın', value: 'GOLD_YARIM' },
  { label: 'Tam Altın', value: 'GOLD_TAM' },
  { label: 'Cumhuriyet Altını', value: 'GOLD_CUMH' },
  { label: 'Ons Altın', value: 'GOLD_ONS' },
];

export default function HomeScreen() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('TRY');
  const [result, setResult] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [gold, setGold] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [xauPrice, setXauPrice] = useState(null); // { ounce, gram, date, currency }
  const [xauLoading, setXauLoading] = useState(false);
  const [opCount, setOpCount] = useState(0);
  const interstitialRef = useRef(InterstitialAd.createForAdRequest(INTERSTITIAL_ID));
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  // Altın verisini ilk açılışta çek (TRuncgil)
  useEffect(() => {
    (async () => {
      try {
        const g = await fetchGoldToday();
        setGold(g);
        setUpdatedAt(g?.updated ?? null);
      } catch {
        // sessizce geç
      }
    })();
  }, []);

  // Seçilen hedef para birimine göre XAU fiyatını çek
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setXauLoading(true);
        const x = await fetchGoldXau(to === 'GOLD_GRAM' || to === 'GOLD_ONS' ? 'TRY' : to);
        if (!cancelled) setXauPrice(x);
      } catch {
        if (!cancelled) setXauPrice(null);
      } finally {
        if (!cancelled) setXauLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [to]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const goldToTryPrice = useMemo(() => {
    if (!gold) return null;

    return {
      GOLD_GRAM: gold?.gram?.Satış ? parseTr(gold.gram.Satış) : null,
      GOLD_CEYREK: gold?.ceyrek?.Satış ? parseTr(gold.ceyrek.Satış) : null,
      GOLD_YARIM: gold?.yarim?.Satış ? parseTr(gold.yarim.Satış) : null,
      GOLD_TAM: gold?.tam?.Satış ? parseTr(gold.tam.Satış) : null,
      GOLD_CUMH: gold?.cumhuriyet?.Satış ? parseTr(gold.cumhuriyet.Satış) : null,
      GOLD_ONS: gold?.ons?.Satış ? parseTr(gold.ons.Satış) : null,
    };
  }, [gold]);

  async function convert() {
    setLoading(true);
    setError(null);
    try {
      const amt = Number(amount) || 0;
      if (!amt) throw new Error('Lütfen tutar girin');

      // Altın ↔ TRY dönüşümü
      const goldMap = goldToTryPrice || {};
      const isGold = (code) => String(code).startsWith('GOLD_');

      let value = null;

      if (from === 'TRY' && isGold(to)) {
        const tlPerGold = goldMap[to];
        if (!tlPerGold) throw new Error('Altın fiyatı bulunamadı');
        value = amt / tlPerGold; // TRY -> Altın birimi
      } else if (isGold(from) && to === 'TRY') {
        const tlPerGold = goldMap[from];
        if (!tlPerGold) throw new Error('Altın fiyatı bulunamadı');
        value = amt * tlPerGold; // Altın -> TRY
      } else if (isGold(from) && isGold(to)) {
        const fromTl = goldMap[from];
        const toTl = goldMap[to];
        if (!fromTl || !toTl) throw new Error('Altın fiyatı bulunamadı');
        value = amt * (fromTl / toTl); // Altın A -> Altın B
      } else if (!isGold(from) && !isGold(to)) {
        // Döviz ↔ Döviz (USD/EUR/TRY)
        const fx = await fetchFx(from, to, amt);
        value = fx.result;
        setUpdatedAt(fx.date);
      } else {
        // Altın ↔ Döviz (örn. Altın -> USD)
        const tlMap = goldMap;
        const fromIsGold = isGold(from);
        const goldCode = fromIsGold ? from : to;
        const tlPerGold = tlMap[goldCode];
        if (!tlPerGold) throw new Error('Altın fiyatı bulunamadı');

        if (fromIsGold) {
          // Altın -> Döviz
          const tlValue = amt * tlPerGold; // önce TL
          const fx = await fetchFx('TRY', to, tlValue);
          value = fx.result;
          setUpdatedAt(fx.date);
        } else {
          // Döviz -> Altın
          const fx = await fetchFx(from, 'TRY', amt);
          const tlValue = fx.result;
          value = tlValue / tlPerGold;
          setUpdatedAt(fx.date);
        }
      }

      setResult(value);
      // successful conversion -> increase op counter and maybe show interstitial
      setOpCount((c) => {
        const next = c + 1;
        if (next >= SHOW_AFTER) {
          // show if loaded
          if (interstitialRef.current && interstitialLoaded) {
            interstitialRef.current.show();
            setInterstitialLoaded(false);
          }
          return 0; // reset counter after showing
        }
        return next;
      });
    } catch (e) {
      setError(e.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  // Interstitial ad setup
  useEffect(() => {
    const interstitial = interstitialRef.current;
    const listeners = [];
    if (interstitial) {
      listeners.push(interstitial.addAdEventListener(AdEventType.LOADED, () => setInterstitialLoaded(true)));
      listeners.push(interstitial.addAdEventListener(AdEventType.ERROR, () => setInterstitialLoaded(false)));
      // when closed, load next
      listeners.push(interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        setInterstitialLoaded(false);
        interstitial.load();
      }));
      // initial load
      interstitial.load();
    }
    return () => {
      listeners.forEach((unsub) => unsub());
    };
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Kurmatik</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Tutar</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="1"
            style={styles.input}
          />

          <View style={styles.pickerContainer}>
            <CurrencyPicker
              label="Dönüştürülecek (From)"
              value={from}
              onChange={setFrom}
              options={CURRENCIES}
            />
          </View>

          <View style={styles.swapContainer}>
            <TouchableOpacity onPress={handleSwap} style={styles.swapButton}>
              <Text style={styles.swapText}>⇅</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <CurrencyPicker
              label="Hedef (To)"
              value={to}
              onChange={setTo}
              options={CURRENCIES}
            />
          </View>

          <TouchableOpacity onPress={convert} style={styles.convertButton} disabled={loading}>
            <Text style={styles.convertButtonText}>
              {loading ? 'Hesaplanıyor...' : 'Çevir'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Sonuç</Text>
          <Text style={styles.resultValue}>
            {result != null ? num(result, 4) : '-'}
          </Text>
          {!!updatedAt && (
            <Text style={styles.updatedText}>
              Son güncelleme: {updatedAt}
            </Text>
          )}
          {!!error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {/* XAU canlı fiyatı (bilgi amaçlı) */}
          <View style={styles.xauBox}>
            <Text style={styles.resultLabel}>Altın (XAU) Bilgi</Text>
            {xauLoading ? (
              <Text style={styles.xauText}>Yükleniyor...</Text>
            ) : xauPrice && isFinite(xauPrice.ounce) ? (
              <>
                <Text style={styles.xauText}>
                  1 ons ≈ {num(xauPrice.ounce, 2)} {xauPrice.currency}
                </Text>
                <Text style={styles.xauText}>
                  1 gram ≈ {num(xauPrice.gram, 4)} {xauPrice.currency}
                </Text>
                {!!xauPrice.date && (
                  <Text style={styles.updatedText}>XAU tarih: {xauPrice.date}</Text>
                )}
              </>
            ) : (
              <Text style={styles.xauText}>XAU fiyatı alınamadı.</Text>
            )}
          </View>
        </View>

        <View style={styles.adContainer}>
          <BannerAd unitId={BANNER_ID} size={BannerAdSize.BANNER} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1e293b',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 50,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  swapButton: {
    backgroundColor: '#3b82f6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  swapText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  convertButton: {
    backgroundColor: '#10b981',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  convertButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 20,
  },
  resultLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  updatedText: {
    marginTop: 8,
    fontSize: 12,
    color: '#6b7280',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
  },
  adContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: 12,
  },
  xauBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  xauText: {
    fontSize: 13,
    color: '#374151',
  },
});
