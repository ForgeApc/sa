import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, X, Eye } from 'lucide-react';
import { holdings } from '../data/mockData';
import Sparkline from './Sparkline';
import StockModal from './StockModal';

const statusConfig: Record<string, { label: string; color: string }> = {
  HOLD: { label: '⏳ HOLD', color: 'var(--text-secondary)' },
  NEAR: { label: '🎯 TARGET', color: 'var(--warning)' },
  WATCH: { label: '📊 WATCH', color: 'var(--accent)' },
};

export default function HoldingsTable() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modal, setModal] = useState<typeof holdings[0] | null>(null);

  return (
    <div className="glass-flat animate-in-1" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Holdings</span>
          <span className="tag tag-accent">{holdings.length}</span>
        </div>
        <button className="btn-glass btn-ghost" style={{ fontSize: '11px', padding: '5px 10px' }}>Filter</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {['Ticker', 'Shares', 'Entry', 'Current', 'Gain', 'Days', 'Chart', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          {holdings.map(h => {
              const isOpen = expanded === h.ticker;
              return (
                <tbody key={h.ticker}>
                  <tr
                    style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,217,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => setExpanded(isOpen ? null : h.ticker)}
                  >
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{h.ticker}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{h.sector}</div>
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{h.shares}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>${h.entry}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>${h.current}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)' }}>
                      <span className={h.gainPct >= 0 ? 'profit' : 'loss'} style={{ fontWeight: 700 }}>
                        {h.gainPct >= 0 ? '+' : ''}{h.gainPct}%
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>{h.daysHeld}d</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)' }}>
                      <Sparkline data={h.sparkline} width={72} height={26} />
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: statusConfig[h.status]?.color }}>
                        {statusConfig[h.status]?.label}
                      </span>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`${h.ticker}-expand`}>
                      <td colSpan={8} style={{ padding: '0 8px 12px' }}>
                        <div className="glass-inner" style={{ padding: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Position</div>
                            {[
                              ['Entry', `$${h.entry}`],
                              ['Current', `$${h.current}`],
                              ['Gain', `+$${h.gain} (+${h.gainPct}%)`, true],
                              ['Target', `$${h.target}`],
                              ['Stop Loss', `$${h.stopLoss}`],
                              ['Confidence', `${h.confidence}%`],
                            ].map(([k, v, pos]) => (
                              <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '3px 0' }}>
                                <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                                <span style={{ fontWeight: 600, color: pos ? 'var(--profit)' : 'var(--text-primary)' }}>{v}</span>
                              </div>
                            ))}
                            <div style={{ marginTop: '8px' }}>
                              <div className="conf-bar"><div className="conf-bar-fill" style={{ width: `${h.confidence}%` }} /></div>
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Thesis: {h.thesis}</div>
                            {h.signals.slice(0, 3).map(s => (
                              <div key={s} style={{ fontSize: '12px', color: 'var(--profit)', padding: '2px 0' }}>✓ {s}</div>
                            ))}
                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                              <button className="btn-glass btn-profit" style={{ fontSize: '11px', padding: '5px 10px' }} onClick={() => setModal(h)}>
                                View Details
                              </button>
                              <button className="btn-glass btn-danger" style={{ fontSize: '11px', padding: '5px 10px' }}>
                                Sell 50%
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              );
            })}
        </table>
      </div>

      {modal && <StockModal stock={modal} onClose={() => setModal(null)} mode="holding" />}
    </div>
  );
}
