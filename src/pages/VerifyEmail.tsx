import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mail, ExternalLink } from 'lucide-react';
import { api, saveToken } from '../api/client';

interface Props {
  email: string;
  previewUrl: string | null;
  onVerified: (token: string, email: string, portfolioSize: number | null, needsSetup: boolean) => void;
  onBack: () => void;
}

export default function VerifyEmail({ email, previewUrl, onVerified, onBack }: Props) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  const code = digits.join('');

  const handleDigit = (i: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
    if (next.every(d => d !== '') && next.join('').length === 6) {
      submitCode(next.join(''));
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setDigits(text.split(''));
      submitCode(text);
    }
  };

  const submitCode = async (c: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.verify(email, c);
      saveToken(res.token);
      localStorage.setItem('sb_email', email);
      onVerified(res.token, email, null, res.needsPortfolioSetup);
    } catch (err: any) {
      setError(err.message);
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => inputs.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <button className="btn-glass btn-ghost" style={{ marginBottom: '24px', fontSize: '12px' }} onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>

        <div className="glass-flat animate-in" style={{ padding: '32px', textAlign: 'center' }}>
          {/* Icon */}
          <div style={{ width: '64px', height: '64px', background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.3)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 30px rgba(0,217,255,0.15)' }}>
            <Mail size={28} style={{ color: 'var(--accent)' }} />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>Check Your Email</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            We sent a 6-digit code to
          </p>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)', marginBottom: '24px' }}>{email}</p>

          {/* Dev preview link (Ethereal) */}
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px', fontSize: '12px', color: 'var(--accent)', background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.2)', borderRadius: '8px', padding: '8px 12px', textDecoration: 'none' }}
            >
              <ExternalLink size={12} />
              <span>Click to preview email (Ethereal dev mode)</span>
            </a>
          )}
          {!previewUrl && (
            <div style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--profit)', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '8px 12px' }}>
              ✓ Email sent — check your inbox and spam folder
            </div>
          )}

          {/* Digit inputs */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }} onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{
                  width: '48px', height: '56px',
                  textAlign: 'center',
                  fontSize: '22px', fontWeight: 800,
                  background: 'rgba(10,14,20,0.6)',
                  border: `1px solid ${d ? 'rgba(0,217,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '10px',
                  color: 'var(--accent)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  caretColor: 'transparent',
                  boxShadow: d ? '0 0 12px rgba(0,217,255,0.2)' : 'none',
                }}
              />
            ))}
          </div>

          {loading && (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Verifying...
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: 'var(--loss)', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button
            className="btn-glass"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', fontWeight: 700 }}
            onClick={() => submitCode(code)}
            disabled={code.length !== 6 || loading}
          >
            Verify Code →
          </button>

          <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Didn't receive it?{' '}
            <button
              style={{ background: 'none', border: 'none', color: resent ? 'var(--profit)' : 'var(--accent)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              onClick={() => { setResent(true); }}
            >
              {resent ? '✓ Sent' : 'Resend code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
