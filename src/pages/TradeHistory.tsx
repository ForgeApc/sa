import { useState } from 'react';
import { trades } from '../data/mockData';
import { BookOpen } from 'lucide-react';

type Filter = 'all' | 'buys' | 'sells';

export default function TradeHistory() {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = trades.filter(t => {
    if (filter === 'buys') return t.type === 'BUY';
    if (filter === 'sells') return t.type === 'SELL';
    return true;
  });

  const totalPnL = trades.filter(t => t.pnl !== null).reduce((acc, t) => acc + (t.pnl || 0), 0);
  const wins = trades.filter(t => t.pnl && t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl && t.pnl < 0).length;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 20px 40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>Trade History</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{trades.length} total trades</div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Total P&L', value: `${totalPnL >= 0 ? '+$' : '-$'}${Math.abs(totalPnL)}`, color: totalPnL >= 0 ? 'var(--profit)' : 'var(--loss)' },
          { label: 'Total Trades', value: `${trades.length}`, color: 'var(--text-primary)' },
          { label: 'Winners', value: `${wins}`, color: 'var(--profit)' },
          { label: 'Losers', value: `${losses}`, color: 'var(--loss)' },
        ].map(s => (
          <div key={s.label} className="glass-flat" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {(['all', 'buys', 'sells'] as Filter[]).map(f => (
          <button key={f} className={`btn-glass ${filter === f ? '' : 'btn-ghost'}`} style={{ fontSize: '11px', padding: '5px 12px', textTransform: 'capitalize' }} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {/* Trade cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(t => {
          const isProfit = t.pnl !== null && t.pnl > 0;
          const isLoss = t.pnl !== null && t.pnl < 0;
          const isBuy = t.type === 'BUY';
          return (
            <div
              key={t.id}
              className="glass"
              style={{ padding: '16px 18px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  {/* Type indicator */}
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px',
                    background: isBuy ? 'rgba(0,217,255,0.12)' : isProfit ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    border: `1px solid ${isBuy ? 'rgba(0,217,255,0.3)' : isProfit ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    flexShrink: 0,
                  }}>
                    {isBuy ? '↗' : isProfit ? '✓' : '✗'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '15px', color: isBuy ? 'var(--accent)' : isProfit ? 'var(--profit)' : 'var(--loss)' }}>
                        {t.type}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '15px' }}>{t.ticker}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>×{t.shares} @ ${t.price}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t.reason}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.date} · {t.time}</div>
                    {t.type === 'BUY' && (
                      <div style={{ marginTop: '4px' }}>
                        <span className="tag tag-accent" style={{ fontSize: '10px' }}>Confidence: {t.confidence}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {t.pnl !== null ? (
                    <>
                      <div style={{ fontSize: '20px', fontWeight: 800 }} className={isProfit ? 'profit' : 'loss'}>
                        {isProfit ? '+$' : '-$'}{Math.abs(t.pnl)}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }} className={isProfit ? 'profit' : 'loss'}>
                        {isProfit ? '+' : ''}{t.pnlPct}%
                      </div>
                    </>
                  ) : (
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--profit)', fontWeight: 600 }}>Open</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>${(t.shares * t.price).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
