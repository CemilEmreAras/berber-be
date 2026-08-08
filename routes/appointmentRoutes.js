const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Barber = require('../models/Barber');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');

// Yardımcı saat oluşturucu (örn. "09:00" ile "20:00" arası 30'ar dakikalık dilimler)
function generateTimeSlots(startTime = '09:00', endTime = '20:00', intervalMinutes = 30) {
  const slots = [];
  let [startHour, startMin] = startTime.split(':').map(Number);
  let [endHour, endMin] = endTime.split(':').map(Number);

  let currentMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;

  while (currentMin < endTotalMin) {
    const hh = String(Math.floor(currentMin / 60)).padStart(2, '0');
    const mm = String(currentMin % 60).padStart(2, '0');
    slots.push(`${hh}:${mm}`);
    currentMin += intervalMinutes;
  }

  return slots;
}

// Müsait saat slotlarını hesapla
router.get('/available-slots', async (req, res) => {
  try {
    const { barberId, date } = req.query;
    if (!barberId || !date) {
      return res.status(400).json({ message: 'barberId ve date parametreleri zorunludur' });
    }

    let barber = null;
    let existingAppointments = [];

    if (getIsConnected()) {
      barber = await Barber.findById(barberId);
      existingAppointments = await Appointment.find({
        barberId,
        date,
        status: { $ne: 'İptal Edildi' }
      });
    } else {
      barber = memoryStore.barbers.find(b => String(b._id) === String(barberId));
      existingAppointments = memoryStore.appointments.filter(
        a => String(a.barberId) === String(barberId) && a.date === date && a.status !== 'İptal Edildi'
      );
    }

    const start = barber?.workingHours?.start || '09:00';
    const end = barber?.workingHours?.end || '20:00';
    const slotDuration = barber?.workingHours?.slotDuration || 30;

    const allSlots = generateTimeSlots(start, end, slotDuration);

    const bookedSlots = new Set(existingAppointments.map(a => a.timeSlot));

    const result = allSlots.map(time => ({
      time,
      isAvailable: !bookedSlots.has(time)
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Müsait saatler hesaplanırken hata oluştu', error: error.message });
  }
});

// Randevuları listele
router.get('/', async (req, res) => {
  try {
    const { phone, date, barberId } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (phone) query.customerPhone = phone;
      if (date) query.date = date;
      if (barberId) query.barberId = barberId;

      const appointments = await Appointment.find(query).sort({ date: 1, timeSlot: 1 });
      return res.json(appointments);
    } else {
      let filtered = [...memoryStore.appointments];
      if (phone) filtered = filtered.filter(a => a.customerPhone.includes(phone));
      if (date) filtered = filtered.filter(a => a.date === date);
      if (barberId) filtered = filtered.filter(a => String(a.barberId) === String(barberId));
      return res.json(filtered);
    }
  } catch (error) {
    res.status(500).json({ message: 'Randevular getirilemedi', error: error.message });
  }
});

// Yeni randevu oluştur
router.post('/', async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, barberId, barberName, services, date, timeSlot, notes } = req.body;

    if (!customerName || !customerPhone || !barberId || !services || !services.length || !date || !timeSlot) {
      return res.status(400).json({ message: 'Lütfen tüm gerekli alanları doldurun' });
    }

    const totalPrice = services.reduce((acc, s) => acc + (Number(s.price) || 0), 0);
    const totalDuration = services.reduce((acc, s) => acc + (Number(s.duration) || 30), 30);

    if (getIsConnected()) {
      // Çakışan randevu var mı kontrol et
      const existing = await Appointment.findOne({
        barberId,
        date,
        timeSlot,
        status: { $ne: 'İptal Edildi' }
      });

      if (existing) {
        return res.status(400).json({ message: 'Seçilen saatte berber zaten dolu! Lütfen başka bir saat seçin.' });
      }

      const newAppt = await Appointment.create({
        customerName,
        customerPhone,
        customerEmail: customerEmail || '',
        barberId,
        barberName: barberName || '',
        services,
        date,
        timeSlot,
        totalPrice,
        totalDuration,
        status: 'Onaylandı',
        notes: notes || ''
      });

      return res.status(201).json(newAppt);
    } else {
      const existing = memoryStore.appointments.find(
        a => String(a.barberId) === String(barberId) && a.date === date && a.timeSlot === timeSlot && a.status !== 'İptal Edildi'
      );

      if (existing) {
        return res.status(400).json({ message: 'Seçilen saatte berber zaten dolu! Lütfen başka bir saat seçin.' });
      }

      const newAppt = {
        _id: 'apt-' + Date.now(),
        customerName,
        customerPhone,
        customerEmail: customerEmail || '',
        barberId,
        barberName: barberName || '',
        services,
        date,
        timeSlot,
        totalPrice,
        totalDuration,
        status: 'Onaylandı',
        notes: notes || '',
        createdAt: new Date().toISOString()
      };

      memoryStore.appointments.push(newAppt);
      return res.status(201).json(newAppt);
    }
  } catch (error) {
    res.status(500).json({ message: 'Randevu oluşturulurken hata oluştu', error: error.message });
  }
});

// Randevu durumu güncelle
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (getIsConnected()) {
      const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
      return res.json(updated);
    } else {
      const appt = memoryStore.appointments.find(a => String(a._id) === String(id));
      if (appt) {
        appt.status = status;
        return res.json(appt);
      }
      return res.status(404).json({ message: 'Randevu bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Durum güncellenemedi', error: error.message });
  }
});

// Randevu sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await Appointment.findByIdAndDelete(id);
    } else {
      memoryStore.appointments = memoryStore.appointments.filter(a => String(a._id) !== String(id));
    }
    res.json({ message: 'Randevu silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Silme işlemi başarısız', error: error.message });
  }
});

module.exports = router;
