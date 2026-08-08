const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Erkek Berber', 'Kadın Kuaför', 'Cilt & Bakım', 'Genel'],
    default: 'Genel'
  },
  duration: {
    type: Number, // dakika cinsinden
    required: true,
    default: 30
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'Scissors'
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
