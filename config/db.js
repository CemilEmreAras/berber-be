const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/randevu_db';
  try {
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB bağlantısı kurulamadı (${error.message}). Uygulama Bellek (In-Memory) Veri Modunda çalışacak.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
