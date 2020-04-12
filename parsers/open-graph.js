const cheerio = require('cheerio');

function getOgData(html) {
  const $ = cheerio.load(html);
  const data = {};
  $('meta[property*="og:"]').each((i, el) => {
    const [og, ...keyParts] = el.attribs.property.split(':');
    data[keyParts.join(':')] = el.attribs.content;
  });
  return data;
}

module.exports = getOgData;