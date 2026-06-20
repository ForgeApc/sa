import { X, TrendingUp, AlertTriangle } from 'lucide-react';
import Sparkline from './Sparkline';

interface StockModalProps {
  stock: any;
  onClose: () => void;
  mode: 'holding' | 'candidate';
}

export default function StockModal({ stock, onClose, mode }: StockModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-flat"
        style={{ maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)' }}>{stock.ticker}</span>
              {mode === 'holding' && (
                <span className={stock.gainPct >= 0 ? 'tag tag-positive' : 'tag tag-negative'}>
                  {stock.gainPct >= 0 ? '+' : ''}{stock.gainPct}%
                </span>
              )}
              {mode === 'candidate' && (
                <span className="tag tag-accent">{stock.confidence}% confidence</span>
              )}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{stock.name}</div>
          </div>
          <button className="btn-glass btn-ghost" style={{ padding: '6px', borderRadius: '8px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Sparkline */}
        <div className="glass-inner" style={{ padding: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>5-Day Chart</span>
            <span style={{ fontSize: '20px', fontWeight: 800 }}>${stock.current || stock.price}</span>
          </div>
          <Sparkline data={stock.sparkline} width={460} height={60} />
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          {mode === 'holding' ? [
            ['Entry Price', `$${stock.entry}`],
            ['Current', `$${stock.current}`],
            ['Gain', `+$${stock.gain} (+${stock.gainPct}%)`],
            ['Days Held', `${stock.daysHeld} days`],
            ['Target', `$${stock.target}`],
            ['Stop Loss', `$${stock.stopLoss}`],
          ] : [
            ['Current Price', `$${stock.price}`],
            ['Market Cap', stock.marketCap],
            ['P/E Ratio', stock.pe ? `${stock.pe} (avg ${stock.sectorPE})` : 'N/A'],
            ['Dividend', `${stock.dividend}%`],
            ['Predicted Return', `+${stock.predictedReturn}% (6mo)`],
            ['Signal Score', stock.signalScore],
          ].map(([k, v]) => (
            <div key={String(k)} className="glass-inner" style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{k}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Confidence bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Confidence Score</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>{stock.confidence}%</span>
          </div>
          <div className="conf-bar">
            <div className="conf-bar-fill" style={{ width: `${stock.confidence}%` }} />
          </div>
        </div>

        {/* Signals */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            {mode === 'holding' ? 'Entry Signals' : 'Signals'}
          </div>
          {(mode === 'holding' ? stock.signals : stock.signals?.map((s: any) => s.label || s)).map((s: any, i: number) => {
            const sig = typeof s === 'string' ? s : s.label;
            const type = typeof s === 'object' ? s.type : 'positive';
            return (
              <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', padding: '3px 0', color: type === 'warning' ? 'var(--warning)' : type === 'neutral' ? 'var(--text-muted)' : 'var(--profit)' }}>
                <span>{type === 'warning' ? '⚠' : '✓'}</span>
                <span>{sig}</span>
              </div>
            );
          })}
        </div>

        {/* Catalysts */}
        {stock.catalysts && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Key Catalysts</div>
            {stock.catalysts.map((c: string) => (
              <div key={c} style={{ fontSize: '12px', color: 'var(--accent)', padding: '2px 0' }}>→ {c}</div>
            ))}
          </div>
        )}

        {/* Risks */}
        {stock.risks && (
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Risks</div>
            {stock.risks.map((r: string) => (
              <div key={r} style={{ fontSize: '12px', color: 'var(--warning)', padding: '2px 0' }}>⚠ {r}</div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {mode === 'holding' ? (
            <>
              <button className="btn-glass btn-profit">Sell 50%</button>
              <button className="btn-glass btn-danger">Set Stop</button>
              <button className="btn-glass btn-ghost">View Chart</button>
              <button className="btn-glass btn-danger" onClick={onClose}>Close Position</button>
            </>
          ) : (
            <>
              <button className="btn-glass">Buy Now</button>
              <button className="btn-glass btn-ghost">Watchlist</button>
              <button className="btn-glass btn-ghost" onClick={onClose}>Dismiss</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
