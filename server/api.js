const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const mongo = require("./mongo");

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require("body-parser").json());
app.use(cors());
app.use(helmet());

app.options("*", cors());

app.get("/", (request, response) => {
  response.send({ ack: true });
});

const querying = async () => {
  app.get(`/products/search`, async (request, response) => {
    let result = null;
    const db = await mongo.getDB();
    if (!request.query.brand && !request.query.limit && !request.query.price) {
      const query_brand = {};
      await mongo.setNumDocs();
      result = await mongo.query(query_brand, (sort = {}));
      console.log(`result: ${result}`);
    } else {
      let brand = request.query.brand;
      console.log(`brand:${brand}`);
      let limit = parseInt(request.query.limit);
      console.log(`limit:${limit}`);
      let price = parseFloat(request.query.price);
      console.log(`price:${price}`);
      const query_brand = { brand: brand, price: price };
      result = await mongo.query(query_brand, (sort = {}), (limit = limit));
    }

    // await mongo.close();
    console.log(`query by brand:${result}`);
    response.send(result);
  });
};

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

querying();
