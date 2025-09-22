// App.js
import { Platform, SafeAreaView, StatusBar } from 'react-native';
import { setNosyApiKey } from './src/lib/api';
import HomeScreen from './src/screens/HomeScreen';

// Not: Güvenlik için anahtarı koda gömmek önerilmez; burada sizin testiniz için ekliyoruz.
// ENV varsa onu kullan, yoksa sağlanan anahtarı kullan.
const ENV_KEY = process.env.EXPO_PUBLIC_NOSY_API_KEY || process.env.NOSY_API_KEY;
setNosyApiKey(ENV_KEY || '2ZglZmDZC6g80zsujM0Kc0thfgpzcYxwGL3CYkA3dcxdm87xJ4vhAZv9rHec');

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <HomeScreen />
    </SafeAreaView>
  );
}
