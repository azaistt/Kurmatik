import React from 'react';
import { Platform } from 'react-native';

export default function SpeedInsights() {
  // Only render this component on web
  if (Platform.OS !== 'web') {
    return null;
  }

  React.useEffect(() => {
    // Only run in the browser
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.src = '/_vercel/speed-insights/script.js';
      script.defer = true;
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  return null;
}