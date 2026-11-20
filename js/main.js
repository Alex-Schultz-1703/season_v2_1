/**
 * SÉASONS Floral Atelier — GSAP Animations & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
      // 1. Initialize GSAP & ScrollTrigger
      gsap.registerPlugin(ScrollTrigger);

      // Pointer capability: drives cursor, magnetic buttons and hover effects
      const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      /* ------------------------------------------------------------------------
         SHARED SCROLL LOCK (drawer / modal / mobile menu)
         ------------------------------------------------------------------------ */
      const scrollLockOwners = new Set();

      function updateScrollLock() {
        document.body.classList.toggle('is-locked', scrollLockOwners.size > 0);
      }

      function lockScroll(owner) {
        scrollLockOwners.add(owner);
        updateScrollLock();
      }

      function unlockScroll(owner) {
        scrollLockOwners.delete(owner);
        updateScrollLock();
      }

      /* ------------------------------------------------------------------------
         CUSTOM LERP CURSOR (pointer-fine devices only)
         ------------------------------------------------------------------------ */
      const cursor = document.getElementById('customCursor');

      if (isFinePointer && cursor) {
        const cursorDot = cursor.querySelector('.custom-cursor__dot');
        const cursorRing = cursor.querySelector('.custom-cursor__ring');

        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        // QuickTo functions for fluid performance (60fps)
        const dotX = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "power2.out" });
        const dotY = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "power2.out" });
        const ringX = gsap.quickTo(cursorRing, "x", { duration: 0.35, ease: "power3.out" });
        const ringY = gsap.quickTo(cursorRing, "y", { duration: 0.35, ease: "power3.out" });

        window.addEventListener('mousemove', (e) => {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
          gsap.to(cursor, { opacity: 1, duration: 0.2 });
          dotX(mouse.x);
          dotY(mouse.y);
          ringX(mouse.x);
          ringY(mouse.y);
        });

        window.addEventListener('mouseleave', () => {
          gsap.to(cursor, { opacity: 0, duration: 0.2 });
        });

        // Cursor hover states
        const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .js-cursor-hover');
        hoverTargets.forEach(el => {
          el.addEventListener('mouseenter', () => cursor.classList.add('custom-cursor--hover'));
          el.addEventListener('mouseleave', () => cursor.classList.remove('custom-cursor--hover'));
        });
      } else if (cursor) {
        cursor.remove();
      }

      /* ------------------------------------------------------------------------
         MAGNETIC BUTTONS EFFECT (pointer-fine devices only)
         ------------------------------------------------------------------------ */
      if (isFinePointer) {
        const magneticBtns = document.querySelectorAll('.js-magnetic');
        magneticBtns.forEach(btn => {
          btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: "power2.out" });
          });

          btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
          });
        });
      }

      /* ------------------------------------------------------------------------
         SMART HEADER: HIDE ON SCROLL DOWN, SHOW ON SCROLL UP
         ------------------------------------------------------------------------ */
      const header = document.getElementById('header');
      let lastScroll = 0;

      window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }

        // Keep the header (and its close control) visible while an overlay is open
        if (document.body.classList.contains('is-locked')) {
          header.classList.remove('header--hidden');
          lastScroll = currentScroll;
          return;
        }

        if (currentScroll > lastScroll && currentScroll > 200) {
          // Scrolling down
          header.classList.add('header--hidden');
        } else {
          // Scrolling up
          header.classList.remove('header--hidden');
        }
        lastScroll = currentScroll;
      });

      /* ------------------------------------------------------------------------
         HERO ENTRANCE ANIMATION (GSAP Timeline)
         ------------------------------------------------------------------------ */
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      heroTl
        .from('.header', { y: -80, opacity: 0, duration: 1.1 })
        .from('.hero__title-line', {
          yPercent: 120,
          opacity: 0,
          stagger: 0.16,
          duration: 1.25,
          ease: "power4.out"
        }, "-=0.6")
        .from('.hero__desc', { y: 25, opacity: 0, duration: 0.9 }, "-=0.8")
        .from('.hero__actions', { y: 20, opacity: 0, duration: 0.8 }, "-=0.7")
        .from('.hero__frame', {
          scale: 1.12,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out"
        }, "-=1.1")
        .from('.hero__tag', { y: 35, opacity: 0, duration: 0.8 }, "-=0.7");

      /* ------------------------------------------------------------------------
         IMAGE PARALLAX ON SCROLL (ScrollTrigger scrub)
         ------------------------------------------------------------------------ */
      document.querySelectorAll('[data-parallax="true"]').forEach(frame => {
        const img = frame.querySelector('img');
        if (img) {
          gsap.fromTo(img, 
            { yPercent: -8 }, 
            { 
              yPercent: 8, 
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            }
          );
        }
      });

      /* ------------------------------------------------------------------------
         SCROLLTRIGGER REVEALS (Concept, Catalog, Care Guide)
         ------------------------------------------------------------------------ */
      // Concept Section
      gsap.from('.concept__quote', {
        scrollTrigger: {
          trigger: '.concept',
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out'
      });

      gsap.from('.concept__desc', {
        scrollTrigger: {
          trigger: '.concept__quote',
          start: 'bottom 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });

      gsap.from('.concept__card', {
        scrollTrigger: {
          trigger: '.concept__grid',
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        stagger: 0.18,
        duration: 0.9,
        ease: 'power3.out'
      });

      // Catalog Items Stagger
      gsap.from('.product-card', {
        scrollTrigger: {
          trigger: '.catalog__grid',
          start: 'top 85%',
        },
        y: 45,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out'
      });

      // Care Guide Steps
      // A horizontal offset would push full-width cards past the viewport edge
      // on phones, so reveal them vertically there instead.
      const careMM = gsap.matchMedia();

      careMM.add('(min-width: 769px)', () => {
        gsap.from('.care-step', {
          scrollTrigger: {
            trigger: '.care-guide__list',
            start: 'top 85%',
          },
          x: 40,
          opacity: 0,
          stagger: 0.14,
          duration: 0.85,
          ease: 'power3.out'
        });
      });

      careMM.add('(max-width: 768px)', () => {
        gsap.from('.care-step', {
          scrollTrigger: {
            trigger: '.care-guide__list',
            start: 'top 88%',
          },
          y: 30,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out'
        });
      });

      /* ------------------------------------------------------------------------
         SEAMLESS MARQUEE TICKER ANIMATION (GSAP loop)
         ------------------------------------------------------------------------ */
      const tickerTrack = document.getElementById('tickerTrack');
      let tickerTween = null;

      function buildTickerTween() {
        if (tickerTween) tickerTween.kill();
        gsap.set(tickerTrack, { x: 0 });

        const tickerWidth = tickerTrack.scrollWidth / 2;
        if (!tickerWidth) return;

        // Keep a constant speed regardless of how wide the track renders
        tickerTween = gsap.to(tickerTrack, {
          x: -tickerWidth,
          ease: "none",
          duration: tickerWidth / 48,
          repeat: -1
        });
      }

      buildTickerTween();

      // Recalculate after fonts load and on resize/orientation change
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(buildTickerTween);
      }

      let tickerResizeTimer;
      let lastTickerWidth = window.innerWidth;
      window.addEventListener('resize', () => {
        // Ignore mobile URL-bar height changes, react only to real width changes
        if (window.innerWidth === lastTickerWidth) return;
        lastTickerWidth = window.innerWidth;
        clearTimeout(tickerResizeTimer);
        tickerResizeTimer = setTimeout(buildTickerTween, 250);
      });

      /* ------------------------------------------------------------------------
         CATALOG FILTER WITH GSAP ANIMATIONS
         ------------------------------------------------------------------------ */
      const filterBtns = document.querySelectorAll('.catalog__filter-btn');
      const productCards = document.querySelectorAll('.product-card');

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('catalog__filter-btn--active'));
          btn.classList.add('catalog__filter-btn--active');

          const filter = btn.getAttribute('data-filter');

          // Animate cards out
          gsap.to(productCards, {
            scale: 0.9,
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
              productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                  card.style.display = 'flex';
                } else {
                  card.style.display = 'none';
                }
              });

              // Animate matched cards in
              const visibleCards = Array.from(productCards).filter(c => c.style.display !== 'none');
              gsap.fromTo(visibleCards, 
                { scale: 0.9, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power3.out" }
              );
            }
          });
        });
      });

      /* ------------------------------------------------------------------------
         CART LOGIC & ANIMATED BADGE
         ------------------------------------------------------------------------ */
      let cart = [];
      const cartOpenBtn = document.getElementById('cartOpenBtn');
      const cartDrawer = document.getElementById('cartDrawer');
      const cartCloseBtn = document.getElementById('cartCloseBtn');
      const cartBackdrop = document.getElementById('cartBackdrop');
      const cartItemsContainer = document.getElementById('cartItemsContainer');
      const cartTotalPrice = document.getElementById('cartTotalPrice');
      const cartBadgeCount = document.getElementById('cartBadgeCount');
      const toastNotice = document.getElementById('toastNotice');

      function showToast(text) {
        toastNotice.textContent = text;
        toastNotice.classList.add('toast-notice--active');
        setTimeout(() => {
          toastNotice.classList.remove('toast-notice--active');
        }, 2600);
      }

      function animateCartBadge() {
        gsap.fromTo(cartBadgeCount, 
          { scale: 0.3, rotation: -20 }, 
          { scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1.2, 0.4)" }
        );
      }

      function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
          cartItemsContainer.innerHTML = `
            <div class="cart-drawer__empty">
              <p>Ваша корзина пуста</p>
              <span style="font-size: 11px; margin-top: 10px; display: block; opacity: 0.6;">Выберите свежий букет из каталога</span>
            </div>
          `;
          cartBadgeCount.classList.remove('header__cart-badge--active');
        } else {
          cart.forEach((item, index) => {
            total += item.price * item.quantity;
            count += item.quantity;

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
              <img src="${item.img}" alt="${item.name}" class="cart-item__img">
              <div class="cart-item__info">
                <h4 class="cart-item__name">${item.name}</h4>
                <div class="cart-item__price">${item.price.toLocaleString('ru-RU')} ₽</div>
              </div>
              <button class="cart-item__remove js-cursor-hover" data-index="${index}" title="Удалить">✕</button>
            `;
            cartItemsContainer.appendChild(itemEl);
          });

          cartBadgeCount.textContent = count;
          cartBadgeCount.classList.add('header__cart-badge--active');
          animateCartBadge();
        }

        cartTotalPrice.textContent = `${total.toLocaleString('ru-RU')} ₽`;

        // Item removal listener
        document.querySelectorAll('.cart-item__remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-index'));
            cart.splice(idx, 1);
            updateCartUI();
          });
        });
      }

      function openCart() {
        closeMobileMenu();
        cartDrawer.classList.add('cart-drawer--open');
        cartDrawer.setAttribute('aria-hidden', 'false');
        lockScroll('cart');
      }

      function closeCart() {
        cartDrawer.classList.remove('cart-drawer--open');
        cartDrawer.setAttribute('aria-hidden', 'true');
        unlockScroll('cart');
      }

      cartOpenBtn.addEventListener('click', openCart);
      cartCloseBtn.addEventListener('click', closeCart);
      cartBackdrop.addEventListener('click', closeCart);

      // Add to Cart Buttons
      document.querySelectorAll('.js-add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
          const name = btn.getAttribute('data-name');
          const price = parseInt(btn.getAttribute('data-price'));
          const img = btn.getAttribute('data-img');

          const existing = cart.find(i => i.name === name);
          if (existing) {
            existing.quantity += 1;
          } else {
            cart.push({ name, price, img, quantity: 1 });
          }

          updateCartUI();
          showToast(`«${name}» добавлен в корзину`);
          openCart();
        });
      });

      /* ------------------------------------------------------------------------
         ORDER MODAL LOGIC
         ------------------------------------------------------------------------ */
      const orderModal = document.getElementById('orderModal');
      const modalOverlay = document.getElementById('modalOverlay');
      const modalCloseBtn = document.getElementById('modalCloseBtn');
      const openOrderModalBtn = document.getElementById('openOrderModalBtn');
      const heroConsultBtn = document.getElementById('heroConsultBtn');
      const footerOrderBtn = document.getElementById('footerOrderBtn');
      const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
      const orderForm = document.getElementById('orderForm');
      const modalFormContainer = document.getElementById('modalFormContainer');
      const modalSuccessState = document.getElementById('modalSuccessState');

      function openModal() {
        closeMobileMenu();
        modalFormContainer.style.display = 'block';
        modalSuccessState.style.display = 'none';
        orderModal.classList.add('modal--open');
        orderModal.setAttribute('aria-hidden', 'false');
        lockScroll('modal');
      }

      function closeModal() {
        orderModal.classList.remove('modal--open');
        orderModal.setAttribute('aria-hidden', 'true');
        unlockScroll('modal');
      }

      if (openOrderModalBtn) openOrderModalBtn.addEventListener('click', openModal);
      if (heroConsultBtn) heroConsultBtn.addEventListener('click', openModal);
      if (footerOrderBtn) footerOrderBtn.addEventListener('click', openModal);
      if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
      if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

      if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', () => {
          closeCart();
          openModal();
        });
      }

      orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        modalFormContainer.style.display = 'none';
        modalSuccessState.style.display = 'block';

        cart = [];
        updateCartUI();

        setTimeout(() => {
          closeModal();
          orderForm.reset();
        }, 3600);
      });

      /* ------------------------------------------------------------------------
         INLINE ORDER SECTION (same behaviour as the modal form)
         ------------------------------------------------------------------------ */
      const inlineOrderForm = document.getElementById('inlineOrderForm');
      const inlineOrderFormWrap = document.getElementById('inlineOrderFormWrap');
      const inlineOrderSuccess = document.getElementById('inlineOrderSuccess');

      if (inlineOrderForm && inlineOrderFormWrap && inlineOrderSuccess) {
        inlineOrderForm.addEventListener('submit', (e) => {
          e.preventDefault();
          inlineOrderFormWrap.style.display = 'none';
          inlineOrderSuccess.style.display = 'block';

          cart = [];
          updateCartUI();

          // Bring the form back after a pause, ready for another request
          setTimeout(() => {
            inlineOrderForm.reset();
            inlineOrderSuccess.style.display = 'none';
            inlineOrderFormWrap.style.display = 'block';
          }, 3600);
        });
      }

      // Mobile Menu Toggle
      const burger = document.getElementById('burgerToggle');
      const mobileMenu = document.getElementById('mobileMenu');
      const mobileLinks = document.querySelectorAll('.mobile-link');

      mobileMenu.setAttribute('aria-hidden', 'true');

      function openMobileMenu() {
        mobileMenu.classList.add('mobile-menu--open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        burger.classList.add('header__burger--active');
        burger.setAttribute('aria-expanded', 'true');
        burger.setAttribute('aria-label', 'Закрыть меню');
        lockScroll('mobile-menu');
      }

      function closeMobileMenu() {
        mobileMenu.classList.remove('mobile-menu--open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        burger.classList.remove('header__burger--active');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Открыть меню');
        unlockScroll('mobile-menu');
      }

      burger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('mobile-menu--open')) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });

      mobileLinks.forEach(l => {
        l.addEventListener('click', () => closeMobileMenu());
      });

      // The drawer only exists below 1024px — drop it if the viewport grows
      const desktopQuery = window.matchMedia('(min-width: 1025px)');
      const handleDesktopChange = (e) => {
        if (e.matches) closeMobileMenu();
      };

      if (typeof desktopQuery.addEventListener === 'function') {
        desktopQuery.addEventListener('change', handleDesktopChange);
      } else if (typeof desktopQuery.addListener === 'function') {
        desktopQuery.addListener(handleDesktopChange);
      }

      // Global Escape
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeModal();
          closeCart();
          closeMobileMenu();
        }
      });
    });
