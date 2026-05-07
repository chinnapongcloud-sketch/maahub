const jwt = require('jsonwebtoken');

const JWT_SECRET = 'kh-arena-secret-key-change-in-production';

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'ไม่มีโทเค็น' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'โทเค็นไม่ถูกต้อง' });
  }
}

function ownerOnly(req, res, next) {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ message: 'ต้องเป็นเจ้าของสนาม' });
  }
  next();
}

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, username: user.username, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = { authMiddleware, ownerOnly, generateToken, JWT_SECRET };
