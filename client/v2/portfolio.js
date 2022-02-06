// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let favoriteProducts = [];
let currentPagination = {};

// inititiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const sectionFavoriteProducts = document.querySelector('#products_favorite');
const spanNbProductsTotal = document.querySelector('#nbProductsTotal');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanP90 = document.querySelector('#p90');
// const button_favorites = document.querySelector('#add_favorites');

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
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
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
const renderFavorites = products_favorites =>{
  // renderProducts(currentProducts);

  currentProducts.forEach(product => {
    const button_fav = document.querySelector("#add_favorites "+product.name)
    console.log(button_fav);
  })
  
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products_favorites
  .map(product => {
    return `
    <div class="product" id=${product.uuid}>
      <span>${product.brand}</span>
      <a href="${product.link}">${product.name}</a>
      <span>${product.price}</span>
    </div>
  `;
  })
  .join('');
  div.innerHTML = template;
  fragment.appendChild(div);
  sectionFavoriteProducts.innerHTML = '<h2>Favorite products</h2>';
  sectionFavoriteProducts.appendChild(fragment);
  

}

const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
        <button id="add_favorites ${product.name}"
        type="button">
          Add to favorites
        </button>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
  
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

const renderP90 = products => {
  var idx = parseInt(products.length*0.9);
  // var sorted = SortAsc
}

const render = (products, pagination) => {
  renderProducts(products);
  // renderFavorites(favoriteProducts);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderNbProducts(products);
  renderNewProducts(products);
  renderP90(products);
  // const button_favorites = document.querySelector('#add_favorites Le hoodie');
  // console.log(button_favorites);
};
const selProductsByPage = (pageNumber) =>{

}
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

selectPage.addEventListener('change',(event) =>{
  var e = document.getElementById("show-select");
  var strUser = e.value;

  fetchProducts(parseInt(event.target.value),parseInt(strUser)).
  then(setCurrentProducts)
  .then(() => render(currentProducts, currentPagination))
})

// button_favorites.addEventListener('click',() =>{
//   console.log('Added to favorites!');
// })




