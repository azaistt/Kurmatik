import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import TradingViewTicker from '../components/TradingViewTicker';
import SpeedInsights from '@/components/SpeedInsights';
import BannerColumn from '../components/BannerColumn';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const layout = (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
          name="dashboard" 
          options={{ 
            title: 'Kurmatik Finance Dashboard',
            headerShown: false 
          }} 
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
      {Platform.OS === 'web' && <SpeedInsights />}
    </ThemeProvider>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <BannerColumn position="left" />
        <View style={styles.webContent}>
          {layout}
        </View>
        <BannerColumn position="right" />
      </View>
    );
  }

  return layout;
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    flexDirection: 'row', // Yatay sıra düzeni
    alignItems: 'stretch', // İçeriğin dikeyde tüm alanı doldurmasını sağlar
    justifyContent: 'center', // Banner'ların arasında ana içeriği merkeze alır
    backgroundColor: '#282c34', // Koyu bir arka plan rengi
    padding: 4, // Padding'i daha da azalttım
    height: '100%', // Tüm yüksekliği kullan
  },
  webContent: {
    width: '90%', // Boyutu artırıldı
    height: '100%', // Tam yükseklik kullansın
    transform: [{ scale: 0.95 }], // Küçültme oranını azalttım
    borderRadius: 12,
    overflow: 'hidden',
    // React Native'de gölge için platform uyumlu özellikler
    elevation: 8, // Android için gölge
    shadowColor: "#000", // iOS için gölge
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    backgroundColor: '#fff', // İçerik arka planı
    alignSelf: 'center', // İçeriği dikey olarak ortala
    marginVertical: 8, // Yukarıdan ve aşağıdan birazcık boşluk
  }
});
