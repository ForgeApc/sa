import { useState } from 'react';
import LoginPage from './Login';
import RegisterPage from './Register';
import { Zap, TrendingUp, Shield, BarChart2 } from 'lucide-react';

interface Props {
  onAuth: (token: string, email: string, portfolioSize: number | null, needsSetup: boolean) => void;
}

export default function AuthLanding({ onAuth }: Props) {
  const [mode, setMode] = useState<'landing' | 'login' | 'register'>('landing');

  if (mode === 'login') return <LoginPage onAuth={onAuth} onBack={() => setMode('landing')} />;
  if (mode === 'register') return <RegisterPage onVerified={onAuth} onBack={() => setMode('landing')} />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      {/* Logo */}
      <div className="animate-in" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, rgba(0,217,255,0.25), rgba(139,92,246,0.25))',
            border: '1px solid rgba(0,217,255,0.4)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(0,217,255,0.2)',
          }}>
            <Zap size={28} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.02em' }}>StockBot</div>
            <div style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.15em' }}>PRO</div>
          </div>
        </div>
        <div style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '360px' }}>
          AI-powered stock screening with real-time technical analysis
        </div>
      </div>

      {/* Feature grid */}
      <div className="animate-in-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '560px', width: '100%', marginBottom: '40px' }}>
        {[
          { icon: TrendingUp, label: 'Real Stock Data', desc: 'Live Yahoo Finance data' },
          { icon: BarChart2, label: 'AI Screening', desc: 'RSI · MACD · SMA signals' },
          { icon: Shield, label: 'Backtested', desc: 'Validated on real history' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="glass-flat" style={{ padding: '16px', textAlign: 'center' }}>
            <Icon size={20} style={{ color: 'var(--accent)', marginBottom: '8px' }} />
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Auth buttons */}
      <div className="animate-in-2" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '360px' }}>
        <button
          className="btn-glass"
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', fontWeight: 700 }}
          onClick={() => setMode('register')}
        >
          Create Free Account
        </button>
        <button
          className="btn-glass btn-ghost"
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
          onClick={() => setMode('login')}
        >
          Sign In
        </button>
      </div>

      <div className="animate-in-3" style={{ marginTop: '32px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '300px' }}>
        Uses real market data from Yahoo Finance. For educational purposes only. Not financial advice.
      </div>
    </div>
  );
}
