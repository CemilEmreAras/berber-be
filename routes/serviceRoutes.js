const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');

// Tüm hizmetleri getir
router.get('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const services = await Service.find().sort({ category: 1, name: 1 });
      return res.json(services);
    } else {
      return res.json(memoryStore.services);
    }
  } catch (error) {
    res.status(500).json({ message: 'Hizmetler yüklenirken hata oluştu', error: error.message });
  }
});

// Yeni hizmet ekle
router.post('/', async (req, res) => {
  try {
    const { name, category, duration, price, description, icon } = req.body;
    if (getIsConnected()) {
      const newService = await Service.create({ name, category, duration, price, description, icon });
      return res.status(201).json(newService);
    } else {
      const newService = {
        _id: 'srv-' + Date.now(),
        name,
        category: category || 'Genel',
        duration: Number(duration) || 30,
        price: Number(price) || 0,
        description: description || '',
        icon: icon || 'Scissors'
      };
      memoryStore.services.push(newService);
      return res.status(201).json(newService);
    }
  } catch (error) {
    res.status(400).json({ message: 'Hizmet eklenemedi', error: error.message });
  }
});

// Hizmet sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await Service.findByIdAndDelete(id);
    } else {
      memoryStore.services = memoryStore.services.filter(s => s._id !== id);
    }
    res.json({ message: 'Hizmet silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Silme işlemi başarısız', error: error.message });
  }
});

module.exports = router;
