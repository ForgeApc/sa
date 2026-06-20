import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendVerificationEmail, getEmailProvider } from '../services/email.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, '../../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'stockbot_dev_secret_2026';

function readDB() {
  if (!fs.existsSync(DB_FILE)) return { users: [], codes: [] };
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch { return { users: [], codes: [] }; }
}

function writeDB(data) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    if (!/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ error: 'Invalid email address' });

    const db = readDB();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing?.verified) return res.status(409).json({ error: 'An account with this email already exists' });

    const code = generateCode();
    const expires = Date.now() + 15 * 60 * 1000;
    db.codes = db.codes.filter(c => c.email !== email.toLowerCase());
    db.codes.push({ email: email.toLowerCase(), code, expires });

    db.users = db.users.filter(u => u.email !== email.toLowerCase());
    db.users.push({
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 10),
      verified: false,
      portfolioSize: null,
      createdAt: new Date().toISOString(),
    });
    writeDB(db);

    const { previewUrl } = await sendVerificationEmail(email, code);
    res.json({ success: true, message: 'Verification code sent', devPreviewUrl: previewUrl });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/verify
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code required' });

    const db = readDB();
    const record = db.codes.find(c => c.email === email.toLowerCase() && c.code === String(code).trim());
    if (!record) return res.status(400).json({ error: 'Invalid verification code' });
    if (Date.now() > record.expires) return res.status(400).json({ error: 'Code expired — please register again' });

    const user = db.users.find(u => u.email === email.toLowerCase());
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.verified = true;
    db.codes = db.codes.filter(c => c.email !== email.toLowerCase());
    writeDB(db);

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, needsPortfolioSetup: !user.portfolioSize });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'No account found with this email' });
    if (!user.verified) return res.status(401).json({ error: 'Please verify your email first' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Incorrect password' });

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, needsPortfolioSetup: !user.portfolioSize, portfolioSize: user.portfolioSize });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/portfolio-setup
router.post('/portfolio-setup', authMiddleware, async (req, res) => {
  try {
    const { portfolioSize } = req.body;
    if (!portfolioSize || portfolioSize < 100) return res.status(400).json({ error: 'Portfolio must be at least $100' });

    const db = readDB();
    const user = db.users.find(u => u.email === req.user.email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.portfolioSize = Number(portfolioSize);
    writeDB(db);

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, portfolioSize: user.portfolioSize });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save portfolio' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.email === req.user.email);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ email: user.email, portfolioSize: user.portfolioSize, verified: user.verified });
});

// GET /api/auth/email-provider — tells the frontend which provider is active
router.get('/email-provider', (req, res) => {
  res.json({ provider: getEmailProvider() });
});

export default router;
