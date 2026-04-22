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
  { name: 'Newbie', min: 0, color: 'from-gray-400 to-slate-500', icon: '🌱' },
  { name: 'Explorer', min: 500, color: 'from-blue-400 to-cyan-500', icon: '🗺️' },
  { name: 'Dating Pro', min: 2000, color: 'from-purple-500 to-indigo-600', icon: '🏆' },
  { name: 'Master', min: 5000, color: 'from-rose-500 to-orange-500', icon: '👑' },
];

export const BADGES = [
  { id: 'first_date', name: 'First Date', icon: '💝', desc: 'Hoàn thành buổi hẹn đầu tiên' },
  { id: 'combo_king', name: 'Combo King', icon: '👑', desc: 'Hoàn thành 5 Combo AI' },
  { id: 'night_owl', name: 'Night Owl', icon: '🦉', desc: 'Hẹn hò sau 10 giờ tối' },
  { id: 'fashionista', name: 'Fashionista', icon: '✨', desc: 'Thuê đồ 3 lần trở lên' },
];

export const OUTFIT_STYLES: Record<string, { male: { desc: string; image: string; link: string }; female: { desc: string; image: string; link: string } }> = {
  'Minimalism': {
    male: { desc: 'Áo thun đen basic + Quần jean đen + Sneaker trắng', image: 'https://images.unsplash.com/photo-1499939667766-4afceb292d05?w=400&h=600&fit=crop', link: 'https://shopee.vn/search?keyword=ao+thun+den+nam' },
    female: { desc: 'Áo sơ mi trắng oversize + Quần âu đen + Boots đen', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=600&fit=crop', link: 'https://shopee.vn/search?keyword=ao+so+mi+trang+nu' }
  },
  'Classic': {
    male: { desc: 'Sơ mi oxford xanh + Quần chino be + Derby shoes', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop', link: 'https://shopee.vn/search?keyword=so+mi+oxford+nam' },
    female: { desc: 'Váy suông đen + Cardigan be + Giày búp bê', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop', link: 'https://shopee.vn/search?keyword=vay+suong+den' }
  },
  'Old Money': {
    male: { desc: 'Polo dệt kim be + Quần âu xếp ly + Loafer da lộn', image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=600&fit=crop', link: 'https://shopee.vn/search?keyword=polo+det+kim+nam' },
    female: { desc: 'Áo sơ mi lụa tơ tằm + Chân váy midi chữ A + Giày Slingback', image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=400&h=600&fit=crop', link: 'https://shopee.vn/search?keyword=ao+so+mi+lua+nu' }
  },
  'Sporty': {
    male: { desc: 'Hoodie oversize + Jogger + Sneaker AF1', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop', link: 'https://shopee.vn/search?keyword=hoodie+oversize' },
    female: { desc: 'Áo croptop thể thao + Quần short + Sneaker trắng', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop', link: 'https://shopee.vn/search?keyword=croptop+the+thao' }
  },
  'Streetwear': {
    male: { desc: 'Áo khoác bomber + Quần cargo rộng + Chunky sneakers', image: 'https://images.unsplash.com/photo-1523398002811-999aa8d9512e?w=400&h=600&fit=crop', link: 'https://shopee.vn/search?keyword=quan+cargo+nam' },
    female: { desc: 'Áo hoodie crop + Quần túi hộp + Giày chunky', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop', link: 'https://shopee.vn/search?keyword=hoodie+crop+nu' }
  },
  'Y2K': {
    male: { desc: 'Áo phông graphic vintage + Quần jean rách + Chuck Taylor', image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=600&fit=crop', link: 'https://shopee.vn/search?keyword=ao+phong+vintage' },
    female: { desc: 'Top rib tank + Chân váy tennis + Sneaker retro', image: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=400&h=600&fit=crop', link: 'https://shopee.vn/search?keyword=chan+vay+tennis' }
  }
};

export const RENTAL_STYLES: Record<string, { male: { id: string; desc: string; stock: number; sizes: string[]; price: number; image: string }; female: { id: string; desc: string; stock: number; sizes: string[]; price: number; image: string } }> = {
  'Minimalism': { male: { id: 'Set #12', desc: 'Áo thun đen + Quần jean đen', stock: 5, sizes: ['S', 'M', 'L', 'XL'], price: 50000, image: 'https://images.unsplash.com/photo-1499939667766-4afceb292d05?w=400&h=600&fit=crop' }, female: { id: 'Set #18', desc: 'Sơ mi trắng + Quần âu', stock: 4, sizes: ['S', 'M', 'L'], price: 50000, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=600&fit=crop' } },
  'Classic': { male: { id: 'Set #05', desc: 'Sơ mi oxford + Chino', stock: 6, sizes: ['M', 'L', 'XL'], price: 50000, image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop' }, female: { id: 'Set #21', desc: 'Váy suông + Cardigan', stock: 3, sizes: ['S', 'M'], price: 50000, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop' } },
  'Old Money': { male: { id: 'Set #03', desc: 'Polo dệt kim + Quần âu', stock: 4, sizes: ['M', 'L'], price: 50000, image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=600&fit=crop' }, female: { id: 'Set #14', desc: 'Sơ mi lụa + Váy midi', stock: 2, sizes: ['S', 'M', 'L'], price: 50000, image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=400&h=600&fit=crop' } },
  'Sporty': { male: { id: 'Set #07', desc: 'Hoodie + Jogger', stock: 8, sizes: ['M', 'L', 'XL'], price: 50000, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop' }, female: { id: 'Set #09', desc: 'Croptop + Short thể thao', stock: 7, sizes: ['S', 'M', 'L'], price: 50000, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop' } },
  'Streetwear': { male: { id: 'Set #11', desc: 'Bomber + Cargo', stock: 5, sizes: ['L', 'XL'], price: 50000, image: 'https://images.unsplash.com/photo-1523398002811-999aa8d9512e?w=400&h=600&fit=crop' }, female: { id: 'Set #16', desc: 'Hoodie crop + Túi hộp', stock: 4, sizes: ['S', 'M', 'L'], price: 50000, image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop' } },
  'Y2K': { male: { id: 'Set #22', desc: 'Graphic tee + Jean rách', stock: 6, sizes: ['M', 'L'], price: 50000, image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=600&fit=crop' }, female: { id: 'Set #19', desc: 'Rib tank + Váy tennis', stock: 5, sizes: ['S', 'M'], price: 50000, image: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=400&h=600&fit=crop' } }
};

export const THEME_TO_OUTFIT_STYLE: Record<string, string> = {
  'Lãng mạn': 'Classic',
  'Sang trọng': 'Old Money',
  'Năng động': 'Sporty',
  'Tối giản': 'Minimalism',
  'Cổ điển': 'Vintage',
  'Vibe đường phố': 'Streetwear',
};
