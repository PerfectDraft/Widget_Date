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
];

// 4. Mapping AI Theme sang Outfit Style




export const REAL_LOCATIONS = [
  {
    "id": "loc_01",
    "name": "C'est Si Bon Cafe",
    "category": "Cafe",
    "theme": "Tối giản",
    "address": "276 Thái Hà, Đống Đa, Hà Nội",
    "price": 100000,
    "rating": 4.4,
    "mapsLink": "https://maps.app.goo.gl/XuHXX8jRypQmycGv8",
    "imageUrl": "https://www.google.com/maps/place/C%E2%80%99est+Si+Bon+Cafe/@21.0147779,105.8178526,3a,75.3y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDq3LSu5AE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFjV2EjlBB90k5kdQbeblMaBhUN-9_N5d7YbDvcssHxB8TWkxIy6PKA5LtD1oPaGZImQ1jW7vAhuccvZzAey-UPXWAK_X9m5CYfgovUQ-hl9cOu6l1GAK_3fEl_FjWivg0U0o-G%3Dw152-h86-k-no!7i1080!8i608!4m7!3m6!1s0x3135ab63492bc76f:0xb181e6886c1f0299!8m2!3d21.0148132!4d105.8179428!10e5!16s%2Fg%2F11d_9df98c?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0147779,
    "lng": 105.8178526
  },
  {
    "id": "loc_02",
    "name": "Cư Xá",
    "category": "Cafe",
    "theme": "Vintage,Bình Dân",
    "address": "Tầng 2, A11 khu tập thể Khương Thượng, Đống Đa, Hà Nội",
    "price": 100000,
    "rating": 4.6,
    "mapsLink": "https://www.google.com/maps/search/?api=1&query=C%C6%B0%20X%C3%A1",
    "imageUrl": "https://www.google.com/maps/place/C%C6%B0+X%C3%A1/@21.0052005,105.830713,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhBezeqZdOPLvvrjzkTf4FQq!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGaX4GW96Yu0CJekJ1UfEG4MXeToYOcKngoKw7rC4Y-xm6zkn1kBtCzyLkOltfX9uXI_vo2WFazD1OydX9a5mDl1POHQTr9Osn-RwaRhoJVJ6G0DTVQPbswHJVT3abaZKoKbHk04JSFsLnz%3Dw86-h114-k-no!7i4284!8i5712!4m11!1m2!2m1!1sCu+Xa+Ca+Phe+Dong+Da!3m7!1s0x3135ada9d3bde79d:0x93e4be63c96c5d7!8m2!3d21.0051663!4d105.8308154!10e5!15sChRDdSBYYSBDYSBQaGUgRG9uZyBEYVoWIhRjdSB4YSBjYSBwaGUgZG9uZyBkYZIBBGNhZmWaASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVUktaM0IxUkVoUkVBReABAPoBBAgAED4!16s%2Fg%2F11pcwth875?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0052005,
    "lng": 105.830713
  },
  {
    "id": "loc_03",
    "name": "Bún Chả Hương Liên",
    "category": "Food",
    "theme": "Bình dân",
    "address": "24 P. Lê Văn Hưu, Hai Bà Trưng, Hà Nội",
    "price": 60000,
    "rating": 4.1,
    "mapsLink": "https://maps.app.goo.gl/4D3xRwcqYbabTJTk9",
    "imageUrl": "https://www.google.com/maps/place/B%C3%BAn+ch%E1%BA%A3+H%C6%B0%C6%A1ng+Li%C3%AAn/@21.0178869,105.8539008,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhB7z4KE7LPkzfaq49QSGJI5!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAEZ7Vxnfxyfx5Cv4wlmAmbUQftdJL2-kM7U9qYTpC1aiVSu-8XnGeO_HU-q7EPwW-rBJ5VTZ3cNbIq6NSD8eGC8VhiGlgNl2TjRtpg-bSgPcU-snTT5AuD12oleqJsMvCIfT5VQEybwcAOf%3Dw86-h114-k-no!7i3072!8i4080!4m7!3m6!1s0x3135abf2a4ba685d:0x7e67963f30fa90e7!8m2!3d21.0181373!4d105.8538926!10e5!16s%2Fg%2F1hm5x9fjz?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0178869,
    "lng": 105.8539008
  },
  {
    "id": "loc_04",
    "name": "BÚN ỐC SƯỜN , SNAIL AND RIB NOODLES",
    "category": "Food",
    "theme": "Đường phố, Không gian mở",
    "address": "57 Hai Bà Trưng, Hà Nội",
    "price": 50000,
    "rating": 4,
    "mapsLink": "https://maps.app.goo.gl/bt6CQpc4gaqc6C2o9",
    "imageUrl": "https://www.google.com/maps/place/B%C3%9AN+%E1%BB%90C+S%C6%AF%E1%BB%9CN+,+SNAIL+AND+RIB+NOODLES/@21.0267893,105.8442102,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEJX57drykq6zdQ!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHBaZXGzW9lgkdyJWEg9m08VmyHLxDk4jOL0x09jIvyO2DWi00teh2nRtJdesdL25q1NxiL3Gr6OL5PNzjqbxQ6Tv_hZJ9TMd2rHgTTJaCKS6kW_MsVHynDe7lQcOJLDZTHX4RH%3Dw114-h86-k-no!7i5712!8i4284!4m7!3m6!1s0x3135ab0065d9b639:0x2d3250cad54665c3!8m2!3d21.026726!4d105.8441899!10e5!16s%2Fg%2F11wxlk5p7d?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0267893,
    "lng": 105.8442102
  },
  {
    "id": "loc_05",
    "name": "Bò Tơ Quán Mộc Thái Thịnh",
    "category": "Food",
    "theme": "Cổ Kính",
    "address": "102 Thái Thịnh, Đống Đa, Hà Nội",
    "price": 250000,
    "rating": 4.7,
    "mapsLink": "https://maps.app.goo.gl/XezBL8zLPcLiDumS8",
    "imageUrl": "https://www.google.com/maps/place/B%C3%B2+T%C6%A1+Qu%C3%A1n+M%E1%BB%99c+Hoa+L%C6%B0/@21.0101553,105.8478016,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgMCQxaCn0gE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFMlpOvKALKH_GKaJDMiY7W2Z9kZxXYFNJOsqxFArDHopTpVQdEoUEXm1JxmdxSZbotFPPQhmgzBqJqmUhSrnBe5xajHrnb3Z8dZd31VooGk1FvLZK1ySzuiPO30xbZ7aiSB6y7DA%3Dw114-h86-k-no!7i1242!8i929!4m11!1m2!2m1!1sBo+To+Quan+Moc+Dong+Da!3m7!1s0x3135ab4e1ba19b37:0x1efd1e5c66f3c162!8m2!3d21.0101644!4d105.8477166!10e5!15sChZCbyBUbyBRdWFuIE1vYyBEb25nIERhIgOIAQFaGCIWYm8gdG8gcXVhbiBtb2MgZG9uZyBkYZIBCnJlc3RhdXJhbnSaASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVTkNkRFpRTmtobkVBReABAPoBBAhWEDM!16s%2Fg%2F11fnyjnr82?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0101553,
    "lng": 105.8478016
  },
  {
    "id": "loc_06",
    "name": "Bún Chả Chan",
    "category": "Food",
    "theme": "Nhỏ nhắn, Bình Dân",
    "address": "114 Mai Hắc Đế, Hai Bà Trưng, Hà Nội",
    "price": 50000,
    "rating": 4,
    "mapsLink": "https://maps.app.goo.gl/rGt7WYeCoDNLrz1VA",
    "imageUrl": "https://www.google.com/maps/place/B%C3%BAn+Ch%E1%BA%A3+Chan/@21.0102342,105.8507986,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIC76oe_ygE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGg9876qJjs2MxkFjoa-spWvlV3CMLB2onfsho1NbSuKBSXZYjyHFomaSMShTsjw8GWIFzYzD49GSy41hHWh3ndN8DB4mVXlXPjaEhsL7c53jstJHEsDE9j0S3Yjkwv4wEzxbAk%3Dw129-h86-k-no!7i1620!8i1080!4m11!1m2!2m1!1sBun+Cha+Chan+Hai+Ba+Trung!3m7!1s0x3135ab8ae1db22d5:0xacde5335e40d6dc7!8m2!3d21.0102238!4d105.850733!10e5!15sChlCdW4gQ2hhIENoYW4gSGFpIEJhIFRydW5nWhsiGWJ1biBjaGEgY2hhbiBoYWkgYmEgdHJ1bmeSAQtub29kbGVfc2hvcJoBRENpOURRVWxSUVVOdlpFTm9kSGxqUmpsdlQya3dNVkZzU1hoTmJteHJWSHBhYlZSRk5UUlJNbWhGWTFWd1RWSXlZeEFC4AEA-gEECAAQKw!16s%2Fg%2F11btrrqs3y?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0102342,
    "lng": 105.8507986
  },
  {
    "id": "loc_07",
    "name": "Vien Dining",
    "category": "Food",
    "theme": "Vintage",
    "address": "3 Ba Trieu Alley, Hai Ba Trung, Hà Nội",
    "price": 700000,
    "rating": 4.7,
    "mapsLink": "https://maps.app.goo.gl/9BzJMJXEBUMvsTna9",
    "imageUrl": "https://www.google.com/maps/place/Vien+Dining/@21.0125845,105.8486879,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgICvkObOrgE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAEW2P81VbnRkcQN53kFct3F1lVz7uIpzCCiXdz21hkkh-EN3sJ5xxEnlFb3lKTDe4cuurTd3FvUfgM2fRZNygyEPHlwSiBPf8hg-l9P7ZixT_XxgNsFuj_bgmXrd4MKEAI6Poipzw%3Dw86-h129-k-no!7i4380!8i6570!4m7!3m6!1s0x3135ab006dc7e3f7:0x5f922f987120ce67!8m2!3d21.0125431!4d105.8486699!10e5!16s%2Fg%2F11vk0c6g1p?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0125845,
    "lng": 105.8486879
  },
  {
    "id": "loc_08",
    "name": "Ok Coffee",
    "category": "Cafe",
    "theme": "Hang đá,Không gian mở",
    "address": "41A P. Võ Văn Dũng, Chợ Dừa, Đống Đa, Hà Nội, Việt Nam",
    "price": 45000,
    "rating": 4.6,
    "mapsLink": "https://maps.app.goo.gl/yjWrDeKVjypcByvdA",
    "imageUrl": "https://www.google.com/maps/place/Ok+Coffee+-+41A+V%C3%B5+V%C4%83n+D%C5%A9ng/@21.0155989,105.8244194,3a,75y/data=!3m8!1e2!3m6!1sCIABIhC2Fj5Lg5XljAg3nr7GmJEN!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFhP_Ai-d6u663m_n9-ZYt8BI8o6S6yqrFhPEclIEbwRlWLDNtre6YTK1Wz8PjLi_d1lgPLobj4SnsSa3r4H2uJ1EeZow6MZCW-_SoL5xmwUHMvk7mL7BkAkQJ_1ePR17bel6jdgl1AmKfn%3Dw114-h86-k-no!7i4032!8i3024!4m7!3m6!1s0x3135ab502d6faa2b:0x4e29d60676078e74!8m2!3d21.015674!4d105.8244644!10e5!16s%2Fg%2F11xfdddsc3?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0155989,
    "lng": 105.8244194
  },
  {
    "id": "loc_09",
    "name": "Contrast Coffee",
    "category": "Cafe",
    "theme": "Công nghiệp",
    "address": "Số 264 ngõ Văn Chương, Đống Đa, Hà Nội",
    "price": 55000,
    "rating": 4.2,
    "mapsLink": "https://maps.app.goo.gl/MAUaCi7R133DRpXE7",
    "imageUrl": "https://www.google.com/maps/place/Contrast+Coffee/@21.0208338,105.835832,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDdibj0qQE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFFRPlHzxH4XMJT8TuDYvzgFuDuQtz2_3Fj82_Pb35g5mWSb76trQ8JmKWIzK_AyYyxgLP3FY2Q6uQ-cUa_eKCSW-hJNs0czIWV1tBYxLN-9ThUZYsadwq4nvw3TuFkWvabj6Kv0A%3Dw129-h86-k-no!7i2560!8i1706!4m7!3m6!1s0x3135ab0056efbdb9:0xcd3e9e1e762daa56!8m2!3d21.0207372!4d105.8357993!10e5!16s%2Fg%2F11vt0x6l6_?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0208338,
    "lng": 105.835832
  },
  {
    "id": "loc_10",
    "name": "Hầm Trú Ẩn Cafe",
    "category": "Cafe",
    "theme": "Độc lạ",
    "address": "Số 78 ngõ Trung Tiền, Khâm Thiên, Đống Đa, Hà Nội",
    "price": 50000,
    "rating": 4,
    "mapsLink": "https://maps.app.goo.gl/T5tD19uhbcwB7g4d9",
    "imageUrl": "https://www.google.com/maps/place/H%E1%BA%A7m+Tr%C3%BA+%E1%BA%A8n+Cafe/@21.0204895,105.8384632,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhAdnh-2LiYhAgVT6Oen_L61!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAEEeJEgq0-5kAlXnwouAKkezcEqbZGMP8yn-_sVtwGuKo0Rfs-d5aYmyUSKNofZNviCi3argrGjJJJ8Jj4Ajj_b1GeQB4Jxw-3rcBJpe1vR2mge84k-wwt24JOhjOUX2O6HTB-Sr-h4e6c%3Dw114-h86-k-no!7i2568!8i1926!4m11!1m2!2m1!1sHam+Tru+An+Cafe+Dong+Da!3m7!1s0x3135abaa86d73ec9:0xfed5e852961e3d6f!8m2!3d21.0201797!4d105.8385437!10e5!15sChdIYW0gVHJ1IEFuIENhZmUgRG9uZyBEYVoZIhdoYW0gdHJ1IGFuIGNhZmUgZG9uZyBkYZIBC2NvZmZlZV9zaG9wmgFEQ2k5RFFVbFJRVU52WkVOb2RIbGpSamx2VDI1cmVGa3dTbWxrYWxKb1ZFWm9XVlV5WnpSVFJsVjRVVEZTV1V4V1JSQULgAQD6AQQIGxAZ!16s%2Fg%2F11svrbvf42?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0204895,
    "lng": 105.8384632
  },
  {
    "id": "loc_11",
    "name": "Lermalermer Cafe",
    "category": "Cafe",
    "theme": "Cổ điển, Bình yên",
    "address": "16 Ngõ Yên Thế, Đống Đa, Hà Nội",
    "price": 50000,
    "rating": 4.7,
    "mapsLink": "https://maps.app.goo.gl/tnAUUpESdgLWwVcK9",
    "imageUrl": "https://www.google.com/maps/place/Lermalermer/@21.0286571,105.8401677,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhBSEM3MMS-jjE-vLDFcAELn!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGbPUZZOMABKwH8z6lpjJM7XgEHicco_ZuhTAi5wfMPmCu4B1MnF3Dn4VPBrAk2Vk4xX-5v-iyaUg59z1EmIFiF2vqwgl0PPZXxi3c0lmBMDFJ4QITC2kwEHj110huvSzBZuntcBlCihWo8%3Dw86-h86-k-no!7i2490!8i2490!4m7!3m6!1s0x3135ab76bfb0291f:0x9d4a17b6b0f70c64!8m2!3d21.0286573!4d105.8402251!10e5!16s%2Fg%2F11fmyj_6lv?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0286571,
    "lng": 105.8401677
  },
  {
    "id": "loc_12",
    "name": "Nhà hàng Ngọc Mai Vàng",
    "category": "Food",
    "theme": "Không gian rộng, Tầng cao ,Sang trọng",
    "address": "Tầng 17 Ruby Plaza, 44 Lê Ngọc Hân, Hai Bà Trưng, Hà Nội",
    "price": 350000,
    "rating": 3.5,
    "mapsLink": "https://maps.app.goo.gl/XuKZLuosmzRssi328",
    "imageUrl": "https://www.google.com/maps/place/Nh%C3%A0+H%C3%A0ng+Ng%E1%BB%8Dc+Mai+V%C3%A0ng/@21.0159374,105.8551246,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDEjqSolAE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAH9dJUBVm0hIyrOWwyS-o3KQkWdru25Pzein-ptkiZ8kiEWq9R5vGJZu65rxik2fV0sqFNXBmi0q_SGEm0Ml3A9c8klzlQS3KQlCliz5eDD_wm5tkvtkzUCF_vdBHJjVlcAcEp2uw%3Dw114-h86-k-no!7i4032!8i3024!4m7!3m6!1s0x3135abf3aab9e8cb:0xa41a25eaa6745786!8m2!3d21.0159501!4d105.8552593!10e5!16s%2Fg%2F11b7st_n1v?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0159374,
    "lng": 105.8551246
  },
  {
    "id": "loc_13",
    "name": "Papa's Dessert Cafe",
    "category": "Cafe",
    "theme": "Ngọt ngào, Dễ thương",
    "address": "10 P. Khúc Hạo, Điện Biên, Ba Đình, Hà Nội, Việt Nam",
    "price": 55000,
    "rating": 3.9,
    "mapsLink": "https://maps.app.goo.gl/JxK86QtRQABxckMq5",
    "imageUrl": "https://www.google.com/maps/place/Papa%E2%80%99s+Dessert+%26+Cafe/@21.0319701,105.8372267,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgICB_eqjswE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAH5hvlyS4qSvVpZBM1sQo_zat9F11pI36DMwxe0VEpmXga5kV1GIWps4JIEjE9bnVZHEbnknfnP7SPDcIS8x7rJdOUSb9LPxeve23bZTHPDnwUgQkS0qowPjXdxvo9tuseVZpNt6w%3Dw86-h107-k-no!7i1638!8i2048!4m11!1m2!2m1!1sPapa+Dessert+Cafe+Dong+Da!3m7!1s0x3135ab989cd916af:0x593404a108e6a900!8m2!3d21.031998!4d105.8370746!10e5!15sChlQYXBhIERlc3NlcnQgQ2FmZSBEb25nIERhWhsiGXBhcGEgZGVzc2VydCBjYWZlIGRvbmcgZGGSAQRjYWZlmgEjQ2haRFNVaE5NRzluUzBWSlEwRm5UVVJCY0hRMmVGZEJFQUXgAQD6AQUIkwQQLw!16s%2Fg%2F11cm3v6_cc?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0319701,
    "lng": 105.8372267
  },
  {
    "id": "loc_14",
    "name": "Grille6 Steakhouse",
    "category": "Food",
    "theme": "Châu Âu trầm ấm",
    "address": "184 Hào Nam, Đống Đa, Hà Nội",
    "price": 250000,
    "rating": 4.7,
    "mapsLink": "https://maps.app.goo.gl/ZNStx4BD4mE9xt8YA",
    "imageUrl": "https://www.google.com/maps/place/Grille6+Steakhouse/@21.0273309,105.8276275,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhBKBwImI-xoTLy8j5ENTccw!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGQ8N8bpHAhZ6YXKVGKrskqFz83k7SIwHzK9o0o688MoWfqN74llATETJrzcPMWW7RU_Uzbv25GpIR8ivQkpKjaylfuR6rXQHqgO9JMmof614JvcPHatVX8lU7j1WVL18A-I1-kXhCgUku6%3Dw114-h86-k-no!7i1280!8i960!4m7!3m6!1s0x3135ab75e124ea45:0x2ff1e87739cd54e8!8m2!3d21.0272729!4d105.8277158!10e5!16s%2Fg%2F1q5glvx21?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0273309,
    "lng": 105.8276275
  },
  {
    "id": "loc_15",
    "name": "Lofita Love Station",
    "category": "Cafe",
    "theme": "Sân thượng, Bắt sáng",
    "address": "Tầng 9 - 10, số 338 Phố Huế, Hai Bà Trưng, Hà Nội",
    "price": 60000,
    "rating": 4.5,
    "mapsLink": "https://maps.app.goo.gl/MT7Yh2g73ezTeck99",
    "imageUrl": "https://www.google.com/maps/place/Lofita+Cafe/@21.0204078,105.8547424,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIC6nPv6nQE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGCpAy_qbHHa-EPrEDQb5RJS3KhvkNzTHVk_2HbVPt0x4gz7n5w3-4uv-rlqJDw-BO1MKC58vdO7HL3Q6YQmskZS6ofIMVu4omGXxOjxMb8kNpzV0qIbpaqY8-h3qYGOaM6gxTd%3Dw114-h86-k-no!7i2048!8i1536!4m7!3m6!1s0x3135ab49217355cb:0x44a701b32b36e5f!8m2!3d21.0204289!4d105.8546547!10e5!16s%2Fg%2F11j34jbbbb?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0204078,
    "lng": 105.8547424
  },
  {
    "id": "loc_16",
    "name": "Sam Rooftop Coffee",
    "category": "Cafe",
    "theme": "Tầm nhìn thoáng đạt",
    "address": "XRX7+92 Thanh Xuân, Hà Nội, Việt Nam",
    "price": 60000,
    "rating": 4.5,
    "mapsLink": "https://maps.app.goo.gl/hk3uJdesYUPARQ9p6",
    "imageUrl": "https://www.google.com/maps/place/Sam+Rooftop+Coffee/@20.9984264,105.8125771,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhCuiO6VLPJZGOdt2akN9Fpd!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHK8h--kArcol8FCaa75tSTzZBgNpsncY1Z5jsqTtA4KTs5Cfm3X2G45p2zCk3EOf6NdR-8PiQF_ZjZpbJxTO-kM-u4RXRIhex-IhgzPM14lF1EaRuluECdTVBA1HIxnfbKZtoLuzLck6M%3Dw92-h86-k-no!7i1297!8i1203!4m11!1m2!2m1!1sSam+Rooftop+Coffee+Dong+Da!3m7!1s0x3135ad83835abfcd:0x49b19d6cf9fccc76!8m2!3d20.9984024!4d105.8125412!10e5!15sChpTYW0gUm9vZnRvcCBDb2ZmZWUgRG9uZyBEYVocIhpzYW0gcm9vZnRvcCBjb2ZmZWUgZG9uZyBkYZIBBGNhZmWaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMnRrYWxSWFVrVmlWMWwzV2xoQ1RGcEdXbUZXVm5CMFYxWmpNMWxyUlJBQuABAPoBBQjPARBC!16s%2Fg%2F11hf6lts31?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 20.9984264,
    "lng": 105.8125771
  },
  {
    "id": "loc_17",
    "name": "Rauta House Cofe",
    "category": "Cafe",
    "theme": "Vintage",
    "address": "1 Ngõ 97 Nguyễn Chí Thanh, Láng Hạ, Láng, Hà Nội, Việt Nam",
    "price": 50000,
    "rating": 4.4,
    "mapsLink": "https://maps.app.goo.gl/FTUa3qkVqyppBAoo8",
    "imageUrl": "https://www.google.com/maps/place/Rauta+House+Cafe/@21.0185575,105.8078994,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDCoYOjEg!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHrNVRSYTvEr_OLpT0zAgBNSf_ulMpcX03TGRwdnAp4_RbQAkl48_gN85YfVKGFo-VvMr3_dve1U-YGV79jPP3WKM_dr0lt0jGUUrmwYujNTbQNM0G0KD3FrVuGYliTe30YN2Td%3Dw114-h86-k-no!7i4032!8i3024!4m11!1m2!2m1!1sRauta+House+Dong+Da!3m7!1s0x3135ab6723103cd1:0xb41f3c59e1fe504b!8m2!3d21.0185575!4d105.8078994!10e5!15sChNSYXV0YSBIb3VzZSBEb25nIERhWhUiE3JhdXRhIGhvdXNlIGRvbmcgZGGSAQRjYWZl4AEA!16s%2Fg%2F1q64phjzh?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0185575,
    "lng": 105.8078994
  },
  {
    "id": "loc_18",
    "name": "Cafe Nhà Kho",
    "category": "Cafe",
    "theme": "Thời bao cấp, Nhạc Trịnh",
    "address": "104B2, Khu tập thể Bắc Thành Công, Giảng Võ, Hà Nội, Việt Nam",
    "price": 45000,
    "rating": 4.5,
    "mapsLink": "https://maps.app.goo.gl/YVbfLUouYfnNeKgj8",
    "imageUrl": "https://www.google.com/maps/place/C%C3%A0+ph%C3%AA+Nh%C3%A0+Kho/@21.0212371,105.8151939,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDqnNqGcQ!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAE1QOzogOrhJb_esnD-rorpZ2evpQJ2-Nhs5l-wQNnIImvb6oZJiLn6KcYJTtSqiUv3iPJfZJw9mCyt2rmIvq3sQl-8VSYKW7qNSBI9Z5KM_IR29ipl2ZGFeb11C7c955oaqjDv%3Dw86-h86-k-no!7i750!8i758!4m11!1m2!2m1!1sCafe+Nha+Kho+Dong+Da!3m7!1s0x3135abc21a4ce823:0xfc26d6e4a88129f6!8m2!3d21.0212804!4d105.8151908!10e5!15sChRDYWZlIE5oYSBLaG8gRG9uZyBEYVoWIhRjYWZlIG5oYSBraG8gZG9uZyBkYZIBBGNhZmWaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMjF3TVdOcVJrWmxWVVpPV2tSck1sTnFXWFJNVmxaUFQwVTFjbE5yUlJBQuABAPoBBAgAEEE!16s%2Fg%2F11s0t255gj?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0212371,
    "lng": 105.8151939
  },
  {
    "id": "loc_19",
    "name": "TỔ CHIM XANH - BLUEBIRDS' NEST",
    "category": "Cafe",
    "theme": "Công nghiệp,Study place",
    "address": "27 Đặng Dung Ngõ 27, P. Đặng Dung/20 Ng. Yên Thành, đối diện, Ba Đình, Hà Nội, Việt Nam",
    "price": 45000,
    "rating": 4.6,
    "mapsLink": "https://maps.app.goo.gl/a8UmsTrFL2Lm6qyaA",
    "imageUrl": "https://www.google.com/maps/place/T%E1%BB%94+CHIM+XANH+-+BLUEBIRDS'+NEST/@21.0419678,105.8412529,3a,75y/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDu_6yxxwE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGBR0NokZTK2LqWlz1gXWlKmt0-JNPFM5cEZ0yfwBufGMe4ow3a7fV7boHX1DZ1SFC81BjyStTwejncuMOR5tjs0_USCZbGzi4EvgQvfGqXrrVXJq6SDrZU8hbX4solWTwoBNDAOA%3Dw116-h86-k-no!7i3571!8i2635!4m7!3m6!1s0x3135abbab0d6c891:0xe7cd99fe7b59ab75!8m2!3d21.0419391!4d105.8414268!10e5!16s%2Fg%2F11bwh5rpc1?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0419678,
    "lng": 105.8412529
  },
  {
    "id": "loc_20",
    "name": "Quán Bánh Đúc Nóng bà Nội",
    "category": "Food",
    "theme": "cổ điển",
    "address": "Ngõ 8 Lê Ngọc Hân, Hai Bà Trưng, Hà Nội",
    "price": 35000,
    "rating": 4.3,
    "mapsLink": "https://maps.app.goo.gl/mEPKoAFRWAYh6r4o6",
    "imageUrl": "https://www.google.com/maps/place/Qu%C3%A1n+B%C3%A1nh+%C4%90%C3%BAc+N%C3%B3ng+b%C3%A0+N%E1%BB%99i/@21.0167613,105.8553367,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhARj2N1DzOuekBB6dLOSmPg!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGFyUrAhNy8c5EHjFOf46JT3E8668v-p4iwikqWkbSBesYdT2jSrCcyzwgVCsXkgXF20aKCYr4yLRDt7Z-R1P9lia2Zr1YgyranDsYVCvRdiY63yMo7XuI0t0ZtGl-DAmKFlZp45m9UHw%3Dw95-h86-k-no!7i1171!8i1057!4m7!3m6!1s0x3135abf2f4393611:0x678514239b4702e4!8m2!3d21.0167655!4d105.8549757!10e5!16s%2Fg%2F11c45nyjbh?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0167613,
    "lng": 105.8553367
  },
  {
    "id": "loc_21",
    "name": "Mỳ gà tần Hàng Bồ",
    "category": "Food",
    "theme": "Vỉa hè ban đêm",
    "address": "24 Hàng Bồ, Hoàn Kiếm, Hà Nội",
    "price": 50000,
    "rating": 4.1,
    "mapsLink": "https://maps.app.goo.gl/R5TpHB9U2zN5CPjk6",
    "imageUrl": "https://www.google.com/maps/place/M%E1%BB%B3+G%C3%A0+T%E1%BA%A7n+24+(Th%C3%B9y+Li%C3%AAn)/@21.0339164,105.8492552,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgICc89eNigE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHj6BDUXOLNfSw8RQn_zpsWgUhESoWABW61Zx4Z5q_TmGEShI1t-Mvy4kG2A-QZH4q0-7fcwjl-Qnaw7SdeXdwffHJyv69_WvxePHn8mn1WZNcNLmahN5KFRxZrk-i3i74-FGDnwA%3Dw129-h86-k-no!7i2048!8i1365!4m11!1m2!2m1!1sMy+Ga+Tan+Hang+Bo!3m7!1s0x3135abbf047539df:0x8687e28a4175811c!8m2!3d21.0340307!4d105.8496598!10e5!15sChFNeSBHYSBUYW4gSGFuZyBCb1oTIhFteSBnYSB0YW4gaGFuZyBib5IBC25vb2RsZV9zaG9wmgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVU5NYzFsUFh5MVJSUkFC4AEA-gEFCJwBEDc!16s%2Fg%2F11bws8k3gl?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0339164,
    "lng": 105.8492552
  },
  {
    "id": "loc_22",
    "name": "Kampong Chicken House - Cơm gà Hải Nam",
    "category": "Food",
    "theme": "Chuẩn Singapore, Hiện đại",
    "address": "12 P. Phạm Ngọc Thạch, Kim Liên, Hà Nội 100000, Việt Nam",
    "price": 90000,
    "rating": 4.5,
    "mapsLink": "https://maps.app.goo.gl/JjFPjdRm3FY7uAuc9",
    "imageUrl": "https://www.google.com/maps/place/Kampong+Chicken+House+-+C%C6%A1m+g%C3%A0+H%E1%BA%A3i+Nam/@21.0078238,105.8333528,3a,75y,90t/data=!3m8!1e5!3m6!1sCIHM0ogKEICAgIDipYqzAg!2e10!3e10!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGZAaIVcpuBxHKe1X8FxxQIT0mx2aVcx8m5rV9RQ1au_S7bY9jPyjhYRwYlo6OiREgMARSisbmwP3DSxwJKvpkmcEzDNX0v2onX5Xk-AZTFa7jnlgKCrn2PsZF87AA2Sy1WujOt%3Dw152-h86-k-no!7i1920!8i1080!4m7!3m6!1s0x3135ad82a820fb13:0x7ee86609c49b57d!8m2!3d21.0078105!4d105.8333663!10e5!16s%2Fg%2F11h336mj1v?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0078238,
    "lng": 105.8333528
  },
  {
    "id": "loc_23",
    "name": "Blackbird Coffee",
    "category": "Cafe",
    "theme": "Công xưởng, Workspace",
    "address": "Số 5 Chân Cầm, Hàng Trống, Hoàn Kiếm, Hà Nội",
    "price": 60000,
    "rating": 4.7,
    "mapsLink": "https://maps.app.goo.gl/SA8vHVPh2aJAHGqT8",
    "imageUrl": "https://www.google.com/maps/place/Blackbird+Coffee/@21.0303682,105.8484866,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgID8sYLH8wE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAH66x6_YnXJy5LUjMY5tEhnMyEPnPfhW22novKzZszZ4A6Nj-Xw7xQV0PiEi2tgDOLkprGAxItv9RbF0nXtg7yNsPEP3--FZKfpI6-_BMHHpoQjMeuN1xnqMknuyi9pj-Zdc8vqEQ%3Dw86-h86-k-no!7i2951!8i2951!4m11!1m2!2m1!1shttps+www+google+com+maps+search%2F%3Fapi+1%26query+Blackbird+Coffee+Hoan+Kiem!3m7!1s0x3135ab4ceeff3cbb:0xca4f0cd2de5c07dc!8m2!3d21.0303182!4d105.8485126!10e5!15sCkhodHRwcyB3d3cgZ29vZ2xlIGNvbSBtYXBzIHNlYXJjaC8_YXBpIDEmcXVlcnkgQmxhY2tiaXJkIENvZmZlZSBIb2FuIEtpZW0iA4gBAZIBBGNhZmXgAQA!16s%2Fg%2F11f62dzqyq?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0303682,
    "lng": 105.8484866
  },
  {
    "id": "loc_24",
    "name": "Nhà Hàng Ban Công",
    "category": "Food",
    "theme": "Quý tộc Đông Dương",
    "address": "Số 2 Đinh Liệt, Hoàn Kiếm, Hà Nội",
    "price": 100000,
    "rating": 4.8,
    "mapsLink": "https://maps.app.goo.gl/AVFepmrS3RwH9UDs8",
    "imageUrl": "https://www.google.com/maps/place/Nh%C3%A0+H%C3%A0ng+Ban+C%C3%B4ng/@21.0337161,105.8520202,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDm9LWI3QE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGOkaupNw-dUSltKk7OamuYId5FyLCrjd_L9XjBppIBtNN1PmKHuIOCvWrLcIX1aDPfUVoSsAx2etXiWjXkZY05Ksxnk-2viHjbcnCC7ChWsUMZTeqkStKTCGTzqktUkx3WmdpAow%3Dw152-h86-k-no!7i3024!8i1702!4m7!3m6!1s0x3135abb2f0780dd1:0xe1da2a3e23851876!8m2!3d21.0337234!4d105.8519764!10e5!16s%2Fg%2F11h5411lf0?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0337161,
    "lng": 105.8520202
  },
  {
    "id": "loc_25",
    "name": "Le Beaulieu",
    "category": "Food",
    "theme": "Sang trọng, Kiểu Pháp",
    "address": "15 P. Ngô Quyền, Tràng Tiền, Hoàn Kiếm, Hà Nội 100000, Việt Nam",
    "price": 2500000,
    "rating": 4.4,
    "mapsLink": "https://maps.app.goo.gl/FL4Q6mismGM6AA186",
    "imageUrl": "https://www.google.com/maps/place/Le+Beaulieu/@21.0256993,105.855419,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDO5oDeBA!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHtbZAIxgxWz-5gL4XXfOrX_ziVHATZMybQOLijc_aJksfvIZ-1E8FSNVMVTSe9x43pvRw_zGPUnUEFkS3xRm11OsYnuqyWu7f2_o3ocq2Sd-rp0aZ9jw0bTGqEEa3uhrbh1W6w%3Dw129-h86-k-no!7i3000!8i2000!4m7!3m6!1s0x3135abecf2afaabb:0xf1ba4c0644198f49!8m2!3d21.0256558!4d105.8555804!10e5!16s%2Fg%2F1wc45gh5?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0256993,
    "lng": 105.855419
  },
  {
    "id": "loc_26",
    "name": "Cafe Giảng",
    "category": "Cafe",
    "theme": "Ẩm thực di sản",
    "address": "Số 39 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội",
    "price": 70000,
    "rating": 4.4,
    "mapsLink": "https://maps.app.goo.gl/9Kab1SYRL9UDjy9Q6",
    "imageUrl": "https://www.google.com/maps/place/Cafe+Gi%E1%BA%A3ng/@21.0334713,105.8544221,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhB0IYxmF68XuiqpZ058gU3t!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFVglLAtamDNTi7ooipYEUFvDXvWR666NVwy5NTWdJbTBxJ_3OftRrC7e0uf7hfspnjomoBc443Du5PUc8G9TtBqqd2OA6W9NT7Tyc0fCpPd55ArFTsGaixaf_PSwYkNPU1o0JhUXtxmH0%3Dw86-h114-k-no!7i3060!8i4080!4m7!3m6!1s0x3135abc0ee85335d:0xfca3408ac50e7363!8m2!3d21.0334664!4d105.854518!10e5!16s%2Fg%2F11bxg4n3g3?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0334713,
    "lng": 105.8544221
  },
  {
    "id": "loc_27",
    "name": "Phở 10 Lý Quốc Sư",
    "category": "Food",
    "theme": "Nhộn nhịp, Phố Cổ",
    "address": "10 Lý Quốc Sư, Hoàn Kiếm, Hà Nội",
    "price": 70000,
    "rating": 4.1,
    "mapsLink": "https://maps.app.goo.gl/Wwgbj7bqKo25XgQ2A",
    "imageUrl": "https://www.google.com/maps/place/Ph%E1%BB%9F+10+L%C3%BD+Qu%E1%BB%91c+S%C6%B0/@21.0305144,105.848865,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIC76veWNg!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFp-6P0vGWKo0dX9G4kvHpKmwtdj_1P8i0XKxA6dwnpEkVDSYvFKDhY3f04C2Oyv4U20hFDaSERl1s4ZBOrkPuO4PzUBd_tVCuOJpZF_vcaVI2gzLJbhhWTpm7GXNHz2tIQTXhz%3Dw152-h86-k-no!7i5712!8i3213!4m7!3m6!1s0x3135ab9588b10501:0xf8a3cc53d3aad1eb!8m2!3d21.0304962!4d105.8487892!10e5!16s%2Fg%2F11fxf7gy7d?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0305144,
    "lng": 105.848865
  },
  {
    "id": "loc_28",
    "name": "Bún Chả Đắc Kim",
    "category": "Food",
    "theme": "Đặc sản lâu đời",
    "address": "1 Hàng Mành, Hoàn Kiếm, Hà Nội",
    "price": 60000,
    "rating": 3.9,
    "mapsLink": "https://maps.app.goo.gl/LMJLYrSTL5LfPNXc6",
    "imageUrl": "https://www.google.com/maps/place/B%C3%BAn+Ch%E1%BA%A3+%C4%90%E1%BA%AFc+Kim/@21.0322627,105.8481153,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhACIJ-TgVCCoS3uqVVQWyZx!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHZqDsrrzH8Iw1ItBK_yJMdV76eSzrTOGbQsbaO2j3SDHbEgYumAY19X6oL4hKItfTCRq94qOTYR5Os2VL95xqnFWsrL6w0Nf1p-FUnx-1xwIPQU9yl6UahfvEyJZ09b8un3ln4_8WPWU-K%3Dw114-h86-k-no!7i4000!8i3000!4m7!3m6!1s0x3135abbe40899a17:0x9aa20a2ad5a0f0e4!8m2!3d21.0322493!4d105.8482095!10e5!16s%2Fg%2F1thpz5ms?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0322627,
    "lng": 105.8481153
  },
  {
    "id": "loc_29",
    "name": "L'etage",
    "category": "Cafe",
    "theme": "Gác lầu, Ban công phố",
    "address": "9A P. Hàng Khay, Tràng Tiền, Cửa Nam, Hà Nội, Việt Nam",
    "price": 50000,
    "rating": 4.5,
    "mapsLink": "https://maps.app.goo.gl/AHfuQiN4wySntchMA",
    "imageUrl": "https://www.google.com/maps/place/L'etage+Cafe/@21.0255073,105.8527225,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgID4hLj6jAE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHZd5RQyYiWvfLl0esZf7FVzkvZvbkmJRkwCDk7ACQI6SPOEKRoGfCjdM2H7vFOWiWPJ6m33xW3-iDQDd6i_qslcjeBaIZ8NdTwgQjwRfPjZ9sGNx7puHylZ_2EBr7TfyiFXw2Zcg%3Dw129-h86-k-no!7i3000!8i2000!4m7!3m6!1s0x3135abeb4cff8759:0xa0accfa5242316d!8m2!3d21.0255073!4d105.8527225!10e5!16s%2Fg%2F11ckq2rlqc?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0255073,
    "lng": 105.8527225
  },
  {
    "id": "loc_30",
    "name": "Bún ốc cô Huệ",
    "category": "Food",
    "theme": "Đơn sơ, Gánh hàng rong",
    "address": "43 Nguyễn Siêu, Hoàn Kiếm, Hà Nội",
    "price": 45000,
    "rating": 4.5,
    "mapsLink": "https://maps.app.goo.gl/8vbfXUJmzf43HHfT7",
    "imageUrl": "https://www.google.com/maps/place/B%C3%BAn+%E1%BB%91c+c%C3%B4+Hu%E1%BB%87/@21.0363846,105.8510352,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhBQNWZxgh4CeLhKNduLcCyX!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAE400TEIWrJzYPXcXt5XOELuzDa6443t_2-GAzdHOoq3efVNRtpOKJdhFUuzg9TAqHoBuMzLikrKzl3F1idjS5V2TyC657pIWTa7MYiAny8yPA0iEZ4ltr-W_fwg_pFNKhRoyyfgFysZRQ%3Dw86-h114-k-no!7i4284!8i5712!4m7!3m6!1s0x3135ab0005bdbbcd:0xb62805c977b3b8c9!8m2!3d21.0363285!4d105.8510527!10e5!16s%2Fg%2F11lv_wj886?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0363846,
    "lng": 105.8510352
  },
  {
    "id": "loc_31",
    "name": "The Note Coffee",
    "category": "Cafe",
    "theme": "Post-it Notes rực rỡ",
    "address": "64 Lương Văn Can, Hoàn Kiếm, Hà Nội",
    "price": 50000,
    "rating": 4.3,
    "mapsLink": "https://maps.app.goo.gl/A8jrimAWdfs8HipE7",
    "imageUrl": "https://www.google.com/maps/place/The+Note+Coffee/@21.0315887,105.8509355,3a,75y,90t/data=!3m8!1e5!3m6!1sCIHM0ogKEICAgID8lo-B7wE!2e10!3e10!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHJemNfNny3BpBUWHkDl-Ycb_u5Aa35kwcvRJkUeAq0x2e4BOdWyfa7ojY6DBOeos7lCvEBiC2wKqqQpH6Ub1YiSJNmbEMkE8GEyGZ99GMcxhmH-62KD5mVlScqzV8LXL_NDDunRw%3Dw152-h86-k-no!7i720!8i406!4m7!3m6!1s0x3135abbfc294b397:0xd53005101f42b4af!8m2!3d21.0315927!4d105.8508961!10e5!16s%2Fg%2F1263t5y9t?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0315887,
    "lng": 105.8509355
  },
  {
    "id": "loc_32",
    "name": "All Day Coffee",
    "category": "Cafe",
    "theme": "Châu Âu hiện đại, Lịch thiệp",
    "address": "37 Quang Trung, Hoàn Kiếm, Hà Nội",
    "price": 75000,
    "rating": 4.6,
    "mapsLink": "https://maps.app.goo.gl/v2tys2BJGw4RryVXA",
    "imageUrl": "https://www.google.com/maps/place/All+Day+Coffee/@21.0208449,105.8482289,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgICr6sCfVA!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAEvexz58sNlKltDEaolG5_Hvrbd4QuwsgqylSX355vjW2Fd-h-IJPJdKtdi4jyICSV4X0vrwTIRfVx-2uOsi687l1e8lnt21hsmCXqMDdf2GnR5xH8KlDwohOsP0XZ1kI4MGkc%3Dw135-h86-k-no!7i6131!8i3878!4m7!3m6!1s0x3135ab00461c9e1b:0xe1d3929b1f819e55!8m2!3d21.0205794!4d105.8483609!10e5!16s%2Fg%2F11w3knmyl0?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0208449,
    "lng": 105.8482289
  },
  {
    "id": "loc_33",
    "name": "Serein Cafe & Lounge",
    "category": "Cafe",
    "theme": "Cầu Long Biên, Lãng mạn",
    "address": "Số 16 Ga Long Biên, Hoàn Kiếm, Hà Nội",
    "price": 80000,
    "rating": 4,
    "mapsLink": "https://maps.app.goo.gl/dA13yaBxvP4SGNYe9",
    "imageUrl": "https://www.google.com/maps/place/Serein+Cafe%26lounge/@21.0400732,105.8505589,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgICij6XSDg!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHgGE2gd3IFX-AePxpwQJw80zxZfAjpQUZJW6A4HliE_DiLvWimj7x7wBv90Mlxg0tMYRkysmZRIUPdpYsJSZUz9mIeUmSqT9ZfTDsex9srVBZ6lD70cFDzyaEzxlbLm8YA1eNi%3Dw86-h110-k-no!7i3182!8i4096!4m7!3m6!1s0x3135abb85b3af547:0xa59c2bb413688fbc!8m2!3d21.0399886!4d105.8504591!10e5!16s%2Fg%2F11c6q788d9?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0400732,
    "lng": 105.8505589
  },
  {
    "id": "loc_34",
    "name": "Tanh Tách",
    "category": "Food",
    "theme": "Biệt thự Pháp, Hải sản",
    "address": "Số 3 P. Yết Kiêu, Nguyễn Du, Hai Bà Trưng, Hà Nội 112605, Việt Nam",
    "price": 800000,
    "rating": 4.1,
    "mapsLink": "https://maps.app.goo.gl/Cqu9rb5nYjjtAy7J6",
    "imageUrl": "https://www.google.com/maps/place/Tanh+T%C3%A1ch/@21.0201467,105.8425993,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgID83_Le3gE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAEHNPxeQxZBRU1fkNU2fpG25DqL_vObgw09rZR2X5vx1yk33DchoKeAoq66IcbDPO8_hKdNz3d2NXPqsZIwRKrr7Vegnaw5elJ1W2sheLuI74Ene06gqL9F-yCzEOP9Pq3_GwQxeg%3Dw133-h86-k-no!7i7245!8i4674!4m16!1m8!3m7!1s0x3135abc3c1a7ce4f:0x25e67570c20d0bf6!2sTanh+T%C3%A1ch!8m2!3d21.0200287!4d105.8427676!10e5!16s%2Fg%2F11j4hnmq3_!3m6!1s0x3135abc3c1a7ce4f:0x25e67570c20d0bf6!8m2!3d21.0200287!4d105.8427676!10e5!16s%2Fg%2F11j4hnmq3_?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0201467,
    "lng": 105.8425993
  },
  {
    "id": "loc_35",
    "name": "Hidden Gem Cafe",
    "category": "Cafe",
    "theme": "Tái chế, Khối màu thô",
    "address": "1 Hàng Mắm, Phố cổ Hà Nội, Hoàn Kiếm, Hà Nội 10000, Việt Nam",
    "price": 60000,
    "rating": 4.8,
    "mapsLink": "https://maps.app.goo.gl/vfXwGuWu5bratSYR6",
    "imageUrl": "https://www.google.com/maps/place/Hidden+Gem+Coffee/@21.0338608,105.8551759,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDPmNyQTQ!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFICB7Ti_gZkZemLZRq6k2LnVEbALa2bE-4xb5KQ2ZSxNR8-AYMko6lwuLNZfPZtTXlRoKsT0kO_SngXMJshlFoIagJCt9QL9DvhZsN_VdtRV_0p6RWDdqxS5W8hQMp_JuuPmZf%3Dw114-h86-k-no!7i4000!8i3000!4m7!3m6!1s0x3135ab22da9ec48d:0x8c6411cf507e6c76!8m2!3d21.0337446!4d105.8551911!10e5!16s%2Fg%2F11h54gs4b7?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0338608,
    "lng": 105.8551759
  },
  {
    "id": "loc_36",
    "name": "Backstage",
    "category": "Food",
    "theme": "Theatrical, Sân khấu kịch",
    "address": "GF, Capella Hanoi, 11 Lê Phụng Hiểu, Hoàn Kiếm, Hà Nội",
    "price": 2000000,
    "rating": 4.7,
    "mapsLink": "https://maps.app.goo.gl/242Xh6QkfmHeWCru5",
    "imageUrl": "https://www.google.com/maps/place/Backstage/@21.0259169,105.8568,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDD9rakLA!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFXmOaioGVjNUX5OLn7dvCH0Yc04j1yQIUpTk_wGtDc-gKUjgapACwgqs-Vu-kpqnOwSioxP6qA890n5-2mIX8GTez4SnwY2j5-C37DKeKufyQ3eCVshcu1nRascA_bPgxSsdVX%3Dw114-h86-k-no!7i1770!8i1328!4m7!3m6!1s0x3135ab5f12dadb49:0xf6c6b32ff1d62dbd!8m2!3d21.0258373!4d105.8568227!10e5!16s%2Fg%2F11swmq80vp?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0259169,
    "lng": 105.8568
  },
  {
    "id": "loc_37",
    "name": "Phở Khôi Hói",
    "category": "Food",
    "theme": "Ngõ nhỏ, Đông đúc",
    "address": "50 Hàng Vải, Hoàn Kiếm, Hà Nội",
    "price": 50000,
    "rating": 4.3,
    "mapsLink": "https://maps.app.goo.gl/oJQJMnYRmKuDPwdZ9",
    "imageUrl": "https://www.google.com/maps/place/Ph%E1%BB%9F+Kh%C3%B4i+H%C3%B3i/@21.035649,105.8461704,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhAWQ2mHUPxrAD79zd_hOZGJ!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHDhsw-3DX5GyIH2fDrgc4mjy8Fjoho0-QNIg9GUGLotAdC4owlU4_9GRZ__6XiRiw616QmxXHlV4Nbb97x8h3ucisQALXb0wC62TTAXHBpEuZNBVQJSfJ0KnzVJK3cvyk5M8DLaOAXerVp%3Dw114-h86-k-no!7i4000!8i3000!4m7!3m6!1s0x3135ab003d225009:0x53b75706c0b16dcf!8m2!3d21.0357335!4d105.8461831!10e5!16s%2Fg%2F11y9_46g2c?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.035649,
    "lng": 105.8461704
  },
  {
    "id": "loc_38",
    "name": "GAD8 COFFEE & STUDIO",
    "category": "Cafe",
    "theme": "Nhỏ nhắn, Studio làm việc",
    "address": "50 P. Đào Duy Từ, Hàng Buồm, Hoàn Kiếm, Hà Nội, Việt Nam",
    "price": 55000,
    "rating": 4.9,
    "mapsLink": "https://maps.app.goo.gl/XKNyWJ8UVQVQ18nx9",
    "imageUrl": "https://www.google.com/maps/place/GAD8+COFFEE+%26+STUDIO/@21.035293,105.852518,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhCn3u4VLm0EDxRw3se3HFj1!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFpul7Pu7genkzWVH_NV3Thr3DbnTqJCvS5gRNiKYZdOTjMSnhHbKEdci1PPqqlX1tP6P_MiZ3BxT4G0moMjrFKEaSzd59i9THGnpShcSxII2pUdpf9sKKeDXB9PAS4zzWyp-BsybobRZhP%3Dw86-h107-k-no!7i1600!8i2000!4m7!3m6!1s0x3135ab7756593dc3:0xd3dae263bacea78c!8m2!3d21.0352899!4d105.8525186!10e5!16s%2Fg%2F11swh23gl3?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.035293,
    "lng": 105.852518
  },
  {
    "id": "loc_39",
    "name": "Senté: The flavor of Lotus - Old Quarter",
    "category": "Food",
    "theme": "Sen truyền thống, Thanh đạm",
    "address": "20 phố Nguyễn Quang Bích, Hoàn Kiếm, Hà Nội",
    "price": 350000,
    "rating": 4.7,
    "mapsLink": "https://maps.app.goo.gl/sRoZEWgNSEwrVd8D8",
    "imageUrl": "https://www.google.com/maps/place/Sent%C3%A9:+The+flavor+of+Lotus+-+Old+Quarter/@21.0320754,105.8457706,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhBI2HrqHJiCVsCG74qTYz2F!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGSJYbmp8M8lH4uAtPrhESiamSHcpkv3HfVCRJ0q6DubE2ETjvwFDCoVfBq3NVJ45rAFghhD04wlPZq3bJtXkFKtXkRSMyLv8pCTF1kRr2_VSwdTwlWFcrDbXQpFfNddeEeqn1zUGp1VW7e%3Dw86-h114-k-no!7i2944!8i3926!4m16!1m8!3m7!1s0x3135ab6b513911f5:0x3e1c188a0f83ea06!2sSent%C3%A9:+The+flavor+of+Lotus+-+Old+Quarter!8m2!3d21.0320329!4d105.8456596!10e5!16s%2Fg%2F11g1dx9br2!3m6!1s0x3135ab6b513911f5:0x3e1c188a0f83ea06!8m2!3d21.0320329!4d105.8456596!10e5!16s%2Fg%2F11g1dx9br2?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0320754,
    "lng": 105.8457706
  },
  {
    "id": "loc_40",
    "name": "Nhà hàng Gia",
    "category": "Food",
    "theme": "Bếp Việt Đương đại, Ánh sáng huyền ảo",
    "address": "61 P. Văn Miếu, Văn Miếu, Văn Miếu - Quốc Tử Giám, Hà Nội 100000, Việt Nam",
    "price": 2500000,
    "rating": 4.4,
    "mapsLink": "https://maps.app.goo.gl/dxZ4ASuCwZCZtEWD8",
    "imageUrl": "https://www.google.com/maps/place/Nh%C3%A0+h%C3%A0ng+Gia/@21.0273488,105.835862,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhDVQ_oh2QJ6koJ41IOUMP0y!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHc-kDrZdLxhu-cGpn5HBN827YXGYLgjLIsVckLQ0xT7lLfC4CjklDrG9-Sttkp56_P3UXzn0DdTuuASDhTbgcrmDawSITZUqYajq-_e7N0ojqZDoZMX7ZmpL5adqIO12B5SjWFJRqlyPA%3Dw129-h86-k-no!7i2048!8i1365!4m11!1m2!2m1!1sGia+Restaurant+Ba+Dinh!3m7!1s0x3135abcfca26e977:0x6a03e33fc669ffc!8m2!3d21.027329!4d105.83591!10e5!15sChZHaWEgUmVzdGF1cmFudCBCYSBEaW5oWhgiFmdpYSByZXN0YXVyYW50IGJhIGRpbmiSARZmaW5lX2RpbmluZ19yZXN0YXVyYW50mgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVVJQTm5aVVFUbG5SUkFC4AEA-gEFCPwCEEA!16s%2Fg%2F11mvwb4962?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0273488,
    "lng": 105.835862
  },
  {
    "id": "loc_41",
    "name": "Nhà hàng tẩm vị",
    "category": "Food",
    "theme": "Nhà gỗ cổ, Mâm cơm gia đình",
    "address": "4b P. Yên Thế, Văn Miếu, Văn Miếu - Quốc Tử Giám, Hà Nội, Việt Nam",
    "price": 250000,
    "rating": 4,
    "mapsLink": "https://maps.app.goo.gl/cURqxF9geQEQ4q946",
    "imageUrl": "https://www.google.com/maps/place/Nh%C3%A0+h%C3%A0ng+T%E1%BA%A7m+V%E1%BB%8B/@21.0289954,105.8395417,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhAzEm2FW55YE7LdV1KQ3iwq!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAE-HD26zL164N6H3IWV2UeR12ggkeSTuYfLamJju51pQX7IG6xJxp1sQELs985GGLqrDt4VrYF9vm5fsZQf21ED7mH6jjg3I59UEzGgFsaDAGEdpdOslpsfSu3EJAaYw4F-6oL16HMkK1NX%3Dw86-h114-k-no!7i4284!8i5712!4m7!3m6!1s0x3135ab69ebcf8dab:0x3bbee968f14bcc36!8m2!3d21.0290273!4d105.8394556!10e5!16s%2Fg%2F11fl7py66z?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0289954,
    "lng": 105.8395417
  },
  {
    "id": "loc_42",
    "name": "Top of Hà Nội",
    "category": "Cafe",
    "theme": "Bar sang chảnh,toà tháp",
    "address": "Khách sạn LOTTE, 54 P. Liễu Giai, Cống Vị, Giảng Võ, Hà Nội 100000, Việt Nam",
    "price": 200000,
    "rating": 4.2,
    "mapsLink": "https://maps.app.goo.gl/UQry5JdfGp8GMbhx6",
    "imageUrl": "http://google.com/maps/place/Top+of+Hanoi/@21.0317706,105.8124454,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhAGbyfQEADNl2fqRL8ADZ8T!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGzxbXyw9UtYJuFFCiqT_srsoEVgHxA-9LUYCoTrEuBJNkSwY6_VBW0F_69B10oeSIlxmWyrTturqhWWel5ebmAEMhGdOdc6x3dIqKgaVjT5M2uCZReTLEKhcC0MjKCaIDjw0g7ZHgmbKTc%3Dw129-h86-k-no!7i6720!8i4480!4m7!3m6!1s0x3135ab8621d1a111:0x84ff3f85797eee01!8m2!3d21.0318761!4d105.8123032!10e5!16s%2Fg%2F11s7kr3ybr?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0317706,
    "lng": 105.8124454
  },
  {
    "id": "loc_43",
    "name": "Hemispheres Steak & Seafood Grill",
    "category": "Food",
    "theme": "Lãng mạn, Cửa sổ nhìn ra Hồ Tây",
    "address": "K5 Nghi Tam, Xuan Dieu Road, 11 Từ Hoa Công Chúa, Quảng An, Tây Hồ, Hà Nội, Việt Nam",
    "price": 1200000,
    "rating": 4.6,
    "mapsLink": "https://maps.app.goo.gl/9ktxLYt1HPhX8aGc8",
    "imageUrl": "https://www.google.com/maps/place/Hemispheres+Steak+%26+Seafood+Grill/@21.0598197,105.8321561,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhAkHQyOAWKStdJ84k5_SQvu!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHWT_WYshfqAIVqi3WXyzL3d7hnRTR1KsCLa54dwl1l5oigEicFsNUIBHhZucoYf5Y_kcZs7hnLBG5zmOUi-RgiOArmDdOsH8nNzh42tJPJkL5XjdxZV_gMtFQ6-LzN9hYpY8YLF9gcoPix%3Dw129-h86-k-no!7i1947!8i1298!4m7!3m6!1s0x3135aa55c82198d9:0x9130995ac27c5aa6!8m2!3d21.0597855!4d105.8314044!10e5!16s%2Fg%2F1tz73fvc?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0598197,
    "lng": 105.8321561
  },
  {
    "id": "loc_44",
    "name": "Chào bạn",
    "category": "Food",
    "theme": "Bữa cơm ấm cúng, Biệt thự tĩnh lặng",
    "address": "Villa 28, Ngõ 11 - Tô Ngọc Vân, Quảng An, Tây Hồ, Hà Nội 100000, Việt Nam",
    "price": 200000,
    "rating": 4.8,
    "mapsLink": "https://maps.app.goo.gl/fG71WssGTqh5mem18",
    "imageUrl": "https://www.google.com/maps/place/Ch%C3%A0o+B%E1%BA%A1n+-+Vietnamese+restaurant/@21.0670185,105.8243386,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhBOLAzF3ixr268WanPxBOB5!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAE63sbaLFp8NSfWWK5CoXVDRndU7f0-mSOPLkNnR0jnpnoWCN6MP0F2WbzoF-QD4wW1ZB0MqVTtZAmBstD6oNxYcOLmO4iBMHUi80D_-c4Sl6lMmjK-2jwpANfwIPSx4mm5qZQ9XL0jghQ%3Dw86-h114-k-no!7i4284!8i5712!4m11!1m2!2m1!1sChao+Ban+Tay+Ho!3m7!1s0x3135ab6899c7548f:0x1d9850dc59618c1c!8m2!3d21.0671098!4d105.8242535!10e5!15sCg9DaGFvIEJhbiBUYXkgSG9aESIPY2hhbyBiYW4gdGF5IGhvkgEVdmlldG5hbWVzZV9yZXN0YXVyYW504AEA!16s%2Fg%2F11lf_4ymql?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0670185,
    "lng": 105.8243386
  },
  {
    "id": "loc_45",
    "name": "Capella Coffee Roaster",
    "category": "Cafe",
    "theme": "Xưởng rang, Không gian làm việc",
    "address": "Đ. Tô Ngọc Vân, Nhat tan, Tây Hồ, Hà Nội 100000, Việt Nam",
    "price": 70000,
    "rating": 4.6,
    "mapsLink": "https://maps.app.goo.gl/s4b22MdWerdPMaH46",
    "imageUrl": "http://google.com/maps/place/Capella+Coffee+Roaster/@21.068409,105.8233792,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhDGzbGeQRUgfGpb_tH5a9ig!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAEVAWZRhP89gbUIEBRgC7CTd65FgdFJwxdf23qiTUrKQyLMcDknrj__XYWbEcUycOWo67yBKcOrFCt0qRBKcZ9jNxwkpy072yqUigDyUm0p85vxPhiDUxVWan9gl7eJN7GSJ5Q7DGcNVzQ%3Dw129-h86-k-no!7i5472!8i3648!4m7!3m6!1s0x3135ab8f9ba7ba87:0xd624011efcd64d42!8m2!3d21.0683676!4d105.8233988!10e5!16s%2Fg%2F11fj8dy8kf?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.068409,
    "lng": 105.8233792
  },
  {
    "id": "loc_46",
    "name": "ingPong café & décor",
    "category": "Cafe",
    "theme": "Cạnh hồ nước, Thiết kế lounge",
    "address": "148 P. Từ Hoa, Quảng An, Tây Hồ, Hà Nội 100000, Việt Nam",
    "price": 60000,
    "rating": 4.5,
    "mapsLink": "https://maps.app.goo.gl/NjDaJtxjhMhuk4rc7",
    "imageUrl": "https://www.google.com/maps/place/PingPong+caf%C3%A9+%26+d%C3%A9cor/@21.0594105,105.8296809,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgID7isK0aA!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAF7iG7AOULvUQvzSMz_NSeVWZ8_B6xk5nMu1lgFsebTK15UTCddDiCfo34duc0N-MbMKKu_ND3v-pYhmVeDb8gW7dlRpNz5TtYXJfrhmJZ8akS0la4glDEJDeAgDH19EVe4444-%3Dw86-h107-k-no!7i1440!8i1800!4m16!1m8!3m7!1s0x3135ab1ce5eecbcf:0x34b228de106a9cea!2zUGluZ1BvbmcgY2Fmw6kgJiBkw6ljb3I!8m2!3d21.0593068!4d105.8298195!10e5!16s%2Fg%2F11hylcs7_5!3m6!1s0x3135ab1ce5eecbcf:0x34b228de106a9cea!8m2!3d21.0593068!4d105.8298195!10e5!16s%2Fg%2F11hylcs7_5?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0594105,
    "lng": 105.8296809
  },
  {
    "id": "loc_47",
    "name": "Phở Cuốn Chinh Thắng",
    "category": "Food",
    "theme": "Mặt phố nhộn nhịp",
    "address": "7 P. Mạc Đĩnh Chi, phường, Ba Đình, Hà Nội 10000, Việt Nam",
    "price": 60000,
    "rating": 4.5,
    "mapsLink": "https://maps.app.goo.gl/MEZDkr31geTAtruR8",
    "imageUrl": "https://www.google.com/maps/place/Ph%E1%BB%9F+Cu%E1%BB%91n+Chinh+Th%E1%BA%AFng/@21.0466429,105.8411134,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhBAbQS9znFG23AWiUdThrV5!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAEryi5XO44x6zh_UtIKLPsBwPjaGZixg-uDeSWgr3mcqVRei7vCumHZGThsNnlrnTE3UD4oLM17cBfUr19GAVS7BNkSSYPhC0WCdSwXAtCu-3cXqRt-nDQ5JaFTAB-3iBPo7CxsUxZ-tXT1%3Dw114-h86-k-no!7i5712!8i4284!4m7!3m6!1s0x3135abcd2cc4f0b9:0xaf5d044ed9364e2e!8m2!3d21.0464794!4d105.8411679!10e5!16s%2Fg%2F11twpzqv1z?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0466429,
    "lng": 105.8411134
  },
  {
    "id": "loc_48",
    "name": "Oven D'or Restaurant",
    "category": "Food",
    "theme": "Sang trọng 5 sao, Tiệc quốc tế",
    "address": "Road Sheraton Hotel, K5, Nghi Tàm/11 Đ. Xuân Diệu, Quảng An, Tây Hồ, Hà Nội, Việt Nam",
    "price": 1500000,
    "rating": 4.4,
    "mapsLink": "https://maps.app.goo.gl/CcUT1asuKV1mJTSZ6",
    "imageUrl": "https://www.google.com/maps/place/Oven+D'or+Restaurant/@21.0596896,105.8319922,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgICLio7EFw!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGkIJ61wOy-78Iwa_mKmn-H1CayIJPd85-kQNGmG4QzBz18oP_mBrsE__Sw-6UyscLnG7qbRbfv1Zt1qPy6x9RKfzP2RvGUzthu1_KwHMBIcyHJ7rx-DlhCRjxfDVQJ2UthHOI3%3Dw128-h86-k-no!7i8192!8i5464!4m7!3m6!1s0x3135aa55b136c4fd:0xbbcfd221f37ffeac!8m2!3d21.0598122!4d105.8319087!10e5!16s%2Fg%2F11c1txxds6?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0596896,
    "lng": 105.8319922
  },
  {
    "id": "loc_49",
    "name": "Manzi Art Space and Cafe",
    "category": "Cafe",
    "theme": "Triển lãm nghệ thuật, Trầm lắng",
    "address": "14 P. Phan Huy Ích, Nguyễn Trung Trực, Ba Đình, Hà Nội, Việt Nam",
    "price": 80000,
    "rating": 4.6,
    "mapsLink": "https://maps.app.goo.gl/VCcwvhgsz8gPvmJ16",
    "imageUrl": "google.com/maps/place/Manzi+Art+Space+and+Cafe/@21.0413443,105.8455919,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIC6jNeQwgE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFqnGMTmtL85yvilgA6bgSSaMIgD4C_czU1KqTga_65GaWHDUNp6Nal67_iqWU1a0DTVxoQEkNXi5MsdhgD9XzcgxyDZCF4Z1IX_GzYxvXTRQxHP_Ae6b6mz4kc-xHlTqE6Rm5Dgg%3Dw152-h86-k-no!7i720!8i406!4m11!1m2!2m1!1sManzi+Art+Space+Ba+Dinh!3m7!1s0x3135abba16ee6d6d:0x72d86613a7f1035e!8m2!3d21.0413889!4d105.8455556!10e5!15sChdNYW56aSBBcnQgU3BhY2UgQmEgRGluaFoZIhdtYW56aSBhcnQgc3BhY2UgYmEgZGluaJIBCmFydF9jZW50ZXKaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMjFhV0UwelkzaFhSVVpwV0RCR1RFMVhSbnBQVmxVMFdUTmtiVll3UlJBQuABAPoBBAgAEB8!16s%2Fg%2F1hm400qsk?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0413443,
    "lng": 105.8455919
  },
  {
    "id": "loc_50",
    "name": "A Bản - Mountain Dew",
    "category": "Food",
    "theme": "Ẩm thực vùng cao, Gỗ mộc",
    "address": "76 P. Trần Phú, Điện Bàn, Ba Đình, Hà Nội, Việt Nam",
    "price": 400000,
    "rating": 4.6,
    "mapsLink": "https://maps.app.goo.gl/Kmo7ByBGc3SJ3Q5W8",
    "imageUrl": "https://www.google.com/maps/place/A+B%E1%BA%A3n+-+Mountain+Dew/@21.0324143,105.8320601,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDWmtLj5gE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAExJxCw34AVe632MxqlyBOVPEeOEoMJajNbI3nMMB0jUG_ekAIN3GHyOr97GGoFrHOs6gAxh0aI_eWp2tg7AU5V-NHzpsFmFdbo7iMPQFkUgTN2v6Il7ttHvBDx4eKf4wS5j3X5RQ%3Dw129-h86-k-no!7i6720!8i4480!4m7!3m6!1s0x3135ab3b91bb1789:0x53e6cd3d56667d5b!8m2!3d21.0325838!4d105.8320913!10e5!16s%2Fg%2F11nmmhbb03?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0324143,
    "lng": 105.8320601
  },
  {
    "id": "loc_51",
    "name": "Oriberry Coffee",
    "category": "Cafe",
    "theme": "Bờ hồ,tone cafe",
    "address": "Hanoi City, 28 P. Quảng An, Quảng An, Tây Hồ, Hà Nội 100000, Việt Nam",
    "price": 60000,
    "rating": 4.5,
    "mapsLink": "https://maps.app.goo.gl/XeYPMVeE3DduXwv2A",
    "imageUrl": "https://www.google.com/maps/place/Oriberry+Coffee/@21.0618422,105.8285448,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgICk3dmy7QE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFg2b7LLuSWUCOjCdc6xf3SG6NTI06aLZzMcOBKKoi2_0HfB-QoKEmHyOW_qQKuaB1dOHGWVFGZt5zNwbcVgZF5pdv-XI7nNv3P-tH6RU2cenf6-SU0_Ghim3HZc1p-uvd-mYggGA%3Dw114-h86-k-no!7i4056!8i3040!4m11!1m2!2m1!1sOriberry+Coffee+Tay+Ho!3m7!1s0x3135aa56787a5bdf:0xc2e41b0eca506bf9!8m2!3d21.0618778!4d105.8284651!10e5!15sChZPcmliZXJyeSBDb2ZmZWUgVGF5IEhvIgOIAQFaGCIWb3JpYmVycnkgY29mZmVlIHRheSBob5IBC2NvZmZlZV9zaG9w4AEA!16s%2Fg%2F1pzsvhbn6?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0618422,
    "lng": 105.8285448
  },
  {
    "id": "loc_52",
    "name": "Timeline Coffee",
    "category": "Cafe",
    "theme": "Studio rộng lớn, Tái hiện Đà Lạt",
    "address": "79 Ng. 260 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội, Việt Nam",
    "price": 55000,
    "rating": 4.5,
    "mapsLink": "https://maps.app.goo.gl/yew5G1p3rXjxGkfF6",
    "imageUrl": "https://www.google.com/maps/place/Timeline+Coffee/@21.036122,105.7960494,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDDp4_H_wE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFaCbWFSbB6FBjmfKWymmwiP1WySGFq5IhcNHBkcZEtEGw3NAUdSsgmYkkERxERfpNYsodLlzt1YNFNm27bgSq6tMpcTp2uj7IQ2dnpOlWTruWAJ18Xo1XICmXStMLS9KHHO4cwfw%3Dw114-h86-k-no!7i4032!8i3024!4m7!3m6!1s0x3135ab5b389c9031:0xc0014296fbf4329a!8m2!3d21.0361329!4d105.7960995!10e5!16s%2Fg%2F11hyzcjyj9?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.036122,
    "lng": 105.7960494
  },
  {
    "id": "loc_53",
    "name": "French Grill",
    "category": "Food",
    "theme": "Kiểu Pháp 5 sao, Nội thất da",
    "address": "08 P. Đỗ Đức Dục, Mễ Trì, Từ Liêm, Hà Nội 100000, Việt Nam",
    "price": 1800000,
    "rating": 4.7,
    "mapsLink": "https://maps.app.goo.gl/r7QoXgeJVUtYa3gGA",
    "imageUrl": "https://www.google.com/maps/place/French+Grill/@21.0072393,105.7831181,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhBo8aGfAaiKA86qhxIWUO5u!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAH8f8mqkb1f3UxugLPieaxnNijlUMhxNs1qxvpKjqnuJucvx5itCFvi8MrdcVo83OIjVHwRHtRbXoRj3q_D8-NGo4MSj6yoXzuEXswP2eS6L9arAPMpayQ3OjkhR7kPyVkJW59yz-bdBu4%3Dw129-h86-k-no!7i2048!8i1365!4m7!3m6!1s0x3135acaca2e254ef:0xf7118484094ff0a9!8m2!3d21.007006!4d105.7831221!10e5!16s%2Fg%2F1pzyqdtt_?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0072393,
    "lng": 105.7831181
  },
  {
    "id": "loc_54",
    "name": "Trill Rooftop Cafe",
    "category": "Cafe",
    "theme": "Bể bơi trên cao, Lộng gió",
    "address": "Hei Tower, 1 P. Ngụy Như Kon Tum, Nhân Chính, Thanh Xuân, Hà Nội, Việt Nam",
    "price": 70000,
    "rating": 4.2,
    "mapsLink": "https://maps.app.goo.gl/fGEAkP1L42ZMovxi7",
    "imageUrl": "http://google.com/maps/place/Trill+Rooftop+Cafe/@21.0031745,105.8056456,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhDyIEDAEHfWgkUCtvosVOEw!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAEnMrFIPOtSH3e25n2Io75wytlnLLvc9aCcMYbiH1zoTML2MAmZqaMkDNJ5l3gszMIUcLRt7RbQf9W6JcEIFl-jl9KH3fziiwXOnaYLMx0HhN8-dR5-D-6cSz2dL6yElpIHcYWdTKV3VP-h%3Dw114-h86-k-no!7i4000!8i3000!4m7!3m6!1s0x3135ac987f479bbb:0x785752ff6f1c697b!8m2!3d21.0031028!4d105.805544!10e5!16s%2Fg%2F11cpp5bgdt?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0031745,
    "lng": 105.8056456
  },
  {
    "id": "loc_55",
    "name": "BÚN BÒ HUẾ NGỰ UYỂN 132 TÂN MAI",
    "category": "Food",
    "theme": "Đậm chất huế,Gỗ chạm trổ",
    "address": "132 P. Tân Mai, Hoàng Mai, Hà Nội, Việt Nam",
    "price": 60000,
    "rating": 4.9,
    "mapsLink": "https://maps.app.goo.gl/bNz9szKxb8JEtZEGA",
    "imageUrl": "https://www.google.com/maps/place/B%C3%9AN+B%C3%92+HU%E1%BA%BE+NG%E1%BB%B0+UY%E1%BB%82N+132+T%C3%82N+MAI/@20.9834971,105.8521485,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgMDQhdWmTA!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHHL3c_gznMFtfzKiq-4pKAcNIZMvGjQ0AsC9lL_PguBeawmq90o1znJmDlef2idV1AN4ufjwM9g5uTk6u71UTFMbIO15FfvEg9Dl0OnVWVLF2hLITpy8BuloXeu6lm9qllj8Jj%3Dw114-h86-k-no!7i1920!8i1440!4m7!3m6!1s0x3135adf6b8155f23:0x7ad14e6df9b26ce6!8m2!3d20.983369!4d105.8521442!10e5!16s%2Fg%2F11h065zjwh?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 20.9834971,
    "lng": 105.8521485
  },
  {
    "id": "loc_56",
    "name": "AN BISTRO & CAFE",
    "category": "Cafe",
    "theme": "Kiến trúc khung thép, Cây xanh khổng lồ",
    "address": "Đường 19/5, P. Văn Quán, Hà Đông, Hà Nội, Việt Nam",
    "price": 60000,
    "rating": 4.2,
    "mapsLink": "https://maps.app.goo.gl/WyHzzvrVUJqitCTy8",
    "imageUrl": "https://www.google.com/maps/place/AN+BISTRO+%26+CAFE/@20.9773891,105.7922901,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhBIl2WoSQdi5N2dBBIoWx01!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAH6hvso4LCBQlvhZxUjagVru7tLRxgOpNRgOnC3-2ig2O5-4qtdnO0gkg0nRltolfPmn3CMGqWuvmkBcgJqHyq5_ljxi58KUlpTTJk8bSJzmg6Vso1vrwfatxVwKPZv7cIDpfJNnPjk81O9%3Dw86-h114-k-no!7i3024!8i4032!4m7!3m6!1s0x3135acd03cd8e831:0xb09872c2ada62b1f!8m2!3d20.9773537!4d105.7923162!10e5!16s%2Fg%2F11dfknwfpy?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 20.9773891,
    "lng": 105.7922901
  },
  {
    "id": "loc_57",
    "name": "Little Pie",
    "category": "Cafe",
    "theme": "Vintage Châu Âu",
    "address": "9/267 P. Bồ Đề, Lâm Du, Bồ Đề, Hà Nội, Việt Nam",
    "price": 60000,
    "rating": 4.7,
    "mapsLink": "https://maps.app.goo.gl/PkVsMQmxarAVz9YD6",
    "imageUrl": "https://www.google.com/maps/place/Little+Pie/@21.0337983,105.8777389,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDd8Li2zwE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAGzMREP1ZTPk0Qztsbc0QSBF4TnUyljN2lREexAsaD1ZgXRnaO1DNZADXNmaUqmrYPgjHY7zMRXlHk1M4Gkv_cCRXq3Z3e80N7RcIrpW2jCivmcNzCyUuSvc2b8CyfCeOVoA5CmTw%3Dw86-h184-k-no!7i1868!8i4000!4m7!3m6!1s0x3135a93c5c67242d:0xa3a1bb82ea0cce70!8m2!3d21.0337983!4d105.8777389!10e5!16s%2Fg%2F11fvlt700q?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0337983,
    "lng": 105.8777389
  },
  {
    "id": "loc_58",
    "name": "Bánh mì chảo Cột Điện Quán - 105C3 Nghĩa Tân",
    "category": "Food",
    "theme": "Không gian sinh viên",
    "address": "khu tập thể C3, P. Nghĩa Tân, Nghĩa Tân, Nghĩa Đô, Hà Nội, Việt Nam",
    "price": 45000,
    "rating": 4,
    "mapsLink": "https://maps.app.goo.gl/fG7cywJbTPuyBkRo7",
    "imageUrl": "https://www.google.com/maps/place/B%C3%A1nh+m%C3%AC+ch%E1%BA%A3o+C%E1%BB%99t+%C4%90i%E1%BB%87n+Qu%C3%A1n+-+105C3+Ngh%C4%A9a+T%C3%A2n/@21.0424152,105.7933106,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhCm3GhO2A3N_TtBd5d7tRsw!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAFcpLeLZQVImHNndLkE1qr2x8bjVWRSy5rlc8BSiPqOdK49gH2Wm00j-1rdCXgQxCJh1hI6EqkKUZWBVZ-E_vpjEQSMCJZc8fLD70OmVW_1njmGx5vEatLNGyG1KtTR-qrzFxUaQG84Tjx2%3Dw114-h86-k-no!7i4032!8i3024!4m11!1m2!2m1!1sCot+Dien+Quan+Cau+Giay!3m7!1s0x3135abd67bdd8aed:0x86044eaa01041835!8m2!3d21.042366!4d105.7933104!10e5!15sChZDb3QgRGllbiBRdWFuIENhdSBHaWF5WhgiFmNvdCBkaWVuIHF1YW4gY2F1IGdpYXmSAQpyZXN0YXVyYW50mgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVVJsYlVwVE1qaDNSUkFC4AEA-gEECAAQRg!16s%2Fg%2F11r3bfv7b6?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0424152,
    "lng": 105.7933106
  },
  {
    "id": "loc_59",
    "name": "C'est si bon Cafe",
    "category": "Cafe",
    "theme": "Tối giản,ngọt ngào",
    "address": "35 P.Trung Hòa, Trung Hoà, Yên Hòa, Hà Nội, Việt Nam",
    "price": 45000,
    "rating": 4.7,
    "mapsLink": "https://maps.app.goo.gl/fwhdHPHHVtyAWEsq7",
    "imageUrl": "https://www.google.com/maps/place/C'est+si+bon+Cafe/@21.0151281,105.8011809,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgMCgnKvrRA!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAG_Rf7sgw9D-hUKrO82-JmDQKDs_dzLP0iuam13u8-xmij10d9X4f384H2PeJ-OiDLLTjdGuGw41ce4fnynCzDl5LXyImCcJKSQYl0Eyy-JQ0lT1RFNzmoFb_Nh-wVXgg2dY52n%3Dw86-h114-k-no!7i4284!8i5712!4m7!3m6!1s0x3135ab9459f0750b:0x206d9caccbfa84dc!8m2!3d21.0150113!4d105.8010413!10e5!16s%2Fg%2F11y5tgps5q?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
    "lat": 21.0151281,
    "lng": 105.8011809
  }
];
