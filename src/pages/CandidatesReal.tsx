import { useState, useEffect } from 'react';
import { api } from '../api/client';
import Sparkline from '../components/Sparkline';
import StockModal from '../components/StockModal';
import { Search, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  portfolioSize: number;
}

export default function CandidatesReal({ portfolioSize }: Props) {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [minConf, setMinConf] = useState(0);
  const [modal, setModal] = useState<any>(null);
  const [backtest, setBacktest] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [backtestLoading, setBacktestLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.topPicks(portfolioSize);
      setStocks(res.stocks || []);
      setLastUpdated(res.lastUpdated ? new Date(res.lastUpdated).toLocaleTimeString() : '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

    // Load backtest
    setBacktestLoading(true);
    try {
      const bt = await api.backtest(6);
      setBacktest(bt.backtest);
    } catch {}
    setBacktestLoading(false);
  };

  useEffect(() => { load(); }, [portfolioSize]);

  const filtered = stocks.filter(s =>
    (s.ticker.includes(search.toUpperCase()) || s.name?.toLowerCase().includes(search.toLowerCase())) &&
    s.confidence >= minConf
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 20px 40px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>Live Stock Screening</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {loading ? 'Fetching real-time data from Yahoo Finance...' : `${filtered.length} candidates · Real data${lastUpdated ? ` · Cached at ${lastUpdated}` : ''}`}
            </div>
          </div>
          <button className="btn-glass btn-ghost" style={{ fontSize: '12px' }} onClick={load} disabled={loading}>
            <RefreshCw size={14} style={{ animation: loading ? 'spinAnim 1s linear infinite' : 'none' }} />
            {loading ? 'Updating...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Backtest result banner */}
      {backtest && (
        <div className="glass-flat animate-in" style={{ padding: '14px 18px', marginBottom: '16px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={15} style={{ color: 'var(--profit)', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Algorithm backtested over {backtest.period} on {backtest.stocksTested} stocks</span>
          </div>
          {[
            { label: 'Win Rate', value: `${backtest.winRate}%`, color: 'var(--profit)' },
            { label: 'Avg Return', value: `+${backtest.avgActual}%`, color: 'var(--profit)' },
            { label: 'Best', value: `${backtest.bestPick?.ticker} +${backtest.bestPick?.actual}%`, color: 'var(--accent)' },
            { label: 'Avg Win', value: `+${backtest.avgWin}%`, color: 'var(--profit)' },
            { label: 'Avg Loss', value: `${backtest.avgLoss}%`, color: 'var(--loss)' },
            { label: 'Profit Factor', value: `${backtest.profitFactor}×`, color: 'var(--accent)' },
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m.label}</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}
      {backtestLoading && !backtest && (
        <div className="glass-flat" style={{ padding: '10px 16px', marginBottom: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          ⏳ Running 6-month backtest to validate algorithm accuracy...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass-flat" style={{ padding: '20px', marginBottom: '16px', textAlign: 'center', borderColor: 'rgba(239,68,68,0.3)' }}>
          <AlertCircle size={20} style={{ color: 'var(--loss)', marginBottom: '8px' }} />
          <div style={{ fontSize: '14px', color: 'var(--loss)', marginBottom: '6px' }}>{error}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Make sure the backend is running: <code style={{ color: 'var(--accent)' }}>cd stock-predictor/backend && npm start</code>
          </div>
          <button className="btn-glass" onClick={load}>Retry</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !error && (
        <div className="glass-flat" style={{ padding: '40px', textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px', animation: 'spinAnim 1.5s linear infinite', display: 'inline-block' }}>⚙</div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Screening 35 stocks in real-time</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Fetching Yahoo Finance · Calculating RSI, MACD, SMA · Scoring signals</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>First load takes ~30 seconds. Results cached for 1 hour.</div>
        </div>
      )}

      {/* Filters */}
      {!loading && stocks.length > 0 && (
        <div className="glass-flat" style={{ padding: '14px 16px', marginBottom: '14px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input-glass" placeholder="Search ticker..." style={{ paddingLeft: '30px' }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Min confidence: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{minConf}%</span></span>
            <input type="range" min={0} max={85} step={5} value={minConf} onChange={e => setMinConf(Number(e.target.value))} style={{ width: '100px' }} />
          </div>
        </div>
      )}

      {/* Results table */}
      {!loading && filtered.length > 0 && (
        <div className="glass-flat" style={{ padding: '20px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {['#', 'Ticker', 'Price', 'Confidence', 'Predicted 6mo', 'RSI', '1M Return', 'Signals', 'Chart', 'Action'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 600, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.ticker}
                    style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,217,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => setModal(s)}
                  >
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontWeight: 700 }}>#{i + 1}</td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '15px' }}>{s.ticker}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>${s.price}</td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '52px' }}>
                          <div className="conf-bar"><div className="conf-bar-fill" style={{ width: `${s.confidence}%` }} /></div>
                        </div>
                        <span style={{ fontWeight: 800, color: 'var(--accent)' }}>{s.confidence}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                      <span className="profit" style={{ fontWeight: 800, fontSize: '15px' }}>+{s.predictedReturn}%</span>
                      <div style={{ fontSize: '11px', color: 'var(--profit)' }}>+${s.predictedGain?.toLocaleString()}</div>
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontWeight: 600, color: s.rsi >= 40 && s.rsi <= 65 ? 'var(--profit)' : s.rsi > 70 ? 'var(--warning)' : 'var(--text-secondary)' }}>
                        {s.rsi ?? '—'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                      <span className={s.ret1m >= 0 ? 'profit' : 'loss'} style={{ fontWeight: 600 }}>
                        {s.ret1m >= 0 ? '+' : ''}{s.ret1m}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                      <span className="tag tag-accent">{s.signalScore}</span>
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                      {s.sparkline?.length > 1 && <Sparkline data={s.sparkline} width={72} height={26} />}
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-glass" style={{ fontSize: '11px', padding: '5px 10px' }} onClick={e => { e.stopPropagation(); }}>Buy</button>
                        <button className="btn-glass btn-ghost" style={{ fontSize: '11px', padding: '5px 10px' }} onClick={e => { e.stopPropagation(); setModal(s); }}>Info</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && <StockModal stock={modal} onClose={() => setModal(null)} mode="candidate" />}
    </div>
  );
}
