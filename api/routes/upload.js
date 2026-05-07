const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authMiddleware } = require('../auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/upload/slip — upload slip image
router.post('/slip', authMiddleware, upload.single('slip'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'กรุณาอัปโหลดรูปภาพ' });
  }
  res.json({ filename: req.file.filename, path: `/api/uploads/${req.file.filename}` });
});

module.exports = router;
