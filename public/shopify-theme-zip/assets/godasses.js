/* ══════════════════════════════════════
   GODASSES.MA — Theme JavaScript
   ══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Scroll Reveal ── */
  var revealEls = document.querySelectorAll('.gd-reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('gd-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('gd-revealed'); });
  }

  /* ── Mobile Menu ── */
  var menuToggle = document.querySelector('.gd-menu-toggle');
  var mobileMenu = document.querySelector('.gd-mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('gd-open');
      var iconOpen = menuToggle.querySelector('.gd-icon-open');
      var iconClose = menuToggle.querySelector('.gd-icon-close');
      if (iconOpen) iconOpen.classList.toggle('gd-hidden');
      if (iconClose) iconClose.classList.toggle('gd-hidden');
    });
  }

  /* ── Cart Drawer ── */
  var cartOverlay = document.querySelector('.gd-cart-overlay');
  var cartDrawer = document.querySelector('.gd-cart-drawer');
  var cartOpenBtns = document.querySelectorAll('[data-cart-open]');
  var cartCloseBtns = document.querySelectorAll('[data-cart-close]');

  function openCart() {
    if (cartOverlay) cartOverlay.classList.add('gd-open');
    if (cartDrawer) cartDrawer.classList.add('gd-open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    if (cartOverlay) cartOverlay.classList.remove('gd-open');
    if (cartDrawer) cartDrawer.classList.remove('gd-open');
    document.body.style.overflow = '';
  }

  cartOpenBtns.forEach(function (btn) { btn.addEventListener('click', openCart); });
  cartCloseBtns.forEach(function (btn) { btn.addEventListener('click', closeCart); });
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  /* ── Add to Cart (AJAX) ── */
  document.querySelectorAll('[data-add-to-cart]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var variantId = form.querySelector('[name="id"]').value;
      var qty = form.querySelector('[name="quantity"]') ? form.querySelector('[name="quantity"]').value : 1;

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(variantId), quantity: parseInt(qty) })
      })
        .then(function (r) { return r.json(); })
        .then(function () {
          openCart();
          updateCartDrawer();
        })
        .catch(function (err) { console.error('Add to cart failed:', err); });
    });
  });

  /* ── Update Cart Drawer ── */
  function updateCartDrawer() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        var itemsContainer = document.querySelector('.gd-cart-items');
        var totalEl = document.querySelector('.gd-cart-total');
        var countEls = document.querySelectorAll('.gd-cart-count');

        countEls.forEach(function (el) { el.textContent = cart.item_count; });
        if (totalEl) totalEl.textContent = (cart.total_price / 100).toFixed(2) + ' MAD';

        if (itemsContainer) {
          if (cart.items.length === 0) {
            itemsContainer.innerHTML = '<p style="text-align:center;color:var(--gd-muted);padding:2rem 0;">Votre panier est vide</p>';
          } else {
            itemsContainer.innerHTML = cart.items.map(function (item) {
              return '<div class="gd-cart-item">' +
                '<img src="' + item.image + '" alt="' + item.title + '">' +
                '<div class="gd-cart-item-info">' +
                '<p style="font-size:.875rem;font-weight:500;">' + item.title + '</p>' +
                '<p style="font-size:.75rem;color:var(--gd-muted);">' + (item.variant_title || '') + '</p>' +
                '<p style="font-family:var(--gd-font-display);color:var(--gd-primary);margin-top:.25rem;">' + (item.final_line_price / 100).toFixed(2) + ' MAD</p>' +
                '<div class="gd-qty-controls">' +
                '<button class="gd-qty-btn" onclick="updateQty(' + item.key + ',' + (item.quantity - 1) + ')">−</button>' +
                '<span style="font-size:.875rem;">' + item.quantity + '</span>' +
                '<button class="gd-qty-btn" onclick="updateQty(' + item.key + ',' + (item.quantity + 1) + ')">+</button>' +
                '</div></div></div>';
            }).join('');
          }
        }
      });
  }

  window.updateQty = function (key, qty) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    })
      .then(function () { updateCartDrawer(); });
  };

  /* ── Product Page: Image Gallery ── */
  var thumbs = document.querySelectorAll('.gd-thumb');
  var mainImg = document.querySelector('.gd-main-image');
  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      thumbs.forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
      if (mainImg) mainImg.src = thumb.dataset.src;
    });
  });

  /* ── Product Page: Variant Selection ── */
  var variantBtns = document.querySelectorAll('.gd-variant-btn');
  variantBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.dataset.optionGroup;
      document.querySelectorAll('.gd-variant-btn[data-option-group="' + group + '"]').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var variantInput = document.querySelector('[name="id"]');
      if (variantInput && btn.dataset.variantId) {
        variantInput.value = btn.dataset.variantId;
      }
    });
  });
});
