import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import stockRoutes from './routes/stocks.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 StockBot API → http://localhost:${PORT}`);
  console.log('   POST /api/auth/register  · /api/auth/verify  · /api/auth/login');
  console.log('   GET  /api/stocks/top-picks  · /api/stocks/backtest\n');
});
