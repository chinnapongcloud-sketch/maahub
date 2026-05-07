const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware, ownerOnly } = require('../auth');

// GET /api/bookings — user: own, owner: all
router.get('/', authMiddleware, (req, res) => {
  let query;
  let params = [];

  if (req.user.role === 'owner') {
    query = 'SELECT * FROM bookings ORDER BY created_at DESC';
  } else {
    query = 'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC';
    params = [req.user.userId];
  }

  const { fieldId, date, status } = req.query;
  const conditions = [];
  const newParams = [...params];

  if (fieldId) { conditions.push('field_id = ?'); newParams.push(fieldId); }
  if (date) { conditions.push('booking_date = ?'); newParams.push(date); }
  if (status) { conditions.push('status = ?'); newParams.push(status); }

  if (conditions.length > 0) {
    query += ' AND ' + conditions.join(' AND ');
  }

  const bookings = db.prepare(query).all(...newParams);
  res.json(bookings);
});

// GET /api/bookings/booked-slots — get booked slots for a field + date
router.get('/booked-slots', (req, res) => {
  const { fieldId, date } = req.query;
  if (!fieldId || !date) return res.status(400).json({ message: 'ต้องระบุ fieldId และ date' });

  const rows = db.prepare(
    "SELECT time_slot FROM bookings WHERE field_id = ? AND booking_date = ? AND status = 'approved'"
  ).all(fieldId, date);

  res.json(rows.map(r => r.time_slot));
});

// POST /api/bookings — user only
router.post('/', authMiddleware, (req, res) => {
  const { fieldId, date, timeSlot, slipImage } = req.body;
  if (!fieldId || !date || !timeSlot) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
  }

  const field = db.prepare('SELECT id, price FROM fields WHERE id = ?').get(fieldId);
  if (!field) return res.status(404).json({ message: 'ไม่พบสนาม' });

  // Check if slot is already booked
  const existing = db.prepare(
    "SELECT id FROM bookings WHERE field_id = ? AND booking_date = ? AND time_slot = ? AND status != 'rejected'"
  ).get(fieldId, date, timeSlot);
  if (existing) {
    return res.status(400).json({ message: 'เวลานี้ถูกจองแล้ว' });
  }

  const result = db.prepare(
    'INSERT INTO bookings (field_id, user_id, user_name, booking_date, time_slot, price, slip_image) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(fieldId, req.user.userId, req.user.name, date, timeSlot, field.price, slipImage || '');

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(booking);
});

// PUT /api/bookings/:id/status — owner only
router.put('/:id/status', authMiddleware, ownerOnly, (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'สถานะต้องเป็น approved หรือ rejected' });
  }

  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) return res.status(404).json({ message: 'ไม่พบการจอง' });
  res.json(booking);
});

module.exports = router;
