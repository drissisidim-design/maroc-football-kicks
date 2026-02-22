/* ============================================
   KICKSTORE — JavaScript Animations pour YouCan
   Scroll reveal + Cart drawer + Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Scroll Reveal ──
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ── Staggered reveal (enfants animés un par un) ──
  document.querySelectorAll('.reveal-stagger').forEach(function (parent) {
    const children = parent.querySelectorAll('.reveal-child');
    const staggerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          children.forEach(function (child, i) {
            child.style.animationDelay = (i * 0.1) + 's';
            child.classList.add('animate-fade-in-up');
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    staggerObserver.observe(parent);
  });

  // ── Cart Drawer ──
  var cartOverlay = document.querySelector('.cart-overlay');
  var cartDrawer = document.querySelector('.cart-drawer');
  var cartOpenBtns = document.querySelectorAll('[data-open-cart]');
  var cartCloseBtns = document.querySelectorAll('[data-close-cart]');

  function openCart() {
    if (cartOverlay) cartOverlay.classList.add('open');
    if (cartDrawer) cartDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartOverlay) cartOverlay.classList.remove('open');
    if (cartDrawer) cartDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartOpenBtns.forEach(function (btn) { btn.addEventListener('click', openCart); });
  cartCloseBtns.forEach(function (btn) { btn.addEventListener('click', closeCart); });
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // ── Mobile Menu ──
  var menuToggle = document.querySelector('[data-toggle-menu]');
  var mobileMenu = document.querySelector('.mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      mobileMenu.style.maxHeight = isOpen ? mobileMenu.scrollHeight + 'px' : '0';
    });
  }

  // ── Size Selector ──
  document.querySelectorAll('.size-selector').forEach(function (group) {
    var buttons = group.querySelectorAll('.size-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
      });
    });
  });

  // ── Add to cart animation ──
  document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.classList.add('animate-pulse-neon');
      btn.textContent = '✓ Ajouté !';
      setTimeout(function () {
        btn.classList.remove('animate-pulse-neon');
        btn.textContent = 'Ajouter au panier';
      }, 1500);
    });
  });

  // ── Navbar scroll effect ──
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      } else {
        navbar.style.borderBottom = '1px solid transparent';
      }
    });
  }

});
