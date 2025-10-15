import { useEffect, useMemo, useState, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fetchFx, fetchGoldPrice } from '@/src/lib/api';
import BannerHorizontal from '@/components/BannerHorizontal';
import TradingViewTicker from '@/components/TradingViewTicker';
import TradingViewTickerAlt from '@/components/TradingViewTickerAlt';
import StockPriceWidget from '@/components/market-widgets/StockPriceWidget';
import StockChartWidget from '@/components/market-widgets/StockChartWidget';
import StockFinancialsWidget from '@/components/market-widgets/StockFinancialsWidget';

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

  // Chat messages state
  const [chatMessages, setChatMessages] = useState<Array<{id: string; role: 'user' | 'assistant'; content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Chat handler
  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const questionText = chatInput;
    setChatInput('');
    setChatLoading(true);

    try {
      // Call our Vercel serverless function instead of directly calling Groq
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: questionText,
          conversationId: 'main-chat'
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.response || 'Üzgünüm, yanıt alamadım.';
      
      setChatMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: aiContent 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: '❌ Bağlantı hatası. Lütfen tekrar deneyin.' 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Quick action handler
  const handleQuickAction = (question: string) => {
    setChatInput(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  // Multi-converter state
  const [multiConverterInput, setMultiConverterInput] = useState('');
  const [multiConverterUnit, setMultiConverterUnit] = useState('TRY');
  const [multiConverterResults, setMultiConverterResults] = useState<MultiConverterResult[]>([]);

  // Currencies for converter
  const currencies = [
    { label: '🇺🇸 USD - Amerikan Doları', value: 'USD' },
    { label: '🇪🇺 EUR - Euro', value: 'EUR' },
    { label: '🇹🇷 TRY - Türk Lirası', value: 'TRY' },
    { label: '🇬🇧 GBP - İngiliz Sterlini', value: 'GBP' },
    { label: '🇯🇵 JPY - Japon Yeni', value: 'JPY' },
    { label: '🇨🇭 CHF - İsviçre Frangı', value: 'CHF' },
    { label: '🇨🇦 CAD - Kanada Doları', value: 'CAD' },
    { label: '🇦🇺 AUD - Avustralya Doları', value: 'AUD' },
    { label: '🇨🇳 CNY - Çin Yuanı', value: 'CNY' },
    { label: '🇮🇳 INR - Hint Rupisi', value: 'INR' },
    { label: '🇷🇺 RUB - Rus Rublesi', value: 'RUB' },
    { label: '🇸🇦 SAR - Suudi Riyali', value: 'SAR' },
    { label: '🇦🇪 AED - BAE Dirhemi', value: 'AED' },
    { label: '🇰🇷 KRW - Güney Kore Wonu', value: 'KRW' },
    { label: '🇸🇪 SEK - İsveç Kronu', value: 'SEK' },
    { label: '🇳🇴 NOK - Norveç Kronu', value: 'NOK' },
    { label: '🇩🇰 DKK - Danimarka Kronu', value: 'DKK' },
    { label: '🇵🇱 PLN - Polonya Zlotisi', value: 'PLN' },
    { label: '🇲🇽 MXN - Meksika Pesosu', value: 'MXN' },
    { label: '🇧🇷 BRL - Brezilya Reali', value: 'BRL' },
    { label: '🇿🇦 ZAR - Güney Afrika Randı', value: 'ZAR' },
    { label: '🇸🇬 SGD - Singapur Doları', value: 'SGD' },
    { label: '🇭🇰 HKD - Hong Kong Doları', value: 'HKD' },
    { label: '🇳🇿 NZD - Yeni Zelanda Doları', value: 'NZD' },
    { label: '🇹🇭 THB - Tayland Bahtı', value: 'THB' },
    { label: '🇮🇩 IDR - Endonezya Rupisi', value: 'IDR' },
    { label: '🇲🇾 MYR - Malezya Ringgiti', value: 'MYR' },
    { label: '🇵🇭 PHP - Filipin Pesosu', value: 'PHP' },
    { label: '🇻🇳 VND - Vietnam Dongu', value: 'VND' },
    { label: '🇦🇷 ARS - Arjantin Pesosu', value: 'ARS' },
  ];

  // Real-time data fetch
  useEffect(() => {
    let cancelled = false;

    async function fetchRealTimeData() {
      try {
        console.log('📊 Fetching real-time market data...');
        const [usd, eur, gold] = await Promise.all([
          fetchFx('USD', 'TRY', 1),
          fetchFx('EUR', 'TRY', 1),
          fetchGoldPrice('TRY'),
        ]);

        console.log('📈 Market data received:', { usd, eur, gold });

        if (cancelled) return;

        const format = (input: any, fraction = 2) => {
          if (input == null) return '—';
          const value = typeof input === 'number' ? input : Number(String(input).replace(',', '.'));
          if (!Number.isFinite(value)) return '—';
          return new Intl.NumberFormat('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: fraction,
          }).format(value);
        };

        const snapshotData = {
          usdTry: format(usd?.rate ?? usd?.result ?? 0),
          eurTry: format(eur?.rate ?? eur?.result ?? 0),
          gramAltin: format(gold?.gram ?? 0),
          btcUsd: '98,750', // Mock BTC price - TODO: Add real BTC/USD fetch
        };

        console.log('✅ Snapshot updated:', snapshotData);
        setSnapshot(snapshotData);
      } catch (error) {
        console.error('❌ Real-time data fetch failed:', error);
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
      
      console.log('Converting:', { fromCurrency, toCurrency, amt });
      const fx = await fetchFx(fromCurrency, toCurrency, amt);
      console.log('Conversion result:', fx);
      setResult(fx.result);
    } catch (err) {
      console.error('Conversion error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu';
      setError(errorMessage);
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

      const [usd, eur, gbp, gold] = await Promise.all([
        fetchFx('TRY', 'USD', amount),
        fetchFx('TRY', 'EUR', amount),
        fetchFx('TRY', 'GBP', amount),
        fetchGoldPrice('TRY'),
      ]);

      // TRY cinsinden altın miktarını hesapla
      const goldInGrams = gold?.gram ? amount / gold.gram : 0;
      const goldInOunces = goldInGrams / 31.1035;

      setMultiConverterResults([
        { label: 'USD', value: usd?.result ?? '—' },
        { label: 'EUR', value: eur?.result ?? '—' },
        { label: 'GBP', value: gbp?.result ?? '—' },
        { label: 'Gram Altın', value: goldInGrams > 0 ? goldInGrams.toFixed(4) : '—' },
        { label: 'Ons Altın', value: goldInOunces > 0 ? goldInOunces.toFixed(6) : '—' },
      ]);
    } catch (error) {
      console.error('Multi-converter error:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', boxSizing: 'border-box', overflowY: 'auto', background: theme.page }}>
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
                <Text style={[styles.tickerLabel, { color: '#ffffff' }]}>USD/TRY</Text>
                <Text style={[styles.tickerValue, { color: theme.accent }]}>{snapshot.usdTry}</Text>
              </View>
              <View style={styles.tickerItem}>
                <Text style={[styles.tickerLabel, { color: '#ffffff' }]}>EUR/TRY</Text>
                <Text style={[styles.tickerValue, { color: theme.accent }]}>{snapshot.eurTry}</Text>
              </View>
              <View style={styles.tickerItem}>
                <Text style={[styles.tickerLabel, { color: '#ffffff' }]}>Gram Altın</Text>
                <Text style={[styles.tickerValue, { color: theme.gold }]}>{snapshot.gramAltin}₺</Text>
              </View>
              <View style={styles.tickerItem}>
                <Text style={[styles.tickerLabel, { color: '#ffffff' }]}>BTC/USD</Text>
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
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 14,
                    fontSize: 16,
                    borderRadius: 12,
                    border: `1px solid ${theme.inputBorder}`,
                    backgroundColor: theme.inputBg,
                    color: theme.primaryText,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {currencies.map((curr) => (
                    <option key={curr.value} value={curr.value}>
                      {curr.label}
                    </option>
                  ))}
                </select>
              </View>
              
              <Pressable onPress={handleSwap} style={[styles.swapButton, { backgroundColor: theme.accent }]}>
                <Text style={styles.swapIcon}>⇄</Text>
              </Pressable>
              
              <View style={styles.currencyGroup}>
                <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Hedef</Text>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 14,
                    fontSize: 16,
                    borderRadius: 12,
                    border: `1px solid ${theme.inputBorder}`,
                    backgroundColor: theme.inputBg,
                    color: theme.primaryText,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {currencies.map((curr) => (
                    <option key={curr.value} value={curr.value}>
                      {curr.label}
                    </option>
                  ))}
                </select>
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
              <Text style={[styles.resultLabel, { color: theme.secondaryText }]}>Çevrim Sonucu</Text>
              {result ? (
                <>
                  <Text style={[styles.conversionFormula, { color: theme.mutedText }]}>
                    {amount || '0'} {currencies.find(c => c.value === fromCurrency)?.label.split(' - ')[0] || fromCurrency} =
                  </Text>
                  <Text style={[styles.resultValue, { color: theme.accent }]}>
                    {Number(result).toFixed(4)} {currencies.find(c => c.value === toCurrency)?.label.split(' - ')[0] || toCurrency}
                  </Text>
                  <Text style={[styles.conversionExplanation, { color: theme.mutedText }]}>
                    {currencies.find(c => c.value === fromCurrency)?.label.split(' - ')[1] || fromCurrency} → {currencies.find(c => c.value === toCurrency)?.label.split(' - ')[1] || toCurrency}
                  </Text>
                </>
              ) : (
                <Text style={[styles.resultValue, { color: theme.mutedText }]}>—</Text>
              )}
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
            <View style={[styles.chatArea, { backgroundColor: theme.chatBg }]}>
              {chatMessages.length === 0 ? (
                <View style={styles.welcomeMessage}>
                  <Text style={[styles.welcomeTitle, { color: theme.primaryText }]}>
                    StockBot'a Hoş Geldin! 🚀
                  </Text>
                  <Text style={[styles.welcomeText, { color: theme.secondaryText }]}>
                    • Hisse senedi fiyatları sorgula{'\n'}
                    • Grafikleri görüntüle{'\n'}
                    • Piyasa analizlerini al{'\n'}
                    • Finansal haberleri takip et
                  </Text>
                  
                  {/* Quick Action Buttons */}
                  <View style={styles.quickActions}>
                    <Pressable 
                      style={[styles.quickButton, { backgroundColor: theme.quickBg, borderColor: theme.quickBorder }]}
                      onPress={() => handleQuickAction('Apple hisse senedi fiyatı nedir?')}
                    >
                      <Text style={[styles.quickButtonText, { color: theme.accent }]}>🍎 Apple fiyatı?</Text>
                    </Pressable>
                    <Pressable 
                      style={[styles.quickButton, { backgroundColor: theme.quickBg, borderColor: theme.quickBorder }]}
                      onPress={() => handleQuickAction('Tesla hisse senedi grafiği hakkında bilgi ver')}
                    >
                      <Text style={[styles.quickButtonText, { color: theme.accent }]}>⚡ Tesla grafiği</Text>
                    </Pressable>
                    <Pressable 
                      style={[styles.quickButton, { backgroundColor: theme.quickBg, borderColor: theme.quickBorder }]}
                      onPress={() => handleQuickAction('Bugünkü piyasa durumu nasıl?')}
                    >
                      <Text style={[styles.quickButtonText, { color: theme.accent }]}>📊 Piyasa durumu</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <ScrollView style={styles.messagesContainer} contentContainerStyle={{ paddingBottom: 8 }}>
                  {chatMessages.map(msg => (
                    <View key={msg.id} style={[
                      styles.chatMessage,
                      msg.role === 'user' ? styles.userChatMessage : styles.assistantChatMessage
                    ]}>
                      <Text style={styles.chatMessageText}>{msg.content}</Text>
                    </View>
                  ))}
                  {chatLoading && (
                    <View style={styles.loadingContainer}>
                      <Text style={{ color: theme.accent, fontSize: 14 }}>💭 Düşünüyor...</Text>
                    </View>
                  )}
                </ScrollView>
              )}
            </View>

            {/* Chat Input */}
            <View style={styles.chatInputContainer}>
              <TextInput
                style={[styles.chatInput, { 
                  color: theme.primaryText, 
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder 
                }]}
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Finansal sorularınızı sorun..."
                placeholderTextColor={theme.mutedText}
                multiline
              />
              <Pressable 
                style={[styles.sendButton, { backgroundColor: theme.accent, opacity: chatLoading ? 0.5 : 1 }]}
                onPress={handleSendMessage}
                disabled={chatLoading}
              >
                <Text style={styles.sendIcon}>→</Text>
              </Pressable>
            </View>

            {/* TradingView Widget Alanı: Kompakt ve Modern */}
            <View style={[styles.widgetContainer, { backgroundColor: theme.widgetBg, borderColor: theme.cardBorder, padding: 0 }]}> 
              <View style={{ width: '100%' }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, padding: 16, letterSpacing: 0.5 }}>📈 Canlı Piyasa Görünümü</Text>
                <View style={{ height: 1, backgroundColor: '#222', width: '100%' }} />
              </View>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 16, width: '100%', justifyContent: 'space-between', alignItems: 'stretch', background: 'none', padding: 16 }}>
                <div style={{ flex: 1, background: '#181c23', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', padding: 8, minWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 340 }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 8, letterSpacing: 0.2 }}>Hisse Fiyatı (AAPL)</div>
                  <StockPriceWidget symbol="AAPL" height={100} />
                </div>
                <div style={{ flex: 1.5, background: '#181c23', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', padding: 8, minWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 340 }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 8, letterSpacing: 0.2 }}>Hisse Grafik (AAPL)</div>
                  <StockChartWidget symbol="AAPL" height={220} />
                </div>
                <div style={{ flex: 1.2, background: '#181c23', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', padding: 8, minWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 340 }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 8, letterSpacing: 0.2 }}>Finansallar (AAPL)</div>
                  <StockFinancialsWidget symbol="AAPL" height={220} />
                </div>
              </div>
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

        <BannerHorizontal />
      </div>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    minHeight: 70,
  },
  tickerContent: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  tickerItem: {
    alignItems: 'center',
    marginRight: 32,
    minWidth: 120,
  },
  tickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  tickerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  mainContent: {
    flexDirection: 'row',
    padding: 20,
    gap: 20,
    paddingLeft: 140,
    paddingRight: 140,
  },
  leftPanel: {
    flex: 0.8,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: 420,
  },
  rightPanel: {
    flex: 1.6,
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
    marginBottom: 12,
  },
  conversionFormula: {
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'center',
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  conversionExplanation: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
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
  welcomeMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  quickButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  chatMessage: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userChatMessage: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  assistantChatMessage: {
    backgroundColor: '#1a202c',
    alignSelf: 'flex-start',
  },
  chatMessageText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    padding: 12,
    alignItems: 'center',
  },
  chatInputContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  chatInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
