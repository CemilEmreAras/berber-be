require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Barber = require('./models/Barber');
const Appointment = require('./models/Appointment');
const memoryStore = require('./config/memoryStore');

const seedDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/randevu_db';
    await mongoose.connect(connString);
    console.log('Seed için MongoDB bağlandı.');

    await Service.deleteMany({});
    await Barber.deleteMany({});
    await Appointment.deleteMany({});

    // Mongo ID'siz nesneler ekleyelim
    const cleanServices = memoryStore.services.map(({ _id, ...rest }) => rest);
    const cleanBarbers = memoryStore.barbers.map(({ _id, ...rest }) => rest);

    const insertedServices = await Service.insertMany(cleanServices);
    const insertedBarbers = await Barber.insertMany(cleanBarbers);

    console.log(`${insertedServices.length} Hizmet ve ${insertedBarbers.length} Berber veritabanına eklendi.`);

    const todayStr = new Date().toISOString().split('T')[0];
    await Appointment.create({
      customerName: 'Ahmet Arslan',
      customerPhone: '05359998877',
      customerEmail: 'ahmet@example.com',
      barberId: insertedBarbers[0]._id,
      barberName: insertedBarbers[0].name,
      services: [
        {
          serviceId: insertedServices[0]._id,
          name: insertedServices[0].name,
          price: insertedServices[0].price,
          duration: insertedServices[0].duration
        }
      ],
      date: todayStr,
      timeSlot: '14:00',
      totalPrice: insertedServices[0].price,
      totalDuration: insertedServices[0].duration,
      status: 'Onaylandı',
      notes: 'İlk randevu test kaydı.'
    });

    console.log('Örnek randevu kaydı eklendi.');
    process.exit(0);
  } catch (error) {
    console.error('Seed hatası:', error.message);
    process.exit(1);
  }
};

seedDB();
