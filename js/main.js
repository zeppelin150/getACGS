// js/main.js
ready(() => {
  UI.setYear();
  UI.toggleNav();
  UI.dropdownNav();

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

  if (['harpax', 'revvit', 'quinte'].includes(page)) {
    const product = PRODUCTS.find(p => p.id === page);
    if (product) {
      const heroEl = document.getElementById('product-hero-content');
      if (heroEl) heroEl.innerHTML = Components.productHero(product);

      const descEl = document.getElementById('product-description');
      if (descEl) descEl.textContent = product.description || product.summary;

      const featEl = document.getElementById('product-features');
      if (featEl) featEl.innerHTML = Components.productFeatureGrid(product);

      const priceEl = document.getElementById('product-pricing');
      if (priceEl) priceEl.innerHTML = Components.pricingGrid(product);
    }
  }

  if (page === 'blog') {
    const grid = document.getElementById('blog-grid');
    if (grid && window.BLOG_POSTS) Components.renderGrid(grid, BLOG_POSTS, Components.blogCard);
  }

  if (page === 'testimonials') {
    const grid = document.getElementById('testimonials-grid');
    if (grid && window.TESTIMONIALS) Components.renderGrid(grid, TESTIMONIALS, Components.testimonialCard);
  }

  if (page === 'store') {
    const grid = document.getElementById('store-grid');
    if (grid) Components.renderGrid(grid, PRODUCTS, Components.storeCard);
  }

  UI.ioReveal();
});
