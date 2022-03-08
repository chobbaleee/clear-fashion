const {MongoClient} = require('mongodb');

async function main(){
    const MONGODB_URI = 'mongodb+srv://dbWebApp:WebApp1234@clusterwebapp.fmdx9.mongodb.net/ClusterWebApp?retryWrites=true&writeConcern=majority';
    const MONGODB_DB_NAME = 'clearfashion';

    // const client = new MongoClient(MONGODB_URI);
    // try {
    //     await client.connect();
    //     //const db = client.db(MONGODB_DB_NAME);
    
    //     await listDatabases(client);
    // }
    // catch (e) {
    //     console.error(e);
    // }
    // finally {
    //     await client.close();
    // }
// CHECK IF I TAKE COMMENTED CODE INTO THE CONNECT FUNCTION


    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
      const collection = client.db(MONGODB_DB_NAME).collection('products');




      console.log('connected');
  
      const products = [];
      const jsonData=require('./dedicatedbranditems.json');
      console.log('TEST JSON');
      console.log(jsonData);
      console.log('END TEST');
      
      
      const result = collection.insertMany(products);
      console.log(result);
      
      



      client.close();
    });









    
}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};



main().catch(console.error);