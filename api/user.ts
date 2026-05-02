import { sql } from '@vercel/postgres';

const CORS = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default async function handler(req: any, res: any) {
  CORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action as string;
  const phone = req.query.phone as string;

  if (action === 'profile') {
    if (!phone) return res.status(400).json({ error: 'Thi\u1ebfu phone' });
    try {
      const result = await sql`SELECT display_name, avatar_url FROM users WHERE phone = ${phone}`;
      const user = result.rows[0];
      if (!user) return res.status(404).json({ error: 'Kh\u00f4ng t\u00ecm th\u1ea5y user' });
      return res.json({
        display_name: user.display_name || null,
        avatar_url: user.avatar_url || null,
      });
    } catch (err: any) {
      // Column might not exist yet — return empty gracefully
      console.error('Get profile error:', err);
      return res.json({ display_name: null, avatar_url: null });
    }
  }

  return res.status(400).json({ error: 'Unknown action' });
}
