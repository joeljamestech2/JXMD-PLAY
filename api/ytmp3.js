const ytdl = require('@distube/ytdl-core');
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ status: false, message: 'Use GET.' });
  const url = req.query.url;
  if (!url || !ytdl.validateURL(url)) return res.status(400).json({ status: false, message: 'A valid YouTube url is required.' });
  try {
    const info = await ytdl.getInfo(url);
    const safeTitle = info.videoDetails.title.replace(/[\\/:*?"<>|]/g, '_');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
    ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
  } catch (e) { if (!res.headersSent) res.status(502).json({ status: false, message: 'Audio retrieval failed.', error: e.message }); }
};
