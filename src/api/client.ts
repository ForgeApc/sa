const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api';

function getToken() {
  return localStorage.getItem('sb_token');
}

async function request(path: string, opts: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  register: (email: string, password: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),

  verify: (email: string, code: string) =>
    request('/auth/verify', { method: 'POST', body: JSON.stringify({ email, code }) }),

  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  portfolioSetup: (portfolioSize: number) =>
    request('/auth/portfolio-setup', { method: 'POST', body: JSON.stringify({ portfolioSize }) }),

  me: () => request('/auth/me'),

  topPicks: (portfolio: number) => request(`/stocks/top-picks?portfolio=${portfolio}`),

  backtest: (months = 6) => request(`/stocks/backtest?months=${months}`),

  status: () => request('/stocks/status'),

  livePrices: () => request('/stocks/live-prices'),
};

export function saveToken(token: string) {
  localStorage.setItem('sb_token', token);
}

export function clearToken() {
  localStorage.removeItem('sb_token');
  localStorage.removeItem('sb_portfolio');
  localStorage.removeItem('sb_email');
}

export function getStoredPortfolio() {
  return Number(localStorage.getItem('sb_portfolio')) || null;
}
