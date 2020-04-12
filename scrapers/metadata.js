const parseOgData = require('../parsers/open-graph');
const fetchPage = require('../scrapers/puppeteer-fetch');

async function fetchMetadata(req, res) {
  const {url} = req.query;
  if (!url) {
    return res.status(400).send('Missing url');
  }
  const {content, images} = await fetchPage(url);
  const og = parseOgData(content, url);

  res.send({images, og});
}

module.exports = fetchMetadata;
