// Uyarılar Sekmesi - Kur ve altın fiyat uyarıları
import { useEffect, useState } from 'react';
import {
    Alert,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
let AsyncStorage: any = null;
try {
  // attempt to require - if package not installed this will stay null and we use in-memory fallback
  // eslint-disable-next-line global-require
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  console.warn('AsyncStorage not available, using in-memory fallback for alerts persistence. Install @react-native-async-storage/async-storage for persistent storage.');
}

// minimal in-memory fallback
const memoryStore: { [k: string]: string } = {};
const AsyncStorageFallback = {
  async getItem(key: string) {
    return memoryStore[key] ?? null;
  },
  async setItem(key: string, value: string) {
    memoryStore[key] = value;
  }
};

import { Card } from '../../src/components/Card';
import { AppHeader } from '../../src/components/Header';
import { publish as publishAlertCount } from '../../src/lib/alertBus';
import { fetchFx, fetchGoldToday } from '../../src/lib/api';
import { parseTr } from '../../src/lib/format';
import { useTheme } from '../../src/theme';

// Uyarı tipi
type AlertType = {
  id: string;
  type: 'currency' | 'gold';
  pair: string;
  targetValue: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: Date;
};

export default function AlertsScreen() {
  const theme = useTheme();
  const [toast, setToast] = useState<{title: string; message: string} | null>(null);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [newAlert, setNewAlert] = useState({
    pair: 'USD/TRY',
    targetValue: '',
    condition: 'below' as 'above' | 'below'
  });
  
  // Güncel fiyatlar
  const [currentPrices, setCurrentPrices] = useState<{[key: string]: number}>({});
  const [goldPrices, setGoldPrices] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Güncel fiyatları çek
  const fetchCurrentPrices = async () => {
    setLoading(true);
    try {
      // Döviz kurları
      const usdTry = await fetchFx('USD', 'TRY', 1);
      const eurTry = await fetchFx('EUR', 'TRY', 1);
      const rubTry = await fetchFx('RUB', 'TRY', 1);
      
      setCurrentPrices({
        'USD/TRY': usdTry.result,
        'EUR/TRY': eurTry.result, 
        'RUB/TRY': rubTry.result
      });

      // Altın fiyatları
      const gold = await fetchGoldToday();
      setGoldPrices(gold);
      
    } catch (error) {
      console.log('Fiyat çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde fiyatları çek
  useEffect(() => {
    fetchCurrentPrices();
    // load persisted alerts
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@kurmatik_alerts');
        if (raw) {
          const parsed = JSON.parse(raw);
          // revive dates
          const revived: AlertType[] = parsed.map((a: any) => ({ ...a, createdAt: new Date(a.createdAt) }));
          setAlerts(revived);
          try { publishAlertCount(revived.length); } catch {}
        }
      } catch (e) { console.warn('Failed to load alerts', e); }
    })();
  }, []);

  // persist alerts whenever they change
  useEffect(() => {
    (async () => {
      try {
        const store = AsyncStorage || AsyncStorageFallback;
        await store.setItem('@kurmatik_alerts', JSON.stringify(alerts));
      } catch (e) { console.warn('Failed to save alerts', e); }
    })();
  }, [alerts]);

  // Güncel fiyat gösterme fonksiyonu
  const getCurrentPrice = (pair: string) => {
    if (pair.includes('GOLD')) {
      if (!goldPrices) return null;
      const goldType = pair.replace('GOLD_', '').toLowerCase();
      const priceData = goldPrices[goldType]?.Satış;
      return priceData ? parseTr(priceData) : null;
    }
    return currentPrices[pair] || null;
  };

  // Yeni uyarı ekleme
  const addAlert = () => {
    if (!newAlert.targetValue) {
      // keep blocking native alert for error (user must enter value)
      Alert.alert('Hata', 'Lütfen hedef değer girin');
      return;
    }

    const alert: AlertType = {
      id: Date.now().toString(),
      type: newAlert.pair.includes('GOLD') ? 'gold' : 'currency',
      pair: newAlert.pair,
      targetValue: parseFloat(newAlert.targetValue),
      condition: newAlert.condition,
      isActive: true,
      createdAt: new Date()
    };

    setAlerts(prev => {
      const next = [alert, ...prev];
      try { publishAlertCount(next.length); } catch {}
      return next;
    });
    setNewAlert({ pair: 'USD/TRY', targetValue: '', condition: 'below' });
    // show lightweight in-app toast instead of native alert
    setToast({ title: 'Başarılı', message: 'Uyarı eklendi!' });
    setTimeout(() => setToast(null), 2000);
  };

  // Para birimi seçildiğinde güncel değeri input'a yaz
  const selectPairWithCurrentPrice = (pair: string) => {
    setNewAlert(prev => ({ ...prev, pair }));
    
    const currentPrice = getCurrentPrice(pair);
    if (currentPrice) {
      // Güncel fiyatı input'a yaz (kullanıcı editleyebilsin)
      setNewAlert(prev => ({ 
        ...prev, 
        pair,
        targetValue: currentPrice.toFixed(2)
      }));
    }
  };

  // Uyarı silme
  const deleteAlert = (id: string) => {
    Alert.alert(
      'Uyarı Sil',
      'Bu uyarıyı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: () => {
            setAlerts(prev => {
              const next = prev.filter(a => a.id !== id);
              try { publishAlertCount(next.length); } catch {}
              return next;
            });
            setToast({ title: 'Silindi', message: 'Uyarı silindi.' });
            setTimeout(() => setToast(null), 1600);
          }
        }
      ]
    );
  };

  // Popüler currency pairs - Kategorilere ayrıldı
  const currencyPairs = ['USD/TRY', 'EUR/TRY', 'RUB/TRY'];
  const goldTypes = ['GOLD_GRAM', 'GOLD_CEYREK', 'GOLD_ONS'];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader 
        title="Uyarılar" 
        subtitle="Kur ve Altın Fiyat Takibi"
      />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.scrollView}>
        {/* Yeni Uyarı Ekleme */}
        <Card style={styles.addAlertCard}>
          <View style={styles.cardTitleRow}>
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
              🔔 Yeni Uyarı Ekle
            </Text>
            <TouchableOpacity
              onPress={fetchCurrentPrices}
              style={[styles.refreshButton, { backgroundColor: theme.colors.surface }]}
              disabled={loading}
            >
              <Text style={[styles.refreshText, { color: theme.colors.primary }]}>
                {loading ? '⏳' : '🔄'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Döviz Kurları */}
          <Text style={[styles.categoryTitle, { color: theme.colors.textPrimary }]}>
            💱 Döviz Kurları
          </Text>
          <View style={styles.categorizedRow}>
            {currencyPairs.map((pair) => (
              <TouchableOpacity
                key={pair}
                onPress={() => selectPairWithCurrentPrice(pair)}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: newAlert.pair === pair ? theme.colors.primary : theme.colors.surface,
                    borderColor: newAlert.pair === pair ? theme.colors.primary : theme.colors.border
                  }
                ]}
              >
                <Text style={[
                  styles.categoryButtonText,
                  {
                    color: newAlert.pair === pair ? '#FFFFFF' : theme.colors.textPrimary,
                    fontWeight: newAlert.pair === pair ? '600' : '500'
                  }
                ]}>
                  {pair}
                </Text>
                {/* Güncel fiyat mini gösterimi */}
                {getCurrentPrice(pair) && (
                  <Text style={[
                    styles.miniPrice,
                    {
                      color: newAlert.pair === pair ? 'rgba(255,255,255,0.8)' : theme.colors.textTertiary
                    }
                  ]}>
                    {getCurrentPrice(pair)?.toFixed(2)}₺
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Altın Türleri */}
          <Text style={[styles.categoryTitle, { color: theme.colors.textPrimary }]}>
            🥇 Altın Fiyatları
          </Text>
          <View style={styles.categorizedRow}>
            {goldTypes.map((goldType) => (
              <TouchableOpacity
                key={goldType}
                onPress={() => selectPairWithCurrentPrice(goldType)}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: newAlert.pair === goldType ? theme.colors.gold : theme.colors.surface,
                    borderColor: newAlert.pair === goldType ? theme.colors.gold : theme.colors.border
                  }
                ]}
              >
                <Text style={[
                  styles.categoryButtonText,
                  {
                    color: newAlert.pair === goldType ? '#000000' : theme.colors.textPrimary,
                    fontWeight: newAlert.pair === goldType ? '600' : '500'
                  }
                ]}>
                  {goldType.replace('GOLD_', '').replace('_', ' ')}
                </Text>
                {/* Güncel fiyat mini gösterimi */}
                {getCurrentPrice(goldType) && (
                  <Text style={[
                    styles.miniPrice,
                    {
                      color: newAlert.pair === goldType ? 'rgba(0,0,0,0.7)' : theme.colors.textTertiary
                    }
                  ]}>
                    {getCurrentPrice(goldType)?.toFixed(0)}₺
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>          {/* Hedef Değer */}
          <View style={styles.targetValueSection}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Hedef Değer
            </Text>
            
            {/* Güncel fiyat gösterimi */}
            {getCurrentPrice(newAlert.pair) && (
              <View style={styles.currentPriceContainer}>
                <Text style={[styles.currentPriceLabel, { color: theme.colors.textTertiary }]}>
                  Güncel:
                </Text>
                <Text style={[styles.currentPrice, { color: theme.colors.success }]}>
                  {getCurrentPrice(newAlert.pair)?.toFixed(2)}
                  {newAlert.pair.includes('GOLD') ? ' ₺' : ' ₺'}
                </Text>
              </View>
            )}
          </View>
          
          <TextInput
            value={newAlert.targetValue}
            onChangeText={(text) => setNewAlert(prev => ({ ...prev, targetValue: text }))}
            placeholder={newAlert.pair === 'USD/TRY' ? '40.50' : '3000'}
            keyboardType="decimal-pad"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            style={[
              styles.input,
              {
                color: theme.colors.textPrimary,
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }
            ]}
          />

          {/* Koşul */}
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Uyarı Koşulu
          </Text>
          <View style={styles.conditionRow}>
            {(['below', 'above'] as const).map((condition) => (
              <TouchableOpacity
                key={condition}
                onPress={() => setNewAlert(prev => ({ ...prev, condition }))}
                style={[
                  styles.conditionButton,
                  {
                    backgroundColor: newAlert.condition === condition ? theme.colors.success : theme.colors.surface,
                    borderColor: theme.colors.border
                  }
                ]}
              >
                <Text style={[
                  styles.conditionText,
                  { 
                    color: newAlert.condition === condition ? '#FFFFFF' : theme.colors.textPrimary,
                    fontWeight: newAlert.condition === condition ? '600' : '400'
                  }
                ]}>
                  {condition === 'below' ? '📉 Altına Düşünce' : '📈 Üstüne Çıkınca'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Ekle Butonu */}
          <TouchableOpacity
            onPress={addAlert}
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.addButtonText}>
              🔔 Uyarı Ekle
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Aktif Uyarılar */}
        <View style={styles.alertsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Aktif Uyarılar ({alerts.length})
          </Text>
          
          {alerts.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                🔕 Henüz uyarı bulunmuyor.{'\n'}Yukarıdan yeni uyarı ekleyebilirsiniz.
              </Text>
            </Card>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id} style={styles.alertCard}>
                <View style={styles.alertCardRow}>
                  {/* Left colored accent */}
                  <View style={[styles.leftAccent, { backgroundColor: alert.type === 'gold' ? theme.colors.gold : theme.colors.primary }]} />

                  <View style={styles.alertContent}>
                    <View style={styles.alertTopRow}>
                      <Text style={[styles.alertPair, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                        {alert.type === 'gold' ? '🥇' : '�'} {alert.pair.replace('_', ' ')}
                      </Text>

                      <TouchableOpacity
                        onPress={() => deleteAlert(alert.id)}
                        style={[styles.deleteIcon, { backgroundColor: theme.colors.danger }]}
                      >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.alertBottomRow}>
                      <Text style={[styles.alertCondition, { color: theme.colors.textSecondary }]}>
                        {alert.condition === 'below' ? '📉' : '📈'} {alert.condition === 'below' ? 'altına düşünce' : 'üstüne çıkınca'}
                      </Text>

                      <Text style={[styles.alertPrice, { color: theme.colors.success }]}> {alert.targetValue}{' '}
                        {alert.pair.includes('GOLD') ? '₺' : '₺'}
                      </Text>
                    </View>

                    <Text style={[styles.alertDate, { color: theme.colors.textTertiary }]}>📅 {alert.createdAt.toLocaleDateString('tr-TR')} {alert.createdAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Alt boşluk */}
        <View style={{ height: 20 }} />
        {/* In-app toast */}
        {toast && (
          <View style={[styles.toastContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
            <Text style={[styles.toastTitle, { color: theme.colors.textPrimary }]}>{toast.title}</Text>
            <Text style={[styles.toastMessage, { color: theme.colors.textSecondary }]}>{toast.message}</Text>
          </View>
        )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  
  // Yeni uyarı ekleme kartı
  addAlertCard: {
    padding: 12,
    marginBottom: 8,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  refreshText: {
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 6,
  },
  
  // Hedef değer ve güncel fiyat
  targetValueSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 6,
  },
  currentPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currentPriceLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Courier New',
  },
  
  // Popüler çiftler
  popularPairsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  popularPairButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  popularPairText: {
    fontSize: 11,
    fontWeight: '500',
  },
  
  // Input ve butonlar
  input: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  conditionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  conditionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  
  // Uyarılar listesi
  alertsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Uyarı kartları
  alertCard: {
    padding: 8,
    marginBottom: 6,
    marginVertical: 4,
    marginHorizontal: 0,
    borderRadius: 12,
  },
  alertCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftAccent: {
    width: 3,
    borderRadius: 3,
    marginRight: 6,
    height: '100%',
    alignSelf: 'stretch'
  },
  alertContent: {
    flex: 1,
  },
  alertTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  alertBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  alertPrice: {
    fontSize: 12,
    fontWeight: '700',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertInfo: {
    flex: 1,
  },
  alertPair: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  alertCondition: {
    fontSize: 12,
    fontWeight: '500',
  },
  alertDate: {
    fontSize: 10,
    marginTop: 6,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  
  // Kategorize edilmiş seçenekler
  categoryTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  categorizedRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 4,
  },
  categoryButton: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
  },
  categoryButtonText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  miniPrice: {
    fontSize: 8,
    fontWeight: '500',
    marginTop: 1,
    opacity: 0.8,
  },
  // In-app toast
  toastContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  toastMessage: {
    fontSize: 12,
  },
});
