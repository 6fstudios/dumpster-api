const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetchMetadata = require('./scrapers/metadata');
const searchImages = require('./scrapers/unsplash-image-search');

const app = express();
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

app.get('/', fetchMetadata);
app.get('/images', searchImages);

app.listen(1234);

module.exports = app;
