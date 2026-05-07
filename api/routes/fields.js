const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware, ownerOnly } = require('../auth');

// GET /api/fields — public
router.get('/', (req, res) => {
  const fields = db.prepare('SELECT * FROM fields ORDER BY id').all();
  const result = fields.map(f => ({ ...f, facilities: JSON.parse(f.facilities || '[]') }));
  res.json(result);
});

// GET /api/fields/:id — public
router.get('/:id', (req, res) => {
  const field = db.prepare('SELECT * FROM fields WHERE id = ?').get(req.params.id);
  if (!field) return res.status(404).json({ message: 'ไม่พบสนาม' });
  field.facilities = JSON.parse(field.facilities || '[]');
  res.json(field);
});

// POST /api/fields — owner only
router.post('/', authMiddleware, ownerOnly, (req, res) => {
  const { name, size, price, image, description, facilities = [] } = req.body;
  const result = db.prepare(
    'INSERT INTO fields (name, size, price, image, description, facilities) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, size, price, image, description, JSON.stringify(facilities));

  const field = db.prepare('SELECT * FROM fields WHERE id = ?').get(result.lastInsertRowid);
  field.facilities = JSON.parse(field.facilities || '[]');
  res.status(201).json(field);
});

// PUT /api/fields/:id — owner only
router.put('/:id', authMiddleware, ownerOnly, (req, res) => {
  const { name, size, price, image, description, facilities } = req.body;
  const facilitiesJson = facilities ? JSON.stringify(facilities) : undefined;

  db.prepare(`UPDATE fields SET name = COALESCE(?, name), size = COALESCE(?, size),
    price = COALESCE(?, price), image = COALESCE(?, image),
    description = COALESCE(?, description), facilities = COALESCE(?, facilities)
    WHERE id = ?`).run(name, size, price, image, description, facilitiesJson, req.params.id);

  const field = db.prepare('SELECT * FROM fields WHERE id = ?').get(req.params.id);
  if (!field) return res.status(404).json({ message: 'ไม่พบสนาม' });
  field.facilities = JSON.parse(field.facilities || '[]');
  res.json(field);
});

// DELETE /api/fields/:id — owner only
router.delete('/:id', authMiddleware, ownerOnly, (req, res) => {
  const result = db.prepare('DELETE FROM fields WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: 'ไม่พบสนาม' });
  res.json({ success: true });
});

module.exports = router;
