import { useState } from 'react';
import { riskSettings } from '../data/mockData';
import { Settings2, AlertTriangle } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({ ...riskSettings });
  const [saved, setSaved] = useState(false);
  const [blacklistInput, setBlacklistInput] = useState('');

  const update = (key: string, value: any) => setSettings(s => ({ ...s, [key]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addBlacklist = () => {
    if (blacklistInput.trim()) {
      update('blacklist', [...settings.blacklist, blacklistInput.trim().toUpperCase()]);
      setBlacklistInput('');
    }
  };

  const removeBlacklist = (ticker: string) => update('blacklist', settings.blacklist.filter(t => t !== ticker));

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 20px 40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>Settings & Risk Controls</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Configure your risk parameters and trading automation</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>

        {/* Risk Parameters */}
        <div className="glass-flat" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Risk Parameters
          </div>

          {[
            { label: 'Max Position Size', key: 'maxPositionSize', min: 1, max: 10, step: 0.5, unit: '%' },
            { label: 'Max Sector Allocation', key: 'maxSectorAllocation', min: 20, max: 50, step: 5, unit: '%' },
            { label: 'Daily Loss Limit', key: 'dailyLossLimit', min: -10, max: -2, step: 1, unit: '%' },
            { label: 'Min Confidence Threshold', key: 'minConfidence', min: 55, max: 90, step: 5, unit: '%' },
            { label: 'Max Positions', key: 'maxPositions', min: 5, max: 50, step: 1, unit: '' },
          ].map(({ label, key, min, max, step, unit }) => (
            <div key={key} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>
                  {(settings as any)[key]}{unit}
                </span>
              </div>
              <input
                type="range" min={min} max={max} step={step}
                value={(settings as any)[key]}
                onChange={e => update(key, Number(e.target.value))}
              />
            </div>
          ))}

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Volatility Tolerance</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['Low', 'Medium', 'High'].map(v => (
                <button key={v} className={`btn-glass ${settings.volatilityTolerance === v ? '' : 'btn-ghost'}`} style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }} onClick={() => update('volatilityTolerance', v)}>{v}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Market Cap Preference</div>
            <select className="input-glass" value={settings.marketCapPref} onChange={e => update('marketCapPref', e.target.value)}>
              {['Any', 'Large ($10B+)', 'Mid ($2B-$10B)', 'Small (<$2B)'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Trading Strategy */}
        <div className="glass-flat" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Trading Strategy
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Strategy Mode</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { key: 'Growth', desc: 'Aggressive, targets small/mid caps with high upside' },
                { key: 'Value', desc: 'Conservative, undervalued stocks with margin of safety' },
                { key: 'Dividend', desc: 'Income-focused, high-yield dividend payers' },
              ].map(({ key, desc }) => (
                <button
                  key={key}
                  onClick={() => update('strategyMode', key)}
                  style={{
                    background: settings.strategyMode === key ? 'rgba(0,217,255,0.12)' : 'rgba(10,14,20,0.5)',
                    border: `1px solid ${settings.strategyMode === key ? 'rgba(0,217,255,0.4)' : 'var(--border)'}`,
                    borderRadius: '8px', padding: '10px 14px',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: settings.strategyMode === key ? 'var(--accent)' : 'var(--text-primary)' }}>{key}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Rebalance Frequency</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['Weekly', 'Monthly', 'Quarterly'].map(v => (
                <button key={v} className={`btn-glass ${settings.rebalanceFrequency === v ? '' : 'btn-ghost'}`} style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }} onClick={() => update('rebalanceFrequency', v)}>{v}</button>
              ))}
            </div>
          </div>

          {/* Blacklist */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Stock Blacklist</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {settings.blacklist.map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', color: '#EF4444' }}>
                  {t}
                  <span style={{ cursor: 'pointer', marginLeft: '2px', fontWeight: 700 }} onClick={() => removeBlacklist(t)}>×</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input className="input-glass" placeholder="Add ticker..." value={blacklistInput} onChange={e => setBlacklistInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addBlacklist()} style={{ flex: 1 }} />
              <button className="btn-glass btn-danger" onClick={addBlacklist}>Add</button>
            </div>
          </div>
        </div>

        {/* Automation */}
        <div className="glass-flat" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Trading Automation
          </div>

          {[
            { label: 'Auto-Buy (high confidence signals)', key: 'autoBuy' },
            { label: 'Auto-Sell (profit target hit)', key: 'autoSellProfit' },
            { label: 'Auto-Sell (stop loss triggered)', key: 'autoSellStopLoss' },
          ].map(({ label, key }) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
              <label className="toggle">
                <input type="checkbox" checked={(settings as any)[key]} onChange={e => update(key, e.target.checked)} />
                <div className="toggle-track" />
                <div className="toggle-thumb" />
              </label>
            </div>
          ))}

          {/* Bot status toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '13px', color: settings.paused ? 'var(--loss)' : 'var(--profit)', fontWeight: 600 }}>
                {settings.paused ? '⏸ Bot Paused' : '▶ Bot Running'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {settings.paused ? 'No trades will execute' : 'Actively monitoring market'}
              </div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={!settings.paused} onChange={e => update('paused', !e.target.checked)} />
              <div className="toggle-track" />
              <div className="toggle-thumb" />
            </label>
          </div>

          {/* Danger zone */}
          <div className="glass-inner" style={{ padding: '14px', borderColor: 'rgba(239,68,68,0.2)' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '10px' }}>
              <AlertTriangle size={14} style={{ color: 'var(--loss)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--loss)' }}>DANGER ZONE</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="btn-glass btn-danger" style={{ fontSize: '12px' }}>⏸ Pause Bot</button>
              <button className="btn-glass btn-danger" style={{ fontSize: '12px' }}>💀 Liquidate All</button>
              <button className="btn-glass btn-ghost" style={{ fontSize: '12px' }}>↺ Reset Defaults</button>
            </div>
          </div>
        </div>

      </div>

      {/* Save */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
        <button className="btn-glass btn-ghost">Cancel</button>
        <button className="btn-glass btn-profit" onClick={handleSave} style={{ minWidth: '100px', justifyContent: 'center' }}>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
