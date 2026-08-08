// MongoDB offline olduğunda bellek içi (In-Memory) veri yönetimi sağlayan fallback modülü
let services = [
  {
    _id: 'srv-1',
    name: 'Klasik Saç Kesimi & Yıkama',
    category: 'Erkek Berber',
    duration: 30,
    price: 350,
    description: 'Yüz tipinize uygun saç tasarımı, şampuanlı yıkama ve fön şekillendirme.',
    icon: 'Scissors'
  },
  {
    _id: 'srv-2',
    name: 'Sakal Tıraşı & Sıcak Havlu Bakımı',
    category: 'Erkek Berber',
    duration: 20,
    price: 200,
    description: 'Ustura ile geleneksel sakal şekillendirme ve rahatlatıcı sıcak havlu kompresi.',
    icon: 'Feather'
  },
  {
    _id: 'srv-3',
    name: 'VIP Saç + Sakal + Cilt Bakımı Kombosu',
    category: 'Erkek Berber',
    duration: 60,
    price: 650,
    description: 'Eksiksiz saç kesimi, sakal tasarımı, kulak/burun ağda ve siyah nokta maskesi.',
    icon: 'Crown'
  },
  {
    _id: 'srv-4',
    name: 'Kadın Saç Kesimi & Keratin Bakım',
    category: 'Kadın Kuaför',
    duration: 60,
    price: 750,
    description: 'Trend modellerde saç kesimi, yıkama, yoğun nem veren keratin bakımı.',
    icon: 'Sparkles'
  },
  {
    _id: 'srv-5',
    name: 'Saç Boyama & Ombre / Sombre',
    category: 'Kadın Kuaför',
    duration: 120,
    price: 1500,
    description: 'Profesyonel renk analizi ile dip boya, ombre veya sombre uygulaması.',
    icon: 'Palette'
  },
  {
    _id: 'srv-6',
    name: 'Topuz & Profesyonel Fön',
    category: 'Kadın Kuaför',
    duration: 45,
    price: 400,
    description: 'Özel günler veya günlük kullanım için kalıcı dalgalı / kırık fön ve maşa.',
    icon: 'Zap'
  }
];

let barbers = [
  {
    _id: 'brb-1',
    name: 'Ahmet Yılmaz',
    title: 'Master Barber / Berber Ustası',
    specialties: ['Klasik Kesim', 'Ustura Sakal', 'Cilt Bakımı'],
    type: 'Berber',
    avatar: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    workingHours: { start: '09:00', end: '20:00', slotDuration: 30 },
    isAvailable: true
  },
  {
    _id: 'brb-2',
    name: 'Zeynep Kaya',
    title: 'Senior Hair Stylist / Kuaför Uzmanı',
    specialties: ['Saç Boyama', 'Ombre', 'Gelin Saçı'],
    type: 'Kuaför',
    avatar: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=400',
    rating: 5.0,
    workingHours: { start: '10:00', end: '19:00', slotDuration: 30 },
    isAvailable: true
  },
  {
    _id: 'brb-3',
    name: 'Caner Demir',
    title: 'Trend & Fade Uzmanı',
    specialties: ['Modern Fade', 'Sakal Tasarımı', 'Saç Dövmesi'],
    type: 'Berber',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    workingHours: { start: '09:00', end: '21:00', slotDuration: 30 },
    isAvailable: true
  },
  {
    _id: 'brb-4',
    name: 'Elif Arslan',
    title: 'Renk & Bakım Uzmanı',
    specialties: ['Keratin Bakım', 'Mikro Kaynak', 'Fön'],
    type: 'Kuaför',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    workingHours: { start: '09:30', end: '19:30', slotDuration: 30 },
    isAvailable: true
  }
];

let appointments = [
  {
    _id: 'apt-101',
    customerName: 'Mehmet Öz',
    customerPhone: '05321112233',
    customerEmail: 'mehmet@example.com',
    barberId: 'brb-1',
    barberName: 'Ahmet Yılmaz',
    services: [
      { serviceId: 'srv-1', name: 'Klasik Saç Kesimi & Yıkama', price: 350, duration: 30 }
    ],
    date: new Date().toISOString().split('T')[0],
    timeSlot: '11:00',
    totalPrice: 350,
    totalDuration: 30,
    status: 'Onaylandı',
    notes: 'Kısa yanlar kalsın lütfen.'
  }
];

module.exports = {
  services,
  barbers,
  appointments
};
