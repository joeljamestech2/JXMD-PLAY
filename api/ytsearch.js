const yts = require('youtube-yts');
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: false, message: 'Use GET.' });
  const query = String(req.query.q || req.query.query || '').trim();
  if (!query) return res.status(400).json({ status: false, message: 'Provide q or query.' });
  try {
    const results = await yts(query);
    return res.json({ status: true, query, results });
  } catch (e) { return res.status(500).json({ status: false, message: 'YouTube search failed.', error: e.message }); }
};
