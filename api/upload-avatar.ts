import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import type { IncomingMessage } from 'http';

export const config = { api: { bodyParser: false } };

const CORS = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-phone');
};

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function ensureColumns() {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`;
}

export default async function handler(req: any, res: any) {
  CORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const phone = req.headers['x-phone'] as string;
  if (!phone) return res.status(400).json({ error: 'Thiếu phone header' });

  const contentType = (req.headers['content-type'] || 'image/jpeg') as string;
  if (!contentType.startsWith('image/')) {
    return res.status(400).json({ error: 'Chỉ hỗ trợ file ảnh' });
  }

  try {
    const buffer = await readBody(req);
    if (buffer.length === 0) return res.status(400).json({ error: 'File rỗng' });
    if (buffer.length > 5 * 1024 * 1024) return res.status(400).json({ error: 'Ảnh tối đa 5MB' });

    const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg';
    const filename = `avatars/${phone.replace(/\D/g, '')}_${Date.now()}.${ext}`;

    const blob = await put(filename, buffer, {
      access: 'public',
      contentType,
    });

    await ensureColumns();
    await sql`UPDATE users SET avatar_url = ${blob.url}, updated_at = NOW() WHERE phone = ${phone}`;

    return res.json({ success: true, url: blob.url });
  } catch (err: any) {
    console.error('Upload avatar error:', err);
    return res.status(500).json({ error: err?.message || 'Lỗi upload, vui lòng thử lại' });
  }
}
