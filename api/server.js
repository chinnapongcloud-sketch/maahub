require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./database');
const authRoutes = require('./routes/auth');
const fieldRoutes = require('./routes/fields');
const bookingRoutes = require('./routes/bookings');
const uploadRoutes = require('./routes/upload');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);

// Serve uploaded files
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`KH Arena API running on http://localhost:${PORT}`);
});
