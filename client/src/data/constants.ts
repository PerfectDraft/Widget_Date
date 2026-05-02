import type { Combo } from '../types';

export const SAMPLE_COMBOS: Combo[] = [
  {
    id: 'c1',
    theme: 'Lãng Mạn',
    icon: '💕',
    totalCost: 160000,
    score: 9.5,
    activities: [
      { time: '18:00', name: 'Cafe Giảng', cost: 50000, distance: '1.2 km', lat: 21.0278, lng: 105.8342 },
      { time: '19:30', name: 'Bún Chả Hương Liên', cost: 80000, distance: '0.5 km', lat: 21.0173, lng: 105.8530 },
      { time: '21:00', name: 'Hồ Tây sunset walk', cost: 0, distance: '3.0 km', lat: 21.0592, lng: 105.8251 },
      { time: '22:00', name: 'Kem Tràng Tiền', cost: 30000, distance: '2.5 km', lat: 21.0252, lng: 105.8546 },
    ]
  },
  {
    id: 'c2',
    theme: 'Vui Vẻ',
    icon: '✨',
    totalCost: 300000,
    score: 8.8,
    activities: [
      { time: '18:00', name: 'Lotte Cinema', cost: 100000, distance: '0.8 km', lat: 21.0318, lng: 105.8122 },
      { time: '20:30', name: 'Lotteria', cost: 80000, distance: '0.1 km', lat: 21.0320, lng: 105.8125 },
      { time: '21:30', name: 'Bowling Mỹ Đình', cost: 120000, distance: '4.0 km', lat: 21.0223, lng: 105.7665 },
    ]
  },
  {
    id: 'c3',
    theme: 'Bí Ẩn',
    icon: '🧭',
    totalCost: 350000,
    score: 9.0,
    activities: [
      { time: '18:00', name: 'Rooftop bar Skyloft', cost: 150000, distance: '2.0 km', lat: 21.0285, lng: 105.8355 },
      { time: '20:00', name: 'Street food tour Tạ Hiện', cost: 120000, distance: '1.5 km', lat: 21.0345, lng: 105.8512 },
      { time: '22:00', name: 'Jazz club Binh', cost: 80000, distance: '0.5 km', lat: 21.0330, lng: 105.8500 },
    ]
  }
];

export const MILESTONE_LEVELS = [
  { name: 'Newbie', min: 0, color: 'from-stone-300 to-stone-400', icon: '🌱' },
  { name: 'Explorer', min: 500, color: 'from-rose-300 to-pink-400', icon: '🗺️' },
  { name: 'Dating Pro', min: 2000, color: 'from-primary to-rose-700', icon: '🏆' },
  { name: 'Master', min: 5000, color: 'from-rose-800 via-primary to-rose-900', icon: '👑' },
];

export const BADGES = [
  { id: 'first_date', name: 'First Date', icon: '💝', desc: 'Hoàn thành buổi hẹn đầu tiên' },
  { id: 'combo_king', name: 'Combo King', icon: '👑', desc: 'Hoàn thành 5 Combo AI' },
  { id: 'night_owl', name: 'Night Owl', icon: '🦉', desc: 'Hẹn hò sau 10 giờ tối' },
];






