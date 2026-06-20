import PortfolioOverview from '../components/PortfolioOverview';
import HoldingsTable from '../components/HoldingsTable';
import CandidatesCarousel from '../components/CandidatesCarousel';
import PerformanceChart from '../components/PerformanceChart';
import { portfolioData } from '../data/mockData';
import { Bell, Settings } from 'lucide-react';

interface DashboardProps {
  onNav: (page: string) => void;
}

export default function Dashboard({ onNav }: DashboardProps) {
  const { totalValue, gainLoss, gainLossPct, dayPL, dayPLPct } = portfolioData;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px' }}>
      {/* Hero header */}
      <div className="animate-in" style={{ textAlign: 'center', padding: '32px 0 28px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
          AI-Powered Stock Intelligence
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em' }}>
            ${totalValue.toLocaleString()}
          </span>
          <span className="profit" style={{ fontSize: '22px', fontWeight: 700 }}>+{gainLossPct}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Total Gain: <span className="profit" style={{ fontWeight: 700 }}>+${gainLoss.toLocaleString()}</span></span>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)' }}>Today: <span className={dayPL >= 0 ? 'profit' : 'loss'} style={{ fontWeight: 700 }}>{dayPL >= 0 ? '+' : ''}${dayPL} ({dayPLPct}%)</span></span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="animate-in-1" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '28px', flexWrap: 'wrap' }}>
        <button className="btn-glass" onClick={() => onNav('candidates')}>🚀 Screen Stocks</button>
        <button className="btn-glass btn-ghost" onClick={() => onNav('holdings')}>📊 All Holdings</button>
        <button className="btn-glass btn-ghost" onClick={() => onNav('trades')}>📋 Trade History</button>
        <button className="btn-glass btn-ghost" onClick={() => onNav('settings')}>⚙ Risk Controls</button>
      </div>

      {/* Main 4-panel grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        <PortfolioOverview />
        <CandidatesCarousel />
        <HoldingsTable />
        <PerformanceChart />
      </div>
    </div>
  );
}
