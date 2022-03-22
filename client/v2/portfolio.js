// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let favoriteProducts = new Set();
let listRecentlyReleased = new Set();
let currentPagination = {};
let currentBrands = [];
let temp = [];

// inititiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectSort = document.querySelector('#sort-select');
const selectBrand = document.querySelector('#brand-select');
const selectFilter= document.querySelector('#filter-select');
const sectionProducts = document.querySelector('#products');
const spanNbProductsTotal = document.querySelector('#nbProductsTotal');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanP50 = document.querySelector('#p50');
const spanP90 = document.querySelector('#p90');
const spanP95 = document.querySelector('#p95');
const spanLastRelasedDate = document.querySelector('#LastReleasedDate');
const filter_recent_products = document.querySelector('#filterRecent');
const filter_Reasonable_Price = document.querySelector('#filterReasonablePrice');


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = (result, meta) => {
  currentProducts = result;
  currentPagination = meta;
};

const changeBrands = (products, brand) => {
  temp = [];
  for (let i = 0; i < products.length; i++) {
    if (Object.values(currentProducts)[i]['brand'] == String(brand)) {
      temp.push((Object.values(currentProducts)[i]));
    }
  }

}

/**
 * Set global value
 * @param {Array} result - products to display
 */
 const setCurrentBrands = (result) => {
    currentBrands = result;
  };

/**
 * Fetch products from api
 * @param  {Number}  [size=12] - size of the page
 * @param  {Boolean}  [filterRecentProduct=false] - filter by recent product
 * @param  {Boolean}  [filterReasonablePrice=false] - filter by reasonable product
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand = ':isnull=true', price = ':isnull=true', filterRecentProduct = false, filterReasonablePrice = false) => {
  try {
    const response = await fetch(
      `https://server-five-beige.vercel.app/products/search?brand${brand}&price${price}&limit=${size}`
    );
    const body = await response.json();

    if (filterRecentProduct == true) {
      return set_recent_products(body);
    }

    if (filterReasonablePrice == true) {
      return set_reasonable_price(body);
    }

    let meta = {"currentPage":1, "pageCount":12, "pageSize":size, "count":body.length};

    return {body, meta};
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Fetch brand from api
 * @param  {Number}  [page=1] - current page to fetch
 * @return {Array}
 */
 const fetchBrands = async (page = 1) => {
    try {
      const response = await fetch(
        `https://clear-fashion-api.vercel.app/brands`
      );

      const body = await response.json();
  
      if (body.success !== true) {
        console.error(body);
        console.log('fine' + currentBrands);
        return {currentBrands, currentPagination};
      }

      let res = {"success":true,"data":{"result":["Montlimart","Adresse Paris","dedicated"]}}; 
      return res.data;
    } catch (error) {
      console.error(error);
      console.log('error' + currentBrands);
      return {currentBrands, currentPagination};
    }
  };

/**
 * Render list of products
 * @param  {Array} products
 */
const isInFavorites = (product,favorites)=>{
  let isfav = false;
  favorites.forEach(fav => {
    if(fav.uuid == product.uuid){
      isfav = true;
    }
  });
  return isfav;
}

const set_button_listeners = () => {
  currentProducts.forEach(product => {
    let button_fav = document.getElementById(`add_favorites ${product.name}`)
    let in_fav = document.getElementById(`in_favorites ${product.name}`)
    if(button_fav){
      button_fav.addEventListener('click',() => {
        if (isInFavorites(product,favoriteProducts)){
          console.log('product already in favorites');
        }
        else{
          favoriteProducts.add(product);
        }
        in_fav.innerHTML = 'Added to favorites';
      })
    }
  })
}

const set_recent_products = body => {
  var recentProducts = new Set();
  var today = new Date();
  var date_today = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());
  body.data.result.forEach(i => {
    let release_date = new Date(i.released)
    var Difference_In_Time = date_today.getTime() - release_date.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if(Difference_In_Days<=50) recentProducts.add(i);
  });
  
  // body.data.result = recentProducts;
  // console.log('body data recent:',body.data);
  return recentProducts;
}

const set_reasonable_price = body => {
  var reasonableProducts = new Set();
  body.data.result.forEach(i => {
    if(i.price<=50) reasonableProducts.add(i);
  });
  console.log('reasonable prices:',reasonableProducts);
  return reasonableProducts;
}

const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  console.log(products);
  const template = products.map(product => {
      let str_fav = '';
      if(isInFavorites(product,favoriteProducts)){
        str_fav = 'Added to favorites'
      }
      return `
      <div class="p-3 mb-2 bg-success text-white w-25" id=${product.uuid}>
        <span class="text-dark">Brand: </span>
        <a>${product.brand}<br></a>
        <a class="text-dark">Name:</a>
        <a href="${product.link}" target="_blank" class="text-white">${product.name}<br></a>
        <a class="text-dark">Price:</a>
        <a>${product.price}<br></a>
        <button id="add_favorites ${product.name}"
        type="button" class="btn btn-dark">
          Add to favorites
        </button>
        <span id="in_favorites ${product.name}">${str_fav}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
  set_button_listeners();
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  console.log('pagination:',pagination);
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option class="list-group-item" value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
  spanNbProductsTotal.innerHTML = count;
};

const renderNbProducts = products => {
  spanNbProducts.innerHTML = products.length;
}

const renderNewProducts = products => {
  let nbNewProductsCount = 0;
  var today = new Date();
  var date_today = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());
  products.forEach((item) => {
    let release_date = new Date(item.released)
    var Difference_In_Time = date_today.getTime() - release_date.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if(Difference_In_Days<=14) nbNewProductsCount++;
  });
  spanNbNewProducts.innerHTML = nbNewProductsCount;
}

const renderP50 = products => {
  var idx = parseInt(products.length*0.5);
  var sorted = products.sort((b,a) => b.price - a.price);
  if(sorted[idx])
    spanP50.innerHTML = sorted[idx].price;
  else
    spanP50.innerHTML = 0;
}

const renderP90 = products => {
  var idx = parseInt(products.length*0.9);
  var sorted = products.sort((b,a) => b.price - a.price);
  if(sorted[idx])
    spanP90.innerHTML = sorted[idx].price;
  else
    spanP50.innerHTML = 0;
}

const renderP95 = products => {
  var idx = parseInt(products.length*0.95);
  var sorted = products.sort((b,a) => b.price - a.price);
  if (sorted[idx])
    spanP95.innerHTML = sorted[idx].price;
  else
    spanP95.innerHTML = 0;
}

const renderLastRelasedDate = products => {
  var sorted = products.sort((b,a) => b.released - a.release_date);
  if(sorted[0])
    spanLastRelasedDate.innerHTML = sorted[0].released;
  else
    spanLastRelasedDate.innerHTML = 'No products';
}

/**
 * Render list of brands
 * @param  {Array} brands
 */
const renderBrands = brands => {  
  const element = document.getElementById('brand-select');
  for (let i = 0; i < element.length; i++) {
    element.remove(element.index[i]);
  }
  const fragment = document.createDocumentFragment();
  let option = "";
  for (let i = 0; i < Object.values(brands)[0].length; i++) {
    option = document.createElement('option');
    option.textContent = Object.values(brands)[0][i];
    option.value = Object.values(brands)[0][i];
    fragment.appendChild(option);
  }
  element.appendChild(fragment);
  };

const render = (products, brands, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderNbProducts(products);
  renderNewProducts(products);
  renderP50(products);
  renderP90(products);
  renderP95(products);
  renderLastRelasedDate(products);
  renderBrands(brands);
};

 /**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', async event => {
  console.log('current page:',currentPagination.currentPage);
  console.log('target value:',event.target.value);

  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));
  setCurrentProducts(products.body, products.meta);
  render(currentProducts, currentBrands, currentPagination);
});

selectPage.addEventListener('change',(event) => {
  var e = document.getElementById("show-select");
  var strUser = e.value;

  fetchProducts(parseInt(event.target.value),parseInt(strUser)).
  then(setCurrentProducts)
  .then(() => render(currentProducts, currentPagination))
});

filter_recent_products.addEventListener('click',async () => {
  console.log('You clicked filter by recent products');
  
  const recentP = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, true, false);
  console.log(recentP);
  render(Array.from(recentP),currentPagination);
});

filter_Reasonable_Price.addEventListener('click',async () => {
  console.log('You clicked filter by reasonable price');
  console.log(currentPagination.currentPage, currentPagination.pageSize);
  const reasonableP = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, false, true);
  console.log(reasonableP);
  render(Array.from(reasonableP),currentPagination);
});

selectSort.addEventListener('change', event => {

  switch(event.target.value){
    default:
      break;
    case 'price-asc':
      currentProducts=currentProducts.sort((x,y)=> x.price-y.price)
      break;
    case 'price-desc':
      currentProducts=currentProducts.sort((x,y) => x.price-y.price).reverse()
      break;
    case 'date-desc':
      currentProducts=currentProducts.sort((x,y)=> new Date(x.released)- new Date(y.released))
      break;   
    case 'favorites':
      currentProducts = Array.from(favoriteProducts);
      break;
    case 'no-filter':
      const show_id = document.getElementById("show-select");
      const page_id = document.getElementById("page-select") 

      const show_v = show_id.value;
      const page_v = page_id.value;

      fetchProducts(parseInt(page_v),parseInt(show_v)).
      then(setCurrentProducts)
      .then(() => render(currentProducts,currentPagination))
    break;
  }
  renderProducts(currentProducts,currentPagination)

});

selectSort.addEventListener('change', event => {

  switch(event.target.value){
    default:
      break;
    case 'price-asc':
      currentProducts=currentProducts.sort((x,y)=> x.price-y.price)
      break;
    case 'price-desc':
      currentProducts=currentProducts.sort((x,y) => x.price-y.price).reverse()
      break;
    case 'date-desc':
      currentProducts=currentProducts.sort((x,y)=> new Date(x.released)- new Date(y.released))
      break;   
    case 'favorites':
      currentProducts = Array.from(favoriteProducts);
      break;
    case 'no-filter':
      const show_id = document.getElementById("show-select");
      const page_id = document.getElementById("page-select") 

      const show_v = show_id.value;
      const page_v = page_id.value;

      fetchProducts(parseInt(page_v),parseInt(show_v)).
      then(setCurrentProducts)
      .then(() => render(currentProducts,currentPagination))
    break;
  }
  renderProducts(currentProducts,currentPagination)

});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const brands = await fetchBrands();
  setCurrentProducts(products.body, products.meta);
  setCurrentBrands(brands);
  render(currentProducts, currentBrands, currentPagination);
})

selectBrand.addEventListener('change', event => {
  changeBrands(currentProducts, event.target.value);
  console.log(Object.values(temp));
  render(temp, currentBrands, currentPagination);
});