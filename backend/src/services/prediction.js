import yahooFinance from 'yahoo-finance2';

const UNIVERSE = [
  'AAPL','MSFT','NVDA','GOOGL','META','AMZN','TSLA','AVGO','AMD','ORCL',
  'CRM','NFLX','QCOM','LLY','UNH','JNJ','ABBV','MRK','TMO','PFE',
  'JPM','BAC','V','MA','GS',
  'HD','COST','WMT','MCD','PG','KO','PEP',
  'XOM','CVX','CAT',
];

// ── Technical indicators ─────────────────────────────────────────────────────

function sma(arr, period) {
  if (arr.length < period) return null;
  return arr.slice(-period).reduce((a, b) => a + b, 0) / period;
}

function ema(arr, period) {
  if (arr.length < period) return null;
  const k = 2 / (period + 1);
  let val = arr.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < arr.length; i++) val = arr[i] * k + val * (1 - k);
  return val;
}

function rsi(closes, period = 14) {
  if (closes.length < period + 1) return null;
  const deltas = closes.slice(1).map((c, i) => c - closes[i]);
  let avgG = deltas.slice(0, period).map(d => Math.max(d, 0)).reduce((a, b) => a + b) / period;
  let avgL = deltas.slice(0, period).map(d => Math.max(-d, 0)).reduce((a, b) => a + b) / period;
  for (let i = period; i < deltas.length; i++) {
    avgG = (avgG * (period - 1) + Math.max(deltas[i], 0)) / period;
    avgL = (avgL * (period - 1) + Math.max(-deltas[i], 0)) / period;
  }
  if (avgL === 0) return 100;
  return 100 - 100 / (1 + avgG / avgL);
}

function macdSignal(closes) {
  if (closes.length < 35) return null;
  const macdSeries = [];
  for (let i = 26; i <= closes.length; i++) {
    const e12 = ema(closes.slice(0, i), 12);
    const e26 = ema(closes.slice(0, i), 26);
    if (e12 != null && e26 != null) macdSeries.push(e12 - e26);
  }
  if (macdSeries.length < 9) return null;
  const line = macdSeries[macdSeries.length - 1];
  const sig = ema(macdSeries, 9);
  return { line, signal: sig, histogram: sig != null ? line - sig : 0 };
}

// ── Scoring ──────────────────────────────────────────────────────────────────

function scoreStock(quotes) {
  if (!quotes || quotes.length < 60) return null;
  const closes = quotes.map(q => q.close).filter(Boolean);
  if (closes.length < 60) return null;

  const current = closes[closes.length - 1];
  const volumes = quotes.map(q => q.volume).filter(Boolean);
  const sma50  = sma(closes, 50);
  const sma200 = closes.length >= 200 ? sma(closes, 200) : sma(closes, closes.length);
  const rsiVal = rsi(closes);
  const macd   = macdSignal(closes);
  const high52 = Math.max(...closes.slice(-Math.min(252, closes.length)));
  const low52  = Math.min(...closes.slice(-Math.min(252, closes.length)));
  const weekAgo  = closes[closes.length - 5]  || current;
  const monthAgo = closes[closes.length - 22] || current;
  const qtrAgo   = closes[closes.length - 63] || current;
  const volAvg20 = volumes.length >= 20 ? volumes.slice(-20).reduce((a, b) => a + b, 0) / 20 : null;
  const volRatio = (volAvg20 && volumes.length) ? (volumes[volumes.length - 1] || volAvg20) / volAvg20 : 1;
  const pos52w   = high52 > low52 ? (current - low52) / (high52 - low52) : 0.5;

  let score = 0;
  const breakdown = {};

  // RSI (0–22)
  if (rsiVal != null) {
    if (rsiVal >= 40 && rsiVal <= 65)      { score += 22; breakdown.rsi = `RSI ${Math.round(rsiVal)}: bullish zone`; }
    else if (rsiVal >= 30 && rsiVal < 40)  { score += 14; breakdown.rsi = `RSI ${Math.round(rsiVal)}: recovering oversold`; }
    else if (rsiVal > 65 && rsiVal <= 75)  { score += 10; breakdown.rsi = `RSI ${Math.round(rsiVal)}: slightly overbought`; }
    else                                   { score += 4;  breakdown.rsi = `RSI ${Math.round(rsiVal)}: unfavorable`; }
  }

  // MACD (0–22)
  if (macd) {
    if (macd.line > 0 && macd.histogram > 0)  { score += 22; breakdown.macd = 'MACD bullish crossover'; }
    else if (macd.line > 0)                   { score += 13; breakdown.macd = 'MACD above zero'; }
    else if (macd.histogram > 0)              { score += 10; breakdown.macd = 'MACD momentum improving'; }
    else                                      { score += 2;  breakdown.macd = 'MACD bearish'; }
  }

  // SMA200 (0–18)
  if (sma200) {
    if (current > sma200 * 1.02) { score += 18; breakdown.trend = `Above 200-SMA ($${sma200.toFixed(0)}) — strong uptrend`; }
    else if (current > sma200)   { score += 12; breakdown.trend = `Above 200-SMA ($${sma200.toFixed(0)})`; }
    else                         { score += 2;  breakdown.trend = 'Below 200-SMA — downtrend'; }
  }

  // SMA50 (0–12)
  if (sma50) {
    if (current > sma50) { score += 12; breakdown.sma50 = `Above 50-SMA ($${sma50.toFixed(0)})`; }
    else                 { score += 2;  breakdown.sma50 = `Below 50-SMA ($${sma50.toFixed(0)})`; }
  }

  // Volume (0–12)
  if (volRatio > 1.5)      { score += 12; breakdown.volume = `Volume ${volRatio.toFixed(1)}× avg — high conviction`; }
  else if (volRatio > 1.1) { score += 8;  breakdown.volume = `Volume ${volRatio.toFixed(1)}× avg`; }
  else                     { score += 4;  breakdown.volume = 'Normal volume'; }

  // 52w range (0–8)
  if (pos52w >= 0.2 && pos52w <= 0.65)       { score += 8; breakdown.position = `52w position: ${Math.round(pos52w*100)}% — ideal`; }
  else if (pos52w > 0.65 && pos52w <= 0.85)  { score += 4; breakdown.position = `52w position: ${Math.round(pos52w*100)}% — elevated`; }
  else                                        { score += 2; breakdown.position = `52w position: ${Math.round(pos52w*100)}%`; }

  // Momentum (0–6)
  const ret1m = (current - monthAgo) / monthAgo;
  const ret1w = (current - weekAgo) / weekAgo;
  if (ret1m > 0 && ret1w > 0)  { score += 6; breakdown.momentum = `+${(ret1m*100).toFixed(1)}% month, +${(ret1w*100).toFixed(1)}% week`; }
  else if (ret1m > 0)          { score += 3; breakdown.momentum = `+${(ret1m*100).toFixed(1)}% month`; }
  else                         { score += 0; breakdown.momentum = `${(ret1m*100).toFixed(1)}% month — negative`; }

  let predictedReturn;
  if (score >= 85)      predictedReturn = 18 + (score - 85) * 0.5;
  else if (score >= 75) predictedReturn = 14 + (score - 75) * 0.4;
  else if (score >= 65) predictedReturn = 11 + (score - 65) * 0.3;
  else if (score >= 55) predictedReturn = 8  + (score - 55) * 0.3;
  else                  predictedReturn = 5;
  predictedReturn = Math.min(predictedReturn, 38);

  return {
    score: Math.round(score), confidence: Math.round(score),
    predictedReturn: Math.round(predictedReturn * 10) / 10,
    rsi: rsiVal ? Math.round(rsiVal) : null,
    sma50, sma200, current,
    ret1w: Math.round(ret1w * 1000) / 10,
    ret1m: Math.round(ret1m * 1000) / 10,
    retQtr: Math.round(((current - qtrAgo) / qtrAgo) * 1000) / 10,
    volRatio: Math.round(volRatio * 100) / 100,
    pos52w: Math.round(pos52w * 100), high52, low52, breakdown,
  };
}

// ── Data fetching ────────────────────────────────────────────────────────────

const stockCache = {};
const cacheTime = {};

async function fetchQuotes(symbol, months = 12) {
  const key = `${symbol}_${months}`;
  if (stockCache[key] && Date.now() - (cacheTime[key] || 0) < 3600000) return stockCache[key];
  const period1 = new Date();
  period1.setMonth(period1.getMonth() - months);
  try {
    const data = await yahooFinance.historical(symbol, { period1: period1.toISOString().split('T')[0], interval: '1d' });
    stockCache[key] = data;
    cacheTime[key] = Date.now();
    return data;
  } catch (err) {
    console.warn(`⚠ ${symbol}:`, err.message?.slice(0, 60));
    return null;
  }
}

async function fetchQuote(symbol) {
  try { return await yahooFinance.quote(symbol); } catch { return null; }
}

// ── Top picks ────────────────────────────────────────────────────────────────

export async function getTopPicks(portfolioSize = 10000) {
  console.log(`🔍 Screening ${UNIVERSE.length} stocks for $${portfolioSize.toLocaleString()} portfolio...`);
  const results = [];

  for (let i = 0; i < UNIVERSE.length; i += 6) {
    const batch = UNIVERSE.slice(i, i + 6);
    const batchResults = await Promise.all(batch.map(async (symbol) => {
      const [quotes, quote] = await Promise.all([fetchQuotes(symbol, 12), fetchQuote(symbol)]);
      if (!quotes || !quote) return null;

      const analysis = scoreStock(quotes);
      if (!analysis || analysis.confidence < 50) return null;

      const price = quote.regularMarketPrice || analysis.current;
      const sharesToBuy = Math.max(1, Math.floor((portfolioSize * 0.05 * analysis.confidence / 100) / price));
      const allocation = Math.round(sharesToBuy * price * 100) / 100;

      const signals = [];
      if (analysis.sma200 && analysis.current > analysis.sma200) signals.push({ label: analysis.breakdown.trend, type: 'positive' });
      if (analysis.ret1m > 0) signals.push({ label: `+${analysis.ret1m}% this month`, type: 'positive' });
      else signals.push({ label: `${analysis.ret1m}% this month`, type: 'warning' });
      if (analysis.volRatio > 1.3) signals.push({ label: analysis.breakdown.volume, type: 'positive' });
      if (analysis.rsi && analysis.rsi >= 40 && analysis.rsi <= 65) signals.push({ label: analysis.breakdown.rsi, type: 'positive' });
      else if (analysis.rsi) signals.push({ label: analysis.breakdown.rsi, type: 'warning' });
      signals.push({ label: analysis.breakdown.position, type: analysis.pos52w < 70 ? 'positive' : 'warning' });

      return {
        ticker: symbol,
        name: quote.longName || quote.shortName || symbol,
        price: Math.round(price * 100) / 100,
        confidence: analysis.confidence,
        predictedReturn: analysis.predictedReturn,
        rsi: analysis.rsi,
        ret1w: analysis.ret1w, ret1m: analysis.ret1m, retQtr: analysis.retQtr,
        high52: Math.round(analysis.high52 * 100) / 100,
        low52: Math.round(analysis.low52 * 100) / 100,
        pos52w: analysis.pos52w,
        volRatio: analysis.volRatio,
        marketCap: quote.marketCap ? `$${(quote.marketCap / 1e9).toFixed(1)}B` : 'N/A',
        sector: quote.sector || 'N/A',
        pe: quote.trailingPE ? Math.round(quote.trailingPE * 10) / 10 : null,
        dividendYield: quote.dividendYield ? Math.round(quote.dividendYield * 1000) / 10 : 0,
        signals,
        signalScore: `${signals.filter(s => s.type === 'positive').length}/5`,
        breakdown: analysis.breakdown,
        sharesToBuy,
        allocation,
        predictedGain: Math.round(allocation * analysis.predictedReturn / 100 * 100) / 100,
        sparkline: quotes.slice(-8).map(q => Math.round((q.close || 0) * 100) / 100),
        catalysts: [],
        risks: [],
        current: price,
      };
    }));
    results.push(...batchResults.filter(Boolean));
    process.stdout.write('.');
  }
  console.log(`\n✅ ${results.length} candidates. Top: ${results.sort((a,b) => b.confidence-a.confidence).slice(0,3).map(r=>r.ticker).join(', ')}`);
  return results.sort((a, b) => b.confidence - a.confidence);
}

// ── Backtest ─────────────────────────────────────────────────────────────────

export async function runBacktest(lookbackMonths = 6) {
  console.log(`📊 Backtesting ${UNIVERSE.length} stocks over ${lookbackMonths}m...`);
  const results = [];

  for (let i = 0; i < UNIVERSE.length; i += 6) {
    const batch = UNIVERSE.slice(i, i + 6);
    const batchResults = await Promise.all(batch.map(async (symbol) => {
      const quotes = await fetchQuotes(symbol, lookbackMonths + 6);
      if (!quotes || quotes.length < 120) return null;
      const split = Math.floor(quotes.length / 2);
      const past   = quotes.slice(0, split);
      const future = quotes.slice(split);
      const signal = scoreStock(past);
      if (!signal || signal.confidence < 55) return null;
      const entry = past[past.length - 1]?.close;
      const exit  = future[future.length - 1]?.close;
      if (!entry || !exit) return null;
      const actual = ((exit - entry) / entry) * 100;
      return {
        ticker: symbol,
        confidence: signal.confidence,
        predicted: Math.round(signal.predictedReturn * 10) / 10,
        actual: Math.round(actual * 10) / 10,
        entryPrice: Math.round(entry * 100) / 100,
        exitPrice: Math.round(exit * 100) / 100,
        win: actual > 0,
      };
    }));
    results.push(...batchResults.filter(Boolean));
  }

  if (!results.length) return null;

  const wins   = results.filter(r => r.win);
  const losses = results.filter(r => !r.win);
  const avgActual    = results.reduce((a, b) => a + b.actual, 0)    / results.length;
  const avgPredicted = results.reduce((a, b) => a + b.predicted, 0) / results.length;
  const avgWin  = wins.length   ? wins.reduce((a, b) => a + b.actual, 0)   / wins.length   : 0;
  const avgLoss = losses.length ? losses.reduce((a, b) => a + b.actual, 0) / losses.length : 0;
  const best  = results.reduce((a, b) => a.actual > b.actual ? a : b);
  const worst = results.reduce((a, b) => a.actual < b.actual ? a : b);
  const profitFactor = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 9.99;

  console.log(`✅ Backtest: ${Math.round(wins.length/results.length*100)}% win rate, avg +${avgActual.toFixed(1)}%`);

  return {
    period: `${lookbackMonths} months`,
    stocksTested: results.length,
    winRate: Math.round(wins.length / results.length * 100),
    avgPredicted: Math.round(avgPredicted * 10) / 10,
    avgActual: Math.round(avgActual * 10) / 10,
    avgWin: Math.round(avgWin * 10) / 10,
    avgLoss: Math.round(avgLoss * 10) / 10,
    profitFactor: Math.round(profitFactor * 100) / 100,
    bestPick:  { ticker: best.ticker,  actual: best.actual },
    worstPick: { ticker: worst.ticker, actual: worst.actual },
    results: results.sort((a, b) => b.actual - a.actual),
  };
}

export { UNIVERSE };
