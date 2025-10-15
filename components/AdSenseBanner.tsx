import { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface AdSenseBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle';
  fullWidthResponsive?: boolean;
  style?: any;
}

export default function AdSenseBanner({ 
  adSlot, 
  adFormat = 'auto',
  fullWidthResponsive = true,
  style 
}: AdSenseBannerProps) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <div style={{ ...styles.container, ...style }}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: style?.minHeight || '90px',
          width: '100%',
        }}
        data-ad-client="ca-pub-4687295574139351"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    minHeight: 90,
  },
});
