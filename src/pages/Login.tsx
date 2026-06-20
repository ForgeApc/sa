import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { api, saveToken } from '../api/client';

interface Props {
  onAuth: (token: string, email: string, portfolioSize: number | null, needsSetup: boolean) => void;
  onBack: () => void;
}

export default function LoginPage({ onAuth, onBack }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      saveToken(res.token);
      localStorage.setItem('sb_email', email);
      if (res.portfolioSize) localStorage.setItem('sb_portfolio', String(res.portfolioSize));
      onAuth(res.token, email, res.portfolioSize || null, res.needsPortfolioSetup);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <button className="btn-glass btn-ghost" style={{ marginBottom: '24px', fontSize: '12px' }} onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>

        <div className="glass-flat animate-in" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>Welcome Back</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Sign in to your StockBot Pro account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input-glass" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ paddingLeft: '36px' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input-glass" type={showPw ? 'text' : 'password'} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingLeft: '36px', paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: 'var(--loss)' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-glass" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '14px', fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
