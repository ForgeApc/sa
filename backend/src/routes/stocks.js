import { Router } from 'express';
import yahooFinance from 'yahoo-finance2';
import authMiddleware from '../middleware/auth.js';
import { getTopPicks, runBacktest } from '../services/prediction.js';

const TICKER_LIST = ['SPY','QQQ','AAPL','MSFT','NVDA','GOOGL','META','TSLA','AMZN','AVGO','AMD','JPM','V','COST'];
let liveCache = null, liveCacheTime = 0;

const router = Router();
let picksCache = null, picksCacheTime = 0;
let backtestCache = null, backtestCacheTime = 0;

router.get('/top-picks', authMiddleware, async (req, res) => {
  try {
    const portfolioSize = Number(req.query.portfolio) || 10000;
    const now = Date.now();
    if (!picksCache || now - picksCacheTime > 3600000) {
      picksCache = await getTopPicks(portfolioSize);
      picksCacheTime = now;
    } else {
      picksCache = picksCache.map(s => {
        const sharesToBuy = Math.max(1, Math.floor((portfolioSize * 0.05 * s.confidence / 100) / s.price));
        const allocation  = Math.round(sharesToBuy * s.price * 100) / 100;
        return { ...s, sharesToBuy, allocation, predictedGain: Math.round(allocation * s.predictedReturn / 100 * 100) / 100 };
      });
    }
    res.json({ success: true, stocks: picksCache, lastUpdated: new Date(picksCacheTime).toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stock data. Yahoo Finance may be temporarily unavailable.' });
  }
});

router.get('/backtest', authMiddleware, async (req, res) => {
  try {
    const months = Number(req.query.months) || 6;
    const now = Date.now();
    if (!backtestCache || now - backtestCacheTime > 3600000) {
      backtestCache = await runBacktest(months);
      backtestCacheTime = now;
    }
    res.json({ success: true, backtest: backtestCache });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Backtest failed' });
  }
});

router.get('/status', authMiddleware, (req, res) => {
  res.json({ cacheReady: !!picksCache, lastUpdated: picksCacheTime ? new Date(picksCacheTime).toISOString() : null });
});

// Public endpoint — no auth needed, 5-min cache
router.get('/live-prices', async (req, res) => {
  try {
    const now = Date.now();
    if (liveCache && now - liveCacheTime < 300000) return res.json({ prices: liveCache });

    const results = await Promise.allSettled(
      TICKER_LIST.map(t => yahooFinance.quote(t, {
        fields: ['regularMarketPrice','regularMarketChange','regularMarketChangePercent','shortName']
      }))
    );

    liveCache = results
      .map((r, i) => r.status === 'fulfilled' && r.value ? {
        ticker: TICKER_LIST[i],
        name: r.value.shortName || TICKER_LIST[i],
        price: r.value.regularMarketPrice ?? 0,
        change: r.value.regularMarketChange ?? 0,
        changePct: r.value.regularMarketChangePercent ?? 0,
      } : null)
      .filter(Boolean);

    liveCacheTime = now;
    res.json({ prices: liveCache });
  } catch (err) {
    console.error('Live prices error:', err);
    res.status(500).json({ error: 'Failed to fetch live prices' });
  }
});

export default router;
