import { useState } from 'react';
import { candidates } from '../data/mockData';
import StockModal from '../components/StockModal';
import Sparkline from '../components/Sparkline';
import { Search } from 'lucide-react';

export default function Candidates() {
  const [modal, setModal] = useState<typeof candidates[0] | null>(null);
  const [search, setSearch] = useState('');
  const [minConf, setMinConf] = useState(0);

  const filtered = candidates.filter(c =>
    (c.ticker.includes(search.toUpperCase()) || c.name.toLowerCase().includes(search.toLowerCase())) &&
    c.confidence >= minConf
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 20px 40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>Stock Screening</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{filtered.length} candidates • Updated tonight at 12:00 AM ET</div>
      </div>

      {/* Filters */}
      <div className="glass-flat" style={{ padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-glass" placeholder="Search ticker or name..." style={{ paddingLeft: '32px' }} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Min confidence: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{minConf}%</span></span>
          <input type="range" min={0} max={90} step={5} value={minConf} onChange={e => setMinConf(Number(e.target.value))} style={{ width: '120px' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {['Any Cap', 'Large', 'Mid', 'Small'].map(s => (
            <button key={s} className="btn-glass btn-ghost" style={{ fontSize: '11px', padding: '5px 10px' }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Results table */}
      <div className="glass-flat" style={{ padding: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {['Rank', 'Ticker', 'Price', 'Confidence', 'Predicted', 'Signals', 'Chart', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 600, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.ticker}
                  style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,217,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => setModal(c)}
                >
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontWeight: 700 }}>#{i + 1}</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '15px' }}>{c.ticker}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{c.name}</div>
                  </td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>${c.price}</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px' }}>
                        <div className="conf-bar"><div className="conf-bar-fill" style={{ width: `${c.confidence}%` }} /></div>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '14px' }}>{c.confidence}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                    <span className="profit" style={{ fontWeight: 800, fontSize: '15px' }}>+{c.predictedReturn}%</span>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>6 months</div>
                  </td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                    <span className="tag tag-accent">{c.signalScore}</span>
                  </td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                    <Sparkline data={c.sparkline} width={72} height={26} />
                  </td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn-glass" style={{ fontSize: '11px', padding: '5px 10px' }} onClick={e => { e.stopPropagation(); }}>Buy</button>
                      <button className="btn-glass btn-ghost" style={{ fontSize: '11px', padding: '5px 10px' }} onClick={e => { e.stopPropagation(); setModal(c); }}>Details</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <StockModal stock={modal} onClose={() => setModal(null)} mode="candidate" />}
    </div>
  );
}
