const fetch = require('node-fetch');
const parse = require('../parse');

async function fetchMetadata(req, res) {
  const {url} = req.body;
  if (!url) {
    return res.status(400).send('Missing url');
  }
  const r = await fetch(url);
  const html = await r.text();

  const json = parse(html, url);

  res.send(json)
}

module.exports = fetchMetadata;