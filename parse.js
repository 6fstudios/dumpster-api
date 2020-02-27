const cheerio = require('cheerio');

function replaceQueryParams(url = '', newParams = '') {
  return url.split('?')[0] + newParams;
}

function getImageUrls(html) {
  const $ = cheerio.load(html);
  return $('img')
    .map((i, el) => $(el).attr('src'))
    .get();
}

function absolutePaths(urls, host) {
  return urls.map(makePathAbsolute(host));
}

function makePathAbsolute(host) {
  return (path = '') => {
    let imageLocation = host + replaceQueryParams(path.slice(1));

    if (path.startsWith('//')) {
      const protocol = host.split('//')[0];
      imageLocation = protocol + replaceQueryParams(path);
    }

    if (path.includes('://')) {
      imageLocation = replaceQueryParams(path);
    }

    return imageLocation;

    // TODO: figure out a good way to do this reliably.
    // return `http://rsz.io/${imageLocation}?width=200`;
  };
}

function getOgData(html) {
  const $ = cheerio.load(html);
  const data = {};
  $('meta[property*="og:"]').each((i, el) => {
    const [og, ...keyParts] = el.attribs.property.split(':');
    data[keyParts.join(':')] = el.attribs.content;
  });
  return data;
}

function parse(html, host) {
  const $ = cheerio.load(html);
  const images = absolutePaths(getImageUrls(html), host);
  const og = getOgData(html);
  return {
    images,
    og,
    snippet: $('title').text(),
    type: 'html',
  };
}

module.exports = parse;
