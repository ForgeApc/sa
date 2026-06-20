import { useState } from 'react';
import { ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import { candidates } from '../data/mockData';
import StockModal from './StockModal';

export default function CandidatesCarousel() {
  const [idx, setIdx] = useState(0);
  const [modal, setModal] = useState<typeof candidates[0] | null>(null);
  const stock = candidates[idx];

  return (
    <div className="glass-flat animate-in-2" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Rocket size={16} style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Next to Buy</span>
        <span className="tag tag-accent" style={{ marginLeft: 'auto' }}>{idx + 1}/{candidates.length}</span>
      </div>

      <div className="glass-inner" style={{ padding: '16px', minHeight: '220px' }}>
        {/* Ticker header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>{stock.ticker}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stock.name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--profit)' }}>+{stock.predictedReturn}%</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>predicted 6mo</div>
          </div>
        </div>

        {/* Confidence */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Confidence</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>{stock.confidence}%</span>
          </div>
          <div className="conf-bar"><div className="conf-bar-fill" style={{ width: `${stock.confidence}%` }} /></div>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Current Price</span>
          <span style={{ fontWeight: 700 }}>${stock.price}</span>
        </div>

        {/* Signals */}
        <div style={{ marginBottom: '14px' }}>
          {stock.signals.slice(0, 4).map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', fontSize: '12px', padding: '2px 0', color: s.type === 'warning' ? 'var(--warning)' : s.type === 'neutral' ? 'var(--text-muted)' : 'var(--profit)' }}>
              <span style={{ flexShrink: 0 }}>{s.type === 'warning' ? '⚠' : '✓'}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-glass" style={{ flex: 1, justifyContent: 'center' }}>Buy Now</button>
          <button className="btn-glass btn-ghost" onClick={() => setModal(stock)}>Details</button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '14px' }}>
        <button
          className="btn-glass btn-ghost"
          style={{ padding: '6px 10px' }}
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={idx === 0}
        >
          <ChevronLeft size={16} />
        </button>
        <div style={{ display: 'flex', gap: '5px' }}>
          {candidates.map((_, i) => (
            <div
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? '16px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === idx ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: i === idx ? '0 0 8px var(--accent)' : 'none',
              }}
            />
          ))}
        </div>
        <button
          className="btn-glass btn-ghost"
          style={{ padding: '6px 10px' }}
          onClick={() => setIdx(i => Math.min(candidates.length - 1, i + 1))}
          disabled={idx === candidates.length - 1}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {modal && <StockModal stock={modal} onClose={() => setModal(null)} mode="candidate" />}
    </div>
  );
}
