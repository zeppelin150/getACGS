// js/main.js
ready(() => {
  UI.setYear();
  UI.toggleNav();

  const page = document.body.getAttribute('data-page');
  Logger.info('Page init', page);

  if (page === 'home') {
    const target = document.getElementById('product-cards');
    if (target) Components.renderGrid(target, PRODUCTS, Components.productCard);
  }

  if (page === 'products') {
    const grid = document.getElementById('products-grid');
    if (grid) Components.renderGrid(grid, PRODUCTS, Components.productCard);
  }

  UI.ioReveal();
});
