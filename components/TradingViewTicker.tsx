
// TradingViewTicker.tsx - Basitleştirilmiş iframe yaklaşımı
import React from 'react';
import { Platform, View } from 'react-native';

// TradingView için iFrame HTML kodu
const TRADINGVIEW_IFRAME = `
<iframe
  src="https://tr.tradingview.com/embed-widget/ticker-tape/?locale=tr#%7B%22symbols%22%3A%5B%7B%22proName%22%3A%22FOREXCOM%3ASPX500%22%2C%22title%22%3A%22S%26P%20500%22%7D%2C%7B%22proName%22%3A%22FOREXCOM%3AUSDTRY%22%2C%22title%22%3A%22USD%2FTRY%22%7D%2C%7B%22proName%22%3A%22FOREXCOM%3AEURTRY%22%2C%22title%22%3A%22EUR%2FTRY%22%7D%2C%7B%22proName%22%3A%22BITSTAMP%3ABTCUSD%22%2C%22title%22%3A%22Bitcoin%22%7D%2C%7B%22proName%22%3A%22NASDAQ%3AAAPL%22%2C%22title%22%3A%22Apple%22%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22adaptive%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A46%2C%22utm_source%22%3A%22kurmatik.app%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22ticker-tape%22%7D"
  style="box-sizing: border-box; height: 46px; width: 100%;"
  frameborder="0"
  allowtransparency="true"
  scrolling="no"
  title="Ticker Tape TradingView widget"
></iframe>
`;

const TradingViewTicker: React.FC = () => {
  // Sadece web platformunda çalışır
  if (Platform.OS !== 'web') {
    return null;
  }

  // Web platformunda iframe kullan
  return (
    <div 
      style={{ 
        width: '100%',
        height: '46px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#151515'
      }}
      dangerouslySetInnerHTML={{ __html: TRADINGVIEW_IFRAME }} 
    />
  );
};

export default TradingViewTicker;
