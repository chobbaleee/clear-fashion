/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const adresseparisbrand = require('./sources/adresseparisbrand');
const montlimartbrand = require('./sources/montlimartbrand');

async function sandboxDedicated (eshop = 'https://www.dedicatedbrand.com/en/men/all-men') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await dedicatedbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    //process.exit(0);
  } catch (e) {
    console.error(e);
    //process.exit(1);
  }
}

async function sandboxAdresseParis (eshop = 'https://adresse.paris/630-toute-la-collection') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await adresseparisbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    //process.exit(0);
  } catch (e) {
    console.error(e);
    //process.exit(1);
  }
}

async function sandboxMontlimart (eshop = 'https://www.montlimart.com/toute-la-collection.html') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await montlimartbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    //process.exit(0);
  } catch (e) {
    console.error(e);
    //process.exit(1);
  }
}

// async function getAllProducts() {
//   for (let page = 1; page <= 10; page++){
//     url = `https://www.dedicatedbrand.com/en/men/all-men#page=${page}`;
//     await sandbox1(url);
//   }
// }

//const [,, eshop1] = process.argv;

async function multipleSandbox(URLList){
  var url = URLList[0];
  await sandboxDedicated(url);
  url = URLList[1];
  await sandboxAdresseParis(url);
  url = URLList[2];
  await sandboxMontlimart(url);
}

const URLLIst = ['https://www.dedicatedbrand.com/en/men/all-men','https://adresse.paris/630-toute-la-collection','https://www.montlimart.com/toute-la-collection.html']
multipleSandbox(URLLIst);
