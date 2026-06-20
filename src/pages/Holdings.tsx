import { useState } from 'react';
import { holdings } from '../data/mockData';
import Sparkline from '../components/Sparkline';
import StockModal from '../components/StockModal';
import { TrendingUp, Filter } from 'lucide-react';

type Filter = 'all' | 'gainers' | 'losers' | 'near';

export default function Holdings() {
  const [filter, setFilter] = useState<Filter>('all');
  const [modal, setModal] = useState<typeof holdings[0] | null>(null);
  const [sort, setSort] = useState<'gain' | 'days' | 'conf'>('gain');

  const filtered = holdings
    .filter(h => {
      if (filter === 'gainers') return h.gainPct > 0;
      if (filter === 'losers') return h.gainPct < 0;
      if (filter === 'near') return h.status === 'NEAR';
      return true;
    })
    .sort((a, b) => {
      if (sort === 'gain') return b.gainPct - a.gainPct;
      if (sort === 'days') return b.daysHeld - a.daysHeld;
      return b.confidence - a.confidence;
    });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 20px 40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>Holdings</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{holdings.length} active positions</div>
      </div>

      <div className="glass-flat" style={{ padding: '20px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['all', 'gainers', 'losers', 'near'] as Filter[]).map(f => (
              <button key={f} className={`btn-glass ${filter === f ? '' : 'btn-ghost'}`} style={{ fontSize: '11px', padding: '5px 10px', textTransform: 'capitalize' }} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sort:</span>
            {(['gain', 'days', 'conf'] as const).map(s => (
              <button key={s} className={`btn-glass ${sort === s ? '' : 'btn-ghost'}`} style={{ fontSize: '11px', padding: '5px 10px', textTransform: 'capitalize' }} onClick={() => setSort(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(h => (
            <div
              key={h.ticker}
              className="glass-inner"
              style={{ padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s ease', display: 'grid', gridTemplateColumns: '80px 1fr auto', alignItems: 'center', gap: '16px' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,217,255,0.25)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
              onClick={() => setModal(h)}
            >
              {/* Ticker */}
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)' }}>{h.ticker}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{h.sector}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h.daysHeld}d held</div>
              </div>

              {/* Main info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Shares</div>
                  <div style={{ fontWeight: 600 }}>{h.shares}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Entry</div>
                  <div style={{ fontWeight: 600 }}>${h.entry}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current</div>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>${h.current}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>P&L</div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }} className={h.gainPct >= 0 ? 'profit' : 'loss'}>
                    {h.gainPct >= 0 ? '+' : ''}{h.gainPct}%
                  </div>
                  <div style={{ fontSize: '11px' }} className={h.gainPct >= 0 ? 'profit' : 'loss'}>
                    {h.gainPct >= 0 ? '+$' : '-$'}{Math.abs(h.gain).toFixed(0)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Confidence</div>
                  <div style={{ fontWeight: 600, color: 'var(--accent)' }}>{h.confidence}%</div>
                  <div className="conf-bar" style={{ marginTop: '4px', width: '60px' }}>
                    <div className="conf-bar-fill" style={{ width: `${h.confidence}%` }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target / Stop</div>
                  <div style={{ fontSize: '12px' }}><span className="profit">${h.target}</span> / <span className="loss">${h.stopLoss}</span></div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>5d</div>
                  <Sparkline data={h.sparkline} width={72} height={28} />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                <button className="btn-glass btn-profit" style={{ fontSize: '11px' }} onClick={e => { e.stopPropagation(); }}>Details</button>
                <button className="btn-glass btn-danger" style={{ fontSize: '11px' }} onClick={e => { e.stopPropagation(); }}>Sell 50%</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && <StockModal stock={modal} onClose={() => setModal(null)} mode="holding" />}
    </div>
  );
}
