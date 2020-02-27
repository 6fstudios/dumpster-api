const fetch = require('node-fetch');
const parse = require('./parse');
const puppeteer = require('puppeteer');
const URL = require('url');

async function getPageContent(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const response = await page.goto(url);

  const headers = response.headers();
  const contentType = headers['content-type'];

  const content = await page.content();
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(el => {
      const { naturalHeight, naturalWidth, src } = el;
      return {
        height: naturalHeight,
        width: naturalWidth,
        url: src,
      };
    });
  });

  const u = await page.url();
  const { protocol, host } = URL.parse(u);
  const baseUrl = `${protocol}//${host}/`;

  await browser.close();

  return { content, contentType, baseUrl, images };
}

async function fetchContent(url) {
  try {
    const { content, contentType, baseUrl, images } = await getPageContent(url);
    if (contentType.includes('application/json')) {
      return {
        images: ['https://image.flaticon.com/icons/svg/136/136443.svg'],
        snippet: JSON.stringify(content).slice(0, 100),
        type: 'json',
      };
    }
    if (contentType.includes('text/html')) {
      return {
        images,
      };
    }
    if (contentType.includes('image')) {
      return {
        images: [url],
        snippet: 'this is the image',
        type: 'image',
      };
    }
    return {
      images: [],
      snippet: '',
      type: contentType,
    };
  } catch (e) {
    console.error(e);
  }
}

module.exports = fetchContent;
