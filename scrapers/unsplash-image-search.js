const fetch = require('node-fetch');
global.fetch = fetch;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const {default: Unsplash, toJson} = require('unsplash-js');

const unsplash = new Unsplash({
  accessKey: process.env.ACCESS_TOKEN,
});

module.exports = (req, res) => {
  unsplash.search
    .photos(req.query.q, 1, 100)
    .then(toJson)
    .then(json => {
      res.send(json)
    });
};
