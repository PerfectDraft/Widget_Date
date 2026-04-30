import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  const phone = req.query.phone as string;
  if (!phone) return res.status(400).json({ error: 'Phone is required' });

  try {
    const result = await sql`SELECT phone, google_id, preferences, last_tab, updated_at FROM users WHERE phone = ${phone}`;
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({
      ...user,
      preferences: user.preferences ? JSON.parse(user.preferences) : []
    });
  } catch (err: any) {
    console.error('Profile error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
