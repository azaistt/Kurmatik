import { useEffect, useMemo, useState, ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fetchFx, fetchGoldToday, fetchGoldXau } from '@/src/lib/api';
import BannerHorizontal from '@/components/BannerHorizontal';
import TradingViewTicker from '@/components/TradingViewTicker';
import TradingViewTickerAlt from '@/components/TradingViewTickerAlt';
import AIChat from '@/components/AIChat';

// Modern tek sayfalık finans paneli
export default function FinanceDashboard({ stepsHeader }: { stepsHeader?: ReactNode }) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => createPalette(colorScheme === 'dark'), [colorScheme]);
  const router = useRouter();

  // Kurmatik kur çevirici state
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('TRY');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Market snapshot state
  const [snapshot, setSnapshot] = useState({
    usdTry: '—',
    eurTry: '—',
    gramAltin: '—',
    btcUsd: '—',
  });

  // Multi-converter state
  const [multiConverterInput, setMultiConverterInput] = useState('');
  const [multiConverterUnit, setMultiConverterUnit] = useState('TRY');
  const [multiConverterResults, setMultiConverterResults] = useState<MultiConverterResult[]>([]);

  // Currencies for converter
  const currencies = [
    { label: 'USD - Dolar', value: 'USD' },
    { label: 'EUR - Euro', value: 'EUR' },
    { label: 'TRY - Türk Lirası', value: 'TRY' },
    { label: 'GBP - İngiliz Sterlini', value: 'GBP' },
    { label: 'GRAM - Gram Altın', value: 'GOLD_GRAM' },
  ];

  // Real-time data fetch
  useEffect(() => {
    let cancelled = false;

    async function fetchRealTimeData() {
      try {
        const [usd, eur, gold] = await Promise.all([
          fetchFx('USD', 'TRY', 1),
          fetchFx('EUR', 'TRY', 1),
          fetchGoldToday(),
        ]);

        if (cancelled) return;

        const format = (input: any, fraction = 2) => {
          if (input == null) return '—';
          const value = typeof input === 'number' ? input : Number(String(input).replace(',', '.'));
          if (!Number.isFinite(value)) return '—';
          return new Intl.NumberFormat('tr-TR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: fraction,
          }).format(value);
        };

        setSnapshot({
          usdTry: format(usd?.result ?? usd?.rate),
          eurTry: format(eur?.result ?? eur?.rate),
          gramAltin: gold?.gram?.Satış ?? '—',
          btcUsd: '98,750', // Mock BTC price
        });
      } catch (error) {
        console.warn('Real-time data fetch failed', error);
      }
    }

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 60000); // Her dakika güncelle

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Currency conversion
  const handleConvert = async () => {
    if (!amount.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const amt = Number(amount);
      if (!amt) throw new Error('Geçerli bir tutar girin');
      
      const fx = await fetchFx(fromCurrency, toCurrency, amt);
      setResult(fx.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Refine type definitions
  interface MultiConverterResult {
    label: string;
    value: string | number;
  }

  // Fix type definitions for API responses
  interface FxResponse {
    result: number;
    rate: number;
  }

  interface GoldResponse {
    gram: {
      Satış: string;
      Alış: string;
    };
  }
  
  interface GoldXauResponse {
    ounce: number;
    gram: number;
    date?: string;
  }

  // Multi-converter calculation
  const handleMultiConvert = async () => {
    if (!multiConverterInput.trim()) return;

    try {
      const amount = Number(multiConverterInput);
      if (!amount) throw new Error('Geçerli bir tutar girin');

      const [usd, eur, gbp, goldGram, goldXau] = await Promise.all([
        fetchFx('TRY', 'USD', amount),
        fetchFx('TRY', 'EUR', amount),
        fetchFx('TRY', 'GBP', amount),
        fetchGoldToday(),
        fetchGoldXau('TRY'),
      ]);

      setMultiConverterResults([
        { label: 'USD', value: usd?.result ?? '—' },
        { label: 'EUR', value: eur?.result ?? '—' },
        { label: 'GBP', value: gbp?.result ?? '—' },
        { label: 'Gram Altın', value: goldGram?.gram?.Satış ?? '—' },
        { label: 'Ons Altın', value: goldXau?.ounce ?? '—' },
      ]);
    } catch (error) {
      console.error('Multi-converter error:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.page }]}> 
      {/* TradingView Ticker - Header'ın hemen altında */}
      <TradingViewTicker />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg }]}> 
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'flex-start' }}>
          <View style={styles.headerLogo}> 
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.logoImage}
            />
            <View style={styles.headerText}> 
              <Text style={[styles.headerTitle, { color: theme.primaryText }]}> 
                Kurmatik Finance
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}> 
                Döviz Çevirici & Finansal AI Asistanı
              </Text>
            </View>
          </View>
          {/* stepsHeader prop'u logonun ve sloganın sağında, ortada göster */}
          {stepsHeader && (
            <View style={{ marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {stepsHeader}
            </View>
          )}
        </View>
      </View>

      {/* Market Ticker */}
      <View style={[styles.ticker, { backgroundColor: theme.tickerBg }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tickerContent}>
            <View style={styles.tickerItem}>
              <Text style={[styles.tickerLabel, { color: theme.mutedText }]}>USD/TRY</Text>
              <Text style={[styles.tickerValue, { color: theme.accent }]}>{snapshot.usdTry}</Text>
            </View>
            <View style={styles.tickerItem}>
              <Text style={[styles.tickerLabel, { color: theme.mutedText }]}>EUR/TRY</Text>
              <Text style={[styles.tickerValue, { color: theme.accent }]}>{snapshot.eurTry}</Text>
            </View>
            <View style={styles.tickerItem}>
              <Text style={[styles.tickerLabel, { color: theme.mutedText }]}>Gram Altın</Text>
              <Text style={[styles.tickerValue, { color: theme.gold }]}>{snapshot.gramAltin}₺</Text>
            </View>
            <View style={styles.tickerItem}>
              <Text style={[styles.tickerLabel, { color: theme.mutedText }]}>BTC/USD</Text>
              <Text style={[styles.tickerValue, { color: theme.crypto }]}>{snapshot.btcUsd}$</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Main Content - Desktop: Side by Side, Mobile: Stacked */}
      <View style={styles.mainContent}>
        
        {/* Sol Panel: Kurmatik Döviz Çevirici */}
        <View style={[styles.leftPanel, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={styles.panelHeader}>
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.panelLogo}
            />
            <Text style={[styles.panelTitle, { color: theme.primaryText }]}>
              💱 Döviz Çevirici
            </Text>
          </View>
          
          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Miktar</Text>
            <TextInput
              style={[styles.amountInput, { 
                color: theme.primaryText, 
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder 
              }]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="1.00"
              placeholderTextColor={theme.mutedText}
            />
          </View>

          {/* Currency Selectors */}
          <View style={styles.currencySelectors}>
            <View style={styles.currencyGroup}>
              <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Kaynak</Text>
              <Pressable style={[styles.currencyButton, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                <Text style={[styles.currencyButtonText, { color: theme.primaryText }]}>
                  {currencies.find(c => c.value === fromCurrency)?.label.split(' - ')[0] || fromCurrency}
                </Text>
              </Pressable>
            </View>
            
            <Pressable onPress={handleSwap} style={[styles.swapButton, { backgroundColor: theme.accent }]}>
              <Text style={styles.swapIcon}>⇄</Text>
            </Pressable>
            
            <View style={styles.currencyGroup}>
              <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Hedef</Text>
              <Pressable style={[styles.currencyButton, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                <Text style={[styles.currencyButtonText, { color: theme.primaryText }]}>
                  {currencies.find(c => c.value === toCurrency)?.label.split(' - ')[0] || toCurrency}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Convert Button */}
          <Pressable 
            onPress={handleConvert} 
            disabled={loading}
            style={[styles.convertButton, { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.convertButtonText, { color: '#fff' }]}>
              {loading ? 'Hesaplanıyor...' : 'Çevir'}
            </Text>
          </Pressable>

          {/* Result */}
          <View style={[styles.resultCard, { backgroundColor: theme.resultBg, borderColor: theme.resultBorder }]}>
            <Text style={[styles.resultLabel, { color: theme.secondaryText }]}>Sonuç</Text>
            <Text style={[styles.resultValue, { color: theme.accent }]}>
              {result ? `${Number(result).toFixed(4)}` : '—'}
            </Text>
            {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}
          </View>
        </View>

        {/* Sağ Panel: StockBot AI Chat + Widgets */}
        <View style={[styles.rightPanel, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <Text style={[styles.panelTitle, { color: theme.primaryText }]}
          >
            🤖 Finansal AI Asistanı
          </Text>
          
          {/* Chat Messages Area */}
          <AIChat />

          {/* TradingView Widget Placeholder */}
          <View style={[styles.widgetContainer, { backgroundColor: theme.widgetBg, borderColor: theme.cardBorder }]}>
            <Text style={[styles.widgetTitle, { color: theme.primaryText }]}>📈 Canlı Piyasa Görünümü</Text>
            <View style={[styles.widgetPlaceholder, { backgroundColor: theme.widgetPlaceholder }]}>
              <Text style={[styles.widgetPlaceholderText, { color: theme.mutedText }]}>
                TradingView Widget{'\n'}
                Stock Charts & Market Data
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      {/* Alt TradingView ticker - sabit bannerın üstünde, static */}
      <TradingViewTickerAlt />
      <View style={[styles.footer, { backgroundColor: theme.footerBg }]}> 
        <View style={styles.footerContent}> 
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.footerLogo}
          />
          <Text style={[styles.footerText, { color: theme.mutedText }]}> 
            © 2024 Kurmatik Finance • Powered by StockBot AI • TradingView Widgets
          </Text>
        </View>
      </View>

      {Platform.OS === 'web' && <BannerHorizontal />}
    </ScrollView>
  );
}

function createPalette(isDark: boolean) {
  return {
    page: isDark ? '#0a0a0f' : '#f8fafc',
    primaryText: isDark ? '#ffffff' : '#1a202c',
    secondaryText: isDark ? '#a0aec0' : '#4a5568',
    mutedText: isDark ? '#718096' : '#718096',
    
    headerBg: isDark ? '#1a202c' : '#ffffff',
    tickerBg: isDark ? '#2d3748' : '#edf2f7',
    cardBg: isDark ? '#2d3748' : '#ffffff',
    cardBorder: isDark ? '#4a5568' : '#e2e8f0',
    
    inputBg: isDark ? '#4a5568' : '#f7fafc',
    inputBorder: isDark ? '#718096' : '#e2e8f0',
    
    chatBg: isDark ? '#1a202c' : '#f7fafc',
    resultBg: isDark ? '#2a69ac20' : '#2b6cb015',
    resultBorder: isDark ? '#2a69ac' : '#2b6cb0',
    
    quickBg: isDark ? '#4a556820' : '#ffffff',
    quickBorder: isDark ? '#4a5568' : '#e2e8f0',
    
    widgetBg: isDark ? '#1a202c' : '#ffffff',
    widgetPlaceholder: isDark ? '#4a5568' : '#edf2f7',
    
    footerBg: isDark ? '#1a202c' : '#2d3748',
    
    accent: '#3182ce',
    gold: '#d69e2e',
    crypto: '#f56500',
    error: '#e53e3e',
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  headerText: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  ticker: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tickerContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tickerItem: {
    alignItems: 'center',
    marginRight: 32,
    minWidth: 80,
  },
  tickerLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  tickerValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainContent: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    padding: 20,
    gap: 20,
    ...(Platform.OS === 'web' ? { paddingLeft: 140, paddingRight: 140 } : {}),
  },
  leftPanel: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  rightPanel: {
    flex: Platform.OS === 'web' ? 1.2 : undefined,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  panelLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  amountInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  currencySelectors: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  currencyGroup: {
    flex: 1,
  },
  currencyButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  currencyButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  swapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  swapIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  convertButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  convertButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  chatArea: {
    height: 300,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  widgetContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  widgetTitle: {
    padding: 16,
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  widgetPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  widgetPlaceholderText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerLogo: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
  multiConverter: {
    marginTop: 32,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  resultGrid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});