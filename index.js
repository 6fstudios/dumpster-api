const express = require('express');
const cors = require('cors');
const handler = require('./handler');
const handleAddItems = require('./handlers/addItems');
const bodyParser = require('body-parser');
const fetchMetadata = require('./scrapers/metadata');

const app = express();
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

app.post('/items', handleAddItems);

app.post('/metadata', fetchMetadata);

app.get('*', async (req, res) => {
  const data = await handler(req);
  res.json(data);
});

app.listen(1234);

module.exports = app;
