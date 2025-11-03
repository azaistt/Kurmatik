// src/components/CurrencyPicker.js
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

export default function CurrencyPicker({ label, value, onChange, options }) {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <View style={[styles.pickerContainer, { 
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.cardBackground 
      }]}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={[styles.picker, { color: theme.colors.text }]}
        >
          {options?.map(opt => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 56,
  },
  picker: {
    height: 56,
    paddingHorizontal: 12,
  },
});
