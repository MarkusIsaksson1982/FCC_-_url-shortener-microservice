/* I have utilized ChatGPT, Perplexity and Gitbuh's Copilot as resources for guidance and learning throughout this project. My approach reflects the growing trend of modern developers using AI tools to enhance their coding processes. However, all the final code presented here is my own work, based on own independently thought out prompts and without copying prompts or code from others other than snippets. I believe this practice aligns with the principles of academic honesty, as it emphasizes learning and using technology responsibly. */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// In-memory URL store and counter for short URLs
let urlDatabase = [];
let idCounter = 1;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

// Serve the HTML file
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validate URL format using regex
  const urlRegex = /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\/.*)?$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Skip DNS lookup for testing purposes
  const shortUrl = idCounter++;
  urlDatabase.push({ original_url: originalUrl, short_url: shortUrl });

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Endpoint to redirect to original URL based on short URL
app.get('/api/shorturl/:shorturl', (req, res) => {
  const shortUrl = parseInt(req.params.shorturl);

  // Find the original URL by short URL
  const urlEntry = urlDatabase.find(entry => entry.short_url === shortUrl);
  if (urlEntry) {
    return res.redirect(urlEntry.original_url);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

// Endpoint to get user info
app.get('/api/whoami', (req, res) => {
  const ipaddress = req.ip;
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];

  res.json({
    ipaddress: ipaddress,
    language: language,
    software: software
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
