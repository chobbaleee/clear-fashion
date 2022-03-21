const cors = require('cors');
const express = require('express');

const db = require('./db');

const helmet = require('helmet');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

// endpoint to get a product by id
app.get('/products/:id', async (request, response) => {
  const { id } = request.query;
  const product = await db.find({'_id': id});
  response.send(product);
});

// endpoint called search, to search for products
// this endpoint accepts the following query parameters:
// - brand: the brand to search for (default: all brands)
// - price: the price to search for (default: all prices)
// - limit: the number of products to return (default: 12)
app.get('/search', async (request, response) => {
 // set default values for query parameters
  const { brand = 'all', price = 'all', limit = 12 } = request.query;
  if(brand === 'all' && price === 'all') {
    const products = await db.find_limit({}, parseInt(limit));
    response.send(products);
  } else if(brand === 'all') {
    const products = await db.find_limit({'price': parseInt(price)}, parseInt(limit));
    response.send(products);
  } else if(price === 'all') {
    const products = await db.find_limit({'brand': brand}, parseInt(limit));
    response.send(products);
  } else {
    const products = await db.find_limit({
      'brand': brand,
      'price': parseInt(price)
    },
      parseInt(limit)
    );
    response.send(products);
  }
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);