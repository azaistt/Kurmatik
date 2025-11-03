// App.js
import { SafeAreaView } from 'react-native';
import { setNosyApiKey } from './src/lib/api';
import HomeScreen from './src/screens/HomeScreen';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Not: Güvenlik için anahtarı koda gömmek önerilmez; burada sizin testiniz için ekliyoruz.
// ENV varsa onu kullan, yoksa sağlanan anahtarı kullan.
const ENV_KEY = process.env.EXPO_PUBLIC_NOSY_API_KEY || process.env.NOSY_API_KEY;
setNosyApiKey(ENV_KEY || '2ZglZmDZC6g80zsujM0Kc0thfgpzcYxwGL3CYkA3dcxdm87xJ4vhAZv9rHec');

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HomeScreen />
      <SpeedInsights />
    </SafeAreaView>
  );
}
