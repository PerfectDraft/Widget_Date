// Trending topics for Hanoi – returns cached/static data as a lightweight fallback
// For production, replace with a real Google Trends or scraper call.
const FALLBACK_TRENDS = [
  { title: 'Quán cà phê view đẹp Hà Nội', traffic: '50K+' },
  { title: 'Nhà hàng lãng mạn cuối tuần', traffic: '30K+' },
  { title: 'Phim chiếu rạp tháng này', traffic: '80K+' },
  { title: 'Địa điểm dã ngoại gần Hà Nội', traffic: '40K+' },
  { title: 'Trà sữa mới khai trương 2026', traffic: '25K+' },
];

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  return res.json({ trends: FALLBACK_TRENDS });
}
