import { useState, useEffect } from 'react';
import { api } from '../api/client';

interface TickerItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
}

export default function LiveTicker() {
  const [prices, setPrices] = useState<TickerItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.livePrices();
        if (data?.prices) setPrices(data.prices);
      } catch {
        // silently fail — ticker is decorative
      }
    };
    load();
    const iv = setInterval(load, 60000);
    return () => clearInterval(iv);
  }, []);

  if (!prices.length) return null;

  // Double the array so the scroll loops seamlessly
  const items = [...prices, ...prices];

  return (
    <div className="ticker-wrap" style={{ height: '32px' }}>
      <div className="ticker-track">
        {items.map((p, i) => {
          const up = p.change >= 0;
          return (
            <div key={i} className="ticker-item">
              <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '11px' }}>{p.ticker}</span>
              <span style={{ color: 'var(--text-primary)' }}>${p.price.toFixed(2)}</span>
              <span style={{ color: up ? 'var(--profit)' : 'var(--loss)', fontSize: '10px' }}>
                {up ? '▲' : '▼'} {Math.abs(p.changePct).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
