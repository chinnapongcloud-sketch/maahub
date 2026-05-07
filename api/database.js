const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'kharena.db');
const db = new Database(DB_PATH);

// Enable WAL mode and foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS fields (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    size TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT,
    description TEXT,
    facilities TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    price INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    slip_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES fields(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Seed data
function seed() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) return; // already seeded

  const hash = bcrypt.hashSync('1234', 10);

  // Seed users
  db.prepare(`INSERT INTO users (username, password, name, phone, email, role) VALUES (?, ?, ?, ?, ?, ?)`).run('user', hash, 'สมชาย ใจดี', '081-234-5678', 'somchai@email.com', 'user');
  db.prepare(`INSERT INTO users (username, password, name, phone, email, role) VALUES (?, ?, ?, ?, ?, ?)`).run('owner', hash, 'KH Arena Admin', '089-999-8888', 'admin@kharena.com', 'owner');

  // Seed fields
  const fields = [
    ['สนาม A — 5 คน', '5-a-side', 800, 'https://images.unsplash.com/photo-1529900748103-530527dd669b?w=600&h=400&fit=crop', 'สนามหญ้าเทียมมาตรฐาน FIFA ขนาดเล็ก เหมาะสำหรับทีมเล็กหรือฝึกซ้อม', JSON.stringify(['ไฟส่องสว่าง', 'ห้องน้ำ', 'ที่จอดรถ', 'น้ำดื่มฟรี'])],
    ['สนาม B — 7 คน', '7-a-side', 1200, 'https://images.unsplash.com/photo-1574629810360-7efbbe195160?w=600&h=400&fit=crop', 'สนามหญ้าเทียมขนาดกลาง เหมาะสำหรับแข่งขันกระชับมิตร', JSON.stringify(['ไฟส่องสว่าง', 'ห้องน้ำ', 'ที่จอดรถ', 'น้ำดื่มฟรี', 'ห้องเปลี่ยนเสื้อ'])],
    ['สนาม C — 11 คน', '11-a-side', 2000, 'https://images.unsplash.com/photo-1556056504-5890b5e85799?w=600&h=400&fit=crop', 'สนามหญ้าแท้ขนาดมาตรฐานเต็มรูปแบบ สำหรับการแข่งขันอย่างเป็นทางการ', JSON.stringify(['ไฟส่องสว่าง', 'ห้องน้ำ', 'ที่จอดรถ', 'น้ำดื่มฟรี', 'ห้องเปลี่ยนเสื้อ', 'อัฒจันทร์'])],
    ['สนาม D — 5 คน (Indoor)', '5-a-side', 1000, 'https://images.unsplash.com/photo-1624880357907-7a425e4642e3?w=600&h=400&fit=crop', 'สนามในร่ม ไม่ต้องกลัวฝน หญ้าเทียมคุณภาพสูง', JSON.stringify(['ไฟส่องสว่าง', 'ห้องน้ำ', 'ที่จอดรถ', 'น้ำดื่มฟรี', 'แอร์'])],
    ['สนาม E — 7 คน (Premium)', '7-a-side', 1500, 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=400&fit=crop', 'สนามพรีเมียม หญ้าเทียมนำเข้า พร้อมระบบไฟ LED', JSON.stringify(['ไฟ LED', 'ห้องน้ำ', 'ที่จอดรถ', 'น้ำดื่มฟรี', 'ห้องเปลี่ยนเสื้อ', 'คาเฟ่'])],
    ['สนาม F — 11 คน (หญ้าเทียม)', '11-a-side', 1800, 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop', 'สนามหญ้าเทียมนำเข้า เกรดแข่งขัน ทนทานทุกสภาพอากาศ', JSON.stringify(['ไฟส่องสว่าง', 'ห้องน้ำ', 'ที่จอดรถ', 'น้ำดื่มฟรี', 'ห้องเปลี่ยนเสื้อ'])],
  ];

  const insertField = db.prepare(`INSERT INTO fields (name, size, price, image, description, facilities) VALUES (?, ?, ?, ?, ?, ?)`);
  for (const f of fields) insertField.run(...f);

  // Seed bookings
  const insertBooking = db.prepare(`INSERT INTO bookings (field_id, user_id, user_name, booking_date, time_slot, price, status) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  insertBooking.run(1, 1, 'สมชาย ใจดี', '2026-05-10', '18:00-19:00', 800, 'pending');
  insertBooking.run(2, 1, 'วิชัย เก่งกาจ', '2026-05-11', '16:00-17:00', 1200, 'approved');
  insertBooking.run(3, 1, 'สมชาย ใจดี', '2026-05-12', '19:00-20:00', 2000, 'rejected');
}

seed();

module.exports = db;
