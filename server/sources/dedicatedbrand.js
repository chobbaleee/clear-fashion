// const fetch = require('node-fetch');
// const cheerio = require('cheerio');

const puppeteer = require('puppeteer');
// const {'v5': uuidv5} = require('uuid');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */

function extractItems() {
/*  For extractedElements, you are selecting the tag and class,
    that holds your desired information,
    then choosing the desired child element you would like to scrape from.
    in this case, you are selecting the
    "<div class=blog-post />" from "<div class=container />" See below: */
  const extractedElements = document.querySelectorAll('#filterItems > div.productList');
  const extractedTitle = document.querySelectorAll('#filterItems > div.productList > a.productList-link > div.productList-details > span.productList-title');
  const extractedPrice = document.querySelectorAll('#filterItems > div.productList > a.productList-link > div.productList-details > div.productList-price');
  const images = document.querySelectorAll('#filterItems > div.productList > a.productList-link > div.productList-image > img');
  const items = [];
  console.log(images.length);
  
  for(let i =0;i<extractedTitle.length;i++){
    var imageLink = images[2*i].getAttribute('src');
    item = JSON.parse(`{"brand":"dedicated","name":"${extractedTitle[i].innerText}",
    "price":${parseFloat(extractedPrice[i].innerText)},"link":"${imageLink}"}`);
    
    items.push(item);
  }
  // for (let element of extractedTitle) {
  //   items.push(element.innerText);
  //   console.log(`length:${extractedElements.length}`);
  // }
  return items;
}

async function scrapeItems(
  page,
  extractItems,
  itemCount,
  scrollDelay = 800,
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemCount) {
      console.log('extracting items...');
      items = await page.evaluate(extractItems);
      //console.log(`items:${items}`);
      console.log(`items length: ${items.length}`);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      console.log(`previous height: ${previousHeight}`);
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitForTimeout(scrollDelay);
      await page.evaluate('window.scrollTo(0,0)');
      await page.waitForTimeout(scrollDelay);

    }
  } catch(e) { }
  return items;
}

module.exports.scrape = async (eshop) => {
  try{
    // Set up Chromium browser and page.
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Navigate to the example page.
  await page.goto(eshop);
  
  // Auto-scroll and extract desired items from the page. Currently set to extract ten items.
  const items = await scrapeItems(page, extractItems, 371);
  console.log(items);
  const items_json = JSON.stringify(items);

  // Save extracted items to a new file.
  // fs.writeFileSync('./items.json',items_json);

  // Close the browser.
  await browser.close();

  return items_json;

  }catch(error){
    console.error(error);
  }
  
}

// const parse = data => {
//   const $ = cheerio.load(data);
//   // console.log($);
//   return $('.productList-container .productList')
//     .map((i, element) => {
//       const name = $(element)
//         .find('.productList-title')
//         .text()
//         .trim()
//         .replace(/\s/g, ' ');
//       const price = parseInt(
//         $(element)
//           .find('.productList-price')
//           .text()
      
//       );

//       return {name, price};
//     })
//     .get();
// };

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
// module.exports.scrape = async url => {
//   try {
//     const response = await fetch(url);

//     if (response.ok) {
//       const body = await response.text();
//       console.log(body);

//       return parse(body);
//     }

//     console.error(response);

//     return null;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };
