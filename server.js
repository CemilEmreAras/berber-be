require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const serviceRoutes = require('./routes/serviceRoutes');
const barberRoutes = require('./routes/barberRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Rotaları
app.use('/api/services', serviceRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Berber & Kuaför Randevu API çalışıyor' });
});

// Veritabanına bağlan ve Sunucuyu başlat
connectDB().then(() => {
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`=================================`);
      console.log(`Backend Sunucu Port ${PORT} üzerinde çalışıyor.`);
      console.log(`http://localhost:${PORT}`);
      console.log(`=================================`);
    });
  }
});

module.exports = app;
