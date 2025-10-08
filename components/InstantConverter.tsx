import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CURRENCY_LIST, GOLD_LIST } from '../constants/currencies';
import { convertAnyToAll } from '../src/lib/api';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anlık Kur / Altın Çevirici</Text>
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
      <View style={styles.grid}>
        {loading ? (
          <Text style={styles.loading}>Yükleniyor...</Text>
        ) : (
          results.map(item => (
            <View key={item.code} style={[styles.gridItem, item.type === 'gold' ? styles.gold : styles.fiat]}>
              <Text style={styles.gridLabel}>{item.label}</Text>
              <Text style={styles.gridValue}>{item.value}</Text>
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
    alignSelf: 'flex-end',
    ...Platform.select({ web: { boxShadow: '0 4px 32px #0002' } }),
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'left',
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
    justifyContent: 'flex-start',
  },
  gridItem: {
    minWidth: 120,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#181f33',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#232b3b',
    alignItems: 'center',
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
    marginBottom: 2,
  },
  gridValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  loading: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
});
