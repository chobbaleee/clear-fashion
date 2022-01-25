// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode

// git add -A && git commit -m "New File"
// git push origin master (branch name)
// git remote add -f <nom de la branche> https://github.com/Antoine-Cohen/clear-fashion.git
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}];

console.table(MY_FAVORITE_BRANDS);
console.log(MY_FAVORITE_BRANDS[0]);



/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO: The cheapest t-shirt
// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
const cheap = 'https://www.loom.fr/collections/tous-les-vetements/products/le-t-shirt';

// I can find on these e-shops
// 2. Log the variable
console.log(cheap);




/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */

// 🎯 TODO: Number of products
console.log('TODO: Number of products');
// 1. Create a variable and assign it the number of products
console.log('Nombre de produits:');
let n_prod = marketplace.length;
// 2. Log the variable

console.log(n_prod);


// 🎯 TODO: Brands name
console.log('TODO: Brands name');
// 1. Create a variable and assign it the list of brands name only
let brand_names = [];
for(let i = 0;i<n_prod;i++){
  brand_names.push(marketplace[i].brand);
}

// 2. Log the variable
console.log(brand_names);
// 3. Log how many brands we have
let single_brand_names = new Set(brand_names);
console.log(single_brand_names.size);


// 🎯 TODO: Sort by price
console.log('TODO: Sort by price');
// 1. Create a function to sort the marketplace products by price
marketplace.sort((a, b) => {
  return a.price - b.price;
});
marketplace.forEach((e) => {
  console.log(`${e.brand} ${e.price} ${e.name}`);
});
// 2. Create a variable and assign it the list of products by price from lowest to highest
let market_sorted = marketplace.sort((a, b) => {
  return a.price - b.price;
});
// 3. Log the variable
console.log(market_sorted);


// 🎯 TODO: Sort by date
console.log('TODO: Sort by date');
// 1. Create a function to sort the marketplace objects by products date
marketplace.sort(function(a,b){
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return new Date(b.date) - new Date(a.date);
});
marketplace.forEach((e) => {
  console.log(`${e.brand} ${e.date} ${e.name}`);
});

// 2. Create a variable and assign it the list of products by date from recent to old
let market_date = marketplace.sort(function(a,b){
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return new Date(b.date) - new Date(a.date);
});
// 3. Log the variable
console.log(market_date);


// 🎯 TODO: Filter a specific price range
console.log('TODO: Filter a specific price range');
// 1. Filter the list of products between 50€ and 100€
let market_price = marketplace.filter(obj => obj.price>=50 && obj.price<=100)
market_price.forEach((e)=>{
  console.log(e.price);
})
// 2. Log the list
console.log(market_price);

// 🎯 TODO: Average price
console.log('TODO: Average price');
// 1. Determine the average price of the marketplace
let prices = marketplace.map(obj => obj.price);
let avg = 0;
for(let i=0;i<prices.length;i++){
  avg += prices[i];
}
avg = avg/prices.length;
// 2. Log the average
console.log(avg);





/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO: Products by brands
console.log('TODO: Products by brands');
// 1. Create an object called `brands` to manipulate products by brand name

const brands = marketplace.reduce(function (r, a) {
  r[a.brand] = r[a.brand] || [];
  r[a.brand].push(a);
  return r;
}, Object.create(null));


// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
console.log(brands);
// 3. Log the number of products by brands
for (const [key, value] of Object.entries(brands)) {
  console.log(`${key}: ${value.length}`);
}
// 🎯 TODO: Sort by price for each brand
console.log('TODO: Sort by price for each brand');
// 1. For each brand, sort the products by price, from highest to lowest
let brands_price = {}
for (const [key, value] of Object.entries(brands)) {
  let sorted_p = value.sort((a, b) => {
    return b.price - a.price;
  });
  brands_price[key] = sorted_p;
}
// 2. Log the sort
console.log(brands_price);


// 🎯 TODO: Sort by date for each brand

console.log('TODO: Sort by date for each brand');
// 1. For each brand, sort the products by date, from old to recent
let brands_date = {};
for (const [key, value] of Object.entries(brands)) {
  let sorted_p = value.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  brands_date[key] = sorted_p;
}
// 2. Log the sort
console.log(brands_date);




/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
console.log('TODO: Compute the p90 price value');
// 1. Compute the p90 price value of each brand
let b_p = {}
for (const [key, value] of Object.entries(brands)){
  let avg = 0;
  for(let i = 0;i<value.length;i++){
    avg += value[i].price;
  }
  avg = avg/value.length;
  let std = 0;
  for(let i = 0;i<value.length;i++){
    std+= (value[i].price - avg)^2;
  }
  std = std/value.length;
  b_p[key] = Math.round(std*1.282);
}

// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products
console.log(b_p);




/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
]

// 🎯 TODO: New released products
console.log('TODO: New released products');
// 1. Log if we have new products only (true or false)
let new_products = true;
var today = new Date();
var date_today = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());
COTELE_PARIS.forEach((item) => {
  let release_date = new Date(item.released)
  
  var Difference_In_Time = date_today.getTime() - release_date.getTime();
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  if(Difference_In_Days>=14) new_products = false;
})

console.log(new_products);
// A new product is a product `released` less than 2 weeks.

var today = new Date();
var dateauj = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

// test 1703
for(let i = 0;i<COTELE_PARIS.length;i++){
  var aDay = 86400000;
  
  var diff = Math.floor(
  (
    Date.parse(
      dateauj.replace(/-/g, '\/')
    ) - Date.parse(
      COTELE_PARIS[i].released.replace(/-/g, '\/')
    )
  ) / aDay);

  if(diff < 14)
  {
    console.log(COTELE_PARIS[i])
  }
  
}
// 🎯 TODO: Reasonable price
console.log('TODO: Reasonable price');
let reasonable = true;
COTELE_PARIS.forEach((item) => {
  if(item.price > 100) reasonable=false;
})
console.log(`is reasonable: ${reasonable}`);
// // 1. Log if coteleparis is a reasonable price shop (true or false)
// // A reasonable price if all the products are less than 100€


// 🎯 TODO: Find a specific product
console.log('TODO: Find a specific product');
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
let uuid_to_find = `b56c6d88-749a-5b4c-b571-e5b5c6483131`;
let index_to_find = COTELE_PARIS.findIndex(item => item.uuid == uuid_to_find);
console.log(COTELE_PARIS[index_to_find].name);
// 2. Log the product


// 🎯 TODO: Delete a specific product
console.log('TODO: Delete a specific product');
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
console.log('Salut Antoine');
// 2. Log the new list of product

// 🎯 TODO: Save the favorite product
console.log('TODO: Save the favorite product');
let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// we make a copy of blueJacket to jacket
// and set a new property `favorite` to true
let jacket = blueJacket;

jacket.favorite = true;

// 1. Log `blueJacket` and `jacket` variables
// 2. What do you notice?

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties





/**
 * 🎬
 * The End
 * 🎬
 */

// 🎯 TODO: Save in localStorage
console.log('TODO: Save in localStorage');
// 1. Save MY_FAVORITE_BRANDS in the localStorage
// 2. log the localStorage
