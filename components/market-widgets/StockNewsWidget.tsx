import React, { useEffect, useRef } from 'react';

interface StockNewsWidgetProps {
  symbol: string;
  width?: string | number;
  height?: string | number;
}

const StockNewsWidget: React.FC<StockNewsWidgetProps> = ({ symbol, width = '100%', height = 600 }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `{
      "symbol": "${symbol}",
      "width": "${width}",
      "height": "${height}",
      "locale": "tr",
      "colorTheme": "dark",
      "isTransparent": true,
      "autosize": true
    }`;
    container.current.innerHTML = '';
    container.current.appendChild(script);
    return () => { container.current && (container.current.innerHTML = ''); };
  }, [symbol, width, height]);

  return <div ref={container} style={{ width, height }} />;
};

export default StockNewsWidget;
