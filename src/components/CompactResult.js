// src/components/CompactResult.js - Compact result display
import { StyleSheet, Text, View } from 'react-native';
import { num } from '../lib/format';
import { useTheme } from '../theme';
import { Card } from './Card';

export default function CompactResult({ 
  result, 
  fromAmount,
  fromCurrency,
  toCurrency, 
  error, 
  updatedAt,
  xauPrice,
  xauLoading,
  currencies 
}) {
  const theme = useTheme();
  
  // Get currency display names
  const getCurrencyName = (code) => {
    const currency = currencies.find(c => c.value === code);
    return currency ? currency.label.split('(')[0].trim() : code;
  };

  const getCurrencySymbol = (code) => {
    const symbolMap = {
      // Ana para birimleri
      'TRY': '₺',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      
      // Orta Doğu para birimleri
      'QAR': 'QR',
      'IRR': '﷼',
      'IQD': 'ع.د',
      
      // Diğer para birimleri
      'RUB': '₽',
      
      // Altın çeşitleri
      'GOLD_GRAM': 'gr',
      'GOLD_CEYREK': 'çeyrek',
      'GOLD_YARIM': 'yarım',
      'GOLD_TAM': 'tam',
      'GOLD_CUMH': 'cumh.',
      'GOLD_ONS': 'ons'
    };
    return symbolMap[code] || code;
  };

  if (error) {
    return (
      <Card style={[styles.resultCard, styles.errorCard]}>
        <Text style={[styles.errorIcon, { color: theme.colors.danger }]}>
          ⚠️
        </Text>
        <Text style={[styles.errorText, { color: theme.colors.danger }]}>
          {error}
        </Text>
      </Card>
    );
  }

  if (result === null) {
    return (
      <Card style={[styles.resultCard, { opacity: 0.6 }]}>
        <Text style={[styles.placeholderText, { color: theme.colors.textTertiary }]}>
          Çevirmek için yukarıdaki butona basın
        </Text>
      </Card>
    );
  }

  return (
    <Card style={styles.resultCard}>
      {/* Kompakt tek satır sonuç */}
      <View style={styles.resultRow}>
        <View style={styles.leftSide}>
          <Text style={[styles.conversionText, { color: theme.colors.textSecondary }]}>
            {fromAmount} {getCurrencyName(fromCurrency)}
          </Text>
          <View style={styles.resultMain}>
            <Text style={[styles.resultValue, { color: theme.colors.success }]}>
              {num(result, 4)}
            </Text>
            <Text style={[styles.resultCurrency, { color: theme.colors.textPrimary }]}>
              {getCurrencySymbol(toCurrency)}
            </Text>
          </View>
        </View>
        
        <View style={styles.rightSide}>
          <Text style={[styles.resultLabel, { color: theme.colors.textSecondary }]}>
            {getCurrencyName(toCurrency)}
          </Text>
          {!!updatedAt && (
            <Text style={[styles.updatedText, { color: theme.colors.textTertiary }]}>
              🕐 {updatedAt.split(' ')[1] || updatedAt}
            </Text>
          )}
        </View>
      </View>

      {/* XAU info - sadece gerektiğinde, çok kompakt */}
      {(xauPrice || xauLoading) && (String(fromCurrency).includes('GOLD') || String(toCurrency).includes('GOLD')) && (
        <View style={[styles.xauCompact, { borderTopColor: theme.colors.border }]}>
          {xauLoading ? (
            <Text style={[styles.xauTextSmall, { color: theme.colors.textTertiary }]}>
              📈 XAU yükleniyor...
            </Text>
          ) : xauPrice && isFinite(xauPrice.ounce) ? (
            <Text style={[styles.xauTextSmall, { color: theme.colors.textSecondary }]}>
              🥇 1 ons ≈ {num(xauPrice.ounce, 2)} {xauPrice.currency}
            </Text>
          ) : null}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  resultCard: {
    padding: 14,
    marginHorizontal: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  errorIcon: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
  },
  placeholderText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  
  // Kompakt row layout
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSide: {
    flex: 1,
  },
  rightSide: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  
  // Sonuç stilleri
  conversionText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    opacity: 0.8,
  },
  resultMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Courier New',
    letterSpacing: -0.3,
  },
  resultCurrency: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2,
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'right',
    marginBottom: 2,
  },
  updatedText: {
    fontSize: 9,
    textAlign: 'right',
    opacity: 0.7,
  },
  
  // XAU kompakt bilgi
  xauCompact: {
    borderTopWidth: 0.5,
    paddingTop: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  xauTextSmall: {
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.8,
  },
});