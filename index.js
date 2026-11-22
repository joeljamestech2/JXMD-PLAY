const express = require('express');
const path = require('path');
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', require('./routes/dashboard'));
app.get('/dashboard', require('./routes/dashboard'));
app.get('/mp3', require('./routes/mp3'));
app.get('/mp4', require('./routes/mp4'));
app.all('/api/user/create', require('./api/user/create'));
app.all('/api/userhistory', require('./api/userhistory'));
app.all('/api/ytsearch', require('./api/ytsearch'));
app.all('/api/ytmp3', require('./api/ytmp3'));
app.all('/api/ytmp4', require('./api/ytmp4'));
// SEO-style detail URL routing (dynamic placeholders for future detail-page rendering).
app.get(/^\/(audio-.+\.html|video-.+\.html)$/, (req, res) => {
  const isAudio = req.path.startsWith('/audio-');
  res.sendFile(path.join(__dirname, 'public', isAudio ? 'mp3.html' : 'mp4.html'));
});
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', 'mp3.html')));
if (require.main === module) app.listen(process.env.PORT || 3000, () => console.log('Music platform running on port ' + (process.env.PORT || 3000)));
module.exports = app;
