const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    trim: true,
    default: ''
  },
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: true
  },
  barberName: {
    type: String,
    default: ''
  },
  services: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    name: String,
    price: Number,
    duration: Number
  }],
  date: {
    type: String, // YYYY-MM-DD formatında
    required: true
  },
  timeSlot: {
    type: String, // HH:MM formatında (ör. "14:30")
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  totalDuration: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Onay Bekliyor', 'Onaylandı', 'Tamamlandı', 'İptal Edildi'],
    default: 'Onaylandı'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
