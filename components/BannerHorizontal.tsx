import React from 'react';
import { View, Text, useWindowDimensions, useColorScheme, Platform } from 'react-native';

export default function BannerHorizontal() {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';

  // Mobilde gösterme
  if (width < 900) return null;

  if (Platform.OS === 'web') {
    // @ts-ignore
    return (
      <View
        style={{
          width: '100vw',
          maxWidth: '100vw',
          height: 130,
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: dark ? '#181c23' : '#f3f4f6',
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
          margin: 0,
          overflow: 'hidden',
        } as any}
      >
  <Text style={{ color: dark ? '#4ade80' : '#2563eb', fontWeight: 'bold', fontSize: 32 }}>
          Banner Alanı
        </Text>
      </View>
    );
  }
  return null;
}
