// src/components/CompactConverter.js - Compact, mobile-optimized converter
import { useState } from 'react';
import {
    Keyboard,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import { useTheme } from '../theme';
import { Card } from './Card';

// Custom Currency Picker Modal - mobilde daha iyi çalışır
function CurrencyPickerModal({ visible, onClose, value, onChange, options, title }) {
  const theme = useTheme();
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
            {title}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, { color: theme.colors.primary }]}>
              Tamam
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.optionsList}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.optionItem,
                { 
                  backgroundColor: value === option.value ? theme.colors.primary + '20' : 'transparent',
                  borderBottomColor: theme.colors.border 
                }
              ]}
              onPress={() => {
                onChange(option.value);
                onClose();
              }}
            >
              <Text style={[
                styles.optionText,
                { 
                  color: value === option.value ? theme.colors.primary : theme.colors.textPrimary,
                  fontWeight: value === option.value ? '600' : '400'
                }
              ]}>
                {option.label}
              </Text>
              {value === option.value && (
                <Text style={[styles.checkmark, { color: theme.colors.primary }]}>
                  ✓
                </Text>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

// Compact Currency Selector
function CompactCurrencySelector({ value, onChange, options, placeholder, style }) {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label.split('(')[0].trim() : placeholder;
  
  return (
    <>
      <TouchableOpacity
        style={[
          styles.compactSelector,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
          style
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[
          styles.selectorText,
          { color: theme.colors.textPrimary }
        ]} numberOfLines={1}>
          {displayText}
        </Text>
        <Text style={[styles.dropdownIcon, { color: theme.colors.textSecondary }]}>
          ▼
        </Text>
      </TouchableOpacity>
      
      <CurrencyPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        value={value}
        onChange={onChange}
        options={options}
        title={placeholder}
      />
    </>
  );
}

export default function CompactConverter({
  amount,
  setAmount,
  fromCurrency,
  setFromCurrency,
  toCurrency,
  setToCurrency,
  onSwap,
  onConvert,
  loading,
  currencies
}) {
  const theme = useTheme();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Card style={[styles.converterCard, { backgroundColor: theme.colors.cardBackground }]}>
        {/* İlk satır: Tutar girişi */}
      <View style={styles.amountRow}>
        <View style={styles.amountHeader}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Çevir
          </Text>
          {/* Quick amount buttons */}
          <View style={styles.quickAmountRow}>
            {['1', '10', '100', '1000'].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                onPress={() => {
                  // Klavyeyi kapat ve tutarı ayarla
                  Keyboard.dismiss();
                  setAmount(quickAmount);
                }}
                style={[
                  styles.quickAmountButton,
                  {
                    backgroundColor: amount === quickAmount ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
              >
                <Text style={[
                  styles.quickAmountText,
                  {
                    color: amount === quickAmount ? '#FFFFFF' : theme.colors.textSecondary,
                    fontWeight: amount === quickAmount ? '600' : '400'
                  }
                ]}>
                  {quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="1"
          placeholderTextColor={theme.colors.textTertiary}
          returnKeyType="done"
          blurOnSubmit={true}
          onSubmitEditing={() => {
            // Klavyeyi kapat ve çevirme işlemini başlat
            onConvert();
          }}
          onBlur={() => {
            // Input'tan çıkıldığında klavyeyi kapat
          }}
          style={[
            styles.amountInput,
            {
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
        />
      </View>

      {/* İkinci satır: From - Swap - To */}
      <View style={styles.currencyRow}>
        <CompactCurrencySelector
          value={fromCurrency}
          onChange={setFromCurrency}
          options={currencies}
          placeholder="Kaynak"
          style={styles.fromSelector}
        />
        
        <TouchableOpacity
          onPress={() => {
            // Klavyeyi kapat ve swap işlemini yap
            Keyboard.dismiss();
            onSwap();
          }}
          style={[styles.compactSwapButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.swapIcon}>⇄</Text>
        </TouchableOpacity>
        
        <CompactCurrencySelector
          value={toCurrency}
          onChange={setToCurrency}
          options={currencies}
          placeholder="Hedef"
          style={styles.toSelector}
        />
      </View>

      {/* Üçüncü satır: Convert butonu */}
      <TouchableOpacity
        onPress={() => {
          // Klavyeyi kapat ve çevirme işlemini başlat
          Keyboard.dismiss();
          onConvert();
        }}
        style={[
          styles.compactConvertButton,
          { backgroundColor: theme.colors.success },
          loading && styles.convertButtonDisabled
        ]}
        disabled={loading}
      >
        <Text style={styles.convertButtonText}>
          {loading ? 'Hesaplanıyor...' : '💱 Çevir'}
        </Text>
      </TouchableOpacity>
      </Card>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  converterCard: {
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  
  // Amount input row
  amountRow: {
    marginBottom: 12,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  quickAmountRow: {
    flexDirection: 'row',
    gap: 6,
  },
  quickAmountButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 28,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 11,
    fontWeight: '500',
  },
  amountInput: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Courier New',
  },
  
  // Currency selection row
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  compactSelector: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  fromSelector: {
    flex: 1,
  },
  toSelector: {
    flex: 1,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
    marginLeft: 4,
  },
  
  // Swap button
  compactSwapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  swapIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Convert button
  compactConvertButton: {
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  convertButtonDisabled: {
    opacity: 0.6,
  },
  convertButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionsList: {
    flex: 1,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});