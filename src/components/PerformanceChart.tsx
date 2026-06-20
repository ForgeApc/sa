import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart2 } from 'lucide-react';
import { performanceData } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-flat" style={{ padding: '10px 14px', fontSize: '12px' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? `$${p.value.toLocaleString()}` : `${p.value > 0 ? '+' : ''}${p.value}%`}
        </div>
      ))}
    </div>
  );
};

export default function PerformanceChart() {
  const [tab, setTab] = useState<'cumulative' | 'monthly'>('cumulative');
  const { metrics } = performanceData;

  return (
    <div className="glass-flat animate-in-3" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={16} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Performance</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['cumulative', 'monthly'] as const).map(t => (
            <button
              key={t}
              className={`btn-glass ${tab === t ? '' : 'btn-ghost'}`}
              style={{ fontSize: '11px', padding: '4px 10px', textTransform: 'capitalize' }}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* vs S&P callout */}
      <div className="glass-inner" style={{ padding: '10px 14px', marginBottom: '14px', display: 'flex', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Portfolio YTD</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--profit)' }}>+{metrics.totalReturn}%</div>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }} />
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>S&P 500 YTD</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-secondary)' }}>+{metrics.sp500Return}%</div>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }} />
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sharpe</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)' }}>{metrics.sharpeRatio}</div>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }} />
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Win Rate</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--profit)' }}>{metrics.winRate}%</div>
        </div>
      </div>

      <div style={{ height: 160, minWidth: 0 }}>
        {tab === 'cumulative' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData.cumulative} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="portfolio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sp500" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sp500" name="S&P 500" stroke="#6B7280" strokeWidth={1.5} fill="url(#sp500)" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="portfolio" name="Portfolio" stroke="#00D9FF" strokeWidth={2} fill="url(#portfolio)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData.monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sp500" name="S&P 500" fill="rgba(156,163,175,0.3)" radius={[3,3,0,0]} />
              <Bar dataKey="portfolio" name="Portfolio" fill="rgba(0,217,255,0.6)" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '14px' }}>
        {[
          { label: 'CAGR', value: `${metrics.cagr}%`, color: 'var(--profit)' },
          { label: 'Max DD', value: `${metrics.maxDrawdown}%`, color: 'var(--loss)' },
          { label: 'Avg Win', value: `+${metrics.avgWin}%`, color: 'var(--profit)' },
          { label: 'Profit F.', value: `${metrics.profitFactor}x`, color: 'var(--accent)' },
        ].map(m => (
          <div key={m.label} className="glass-inner" style={{ padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.label}</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
