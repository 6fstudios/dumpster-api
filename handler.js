const fetchContent = require('./fetchContent');

function isValidUrl(string) {
  if (!string.includes('.')) {
    return false;
  }

  return true;
}

function handler(request, res) {
  console.log('Request received:', request.query)
  let { url } = request.query;
  if (!url || !isValidUrl(url)) {
    return {};
  }

  if (!url.includes('http')) {
    url = 'http://' + url;
  }

  return fetchContent(url);
}

module.exports = handler;
