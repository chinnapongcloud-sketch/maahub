require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const router = express.Router();
const db = require('../database');

const THAILLM_URL = process.env.THAILLM_API_URL;
const THAILLM_KEY = process.env.THAILLM_API_KEY;
const THAILLM_MODEL = process.env.THAILLM_MODEL;
const SYSTEM_PROMPT = process.env.CHATBOT_SYSTEM_PROMPT;

// POST /api/chat — proxy to ThaiLLM with field context
router.post('/', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'ต้องส่งข้อความ' });

  if (!THAILLM_KEY || THAILLM_KEY.startsWith('ใส่_')) {
    return res.status(500).json({ error: 'ยังไม่ได้ตั้งค่า API Key ในไฟล์ .env' });
  }

  // Get current field context
  const fields = db.prepare('SELECT name, size, price, description FROM fields').all();
  const today = new Date().toISOString().split('T')[0];
  const bookedToday = db.prepare(
    `SELECT b.field_id, b.time_slot, f.name as field_name FROM bookings b
     JOIN fields f ON b.field_id = f.id
     WHERE b.booking_date = ? AND b.status = 'approved'`
  ).all(today);

  let contextInfo = `สนามทั้งหมดใน KH Arena:\n`;
  fields.forEach(f => {
    contextInfo += `- ${f.name} (${f.size}) ราคา ${f.price.toLocaleString()} บาท/ชม. — ${f.description}\n`;
  });
  contextInfo += `\nเวลาที่จองแล้ววันนี้ (${today}):\n`;
  if (bookedToday.length > 0) {
    bookedToday.forEach(b => {
      contextInfo += `- ${b.field_name} เวลา ${b.time_slot}\n`;
    });
  } else {
    contextInfo += `- วันนี้ยังไม่มีรายการจอง`;
  }

  const messages = [
    { role: 'system', content: `${SYSTEM_PROMPT}\n\n${contextInfo}` },
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message },
  ];

  try {
    const response = await fetch(THAILLM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${THAILLM_KEY}`,
      },
      body: JSON.stringify({
        model: THAILLM_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `LLM API error: ${errText}` });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'ขออภัย ไม่สามารถตอบได้ในขณะนี้';
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI' });
  }
});

module.exports = router;
