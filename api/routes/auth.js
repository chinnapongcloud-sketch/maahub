const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database');
const { generateToken } = require('../auth');

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, password, name, phone, email } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(400).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (username, password, name, phone, email, role) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(username, hashedPassword, name, phone || '', email || '', 'user');

  const user = db.prepare('SELECT id, username, name, phone, email, role FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = generateToken(user);

  res.json({ success: true, token, user });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  }

  const { password: _, ...userData } = user;
  const token = generateToken(userData);

  res.json({ success: true, token, user: userData });
});

module.exports = router;
