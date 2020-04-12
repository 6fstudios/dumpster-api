const fetch = require('node-fetch');
const chrome = require('chrome-aws-lambda');
const URL = require('url');

const puppeteer = process.env.NODE_ENV === 'production' ? require('puppeteer-core') : require('puppeteer')

async function fetchPage(url) {
  const options = process.env.NODE_ENV = 'production' ? {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  } : {};
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36")
  const response = await page.goto(url);

  const headers = response.headers();
  const contentType = headers['content-type'];

  const content = await page.content();

  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(el => {
      const {naturalHeight, naturalWidth, src} = el;
      return {
        height: naturalHeight,
        width: naturalWidth,
        url: src,
      };
    });
  });

  const u = await page.url();
  const {protocol, host} = URL.parse(u);
  const baseUrl = `${protocol}//${host}/`;

  await browser.close();

  return {content, contentType, baseUrl, images};
}

module.exports = fetchPage;