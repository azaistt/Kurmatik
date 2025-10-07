import React from 'react';
import { Platform, View } from 'react-native';
import TradingViewTicker from './TradingViewTicker';

// Ana sayfaya eklenen bileşen, ticker'ı sadece web'de gösterir
const TickerWrapper: React.FC = () => {
  return Platform.OS === 'web' ? <TradingViewTicker /> : null;
};

export default TickerWrapper;