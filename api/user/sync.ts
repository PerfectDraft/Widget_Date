import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { phone, googleId, preferences, lastTab } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone is required' });

  try {
    const prefJson = preferences ? JSON.stringify(preferences) : null;
    await sql`
      INSERT INTO users (phone, google_id, preferences, last_tab, updated_at)
      VALUES (${phone}, ${googleId || null}, ${prefJson}, ${lastTab || 'home'}, CURRENT_TIMESTAMP)
      ON CONFLICT(phone) DO UPDATE SET
        google_id = COALESCE(EXCLUDED.google_id, users.google_id),
        preferences = COALESCE(EXCLUDED.preferences, users.preferences),
        last_tab = COALESCE(EXCLUDED.last_tab, users.last_tab),
        updated_at = CURRENT_TIMESTAMP
    `;
    return res.json({ success: true });
  } catch (err: any) {
    console.error('Sync error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
