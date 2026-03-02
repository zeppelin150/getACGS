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
    const linkHref = `${product.id}.html`;

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

  productHero(product) {
    const badges = product.badges.map(b => `<span class="badge">${b}</span>`).join('');
    const comingSoon = product.id === 'quinte' ? ' <span class="coming-soon-banner">Coming Soon</span>' : '';
    return `
      <div class="product-icon-large ${product.iconClass}">${product.icon}</div>
      <div class="badge-row">${badges}${comingSoon}</div>
      <h1>${product.name}</h1>
      <p class="tagline">${product.tagline}</p>
    `;
  },

  productFeatureGrid(product) {
    if (!product.detailedFeatures || !product.detailedFeatures.length) {
      return '<p class="muted" style="font-style:italic">Feature details coming soon.</p>';
    }
    return product.detailedFeatures.map(f => `
      <div class="feature-item reveal">
        <h4>${f.title}</h4>
        <p>${f.description}</p>
      </div>
    `).join('');
  },

  pricingGrid(product) {
    if (!product.pricing || !product.pricing.length) {
      return '<p class="muted" style="font-style:italic">Pricing details coming soon.</p>';
    }
    return product.pricing.map(p => `
      <div class="pricing-card ${p.featured ? 'featured' : ''} reveal">
        <h3>${p.tier}</h3>
        <div class="price">${p.price}<span>${p.period}</span></div>
        <ul class="checklist">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
        <a class="btn btn-primary" href="contact.html">${p.cta}</a>
      </div>
    `).join('');
  },

  blogCard(post) {
    return `
      <article class="blog-card reveal">
        <span class="blog-date">${post.date}</span>
        <h3><a href="${post.url}" target="_blank" rel="noopener">${post.title}</a></h3>
        <p class="excerpt">${post.excerpt}</p>
        <a class="card-link" href="${post.url}" target="_blank" rel="noopener">Read on Substack <span class="arrow">&#8594;</span></a>
      </article>
    `;
  },

  testimonialCard(t) {
    return `
      <div class="testimonial-card reveal">
        <blockquote>${t.quote}</blockquote>
        <div class="testimonial-author">
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}, ${t.company}</div>
        </div>
      </div>
    `;
  },

  storeCard(product) {
    const isQuinte = product.id === 'quinte';
    const price = product.pricing && product.pricing[1] ? product.pricing[1].price : 'TBD';
    const period = product.pricing && product.pricing[1] ? product.pricing[1].period : '';
    const btnText = isQuinte ? 'Coming Soon' : 'Purchase';
    const btnClass = isQuinte ? 'btn btn-ghost' : 'btn btn-primary';
    const disabled = isQuinte ? ' style="pointer-events:none;opacity:.5"' : '';
    return `
      <div class="store-card reveal">
        <div class="product-icon ${product.iconClass}">${product.icon}</div>
        <h3>${product.name}</h3>
        <p class="muted">${product.tagline}</p>
        <p>${product.summary}</p>
        <div class="store-price">${price}<span>${period}</span></div>
        <a class="${btnClass}" href="${product.id}.html"${disabled}>${btnText}</a>
      </div>
    `;
  },

  renderGrid(el, items, tplFn) {
    el.innerHTML = items.map(tplFn).join('');
  }
};
