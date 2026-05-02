import { sql } from '@vercel/postgres';

const CORS = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-action');
};

export default async function handler(req: any, res: any) {
  CORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = (req.headers['x-action'] || req.query.action) as string;

  // ── GET PROFILE ────────────────────────────────────────
  if (action === 'profile') {
    if (req.method !== 'GET') return res.status(405).end();
    const phone = req.query.phone as string;
    if (!phone) return res.status(400).json({ error: 'Phone is required' });
    try {
      const result = await sql`SELECT phone, google_id, preferences, last_tab, display_name, avatar_url, updated_at FROM users WHERE phone = ${phone}`;
      const user = result.rows[0];
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json({ ...user, preferences: user.preferences ? JSON.parse(user.preferences) : [] });
    } catch (err) {
      console.error('Profile error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // ── SYNC ───────────────────────────────────────────────
  if (action === 'sync') {
    if (req.method !== 'POST') return res.status(405).end();
    const { phone, googleId, preferences, lastTab } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone is required' });
    try {
      const prefJson = preferences ? JSON.stringify(preferences) : null;
      await sql`
        INSERT INTO users (phone, password_hash, google_id, preferences, last_tab, updated_at)
        VALUES (${phone}, '', ${googleId || null}, ${prefJson}, ${lastTab || 'home'}, CURRENT_TIMESTAMP)
        ON CONFLICT(phone) DO UPDATE SET
          google_id = COALESCE(EXCLUDED.google_id, users.google_id),
          preferences = COALESCE(EXCLUDED.preferences, users.preferences),
          last_tab = COALESCE(EXCLUDED.last_tab, users.last_tab),
          updated_at = CURRENT_TIMESTAMP
      `;
      return res.json({ success: true });
    } catch (err) {
      console.error('Sync error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(400).json({ error: 'Unknown action. Use x-action header or ?action= param.' });
}
