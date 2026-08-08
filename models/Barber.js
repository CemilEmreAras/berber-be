const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    default: 'Kıdemli Stilist'
  },
  specialties: [{
    type: String
  }],
  type: {
    type: String,
    enum: ['Berber', 'Kuaför', 'Her İkisi'],
    default: 'Her İkisi'
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  },
  rating: {
    type: Number,
    default: 4.9
  },
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '20:00' },
    slotDuration: { type: Number, default: 30 } // dakika
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Barber', barberSchema);
