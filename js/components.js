// js/components.js
window.Components = {
  productCard(product) {
    const isQuinte = product.id === 'quinte';
    const features = product.features.length
      ? product.features.map(f => `<li>${f}</li>`).join('')
      : '';

    const featureBlock = features
      ? `<ul class="checklist">${features}</ul>`
      : `<p style="color:var(--muted);font-size:.88rem;font-style:italic">More details coming soon.</p>`;

    const linkText = isQuinte ? 'Coming soon' : 'Discover more';
    const linkHref = isQuinte ? '#' : `products.html#${product.id}`;

    return `
      <article class="product-card reveal">
        <div class="product-icon ${product.iconClass}">${product.icon}</div>
        <h3><a href="${linkHref}">${product.name}</a></h3>
        <p class="muted" style="font-size:.85rem;margin-bottom:4px">${product.tagline}</p>
        <p>${product.summary}</p>
        ${featureBlock}
        <a class="card-link" href="${linkHref}">${linkText} <span class="arrow">&#8594;</span></a>
      </article>
    `;
  },

  renderGrid(el, items, tplFn) {
    el.innerHTML = items.map(tplFn).join('');
  }
};
