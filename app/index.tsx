import FinanceDashboard from '@/src/screens/FinanceDashboard';
import { View, Text, useColorScheme, StyleSheet, Platform } from 'react-native';

const STEPS = [
  { step: '1', title: 'Kurmatik’i aç', description: 'Web veya mobil uygulamada aynı hesap ile giriş yap.' },
  { step: '2', title: 'Hedeflerini belirle', description: 'Döviz, altın veya özel pariteler için izleme ve alarm kur.' },
  { step: '3', title: 'Harekete geç', description: 'Anlık bildirimler ve temiz grafiklerle fırsatı kaçırma.' },
];

function StepsHeaderInline() {
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <View style={styles.stepsHeaderContainer}>
      <Text style={[styles.stepsHeaderTitle, { color: dark ? '#bfc9db' : '#6b7280' }]}>NASIL ÇALIŞIR?</Text>
      <View style={styles.stepsRow}>
        {STEPS.map((item, idx) => (
          <View key={item.step} style={styles.stepItem}>
            <Text style={{ color: dark ? '#4ade80' : '#2563eb', fontWeight: 'bold', fontSize: 20 }}>{item.step}</Text>
            <Text style={{ color: dark ? '#fff' : '#111827', fontWeight: '800', fontSize: 18, marginLeft: 2 }}>{item.title}</Text>
            {idx < STEPS.length - 1 && <Text style={{ color: dark ? '#4ade80' : '#2563eb', fontWeight: 'bold', fontSize: 28, marginHorizontal: 12 }}>→</Text>}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepsHeaderContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    gap: 4,
  },
  stepsHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 16,
  },
});

// Header'ın yanına StepsHeaderInline'ı prop olarak gönder
export default function FinanceDashboardWithSteps() {
  return <FinanceDashboard stepsHeader={<StepsHeaderInline />} />;
}
