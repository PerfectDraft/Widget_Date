import React from 'react';
import { Heart, Sparkles, Compass } from 'lucide-react';

export interface Activity {
  time: string;
  name: string;
  address?: string;
  cost: number;
  distance?: string;
  lat?: number;
  lng?: number;
  websiteUri?: string;
}

export interface Combo {
  id: string;
  theme: string;
  icon: React.ReactNode;
  totalCost: number;
  score: number;
  activities: Activity[];
}

export const SAMPLE_COMBOS: Combo[] = [
  {
    id: 'c1',
    theme: 'Lãng Mạn',
    icon: <Heart className="w-5 h-5 text-pink-500" />,
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
    icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
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
    icon: <Compass className="w-5 h-5 text-purple-500" />,
    totalCost: 350000,
    score: 9.0,
    activities: [
      { time: '18:00', name: 'Rooftop bar Skyloft', cost: 150000, distance: '2.0 km', lat: 21.0285, lng: 105.8355 },
      { time: '20:00', name: 'Street food tour Tạ Hiện', cost: 120000, distance: '1.5 km', lat: 21.0345, lng: 105.8512 },
      { time: '22:00', name: 'Jazz club Binh', cost: 80000, distance: '0.5 km', lat: 21.0330, lng: 105.8500 },
    ]
  }
];

export const LOCATIONS = [
  { id: 1, name: 'The Note Coffee', area: 'Hoàn Kiếm', desc: 'Cafe view hồ', rating: 4.8, dist: '1.2km', note: 'Hàng ngàn note màu sắc', lat: 21.0315, lng: 105.8533 },
  { id: 2, name: 'Beyond Coffee Roastery', area: 'Tây Hồ', desc: 'Cafe sang chảnh', rating: 4.6, dist: '3.1km', note: 'View hoàng hôn Hồ Tây', lat: 21.0612, lng: 105.8261 },
  { id: 3, name: 'Grill 66 Steakhouse', area: 'Cầu Giấy', desc: 'Nhà hàng Âu', rating: 4.5, dist: '4.8km', note: 'Không gian ấm cúng', lat: 21.0355, lng: 105.7955 },
  { id: 4, name: '6 Degrees Rooftop', area: 'Tây Hồ', desc: 'Rooftop Dinner', rating: 4.7, dist: '3.5km', note: 'View toàn thành phố', lat: 21.0652, lng: 105.8281 },
  { id: 5, name: 'Labo Bistro', area: 'Hoàn Kiếm', desc: 'French Bistro', rating: 4.9, dist: '2.0km', note: 'Biệt thự cổ, chỉ 5 bàn', lat: 21.0255, lng: 105.8455 },
  { id: 6, name: 'Jazz Club Binh', area: 'Hoàn Kiếm', desc: 'Bar & Music', rating: 4.6, dist: '1.8km', note: 'Jazz sống mỗi tối', lat: 21.0330, lng: 105.8500 },
  { id: 7, name: 'Lotte Observation Deck', area: 'Ba Đình', desc: 'Ngắm toàn cảnh', rating: 4.8, dist: '2.5km', note: 'Từ tầng 65 siêu cao', lat: 21.0318, lng: 105.8122 },
  { id: 8, name: 'Nhà Thờ Lớn', area: 'Hoàn Kiếm', desc: 'Địa điểm check-in', rating: 4.9, dist: '1.0km', note: 'Trà chanh chém gió', lat: 21.0287, lng: 105.8490 },
  { id: 9, name: 'Lotte Mall West Lake', area: 'Tây Hồ', desc: 'TTTM lớn nhất', rating: 4.8, dist: '6.5km', note: 'Thủy cung trong nhà', lat: 21.0772, lng: 105.8080 },
  { id: 10, name: 'Phố Bia Tạ Hiện', area: 'Hoàn Kiếm', desc: 'Vui chơi đêm', rating: 4.5, dist: '1.5km', note: 'Nhộn nhịp sầm uất', lat: 21.0345, lng: 105.8512 },
  { id: 11, name: 'Cầu Long Biên', area: 'Hoàn Kiếm', desc: 'Checkin hoàng hôn', rating: 4.7, dist: '2.0km', note: 'Đường tàu lịch sử', lat: 21.0425, lng: 105.8546 },
  { id: 12, name: 'Xofa Café & Bistro', area: 'Hoàn Kiếm', desc: 'Mở cửa 24/7', rating: 4.6, dist: '0.8km', note: 'Nơi ngủ rạng sáng', lat: 21.0312, lng: 105.8458 },
  { id: 13, name: 'Hanoi Saloon', area: 'Đống Đa', desc: 'Pub nhẹ nhàng', rating: 4.5, dist: '3.0km', note: 'Cocktail đa dạng', lat: 21.0232, lng: 105.8234 },
  { id: 14, name: 'Pizza 4P’s Trang Tien', area: 'Hoàn Kiếm', desc: 'Đồ Ý Fusion', rating: 4.8, dist: '1.4km', note: 'Pizza phô mai béo', lat: 21.0252, lng: 105.8546 },
  { id: 15, name: 'Bún Chả Hương Liên', area: 'Hai Bà Trưng', desc: 'Chỗ Obama ăn', rating: 4.4, dist: '1.6km', note: 'Tuyệt đỉnh bún chả', lat: 21.0173, lng: 105.8530 }
];

export const TRENDS = [
  { id: 1, icon: '🧋', name: 'Oolong Đậm Vị Kem Nướng', badge: 'VIRAL', badgeColor: 'bg-pink-100 text-pink-600', desc: 'Khu Chùa Láng', price: '35K/ly' },
  { id: 2, icon: '🍋', name: 'Trà Chanh Giã Tay', badge: 'HOT', badgeColor: 'bg-yellow-100 text-yellow-600', desc: 'Quảng Trường Đông Kinh', price: '25K/ly' },
  { id: 3, icon: '🪙', name: 'Bánh Đồng Xu Phô Mai', badge: 'TRENDING', badgeColor: 'bg-blue-100 text-blue-600', desc: 'Phố Hội & Phố Cổ', price: '35K/chiếc' },
  { id: 4, icon: '☕', name: 'Cà Phê Muối Chú Long', badge: 'MUST TRY', badgeColor: 'bg-orange-100 text-orange-600', desc: 'Khắp Hà Nội', price: '20K/ly' },
  { id: 5, icon: '🌭', name: 'Lạp Xưởng Nướng Đá', badge: 'VIRAL', badgeColor: 'bg-pink-100 text-pink-600', desc: 'Khu Chợ Đêm', price: '15K/chiếc' },
  { id: 6, icon: '🍮', name: 'Trà Sữa Vân Nam', badge: 'HOT', badgeColor: 'bg-yellow-100 text-yellow-600', desc: 'Cầu Giấy', price: '40K/ly' },
  { id: 7, icon: '🍵', name: 'Cà Phê Trứng Giảng', badge: 'CLASSIC', badgeColor: 'bg-slate-100 text-slate-800', desc: 'Hoàn Kiếm', price: '35K/ly' },
  { id: 8, icon: '🥟', name: 'Bánh Trôi Tàu Đê La Thành', badge: 'WINTER', badgeColor: 'bg-purple-100 text-purple-600', desc: 'Đê La Thành', price: '20K/bát' },
];

export const MOVIES = [
  { id: 1, icon: '🎬', name: 'MAI', theaters: 'CGV, Lotte, BHD', genre: 'Tâm lý / Gia đình', rating: 8.8, price: '110K', badge: '🔥 TOP 1 VN', note: 'Gợi ý: Cực kỳ cảm động, nên mang khăn giấy.' },
  { id: 2, icon: '🏜️', name: 'Dune: Part Two (Hành Tinh Cát 2)', theaters: 'CGV IMAX', genre: 'Sci-Fi / Action', rating: 9.3, price: '150K', badge: '🌟 Blockbuster', note: 'Gợi ý: Trải nghiệm điện ảnh đỉnh cao, bắt buộc xem IMAX!' },
  { id: 3, icon: '🧟', name: 'Exhuma (Quật Mộ Trùng Ma)', theaters: 'CGV & Lotte', genre: 'Kinh dị / Tâm linh', rating: 8.9, price: '120K', badge: '👻 Siêu Hot', note: 'Gợi ý: Nhớ đi vệ sinh trước khi xem, phim rất cuốn!' },
  { id: 4, icon: '🐼', name: 'Kung Fu Panda 4', theaters: 'Tất cả rạp', genre: 'Hoạt hình / Hài', rating: 8.5, price: '100K', badge: '🐼 Family', note: 'Gợi ý: Siêu hài hước, xả stress cuối tuần rất hợp.' },
  { id: 5, icon: '🦍', name: 'Godzilla x Kong: Đế Chế Mới', theaters: 'CGV & BHD', genre: 'Hành động / Viễn tưởng', rating: 8.2, price: '130K', badge: '💥 Đánh Nhau', note: 'Gợi ý: Xem vì quái vật đánh nhau cực đã mắt.' },
  { id: 6, icon: '🌸', name: 'Đào, Phở và Piano', theaters: 'Trung tâm chiếu phim QG', genre: 'Lịch sử / Lãng mạn', rating: 9.0, price: '60K', badge: '🏛️ Lịch Sử', note: 'Gợi ý: Tự hào dân tộc, săn vé cực kỳ khó.' },
];

export const OUTFIT_STYLES: Record<string, { male: { desc: string, image: string, link: string }, female: { desc: string, image: string, link: string } }> = {
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

export const RENTAL_STYLES: Record<string, { male: { id: string, desc: string, stock: number, sizes: string[], price: number, image: string }, female: { id: string, desc: string, stock: number, sizes: string[], price: number, image: string } }> = {
  'Minimalism': {
    male: { id: 'Set #12', desc: 'Áo thun đen + Quần jean đen', stock: 5, sizes: ['S', 'M', 'L', 'XL'], price: 50000, image: 'https://images.unsplash.com/photo-1499939667766-4afceb292d05?w=400&h=600&fit=crop' },
    female: { id: 'Set #18', desc: 'Sơ mi trắng + Quần âu', stock: 4, sizes: ['S', 'M', 'L'], price: 50000, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=600&fit=crop' }
  },
  'Classic': {
    male: { id: 'Set #05', desc: 'Sơ mi oxford + Chino', stock: 6, sizes: ['M', 'L', 'XL'], price: 50000, image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop' },
    female: { id: 'Set #21', desc: 'Váy suông + Cardigan', stock: 3, sizes: ['S', 'M'], price: 50000, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop' }
  },
  'Old Money': {
    male: { id: 'Set #03', desc: 'Polo dệt kim + Quần âu', stock: 4, sizes: ['M', 'L'], price: 50000, image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=600&fit=crop' },
    female: { id: 'Set #14', desc: 'Sơ mi lụa + Váy midi', stock: 2, sizes: ['S', 'M', 'L'], price: 50000, image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=400&h=600&fit=crop' }
  },
  'Sporty': {
    male: { id: 'Set #07', desc: 'Hoodie + Jogger', stock: 8, sizes: ['M', 'L', 'XL'], price: 50000, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop' },
    female: { id: 'Set #09', desc: 'Croptop + Short thể thao', stock: 7, sizes: ['S', 'M', 'L'], price: 50000, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop' }
  },
  'Streetwear': {
    male: { id: 'Set #11', desc: 'Bomber + Cargo', stock: 5, sizes: ['L', 'XL'], price: 50000, image: 'https://images.unsplash.com/photo-1523398002811-999aa8d9512e?w=400&h=600&fit=crop' },
    female: { id: 'Set #16', desc: 'Hoodie crop + Túi hộp', stock: 4, sizes: ['S', 'M', 'L'], price: 50000, image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop' }
  },
  'Y2K': {
    male: { id: 'Set #22', desc: 'Graphic tee + Jean rách', stock: 6, sizes: ['M', 'L'], price: 50000, image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=600&fit=crop' },
    female: { id: 'Set #19', desc: 'Rib tank + Váy tennis', stock: 5, sizes: ['S', 'M'], price: 50000, image: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=400&h=600&fit=crop' }
  }
};

// ==========================================
// Date Miles & Gamification
// ==========================================

// 1. Interface cho hệ thống phần thưởng
export interface ActivityLog {
  id: string;
  reason: string;
  amount: number;
  timestamp: string;
}

export interface UserReward {
  totalMiles: number;
  level: string;
  completedDates: number;
  badges: string[];
  history: ActivityLog[];
}

// 2. Định nghĩa các cột mốc Level
export const MILESTONE_LEVELS = [
  { name: 'Newbie', min: 0, color: 'from-gray-400 to-slate-500', icon: '🌱' },
  { name: 'Explorer', min: 500, color: 'from-blue-400 to-cyan-500', icon: '🗺️' },
  { name: 'Dating Pro', min: 2000, color: 'from-purple-500 to-indigo-600', icon: '🏆' },
  { name: 'Master', min: 5000, color: 'from-rose-500 to-orange-500', icon: '👑' },
];

// 3. Hệ thống Huy hiệu
export const BADGES = [
  { id: 'first_date', name: 'First Date', icon: '💝', desc: 'Hoàn thành buổi hẹn đầu tiên' },
  { id: 'combo_king', name: 'Combo King', icon: '👑', desc: 'Hoàn thành 5 Combo AI' },
  { id: 'night_owl', name: 'Night Owl', icon: '🦉', desc: 'Hẹn hò sau 10 giờ tối' },
  { id: 'fashionista', name: 'Fashionista', icon: '✨', desc: 'Thuê đồ 3 lần trở lên' },
];

// 4. Mapping AI Theme sang Outfit Style
export const THEME_TO_OUTFIT_STYLE: Record<string, string> = {
  'Lãng mạn': 'Classic',
  'Sang trọng': 'Old Money',
  'Năng động': 'Sporty',
  'Tối giản': 'Minimalism',
  'Cổ điển': 'Vintage',
  'Vibe đường phố': 'Streetwear',
};

