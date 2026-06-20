import { TrendingUp, DollarSign, PieChart } from 'lucide-react';
import { portfolioData, sectorAllocation } from '../data/mockData';

export default function PortfolioOverview() {
  const { totalValue, cash, invested, gainLoss, gainLossPct, dayPL, dayPLPct } = portfolioData;

  return (
    <div className="glass-flat animate-in" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <PieChart size={16} style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Portfolio</span>
        <span className="pulse-dot" style={{ marginLeft: 'auto' }} />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
          ${totalValue.toLocaleString()}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <span className={dayPL >= 0 ? 'profit' : 'loss'} style={{ fontSize: '13px', fontWeight: 600 }}>
            {dayPL >= 0 ? '+' : ''}{dayPL >= 0 ? '+$' : '-$'}{Math.abs(dayPL)} today
          </span>
          <span className={gainLossPct >= 0 ? 'profit' : 'loss'} style={{ fontSize: '13px', fontWeight: 600 }}>
            {gainLossPct >= 0 ? '+' : ''}{gainLossPct}% total
          </span>
        </div>
      </div>

      <div className="glass-inner" style={{ padding: '12px', marginBottom: '14px' }}>
        {[
          { label: 'Total Value', value: `$${totalValue.toLocaleString()}` },
          { label: 'Cash', value: `$${cash.toLocaleString()}` },
          { label: 'Invested', value: `$${invested.toLocaleString()}` },
          { label: 'Gain/Loss', value: `+$${gainLoss.toLocaleString()} (+${gainLossPct}%)`, positive: true },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.label}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: row.positive ? 'var(--profit)' : 'var(--text-primary)' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
        Sector Allocation
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {sectorAllocation.map(s => (
          <div key={s.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.name}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: s.color }}>{s.pct}%</span>
            </div>
            <div className="sector-bar">
              <div className="sector-bar-fill" style={{ width: `${s.pct}%`, background: s.color, opacity: 0.8 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
