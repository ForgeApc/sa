import { useState, useEffect } from 'react';
import { api, saveToken } from '../api/client';
import { DollarSign, TrendingUp, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import Sparkline from '../components/Sparkline';

interface Props {
  email: string;
  onComplete: (portfolioSize: number) => void;
}

const PRESETS = [
  { label: '$1,000', value: 1000 },
  { label: '$5,000', value: 5000 },
  { label: '$10,000', value: 10000 },
  { label: '$25,000', value: 25000 },
  { label: '$50,000', value: 50000 },
  { label: '$100,000', value: 100000 },
];

type LoadState = 'idle' | 'loading' | 'done' | 'error';

export default function PortfolioSetup({ email, onComplete }: Props) {
  const [size, setSize] = useState(10000);
  const [input, setInput] = useState('10000');
  const [loading, setLoading] = useState<LoadState>('idle');
  const [error, setError] = useState('');
  const [picks, setPicks] = useState<any[]>([]);
  const [backtest, setBacktest] = useState<any>(null);
  const [backtestLoading, setBacktestLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalAllocated = picks.slice(0, 8).reduce((a, s) => a + s.allocation, 0);
  const totalPredictedGain = picks.slice(0, 8).reduce((a, s) => a + s.predictedGain, 0);

  async function loadPicks() {
    setLoading('loading');
    setError('');
    setPicks([]);
    try {
      const res = await api.topPicks(size);
      setPicks(res.stocks || []);
      setLoading('done');

      // Load backtest in background
      setBacktestLoading(true);
      try {
        const bt = await api.backtest(6);
        setBacktest(bt.backtest);
      } catch { /* non-critical */ }
      setBacktestLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load stocks. Make sure the backend is running.');
      setLoading('error');
    }
  }

  const handleSetSize = (v: number) => {
    setSize(v);
    setInput(String(v));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.replace(/[^0-9]/g, ''));
  };

  const handleInputBlur = () => {
    const v = Math.max(100, Math.min(10000000, Number(input) || 10000));
    setSize(v);
    setInput(String(v));
  };

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const res = await api.portfolioSetup(size);
      saveToken(res.token);
      localStorage.setItem('sb_portfolio', String(size));
      onComplete(size);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div className="animate-in" style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Welcome, {email.split('@')[0]} 👋
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '8px' }}>Set Your Portfolio Size</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>We'll calculate optimal position sizes and show you the best stocks to buy</p>
      </div>

      {/* Size selector */}
      <div className="glass-flat animate-in-1" style={{ padding: '28px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
          Portfolio Amount
        </div>

        {/* Big display */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
            <span style={{ fontSize: '32px', fontWeight: 400, color: 'var(--text-muted)' }}>$</span>
            <input
              type="text"
              value={Number(input).toLocaleString()}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.03em', background: 'none', border: 'none', outline: 'none', color: 'var(--accent)', width: '280px', textAlign: 'center' }}
            />
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Max per stock: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${(size * 0.05).toLocaleString()}</span>
            {' '}· Cash reserve: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${(size * 0.08).toLocaleString()}</span>
          </div>
        </div>

        {/* Slider */}
        <input
          type="range"
          min={500}
          max={500000}
          step={500}
          value={size}
          onChange={e => handleSetSize(Number(e.target.value))}
          style={{ width: '100%', marginBottom: '16px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <span>$500</span><span>$50k</span><span>$500k</span>
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button
              key={p.value}
              className={`btn-glass ${size === p.value ? '' : 'btn-ghost'}`}
              style={{ flex: 1, minWidth: '70px', justifyContent: 'center', fontSize: '12px' }}
              onClick={() => handleSetSize(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analyze button */}
      {loading === 'idle' && (
        <div className="animate-in-2" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button
            className="btn-glass"
            style={{ padding: '14px 36px', fontSize: '15px', fontWeight: 700 }}
            onClick={loadPicks}
          >
            Analyze Best Stocks for My Portfolio →
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading === 'loading' && (
        <div className="glass-flat" style={{ padding: '40px', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '20px', marginBottom: '12px', animation: 'spinAnim 1s linear infinite', display: 'inline-block' }}>⚙</div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Screening {'>'}30 stocks...</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Fetching real-time data · Running RSI, MACD, SMA analysis · Scoring signals</div>
        </div>
      )}

      {/* Error */}
      {loading === 'error' && (
        <div className="glass-flat" style={{ padding: '24px', textAlign: 'center', marginBottom: '20px', borderColor: 'rgba(239,68,68,0.3)' }}>
          <AlertCircle size={24} style={{ color: 'var(--loss)', marginBottom: '8px' }} />
          <div style={{ fontSize: '14px', color: 'var(--loss)', marginBottom: '8px' }}>{error}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Make sure the backend is running: <code style={{ color: 'var(--accent)' }}>cd backend && npm start</code></div>
          <button className="btn-glass" onClick={loadPicks}>Retry</button>
        </div>
      )}

      {/* Results */}
      {loading === 'done' && picks.length > 0 && (
        <>
          {/* Backtest banner */}
          {backtest && (
            <div className="glass-flat animate-in" style={{ padding: '16px 20px', marginBottom: '16px', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} style={{ color: 'var(--profit)' }} />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>Algorithm Validated: {backtest.period} Backtest</span>
              </div>
              {[
                { label: 'Win Rate', value: `${backtest.winRate}%`, color: 'var(--profit)' },
                { label: 'Avg Actual Return', value: `+${backtest.avgActual}%`, color: 'var(--profit)' },
                { label: 'Best Pick', value: `${backtest.bestPick?.ticker} +${backtest.bestPick?.actual}%`, color: 'var(--accent)' },
                { label: 'Profit Factor', value: `${backtest.profitFactor}×`, color: 'var(--accent)' },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
          )}
          {backtestLoading && !backtest && (
            <div className="glass-flat" style={{ padding: '12px 16px', marginBottom: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
              ⏳ Running 6-month backtest to validate algorithm...
            </div>
          )}

          {/* Top picks summary */}
          <div className="glass-flat animate-in" style={{ padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>Top {Math.min(8, picks.length)} Recommended Stocks</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Based on ${size.toLocaleString()} portfolio · Real Yahoo Finance data</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total allocated</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)' }}>${Math.round(totalAllocated).toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: 'var(--profit)' }}>Predicted gain: +${Math.round(totalPredictedGain).toLocaleString()}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {picks.slice(0, 8).map((s, i) => (
                <div
                  key={s.ticker}
                  className="glass-inner"
                  style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: '14px', alignItems: 'center' }}
                >
                  <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-muted)' }}>#{i + 1}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)' }}>{s.ticker}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{s.name}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Price</div>
                      <div style={{ fontWeight: 700 }}>${s.price}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Confidence</div>
                      <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{s.confidence}%</div>
                      <div className="conf-bar" style={{ marginTop: '3px', width: '50px' }}>
                        <div className="conf-bar-fill" style={{ width: `${s.confidence}%` }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Shares</div>
                      <div style={{ fontWeight: 700 }}>{s.sharesToBuy}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Invest</div>
                      <div style={{ fontWeight: 700 }}>${s.allocation.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Predicted</div>
                      <div style={{ fontWeight: 800, color: 'var(--profit)', fontSize: '15px' }}>+{s.predictedReturn}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pred. Gain</div>
                      <div style={{ fontWeight: 700, color: 'var(--profit)' }}>+${s.predictedGain.toLocaleString()}</div>
                    </div>
                    {s.sparkline?.length > 1 && (
                      <div>
                        <Sparkline data={s.sparkline} width={72} height={28} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-glass btn-ghost" onClick={() => { setLoading('idle'); setPicks([]); }}>
              Change Portfolio Size
            </button>
            <button
              className="btn-glass btn-profit"
              style={{ padding: '14px 32px', fontSize: '15px', fontWeight: 700 }}
              onClick={handleConfirm}
              disabled={saving}
            >
              {saving ? 'Saving...' : `Start with $${size.toLocaleString()} Portfolio →`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
