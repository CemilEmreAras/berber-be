const express = require('express');
const router = express.Router();
const Barber = require('../models/Barber');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');

// Tüm berber ve kuaförleri getir
router.get('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const barbers = await Barber.find().sort({ rating: -1, name: 1 });
      return res.json(barbers);
    } else {
      return res.json(memoryStore.barbers);
    }
  } catch (error) {
    res.status(500).json({ message: 'Berberler getirilemedi', error: error.message });
  }
});

// Yeni berber ekle
router.post('/', async (req, res) => {
  try {
    const { name, title, specialties, type, avatar, workingHours } = req.body;
    if (getIsConnected()) {
      const newBarber = await Barber.create({ name, title, specialties, type, avatar, workingHours });
      return res.status(201).json(newBarber);
    } else {
      const newBarber = {
        _id: 'brb-' + Date.now(),
        name,
        title: title || 'Kıdemli Stilist',
        specialties: specialties || [],
        type: type || 'Her İkisi',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        rating: 5.0,
        workingHours: workingHours || { start: '09:00', end: '20:00', slotDuration: 30 },
        isAvailable: true
      };
      memoryStore.barbers.push(newBarber);
      return res.status(201).json(newBarber);
    }
  } catch (error) {
    res.status(400).json({ message: 'Berber oluşturulamadı', error: error.message });
  }
});

module.exports = router;
