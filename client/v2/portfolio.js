// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let favoriteProducts = new Set();
let listRecentlyReleased = new Set();
let currentPagination = {};

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
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @param  {Boolean}  [filterRecentProduct=false] - filter by recent product
 * @param  {Boolean}  [filterReasonablePrice=false] - filter by reasonable product
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, filterRecentProduct = false, filterReasonablePrice = false) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    console.log('data returned:'+body.data.meta);

    if (filterRecentProduct == true) {
      return set_recent_products(body);
    }

    if (filterReasonablePrice == true) {
      return set_reasonable_price(body);
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
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
    button_fav.addEventListener('click',() => {
      if (isInFavorites(product,favoriteProducts)){
        console.log('product already in favorites');
      }
      else{
        favoriteProducts.add(product);
      }
      in_fav.innerHTML = 'Added to favorites'
    })
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
  body.data.result = recentProducts;
  return body.data;
}

const set_reasonable_price = body => {
  var reasonableProducts = new Set();
  body.data.result.forEach(i => {
    if(i.price<=50) reasonableProducts.add(i);
  });
  return body.data;
}

const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products.map(product => {
      let str_fav = '';
      if(isInFavorites(product,favoriteProducts)){
        str_fav = 'Added to favorites'
      }
      return `
      <div class="product" id=${product.uuid}>
        <span>Brand:${product.brand}</span>
        <a>| Name:</a>
        <a href="${product.link}" target="_blank">${product.name}</a>
        <span>${product.price}</span>
        <button id="add_favorites ${product.name}"
        type="button">
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
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
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
  spanP50.innerHTML = sorted[idx].price;
}

const renderP90 = products => {
  var idx = parseInt(products.length*0.9);
  var sorted = products.sort((b,a) => b.price - a.price);
  spanP90.innerHTML = sorted[idx].price;
}

const renderP95 = products => {
  var idx = parseInt(products.length*0.95);
  var sorted = products.sort((b,a) => b.price - a.price);
  spanP95.innerHTML = sorted[idx].price;
}

const renderLastRelasedDate = products => {
  var sorted = products.sort((b,a) => b.released - a.release_date);
  spanLastRelasedDate.innerHTML = sorted[0].released;
}

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderNbProducts(products);
  renderNewProducts(products);
  renderP50(products);
  renderP90(products);
  renderP95(products);
  renderLastRelasedDate(products);
};

 /**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  console.log('current page:',currentPagination.currentPage);
  console.log('target value:',event.target.value);
  
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);

selectPage.addEventListener('change',(event) => {
  var e = document.getElementById("show-select");
  var strUser = e.value;

  fetchProducts(parseInt(event.target.value),parseInt(strUser)).
  then(setCurrentProducts)
  .then(() => render(currentProducts, currentPagination))
});

filter_recent_products.addEventListener('click',() => {
  console.log('You clicked filter by recent products');
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize, true, false)
  .then(setCurrentProducts)
  .then(() => render(currentProducts, currentPagination))
});

filter_Reasonable_Price.addEventListener('click',() => {
  console.log('You clicked filter by reasonable price');
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize, false, true)
  .then(setCurrentProducts)
  .then(() => render(currentProducts, currentPagination))
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
    case 'date-asc':
      currentProducts=currentProducts.sort((x,y)=> new Date(x.released)- new Date(y.released)).reverse()
      break;
    case 'date-desc':
      currentProducts=currentProducts.sort((x,y)=> new Date(x.released)- new Date(y.released))
      break;   
    case 'favorites':
      currentProducts = Array.from(favoriteProducts);
      break;
    case 'reasonable price':
      currentProducts = currentProducts.filter(currentProducts => currentProducts.price < 50);
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
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
})






