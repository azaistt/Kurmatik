import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CURRENCY_LIST, GOLD_LIST } from '../constants/currencies';
import { convertAnyToAll } from '../src/lib/api';

// Web için CSS dosyasını import et (web'de çalışırken)
if (Platform.OS === 'web') {
  import('./InstantConverter.web.css');
}

export default function InstantConverter() {
  const [amount, setAmount] = useState('100');
  const [fromCode, setFromCode] = useState('TRY');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const allOptions = [...CURRENCY_LIST, ...GOLD_LIST];

  const handleConvert = async () => {
    setLoading(true);
    try {
      const res = await convertAnyToAll(Number(amount), fromCode);
      setResults(res);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleConvert();
    // eslint-disable-next-line
  }, [amount, fromCode]);

  // Kaynak para birimi bilgisini al
  const getFromLabel = () => {
    const source = allOptions.find(opt => opt.code === fromCode);
    return source?.label || fromCode;
  };

  return (
    <View style={styles.container} className={Platform.OS === 'web' ? 'container' : ''}>
      <Text style={styles.title}>Anlık Kur / Altın Çevirici</Text>
      
      {/* Kaynak Para Birimi Bilgisi */}
      <View style={styles.sourceInfo}>
        <Text style={styles.sourceLabel}>Kaynak:</Text>
        <Text style={styles.sourceValue}>{amount} {getFromLabel()} ({fromCode})</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Miktar"
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={fromCode}
            onValueChange={setFromCode}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {allOptions.map(opt => (
              <Picker.Item key={opt.code} label={opt.label} value={opt.code} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Çevrim Sonuçları */}
      <Text style={styles.resultsTitle}>Çevrim Sonuçları:</Text>
      
      <View style={styles.grid} className={Platform.OS === 'web' ? 'grid' : ''}>
        {loading ? (
          <Text style={styles.loading}>Yükleniyor...</Text>
        ) : (
          results.map(item => (
            <View 
              key={item.code} 
              style={[styles.gridItem, item.type === 'gold' ? styles.gold : styles.fiat]}
              className={Platform.OS === 'web' ? 'gridItem' : ''}
            >
              <Text style={styles.gridLabel} className={Platform.OS === 'web' ? 'gridLabel' : ''}>
                ➜ {item.label}
              </Text>
              <Text style={styles.conversionText}>
                {amount} {fromCode} =
              </Text>
              <Text style={styles.gridValue}>
                {item.value} {item.code}
              </Text>
              <Text style={styles.explanationText}>
                {getFromLabel()} → {item.label}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#101624',
    borderWidth: 1,
    borderColor: '#232b3b',
    marginBottom: 24,
    marginTop: 8,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'left',
  },
  sourceInfo: {
    backgroundColor: '#1a2332',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a3b4c',
  },
  sourceLabel: {
    fontSize: 12,
    color: '#8b95a5',
    marginBottom: 4,
    fontWeight: '600',
  },
  sourceValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b95a5',
    marginBottom: 12,
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#232b3b',
    backgroundColor: '#181f33',
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  pickerWrapper: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#232b3b',
    backgroundColor: '#181f33',
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    height: 44,
    width: '100%',
  },
  pickerItem: {
    color: '#fff',
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  gridItem: {
    minWidth: 160,
    width: '47%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#181f33',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#232b3b',
    flex: Platform.OS === 'web' ? undefined : 1,
  },
  gold: {
    backgroundColor: '#2d2a1a',
    borderColor: '#bfa14a',
  },
  fiat: {
    backgroundColor: '#181f33',
    borderColor: '#232b3b',
  },
  gridLabel: {
    color: '#bfa14a',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'center',
  },
  conversionText: {
    color: '#8b95a5',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 2,
  },
  gridValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 4,
  },
  explanationText: {
    color: '#6b7580',
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loading: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
});
