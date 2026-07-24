const REDIS_URL = process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;
const STATS_KEY = 'faq:click-stats';
const MAX_KW_LEN = 50;

async function redis(cmd) {
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cmd),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

async function getRanking() {
  const flat = (await redis(['ZREVRANGE', STATS_KEY, '0', '9', 'WITHSCORES'])) || [];
  const ranking = [];
  for (let i = 0; i < flat.length; i += 2) {
    ranking.push({ kw: flat[i], count: Number(flat[i + 1]) });
  }
  return ranking;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      return res.status(200).json({ ranking: await getRanking() });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body || '{}');
      const kw = (body && body.kw ? String(body.kw) : '').trim().slice(0, MAX_KW_LEN);
      if (!kw) return res.status(400).json({ error: 'kw required' });
      await redis(['ZINCRBY', STATS_KEY, '1', kw]);
      return res.status(200).json({ ranking: await getRanking() });
    }

    if (req.method === 'DELETE') {
      const adminKey = req.headers['x-admin-key'];
      if (!process.env.ADMIN_RESET_KEY || adminKey !== process.env.ADMIN_RESET_KEY) {
        return res.status(403).json({ error: 'forbidden' });
      }
      await redis(['DEL', STATS_KEY]);
      return res.status(200).json({ ranking: [] });
    }

    res.setHeader('Allow', 'GET, POST, DELETE, OPTIONS');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
