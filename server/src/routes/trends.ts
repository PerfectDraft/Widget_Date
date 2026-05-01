import { Router } from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const trendsRouter = Router();

const FALLBACK_TRENDS = [
  { id: 1, icon: '🧋', name: 'Oolong Đậm Vị Kem Nướng', badge: 'VIRAL', badgeColor: 'bg-pink-100 text-pink-600', desc: 'Khu Chùa Láng', price: '35K/ly' },
  { id: 2, icon: '🍋', name: 'Trà Chanh Giã Tay', badge: 'HOT', badgeColor: 'bg-yellow-100 text-yellow-600', desc: 'Quảng Trường Đông Kinh', price: '25K/ly' },
  { id: 3, icon: '🪙', name: 'Bánh Đồng Xu Phô Mai', badge: 'TRENDING', badgeColor: 'bg-blue-100 text-blue-600', desc: 'Phố Hội & Phố Cổ', price: '35K/chiếc' },
  { id: 4, icon: '☕', name: 'Cà Phê Muối Chú Long', badge: 'MUST TRY', badgeColor: 'bg-orange-100 text-orange-600', desc: 'Khắp Hà Nội', price: '20K/ly' },
  { id: 5, icon: '🌭', name: 'Lạp Xưởng Nướng Đá', badge: 'VIRAL', badgeColor: 'bg-pink-100 text-pink-600', desc: 'Khu Chợ Đêm', price: '15K/chiếc' },
  { id: 6, icon: '🍮', name: 'Trà Sữa Vân Nam', badge: 'HOT', badgeColor: 'bg-yellow-100 text-yellow-600', desc: 'Cầu Giấy', price: '40K/ly' },
  { id: 7, icon: '🍵', name: 'Cà Phê Trứng Giảng', badge: 'CLASSIC', badgeColor: 'bg-slate-100 text-slate-800', desc: 'Hoàn Kiếm', price: '35K/ly' },
  { id: 8, icon: '🥟', name: 'Bánh Trôi Tàu Đê La Thành', badge: 'WINTER', badgeColor: 'bg-purple-100 text-purple-600', desc: 'Đê La Thành', price: '20K/bát' },
];

const ICONS = ['🔥', '✨', '🌟', '💫', '📍', '🎉', '📸', '🍹', '🍔', '🍰'];
const BADGES = [
  { label: 'VIRAL', color: 'bg-pink-100 text-pink-600' },
  { label: 'HOT', color: 'bg-yellow-100 text-yellow-600' },
  { label: 'NEW', color: 'bg-green-100 text-green-600' },
  { label: 'TRENDING', color: 'bg-blue-100 text-blue-600' }
];

function getRichTrendData(row: any, index: number) {
  const badgeObj = BADGES[index % BADGES.length];
  return {
    id: row.id || index + 100,
    icon: ICONS[index % ICONS.length],
    name: row.title,
    badge: badgeObj.label,
    badgeColor: badgeObj.color,
    desc: 'Theo xu hướng mạng xã hội',
    price: 'Khám phá ngay'
  };
}

trendsRouter.get('/', (req, res) => {
  try {
    const dbPath = path.resolve(__dirname, '../../../../data-service/data/places.sqlite');
    if (!fs.existsSync(dbPath)) {
      return res.json({ trends: FALLBACK_TRENDS });
    }

    const db = new Database(dbPath, { readonly: true });
    // Lấy top 10 trends mới nhất
    const rows = db.prepare('SELECT id, title FROM places_raw ORDER BY id DESC LIMIT 10').all() as any[];
    db.close();

    if (rows.length === 0) {
      return res.json({ trends: FALLBACK_TRENDS });
    }

    const dynamicTrends = rows.map((row, index) => getRichTrendData(row, index));
    res.json({ trends: dynamicTrends });
  } catch (error) {
    console.error('Error fetching trends from DB:', error);
    res.json({ trends: FALLBACK_TRENDS });
  }
});
