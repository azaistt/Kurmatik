import React, { useEffect, useRef } from 'react';

interface StockPriceWidgetProps {
  symbol: string;
  width?: string | number;
  height?: string | number;
}

const StockPriceWidget: React.FC<StockPriceWidgetProps> = ({ symbol, width = '100%', height = 400 }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `{
      "symbol": "${symbol}",
      "width": "${width}",
      "height": "${height}",
      "locale": "tr",
      "dateRange": "12M",
      "colorTheme": "dark",
      "isTransparent": true,
      "autosize": true,
      "largeChartUrl": ""
    }`;
    container.current.innerHTML = '';
    container.current.appendChild(script);
    return () => { container.current && (container.current.innerHTML = ''); };
  }, [symbol, width, height]);

  return <div ref={container} style={{ width, height }} />;
};

export default StockPriceWidget;
