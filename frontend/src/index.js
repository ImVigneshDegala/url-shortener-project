const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});

let urls = {};

app.post('/shorturls', (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  let code = shortcode || uuidv4().slice(0, 6);
  if (urls[code]) return res.status(400).json({ error: 'Shortcode already exists' });

  const expiry = new Date(Date.now() + validity * 60000).toISOString();

  urls[code] = { url, expiry, clicks: [] };

  res.status(201).json({
    shortLink: `http://localhost:5000/${code}`,
    expiry,
  });
});

app.get('/:code', (req, res) => {
  const { code } = req.params;
  const entry = urls[code];

  if (!entry) return res.status(404).json({ error: 'Shortcode not found' });
  if (new Date() > new Date(entry.expiry))
    return res.status(410).json({ error: 'Link expired' });

  entry.clicks.push({
    timestamp: new Date().toISOString(),
    referrer: req.get('Referrer') || 'direct',
  });

  res.redirect(entry.url);
});

app.get('/shorturls/:code', (req, res) => {
  const entry = urls[req.params.code];
  if (!entry) return res.status(404).json({ error: 'Shortcode not found' });

  res.json({
    originalURL: entry.url,
    expiry: entry.expiry,
    totalClicks: entry.clicks.length,
    clicks: entry.clicks,
  });
});

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
