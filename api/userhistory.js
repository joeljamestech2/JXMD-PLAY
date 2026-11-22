const { readJSON, writeJSON } = require('./_mega');
module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { userId, type, details } = req.body || {};
      if (!userId || !type) return res.status(400).json({ status: false, message: 'userId and type are required.' });
      const history = await readJSON('history', 'activities.json', []);
      const item = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, userId, type, details: details || {}, createdAt: new Date().toISOString() };
      history.push(item); await writeJSON('history', 'activities.json', history);
      return res.status(201).json({ status: true, activity: item });
    }
    if (req.method === 'GET') {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ status: false, message: 'userId is required.' });
      const history = await readJSON('history', 'activities.json', []);
      return res.json({ status: true, activities: history.filter(x => x.userId === userId).reverse() });
    }
    return res.status(405).json({ status: false, message: 'Use GET or POST.' });
  } catch (e) { return res.status(500).json({ status: false, message: 'History request failed.', error: e.message }); }
};
