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

const querying = async (brand_name = null, limit = null, price = null) => {
  if (brand_name != null) {
    app.get(`/products/search`, async (request, response) => {
      const query_brand = { brand: brand_name };
      const result = await mongo.query(query_brand);
      console.log(`query by brand:${result}`);
      response.send(result);
    });
  }
};

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

querying("Montlimart", 10, 50);
