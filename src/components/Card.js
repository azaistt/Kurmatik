// Modern finans kartları için reusable components
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme';

// Ana kart komponenti
export const Card = ({ children, style, elevated = true }) => {
  const theme = useTheme();
  
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      },
      elevated && theme.shadows.base,
      style
    ]}>
      {children}
    </View>
  );
};

// Kart başlığı
export const CardHeader = ({ title, subtitle, rightComponent, style }) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.cardHeader, style]}>
      <View style={styles.cardHeaderContent}>
        <Text style={[
          styles.cardTitle,
          { color: theme.colors.textPrimary }
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[
            styles.cardSubtitle,
            { color: theme.colors.textSecondary }
          ]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent && (
        <View style={styles.cardHeaderRight}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

// Para birimlerinin ikonları
const getCurrencyIcon = (symbol) => {
  const icons = {
    // Ana para birimleri
    'USD/TRY': '💵',
    'EUR/TRY': '💶',
    'GBP/TRY': '💷',
    'USD': '💵',
    'EUR': '💶',
    'TRY': '₺',
    'GBP': '💷',
    
    // Orta Doğu para birimleri
    'QAR': '🇶🇦',
    'IRR': '🇮🇷',
    'IQD': '🇮🇶',
    
    // Diğer para birimleri  
    'RUB': '🇷🇺',
    
    // Para birimi çiftleri
    'QAR/TRY': '🇶🇦',
    'IRR/TRY': '🇮🇷',
    'IQD/TRY': '🇮🇶',
    'RUB/TRY': '🇷🇺'
  };
  return icons[symbol] || '💱';
};

// Para birimi kartı
export const CurrencyCard = ({ 
  symbol, 
  name, 
  value, 
  change, 
  changePercent, 
  onPress,
  style 
}) => {
  const theme = useTheme();
  const isPositive = change >= 0;
  
  return (
    <Card style={[styles.currencyCard, style]} elevated={false}>
      <View style={styles.currencyHeader}>
        <View style={styles.currencyLeft}>
          <Text style={styles.currencyIcon}>{getCurrencyIcon(symbol)}</Text>
          <View style={styles.currencyInfo}>
            <Text style={[
              styles.currencySymbol,
              { color: theme.colors.textPrimary }
            ]}>
              {symbol}
            </Text>
            <Text style={[
              styles.currencyName,
              { color: theme.colors.textSecondary }
            ]}>
              {name}
            </Text>
          </View>
        </View>
        <View style={styles.currencyValues}>
          <Text style={[
            styles.currencyValue,
            { color: theme.colors.textPrimary }
          ]}>
            {value}
          </Text>
          <Text style={[
            styles.currencyChange,
            { color: isPositive ? theme.colors.success : theme.colors.danger }
          ]}>
            {isPositive ? '+' : ''}{change} ({changePercent}%)
          </Text>
        </View>
      </View>
    </Card>
  );
};

// Altın ikonları
const getGoldIcon = (type) => {
  const icons = {
    'Gram': '🥇',
    'Çeyrek': '🟡',
    'Yarım': '🟨',
    'Tam': '🔶',
    'Cumhuriyet': '🪙',
    'Ons': '🏆'
  };
  return icons[type] || '🥇';
};

// Altın kartı
export const GoldCard = ({ 
  type, 
  name, 
  buyPrice, 
  sellPrice, 
  change,
  style 
}) => {
  const theme = useTheme();
  const isPositive = change >= 0;
  
  return (
    <Card style={[styles.goldCard, style]}>
      <View style={[
        styles.goldHeader,
        { backgroundColor: theme.colors.goldLight }
      ]}>
        <View style={styles.goldHeaderContent}>
          <Text style={styles.goldIcon}>{getGoldIcon(type)}</Text>
          <Text style={[
            styles.goldType,
            { color: theme.colors.goldDark }
          ]}>
            {type}
          </Text>
        </View>
        <Text style={[
          styles.goldName,
          { color: theme.colors.textSecondary }
        ]}>
          {name}
        </Text>
      </View>
      <View style={styles.goldPrices}>
        <View style={styles.goldPriceItem}>
          <Text style={[
            styles.goldPriceLabel,
            { color: theme.colors.textSecondary }
          ]}>
            Alış
          </Text>
          <Text style={[
            styles.goldPriceValue,
            { color: theme.colors.textPrimary }
          ]}>
            ₺{buyPrice}
          </Text>
        </View>
        <View style={styles.goldPriceItem}>
          <Text style={[
            styles.goldPriceLabel,
            { color: theme.colors.textSecondary }
          ]}>
            Satış
          </Text>
          <Text style={[
            styles.goldPriceValue,
            { color: theme.colors.textPrimary }
          ]}>
            ₺{sellPrice}
          </Text>
        </View>
        <View style={styles.goldPriceItem}>
          <Text style={[
            styles.goldChangeValue,
            { color: isPositive ? theme.colors.success : theme.colors.danger }
          ]}>
            {isPositive ? '+' : ''}{change}%
          </Text>
        </View>
      </View>
    </Card>
  );
};

// Input kartı
export const InputCard = ({ 
  title,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'numeric',
  style 
}) => {
  const theme = useTheme();
  
  return (
    <Card style={[styles.inputCard, style]}>
      <Text style={[
        styles.inputTitle,
        { color: theme.colors.textSecondary }
      ]}>
        {title}
      </Text>
      <TextInput
        style={[
          styles.inputField,
          { 
            color: theme.colors.textPrimary,
            borderColor: theme.colors.border 
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        keyboardType={keyboardType}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  // Ana kart
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 8,
    marginHorizontal: 2,
    overflow: 'hidden',
  },
  
  // Kart başlığı
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cardHeaderContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
  },
  cardHeaderRight: {
    marginLeft: 16,
  },
  
  // Para birimi kartı
  currencyCard: {
    padding: 20,
  },
  currencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  currencyInfo: {
    // İkon yanındaki bilgiler için container
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 12,
  },
  currencyValues: {
    alignItems: 'flex-end',
  },
  currencyValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: 'Courier New', // Rakamlar için monospace
  },
  currencyChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Altın kartı
  goldCard: {
    overflow: 'hidden',
  },
  goldHeader: {
    padding: 16,
  },
  goldHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goldIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  goldType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  goldName: {
    fontSize: 12,
  },
  goldPrices: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  goldPriceItem: {
    alignItems: 'center',
    flex: 1,
  },
  goldPriceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  goldPriceValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Courier New',
  },
  goldChangeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Input kartı
  inputCard: {
    padding: 20,
  },
  inputTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Courier New',
  },
});

export default {
  Card,
  CardHeader,
  CurrencyCard,
  GoldCard,
  InputCard,
};