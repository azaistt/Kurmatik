import FinanceDashboard from '@/src/screens/FinanceDashboard';
import { View, Text, useColorScheme, StyleSheet, Platform } from 'react-native';
import Head from 'expo-router/head';

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
      <Text style={[styles.stepsHeaderTitle, { color: '#ffffff' }]}>NASIL ÇALIŞIR?</Text>
      <View style={styles.stepsRow}>
        {STEPS.map((item, idx) => (
          <View key={item.step} style={styles.stepItem}>
            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 20 }}>{item.step}</Text>
            <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 18, marginLeft: 2 }}>{item.title}</Text>
            {idx < STEPS.length - 1 && <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 28, marginHorizontal: 12 }}>→</Text>}
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
  return (
    <>
      {Platform.OS === 'web' && (
        <Head>
          <title>Kurmatik Finance - Döviz Çevirici & AI Finansal Asistan</title>
          <meta name="description" content="Canlı döviz kurları, altın fiyatları ve yapay zeka destekli finansal danışmanlık. USD/TRY, EUR/TRY kurları ve anında çeviri." />
          <meta name="keywords" content="döviz çevirici, altın fiyatı, USD TRY, EUR TRY, finansal asistan, AI, kurmatik" />
          <meta name="author" content="Kurmatik Finance" />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content="Kurmatik Finance - Döviz Çevirici" />
          <meta property="og:description" content="Canlı döviz kurları ve AI finansal asistan" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://kurmatik.xyz" />
          <meta property="og:image" content="https://kurmatik.xyz/assets/images/icon.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Kurmatik Finance" />
          <meta name="twitter:description" content="Döviz çevirici ve finansal asistan" />
          <link rel="canonical" href="https://kurmatik.xyz" />
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1300472662769141"
            crossOrigin="anonymous"
          />
        </Head>
      )}
      <FinanceDashboard stepsHeader={<StepsHeaderInline />} />
    </>
  );
}
