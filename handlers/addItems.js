const fetch = require('node-fetch');
const sizeOf = require('image-size');

const fetchContent = require('../fetchContent');

const ACCEPTED_CONTENT_TYPES = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/vnd.microsoft.icon',
  'image/x-icon',
  'image/vnd.djvu',
  'image/svg+xml',
];

const isDisplayImage = ({ width, height }) => {
  // const aspectRatio = width / height;
  const pixels = width * height;
  // const isAbnormalAspect = aspectRatio > 2 || aspectRatio < 0.3
  // return (isAbnormalAspect && pixels < 3000) || pixels < ;
  return pixels > 3000 && width > 100 && height > 100;
};

const goodUrl = url => Boolean(url);

function size(buffer) {
  try {
    return sizeOf(buffer);
  } catch (e) {
    return false;
  }
}

const fetchIt = async url => {
  const res = await fetch(url);
  const contentType = res.headers.get('content-type');
  if (!ACCEPTED_CONTENT_TYPES.includes(contentType)) {
    return false;
  }

  const buffer = await res.buffer();

  return { buffer, url };
};

async function addItems(req, res) {
  // const { urls } = req.body;
  console.log('POST /items', req.body);
  if (!req.body.url) {
    return res.sendStatus(400);
  }
  try {
    const { images, og } = await fetchContent(req.body.url);
    // const promises = urls
    //   .filter(goodUrl)
    //   .map(fetchIt)
    //   .filter(Boolean);

    // Promise.all(promises).then(values => {
    //   const items = [];
    //   values.forEach(({ url, buffer }) => {
    //     const imageData = size(buffer);
    //     if (imageData) {
    //       items.push({
    //         url,
    //         isSmall: isSmallImage(imageData.width, imageData.height),
    //         ...imageData,
    //       });
    //     }
    //   });
    res.json(images.filter(isDisplayImage));
    // });
  } catch (e) {
    res.sendStatus(403);
  }
}

module.exports = addItems;
