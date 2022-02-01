// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentBrands = [];
let currentPagination = {};

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select')
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

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

  spanNbProducts.innerHTML = count;
};

const render = (products, brands, pagination) => {
  renderProducts(products);
  renderBrands(brands);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
 const setCurrentBrands = ({result, meta}) => {
  currentBrands = result;
  currentPagination = meta;
};

/**
 * Fetch brand from api
 * @param  {Number}  [page=1] - current page to fetch
 * @return {Object}
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

    return body.data;
  } catch (error) {
    console.error(error);
    console.log('error' + currentBrands);
    return {currentBrands, currentPagination};
  }
};

/**
 * Render list of brands
 * @param  {Array} brands
 */
 const renderBrands = brands => {
  const element = document.getElementById('brand-select');
  const fragment = document.createDocumentFragment();
  var option = "";
  
  for (let i=0; i<brands.length; i++) {
    option = document.createElement('option')
    option.textContent = brands[i];
    option.value = brands[i];
    fragment.appendChild(option);
  }
  element.appendChild(fragment);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentBrands, currentPagination));
});

selectBrand.addEventListener('change', event => {
  currentBrands = event.target.value;
  console.log(event.target);
  refresh()
})

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts()
    .then(setCurrentProducts)
    .then(fetchBrands)
    .then(setCurrentBrands)
    .then(() => render(currentProducts, currentBrands, currentPagination));
});