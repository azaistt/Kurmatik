import React from 'react';
import { View, Text, useWindowDimensions, useColorScheme, Platform, StyleSheet } from 'react-native';

export default function BannerColumn({ position = 'left' }: { position?: 'left' | 'right' }) {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';

  // Mobilde gösterme
  if (width < 900) return null;

  // Sadece web'de position:fixed ve benzeri stiller uygula
  if (Platform.OS === 'web') {
    // @ts-ignore
    const bannerWidth = 120;
    const bannerHeight = 700;
    return (
      <View
        style={{
          position: 'fixed',
          top: `calc(50% - 350px)`,
          [position]: 0,
          width: bannerWidth,
          height: bannerHeight,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: dark ? '#181c23' : '#f3f4f6',
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
          margin: 4,
          overflow: 'hidden',
        } as any}
      >
        {/* Banner adı ve ölçüleri üstte overlay olarak */}
        <View style={{ position: 'absolute', top: 8, left: 0, width: '100%', alignItems: 'center', zIndex: 200 }}>
          <Text style={{ color: dark ? '#fff' : '#222', fontWeight: 'bold', fontSize: 13, backgroundColor: dark ? '#2229' : '#fff9', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
            {position === 'left' ? 'Sol Banner' : 'Sağ Banner'}
          </Text>
          <Text style={{ color: dark ? '#fff' : '#222', fontSize: 12, backgroundColor: dark ? '#2229' : '#fff9', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1, marginTop: 2 }}>
            {bannerWidth} x {bannerHeight} px
          </Text>
        </View>
        <Text style={{ color: dark ? '#4ade80' : '#2563eb', fontWeight: 'bold', fontSize: 16, transform: [{ rotate: '-90deg' }] }}>
          Banner Alanı
        </Text>
      </View>
    );
  }
  // Mobilde veya native'de gösterme
  return null;
}
