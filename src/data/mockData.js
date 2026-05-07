export const mockFields = [
  {
    id: 1,
    name: 'สนาม A — 5 คน',
    size: '5-a-side',
    price: 800,
    image: 'https://images.unsplash.com/photo-1529900748103-530527dd669b?w=600&h=400&fit=crop',
    description: 'สนามหญ้าเทียมมาตรฐาน FIFA ขนาดเล็ก เหมาะสำหรับทีมเล็กหรือฝึกซ้อม',
    facilities: ['ไฟส่องสว่าง', 'ห้องน้ำ', 'ที่จอดรถ', 'น้ำดื่มฟรี'],
  },
  {
    id: 2,
    name: 'สนาม B — 7 คน',
    size: '7-a-side',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195160?w=600&h=400&fit=crop',
    description: 'สนามหญ้าเทียมขนาดกลาง เหมาะสำหรับแข่งขันกระชับมิตร',
    facilities: ['ไฟส่องสว่าง', 'ห้องน้ำ', 'ที่จอดรถ', 'น้ำดื่มฟรี', 'ห้องเปลี่ยนเสื้อ'],
  },
  {
    id: 3,
    name: 'สนาม C — 11 คน',
    size: '11-a-side',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1556056504-5890b5e85799?w=600&h=400&fit=crop',
    description: 'สนามหญ้าแท้ขนาดมาตรฐานเต็มรูปแบบ สำหรับการแข่งขันอย่างเป็นทางการ',
    facilities: ['ไฟส่องสว่าง', 'ห้องน้ำ', 'ที่จอดรถ', 'น้ำดื่มฟรี', 'ห้องเปลี่ยนเสื้อ', 'อัฒจันทร์'],
  },
  {
    id: 4,
    name: 'สนาม D — 5 คน (Indoor)',
    size: '5-a-side',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1624880357907-7a425e4642e3?w=600&h=400&fit=crop',
    description: 'สนามในร่ม ไม่ต้องกลัวฝน หญ้าเทียมคุณภาพสูง',
    facilities: ['ไฟส่องสว่าง', 'ห้องน้ำ', 'ที่จอดรถ', 'น้ำดื่มฟรี', 'แอร์'],
  },
  {
    id: 5,
    name: 'สนาม E — 7 คน (Premium)',
    size: '7-a-side',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=400&fit=crop',
    description: 'สนามพรีเมียม หญ้าเทียมนำเข้า พร้อมระบบไฟ LED',
    facilities: ['ไฟ LED', 'ห้องน้ำ', 'ที่จอดรถ', 'น้ำดื่มฟรี', 'ห้องเปลี่ยนเสื้อ', 'คาเฟ่'],
  },
  {
    id: 6,
    name: 'สนาม F — 11 คน (หญ้าเทียม)',
    size: '11-a-side',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop',
    description: 'สนามหญ้าเทียมนำเข้า เกรดแข่งขัน ทนทานทุกสภาพอากาศ',
    facilities: ['ไฟส่องสว่าง', 'ห้องน้ำ', 'ที่จอดรถ', 'น้ำดื่มฟรี', 'ห้องเปลี่ยนเสื้อ'],
  },
];

export const timeSlots = [
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
  '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
  '20:00-21:00', '21:00-22:00',
];

export const initialBookings = [
  {
    id: 1,
    fieldId: 1,
    userId: 'user1',
    userName: 'สมชาย ใจดี',
    date: '2026-05-10',
    timeSlot: '18:00-19:00',
    price: 800,
    status: 'pending',
    slipImage: '',
  },
  {
    id: 2,
    fieldId: 2,
    userId: 'user2',
    userName: 'วิชัย เก่งกาจ',
    date: '2026-05-11',
    timeSlot: '16:00-17:00',
    price: 1200,
    status: 'approved',
    slipImage: '',
  },
  {
    id: 3,
    fieldId: 3,
    userId: 'user1',
    userName: 'สมชาย ใจดี',
    date: '2026-05-12',
    timeSlot: '19:00-20:00',
    price: 2000,
    status: 'rejected',
    slipImage: '',
  },
];

export const initialUsers = [
  { id: 'user1', username: 'user', password: '1234', name: 'สมชาย ใจดี', phone: '081-234-5678', email: 'somchai@email.com', role: 'user' },
  { id: 'owner1', username: 'owner', password: '1234', name: 'KH Arena Admin', phone: '089-999-8888', email: 'admin@kharena.com', role: 'owner' },
];
