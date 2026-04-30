export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const city = (req.query.city as string) || 'Hanoi';
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing OPENWEATHER_API_KEY' });

  try {
    const params = `units=metric&lang=vi&appid=${apiKey}`;
    const encoded = encodeURIComponent(city);
    const [curRes, frcRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encoded}&${params}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encoded}&${params}`),
    ]);
    if (!curRes.ok) return res.status(curRes.status).json({ error: 'Weather API error' });

    const current = await curRes.json();
    let forecast: any[] = [];

    if (frcRes.ok) {
      const raw = await frcRes.json();
      const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const map = new Map<string, any>();
      const today = new Date().toISOString().split('T')[0];
      for (const item of raw.list || []) {
        const date = item.dt_txt.split(' ')[0];
        if (date === today) continue;
        if (!map.has(date)) map.set(date, { temps: [], icons: [], mains: [], descs: [] });
        const e = map.get(date);
        e.temps.push(item.main.temp_min, item.main.temp_max);
        e.icons.push(item.weather[0]?.icon || '01d');
        e.mains.push(item.weather[0]?.main || 'Clear');
        e.descs.push(item.weather[0]?.description || '');
      }
      for (const [date, e] of map) {
        const mid = Math.floor(e.icons.length / 2);
        forecast.push({
          date,
          dayLabel: DAYS[new Date(date).getDay()],
          tempMin: Math.round(Math.min(...e.temps)),
          tempMax: Math.round(Math.max(...e.temps)),
          icon: e.icons[mid],
          main: e.mains[mid],
          description: e.descs[mid],
        });
      }
    }

    return res.json({ current, forecast });
  } catch (err) {
    console.error('Weather error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
