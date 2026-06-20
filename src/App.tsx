import { useState, useEffect } from 'react';
import './index.css';
import './App.css';
import AuthLanding from './pages/AuthLanding';
import PortfolioSetup from './pages/PortfolioSetup';
import Dashboard from './pages/Dashboard';
import Holdings from './pages/Holdings';
import CandidatesReal from './pages/CandidatesReal';
import TradeHistory from './pages/TradeHistory';
import Settings from './pages/Settings';
import { LayoutDashboard, TrendingUp, Rocket, BookOpen, Settings2, Zap, LogOut } from 'lucide-react';
import { clearToken } from './api/client';
import LiveTicker from './components/LiveTicker';
import { useStretchyGlass } from './hooks/useStretchyGlass';

type Page = 'dashboard' | 'holdings' | 'candidates' | 'trades' | 'settings';
type AuthStep = 'landing' | 'portfolio-setup' | 'app';

const navItems: { id: Page; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'holdings', label: 'Holdings', icon: TrendingUp },
  { id: 'candidates', label: 'Screening', icon: Rocket },
  { id: 'trades', label: 'Trades', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings2 },
];

export default function App() {
  useStretchyGlass();
  const [authStep, setAuthStep] = useState<AuthStep>('landing');
  const [email, setEmail] = useState('');
  const [portfolioSize, setPortfolioSize] = useState<number>(10000);
  const [page, setPage] = useState<Page>('dashboard');

  // Check existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('sb_token');
    const storedEmail = localStorage.getItem('sb_email');
    const storedPortfolio = localStorage.getItem('sb_portfolio');
    if (token && storedEmail && storedPortfolio) {
      setEmail(storedEmail);
      setPortfolioSize(Number(storedPortfolio));
      setAuthStep('app');
    }
  }, []);

  const handleAuth = (token: string, userEmail: string, ps: number | null, needsSetup: boolean) => {
    setEmail(userEmail);
    if (ps) {
      setPortfolioSize(ps);
      localStorage.setItem('sb_portfolio', String(ps));
    }
    if (needsSetup || !ps) {
      setAuthStep('portfolio-setup');
    } else {
      setAuthStep('app');
    }
  };

  const handlePortfolioComplete = (ps: number) => {
    setPortfolioSize(ps);
    localStorage.setItem('sb_portfolio', String(ps));
    setAuthStep('app');
  };

  const handleLogout = () => {
    clearToken();
    setAuthStep('landing');
    setEmail('');
    setPortfolioSize(10000);
    setPage('dashboard');
  };

  // ── Auth screens ─────────────────────────────────────────────────────────
  if (authStep === 'landing') {
    return <AuthLanding onAuth={handleAuth} />;
  }

  if (authStep === 'portfolio-setup') {
    return <PortfolioSetup email={email} onComplete={handlePortfolioComplete} />;
  }

  // ── Main app ─────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav style={{
        width: '200px', flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
        padding: '20px 12px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(40px) saturate(160%)',
        WebkitBackdropFilter: 'blur(40px) saturate(160%)',
        borderRight: '1px solid rgba(255,255,255,0.10)',
        zIndex: 50,
      }}>
        <div style={{ padding: '8px 12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,rgba(0,217,255,0.3),rgba(139,92,246,0.3))', border: '1px solid rgba(0,217,255,0.4)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0,217,255,0.15)' }}>
              <Zap size={16} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>StockBot</div>
              <div style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.05em' }}>PRO</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '6px 12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
            <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
            <span style={{ fontSize: '11px', color: 'var(--profit)', fontWeight: 600 }}>Markets Open</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = page === id;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px',
                  border: active ? '1px solid rgba(0,217,255,0.3)' : '1px solid transparent',
                  background: active ? 'rgba(0,217,255,0.1)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer', fontSize: '13px',
                  fontFamily: 'Inter, sans-serif', fontWeight: active ? 600 : 400,
                  transition: 'all 0.2s ease', textAlign: 'left',
                  boxShadow: active ? '0 0 12px rgba(0,217,255,0.1)' : 'none',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; } }}
              >
                <Icon size={16} />
                {label}
                {id === 'candidates' && <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, background: 'rgba(0,217,255,0.2)', color: 'var(--accent)', padding: '1px 7px', borderRadius: '10px' }}>LIVE</span>}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Portfolio</div>
          <div style={{ fontSize: '16px', fontWeight: 800 }}>${portfolioSize.toLocaleString()}</div>
          <button className="btn-glass btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', fontSize: '11px', padding: '6px' }} onClick={handleLogout}>
            <LogOut size={12} /> Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <LiveTicker />
        <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(6,8,16,0.85)', backdropFilter: 'blur(40px) saturate(160%)', borderBottom: '1px solid var(--border)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>{navItems.find(n => n.id === page)?.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Portfolio: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>${portfolioSize.toLocaleString()}</span>
            </div>
            <button className="btn-glass btn-ghost" style={{ fontSize: '11px', padding: '5px 12px' }} onClick={() => setAuthStep('portfolio-setup')}>
              Change Portfolio
            </button>
          </div>
        </div>

        {page === 'dashboard'   && <Dashboard onNav={setPage} />}
        {page === 'holdings'    && <Holdings />}
        {page === 'candidates'  && <CandidatesReal portfolioSize={portfolioSize} />}
        {page === 'trades'      && <TradeHistory />}
        {page === 'settings'    && <Settings />}
      </main>
    </div>
  );
}
