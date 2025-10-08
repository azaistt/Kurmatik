import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
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

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {Platform.OS === 'web' && <BannerColumn position="left" />}
      {Platform.OS === 'web' && <BannerColumn position="right" />}
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
}
