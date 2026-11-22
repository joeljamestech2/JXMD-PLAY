const { readJSON, writeJSON } = require('../_mega');
const crypto = require('crypto');
const hash = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ status: false, message: 'Use POST.' });
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password || String(password).length < 6) return res.status(400).json({ status: false, message: 'username, email and password (6+ characters) are required.' });
    const users = await readJSON('users', 'users.json', []);
    if (users.some(u => u.email.toLowerCase() === String(email).toLowerCase() || u.username.toLowerCase() === String(username).toLowerCase())) return res.status(409).json({ status: false, message: 'Username or email already exists.' });
    const user = { id: crypto.randomUUID(), username: String(username), email: String(email), passwordHash: hash(password), createdAt: new Date().toISOString() };
    users.push(user);
    await writeJSON('users', 'users.json', users);
    return res.status(201).json({ status: true, user: { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt } });
  } catch (e) { return res.status(500).json({ status: false, message: 'Account creation failed.', error: e.message }); }
};
