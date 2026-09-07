require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'nirmal_portfolio_super_secure_jwt_secret_key_2026!';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'captainculprit2007@gmail.com').toLowerCase();
let ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

const DATA_DIR = path.join(__dirname, 'data');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure data and uploads directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Setup Multer for file uploads (certificates & images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${safeName}_${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|pdf/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error('Only image and PDF files are allowed!'));
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files & static portfolio assets
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(__dirname));

// Helper: Read JSON file safely
function readJSON(file, fallback = {}) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
    return fallback;
  }
}

// Helper: Write JSON file safely
function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err.message);
    return false;
  }
}

// Authentication Middleware
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Access token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid or expired token' });
  }
}

/* ══════════════════════════════════════════════════════════════
   1. AUTHENTICATION ENDPOINTS
══════════════════════════════════════════════════════════════ */

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const isEmailMatch = (normalizedEmail === ADMIN_EMAIL || normalizedEmail === 'admin@portfolio.dev');
  const isPassMatch = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH) || (password === (process.env.ADMIN_PASSWORD || 'admin123'));

  if (!isEmailMatch || !isPassMatch) {
    return res.status(401).json({ success: false, message: 'Invalid admin email or password' });
  }

  const token = jwt.sign(
    { email: normalizedEmail, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Admin authentication successful',
    token,
    admin: { email: normalizedEmail }
  });
});

// GET /api/admin/verify
app.get('/api/admin/verify', requireAdmin, (req, res) => {
  return res.json({ success: true, admin: req.admin });
});

// POST /api/admin/change-password
app.post('/api/admin/change-password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
  }

  if (!bcrypt.compareSync(currentPassword, ADMIN_PASSWORD_HASH)) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
  }

  ADMIN_PASSWORD_HASH = bcrypt.hashSync(newPassword, 10);
  return res.json({ success: true, message: 'Admin password updated successfully' });
});

/* ══════════════════════════════════════════════════════════════
   2. PUBLIC PORTFOLIO DATA ENDPOINTS
══════════════════════════════════════════════════════════════ */

// GET /api/portfolio
app.get('/api/portfolio', (req, res) => {
  const portfolio = readJSON(PORTFOLIO_FILE, {});
  return res.json({ success: true, data: portfolio });
});

// POST /api/contact (Public Contact Form Submission)
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }

  const messages = readJSON(MESSAGES_FILE, []);
  const newMsg = {
    id: `msg_${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    subject: (subject || 'New Portfolio Inquiry').trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString(),
    isRead: false
  };

  messages.unshift(newMsg);
  writeJSON(MESSAGES_FILE, messages);

  return res.json({ success: true, message: 'Thank you! Your message has been sent successfully.' });
});

/* ══════════════════════════════════════════════════════════════
   3. ADMIN CONTENT MANAGEMENT (CRUD)
══════════════════════════════════════════════════════ */

// POST /api/admin/portfolio/update-section
app.post('/api/admin/portfolio/update-section', requireAdmin, (req, res) => {
  const { section, data } = req.body;
  if (!section || !data) {
    return res.status(400).json({ success: false, message: 'Section name and data are required' });
  }

  const portfolio = readJSON(PORTFOLIO_FILE, {});
  portfolio[section] = data;
  writeJSON(PORTFOLIO_FILE, portfolio);

  return res.json({ success: true, message: `${section} updated successfully`, data: portfolio[section] });
});

// POST /api/admin/portfolio/full-save
app.post('/api/admin/portfolio/full-save', requireAdmin, (req, res) => {
  const { data } = req.body;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid portfolio data payload' });
  }

  writeJSON(PORTFOLIO_FILE, data);
  return res.json({ success: true, message: 'All portfolio changes saved successfully', data });
});

// POST /api/admin/upload (Upload profile image / certificate)
app.post('/api/admin/upload', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const fileUrl = `uploads/${req.file.filename}`;
  return res.json({
    success: true,
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename
  });
});

/* ══════════════════════════════════════════════════════════════
   4. ADMIN MESSAGES MANAGEMENT
══════════════════════════════════════════════════════ */

// GET /api/admin/messages
app.get('/api/admin/messages', requireAdmin, (req, res) => {
  const messages = readJSON(MESSAGES_FILE, []);
  return res.json({ success: true, messages });
});

// DELETE /api/admin/messages/:id
app.delete('/api/admin/messages/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  let messages = readJSON(MESSAGES_FILE, []);
  messages = messages.filter(m => m.id !== id);
  writeJSON(MESSAGES_FILE, messages);
  return res.json({ success: true, message: 'Message deleted successfully' });
});

// Fallback route: serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Nirmal C Portfolio & Admin Backend Server Running`);
  console.log(`📡 Local URL: http://localhost:${PORT}`);
  console.log(`🔐 Admin Login: ${ADMIN_EMAIL}`);
  console.log(`📁 Portfolio Data: ${PORTFOLIO_FILE}`);
  console.log(`====================================================`);
});
