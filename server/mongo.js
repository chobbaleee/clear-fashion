var products = require("./sources/items.json");
var productsAdresseParis = require("./products_AdresseParis.json");
var productsMontlimart = require("./products_montlimart.json");
var secret = require("dotenv").config({ path: "./.env" });
const { MongoClient } = require("mongodb");
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const MONGO_COLLECTION = process.env.MONGO_COLLECTION;
const MONGODB_URI = process.env.MONGODB_URI;

let database = null;
let client = null;
let num_doc = null;

const getDB = (module.exports.getDB = async () => {
  try {
    if (database) {
      console.log("Already connected to db!");
    } else {
      console.log("Connecting to db...");
      client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
      });
      database = client.db(MONGODB_DB_NAME);
      console.log("connected to database successfully!");
    }
    return database;
  } catch (err) {
    console.error(err);
  }
});

const removeProducts = async (query) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGO_COLLECTION);
    num_doc = await collection.countDocuments();
    if (num_doc > 0) {
      const db = await getDB();
      await collection.deleteMany(query);
      console.log("Removed products!");
    } else {
      console.log("No products to delete...");
    }
  } catch (err) {
    console.error(err);
  }
};

const insertProducts = async () => {
  try {
    const db = await getDB();

    const collection = db.collection(MONGO_COLLECTION);
    num_doc = await collection.countDocuments();
    if (num_doc === 0) {
      var result = await collection.insertMany(products);
      console.log("Inserted products Dedicated successfully!");
      result = await collection.insertMany(productsAdresseParis);
      console.log("Inserted products adresse Paris successfully!");
      result = await collection.insertMany(productsMontlimart);
      console.log("Inserted products Montlimart successfully!");
    } else {
      console.log("Documents already insterted!");
    }

    console.log(num_doc);
  } catch (err) {
    console.error(err);
  }
};

const query = (module.exports.query = async (
  query,
  sort = {},
  limit = num_doc
) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGO_COLLECTION);
    const result = await collection
      .find(query)
      .sort(sort)
      .limit(limit)
      .toArray();
    return result;
  } catch (err) {
    console.error(err);
  }
});

const setNumDocs = (module.exports.setNumDocs = async () => {
  const db = await getDB();
  const collection = db.collection(MONGO_COLLECTION);
  num_doc = await collection.countDocuments();
});

const close = (module.exports.close = async () => {
  try {
    if (client) {
      await client.close();
      console.log("Successfully closed the connection!");
    } else {
      console.log("Client doesnt exist...");
    }
  } catch (err) {
    console.error(err);
  }
});

const main = async () => {
  await removeProducts({});
  await insertProducts();
  const query1 = { brand: "dedicated" };
  const result1 = await query(query1, (sort = {}), (limit = 5));
  console.log(result1);

  const query2 = { price: { $lt: 40 } };
  const result2 = await query(query2, (sort = {}), (limit = 5));
  console.log(result2);

  const query3 = {};
  const sort_price = { price: 1 };
  const result3 = await query(query3, (sort = sort_price), (limit = 5));
  console.log(result3);

  //await close();
};

//main();