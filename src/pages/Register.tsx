import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { api, saveToken } from '../api/client';
import VerifyEmail from './VerifyEmail';

interface Props {
  onVerified: (token: string, email: string, portfolioSize: number | null, needsSetup: boolean) => void;
  onBack: () => void;
}

export default function RegisterPage({ onVerified, onBack }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 8) return setError('Password must be at least 8 characters');
    setLoading(true);
    try {
      const res = await api.register(email, password);
      setPreviewUrl(res.devPreviewUrl || null);
      setStep('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <VerifyEmail
        email={email}
        previewUrl={previewUrl}
        onVerified={onVerified}
        onBack={() => setStep('form')}
      />
    );
  }

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : /[!@#$%^&*]/.test(password) ? 4 : 3;
  const strengthColors = ['', '#EF4444', '#F59E0B', '#10B981', '#00D9FF'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <button className="btn-glass btn-ghost" style={{ marginBottom: '24px', fontSize: '12px' }} onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>

        <div className="glass-flat animate-in" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>Create Account</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Start getting AI-powered stock picks</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input-glass"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input-glass"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '36px', paddingRight: '40px' }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input-glass"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  style={{ paddingLeft: '36px', borderColor: confirm && confirm !== password ? 'rgba(239,68,68,0.5)' : undefined }}
                />
              </div>
              {confirm && confirm !== password && (
                <div style={{ fontSize: '11px', color: 'var(--loss)', marginTop: '4px' }}>Passwords don't match</div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: 'var(--loss)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-glass"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '14px', fontWeight: 700, marginTop: '4px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Sending code...' : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
