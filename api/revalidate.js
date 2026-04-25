module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const secret = req.headers['x-revalidate-secret'];
  if (!secret || secret !== process.env.SITE_REVALIDATE_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ok: true, note: 'CDN s-maxage=60 will refresh within 60s' });
};
