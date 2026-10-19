/**
 * THE ROSEWOOD GLASSHOUSE & ATRIUM
 * Main JavaScript Controller
 * - Theme Switcher (Light / Dark) with Persistence
 * - RTL Layout Toggle with Persistence
 * - Mobile Drawer & Accessible Navigation
 * - Sticky Header with Backdrop Blur
 * - Scroll Reveal Animations
 * - Global Modal & Lightbox Controller
 * - Toast Notification System
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 0. Smooth Scroll Viewport Progress Indicator Bar
  // --------------------------------------------------------------------------
  function initScrollProgress() {
    let bar = document.querySelector('.scroll-progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress-bar';
      document.body.appendChild(bar);
    }

    let ticking = false;
    function updateProgress() {
      const scroll = window.pageYOffset || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(1, Math.max(0, scroll / totalHeight)) : 0;
      bar.style.transform = `scaleX(${progress})`;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  // --------------------------------------------------------------------------
  // 0.2 Premium Seamless Page Transitions
  // --------------------------------------------------------------------------
  function initPageTransitions() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let curtain = document.querySelector('.page-transition-curtain');
    if (!curtain) {
      curtain = document.createElement('div');
      curtain.className = 'page-transition-curtain';
      document.body.appendChild(curtain);
    }

    // Clear curtain on arrival
    requestAnimationFrame(() => {
      curtain.classList.remove('is-transitioning');
    });

    window.addEventListener('pageshow', () => {
      curtain.classList.remove('is-transitioning');
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
          href.startsWith('javascript:') || link.hasAttribute('download') ||
          link.getAttribute('target') === '_blank' || link.hasAttribute('data-open-modal') ||
          link.hasAttribute('data-action') || link.hasAttribute('onclick')) {
        return;
      }

      // Check same-origin navigation
      try {
        const targetUrl = new URL(link.href, window.location.href);
        if (targetUrl.origin === window.location.origin && targetUrl.pathname !== window.location.pathname) {
          e.preventDefault();
          curtain.classList.add('is-transitioning');
          setTimeout(() => {
            window.location.href = link.href;
          }, 240);
        }
      } catch (err) {}
    });
  }

  // --------------------------------------------------------------------------
  // 0.3 Interactive Tactile Button Ripple
  // --------------------------------------------------------------------------
  function initButtonRipples() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const circle = document.createElement('span');
      circle.className = 'btn-ripple-circle';

      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;

      btn.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 650);
    });
  }

  // --------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark)
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'rosewood_theme';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);

    const themeToggleBtns = document.querySelectorAll('[data-action="toggle-theme"]');
    themeToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Update aria labels & icons (Sun for Light mode, Moon for Dark mode)
    const themeBtns = document.querySelectorAll('[data-action="toggle-theme"]');
    themeBtns.forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Dark mode active. Switch to light mode' : 'Light mode active. Switch to dark mode');
      const iconSun = btn.querySelector('.icon-sun');
      const iconMoon = btn.querySelector('.icon-moon');
      if (iconSun && iconMoon) {
        if (theme === 'dark') {
          iconSun.style.setProperty('display', 'none', 'important');
          iconMoon.style.setProperty('display', 'block', 'important');
        } else {
          iconSun.style.setProperty('display', 'block', 'important');
          iconMoon.style.setProperty('display', 'none', 'important');
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. RTL Layout Management
  // --------------------------------------------------------------------------
  const DIR_STORAGE_KEY = 'rosewood_direction';

  function initDirection() {
    let savedDir = 'ltr';
    try {
      savedDir = localStorage.getItem(DIR_STORAGE_KEY) || document.documentElement.getAttribute('dir') || 'ltr';
    } catch (e) {
      savedDir = document.documentElement.getAttribute('dir') || 'ltr';
    }
    // Apply initial state without freezing transitions since it was prepared in <head>
    applyDirection(savedDir, false);

    const rtlBtns = document.querySelectorAll('[data-action="toggle-rtl"]');
    rtlBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        applyDirection(newDir, true);
        if (typeof window.showToast === 'function') {
          window.showToast(
            newDir === 'rtl' ? 'Switched to Right-to-Left (RTL) layout' : 'Switched to Left-to-Right (LTR) layout',
            'info'
          );
        }
      });
    });
  }

  function applyDirection(dir, freezeTransitions = true) {
    if (freezeTransitions) {
      document.documentElement.classList.add('disable-transitions');
    }

    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', 'en');
    try {
      localStorage.setItem(DIR_STORAGE_KEY, dir);
    } catch (e) {}

    const rtlBtns = document.querySelectorAll('[data-action="toggle-rtl"]');
    rtlBtns.forEach(btn => {
      const textSpan = btn.querySelector('.rtl-btn-text');
      if (textSpan) {
        textSpan.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left-to-Right view' : 'Switch to Right-to-Left view');
      btn.classList.toggle('is-active', dir === 'rtl');
    });

    if (freezeTransitions) {
      // Force instantaneous layout computation without running transitions
      void document.documentElement.offsetWidth;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.documentElement.classList.remove('disable-transitions');
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const toggleBtns = document.querySelectorAll('[data-action="toggle-menu"]');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close-btn');

    if (!drawer) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // Mobile submenu accordion
    const mobileDropdownToggles = drawer.querySelectorAll('[data-mobile-dropdown-toggle]');
    mobileDropdownToggles.forEach(toggle => {
      const submenu = toggle.nextElementSibling;
      if (submenu && submenu.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('is-expanded');
        const icon = toggle.querySelector('.icon-caret');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (submenu) {
          const isOpen = submenu.classList.contains('is-open');
          submenu.classList.toggle('is-open', !isOpen);
          toggle.classList.toggle('is-expanded', !isOpen);
          toggle.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
          const icon = toggle.querySelector('.icon-caret');
          if (icon) icon.style.transform = !isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Sticky Header with Scroll State
  // --------------------------------------------------------------------------
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function handleHeader() {
      const pos = window.pageYOffset || document.documentElement.scrollTop;
      if (pos > 35) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleHeader();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    handleHeader();
  }

  // --------------------------------------------------------------------------
  // 5. Scroll Reveal Observer & Staggered Reveal Engine
  // --------------------------------------------------------------------------
  function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal, .stagger-children');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // --------------------------------------------------------------------------
  // 6. Global Modals (Quick Tour & Lightbox)
  // --------------------------------------------------------------------------
  function initModals() {
    // Open modal triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-modal]');
      if (trigger) {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-open-modal');
        let modal = document.getElementById(modalId) ||
                    document.getElementById(modalId + '-modal') ||
                    (modalId.endsWith('-modal') ? document.getElementById(modalId.replace(/-modal$/, '')) : null) ||
                    document.getElementById('quick-tour-modal');
        if (modal) {
          openModal(modal);
        } else {
          // If modal element is not present on this specific page, navigate to contact page
          window.location.href = 'contact.html';
        }
      }

      // Close modal triggers
      const closeTrigger = e.target.closest('[data-close-modal]');
      if (closeTrigger) {
        e.preventDefault();
        const modal = closeTrigger.closest('.modal-backdrop');
        if (modal) closeModal(modal);
      }
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-backdrop.is-open');
        if (activeModal) closeModal(activeModal);
      }
    });
  }

  function openModal(modal) {
    // If mobile navigation drawer was open, close it cleanly so modal takes focus
    const drawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
    if (drawer && drawer.classList.contains('is-open')) {
      drawer.classList.remove('is-open');
      if (drawerBackdrop) drawerBackdrop.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('button, [href], input, select, textarea');
    if (focusable) focusable.focus();
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Gallery Lightbox helper
  window.openLightbox = function (imageUrl, caption) {
    const lightboxModal = document.getElementById('gallery-lightbox-modal');
    if (!lightboxModal) return;
    const imgEl = lightboxModal.querySelector('#lightbox-img');
    const capEl = lightboxModal.querySelector('#lightbox-caption');
    if (imgEl) imgEl.src = imageUrl;
    if (capEl) capEl.textContent = caption || 'The Rosewood Conservatory';
    openModal(lightboxModal);
  };

  // --------------------------------------------------------------------------
  // 7. Toast Notification System
  // --------------------------------------------------------------------------
  window.showToast = function (message, type = 'info', title = '') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    const heading = title ? `<div class="toast-title">${title}</div>` : '';
    toast.innerHTML = `
      <div style="flex-shrink:0;">${iconSvg}</div>
      <div style="flex:1;">
        ${heading}
        <div class="toast-msg">${message}</div>
      </div>
      <button style="color:var(--text-muted); padding:4px;" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => removeToast(toast));

    container.appendChild(toast);

    // Auto dismiss after 4.2 seconds
    const timer = setTimeout(() => {
      removeToast(toast);
    }, 4200);

    function removeToast(t) {
      clearTimeout(timer);
      t.classList.add('is-leaving');
      setTimeout(() => {
        if (t.parentNode) t.parentNode.removeChild(t);
      }, 300);
    }
  };

  // --------------------------------------------------------------------------
  // 8. Newsletter Forms
  // --------------------------------------------------------------------------
  function initNewsletters() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && input.value) {
          window.showToast('Thank you for subscribing to The Rosewood Seasonal Journal.', 'success', 'Subscription Confirmed');
          input.value = '';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Active Link Highlighter
  // --------------------------------------------------------------------------
  function highlightActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .dropdown-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href === currentPath) {
        link.classList.add('is-active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. Hero Cinematic Entrance Orchestrator (GSAP + CSS Fallback)
  // --------------------------------------------------------------------------
  function initHeroAnimations() {
    const heroGeneral = document.querySelector('.hero-general');
    const pageHero = document.querySelector('.page-hero');
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (heroGeneral) {
      requestAnimationFrame(() => {
        heroGeneral.classList.add('is-loaded');
      });
    }
    if (pageHero) {
      requestAnimationFrame(() => {
        pageHero.classList.add('is-loaded');
      });
    }

    if (prefersReducedMotion || typeof gsap === 'undefined') return;

    // Premium staggered entrance with GSAP if available
    try {
      if (heroGeneral) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        const badge = heroGeneral.querySelector('.hero-badge');
        const title = heroGeneral.querySelector('.hero-title');
        const subtitle = heroGeneral.querySelector('.hero-subtitle');
        const actions = heroGeneral.querySelector('.hero-actions');
        const rating = heroGeneral.querySelector('.hero-rating');
        const media = heroGeneral.querySelector('.hero-media-wrapper, .hero-image-card');

        if (badge) tl.from(badge, { y: -20, opacity: 0, duration: 0.8 }, 0.1);
        if (title) tl.from(title, { y: 35, opacity: 0, duration: 1.1 }, 0.25);
        if (subtitle) tl.from(subtitle, { y: 25, opacity: 0, duration: 1 }, 0.45);
        if (actions) tl.from(actions.children, { y: 20, opacity: 0, stagger: 0.12, duration: 0.8 }, 0.65);
        if (rating) tl.from(rating, { y: 15, opacity: 0, duration: 0.8 }, 0.8);
        if (media) tl.from(media, { scale: 0.94, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.35);
      } else if (pageHero) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        const badge = pageHero.querySelector('.badge-outline, .page-badge');
        const heading = pageHero.querySelector('h1');
        const lead = pageHero.querySelector('.lead, p');
        const breadcrumbs = pageHero.querySelector('.breadcrumbs');

        if (badge) tl.from(badge, { y: -15, opacity: 0, duration: 0.7 }, 0.1);
        if (heading) tl.from(heading, { y: 28, opacity: 0, duration: 0.9 }, 0.2);
        if (lead) tl.from(lead, { y: 20, opacity: 0, duration: 0.8 }, 0.35);
        if (breadcrumbs) tl.from(breadcrumbs, { opacity: 0, duration: 0.7 }, 0.5);
      }
    } catch (e) {
      console.warn('Hero GSAP initialization skipped:', e);
    }
  }

  // --------------------------------------------------------------------------
  // 11. Hero Floating Candlelight Particles System (Canvas 60 FPS)
  // --------------------------------------------------------------------------
  function initHeroParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight || 600;

    let isVisible = true;
    let animationFrameId = null;

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || 600;
    }, { passive: true });

    // Pause canvas loop when scrolled out of view to preserve battery & GPU
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !animationFrameId) {
          loop();
        }
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    const particleCount = 26;
    const particles = [];
    const colors = [
      'rgba(194, 155, 88, 0.45)', // Champagne Gold
      'rgba(223, 189, 132, 0.35)', // Radiant Light Gold
      'rgba(216, 142, 158, 0.3)',  // Muted Rose
      'rgba(255, 245, 230, 0.25)'  // Candle Warm White
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: -(Math.random() * 0.42 + 0.18),
        speedX: (Math.random() - 0.5) * 0.28,
        alpha: Math.random() * 0.6 + 0.25,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    let time = 0;
    function loop() {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 0.025;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += Math.sin(time + p.pulseOffset) * 0.3 + p.speedX;

        // Wrap around top/sides
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha + Math.sin(time * 2 + p.pulseOffset) * 0.18;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(194, 155, 88, 0.35)';
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(loop);
    }

    loop();
  }

  // --------------------------------------------------------------------------
  // 12. Ultra-Smooth Parallax Engine (Native Scroll Synced)
  // --------------------------------------------------------------------------
  function initParallax() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const parallaxTargets = document.querySelectorAll('#hero-parallax-img, [data-parallax], .parallax-bg');
    if (!parallaxTargets.length) return;

    let ticking = false;

    function applyParallax() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;

      parallaxTargets.forEach(target => {
        const speed = parseFloat(target.getAttribute('data-parallax-speed')) || 0.22;
        const rect = target.getBoundingClientRect();
        const elementTop = rect.top + scrollY;

        // Only compute if target is roughly within screen
        if (scrollY + viewportHeight > elementTop && scrollY < elementTop + target.offsetHeight + viewportHeight) {
          const relativeY = (scrollY - elementTop) * speed;
          target.style.transform = `translate3d(0, ${relativeY.toFixed(1)}px, 0) scale(1.04)`;
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }, { passive: true });

    applyParallax();
  }

  // --------------------------------------------------------------------------
  // 13. Magnetic Buttons Engine (Smooth Pointer Lerp)
  // --------------------------------------------------------------------------
  function initMagneticButtons() {
    const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const magneticBtns = document.querySelectorAll('.btn-magnetic, .social-icon-btn, .hero-actions .btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const moveX = Math.max(-12, Math.min(12, x * 0.22));
        const moveY = Math.max(-12, Math.min(12, y * 0.22));

        btn.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0)`;
        btn.style.transition = 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
        btn.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 14. Interactive 3D Card Tilt with Glare Accents
  // --------------------------------------------------------------------------
  function initCardTilt() {
    const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const cards = document.querySelectorAll('.card-space, .feature-box, .pricing-card, .event-card, .venue-card, .service-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5.0;
        const rotateY = ((x - centerX) / centerX) * 5.0;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale3d(1.015, 1.015, 1.015)`;
        card.style.transition = 'transform 0.1s ease-out';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 15. Animated Number Counters
  // --------------------------------------------------------------------------
  function initCounters() {
    const counters = document.querySelectorAll('[data-count-target]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(c => c.textContent = c.getAttribute('data-count-target'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count-target'), 10);
          animateCount(el, 0, target, 1300);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach(c => observer.observe(c));

    function animateCount(el, start, end, duration) {
      const startTime = performance.now();

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease out
        const current = Math.floor(start + (end - start) * easeProgress);
        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = end;
        }
      }

      requestAnimationFrame(step);
    }
  }

  // --------------------------------------------------------------------------
  // 16. Smooth Anchor Navigation with Sticky Header Offset
  // --------------------------------------------------------------------------
  function initSmoothAnchorScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]:not([href="#"])');
      if (anchor) {
        const targetId = anchor.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          const header = document.querySelector('.site-header');
          const headerOffset = header ? header.offsetHeight : 80;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 16;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 17. Homepage Interactive Atmosphere Mood Switcher
  // --------------------------------------------------------------------------
  function initMoodSwitcher() {
    const moodBtns = document.querySelectorAll('[data-hero-mood]');
    const heroBgImg = document.getElementById('hero-parallax-img');
    const heroOrbGold = document.querySelector('.hero-orb-gold');
    const heroOrbRose = document.querySelector('.hero-orb-rose');

    if (!moodBtns.length) return;

    const moodSettings = {
      'golden': {
        imgFilter: 'brightness(0.96) contrast(1.08) saturate(1.22)',
        goldOrb: 'rgba(223, 189, 132, 0.45)',
        roseOrb: 'rgba(230, 160, 140, 0.35)',
        msg: 'Ambient Setting: Golden Hour Sunset Reception'
      },
      'candlelight': {
        imgFilter: 'brightness(0.82) contrast(1.06) saturate(1.05)',
        goldOrb: 'rgba(194, 155, 88, 0.32)',
        roseOrb: 'rgba(186, 115, 132, 0.28)',
        msg: 'Ambient Setting: Candlelit Dinner Gala'
      },
      'starlight': {
        imgFilter: 'brightness(0.72) contrast(1.15) hue-rotate(210deg) saturate(0.9)',
        goldOrb: 'rgba(140, 175, 230, 0.35)',
        roseOrb: 'rgba(180, 140, 220, 0.3)',
        msg: 'Ambient Setting: Starlight Speakeasy & After-Hours Jazz'
      }
    };

    moodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mood = btn.getAttribute('data-hero-mood');
        const settings = moodSettings[mood];
        if (!settings) return;

        moodBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        if (heroBgImg) {
          heroBgImg.style.filter = settings.imgFilter;
          heroBgImg.style.transition = 'filter 0.8s ease';
        }
        if (heroOrbGold) heroOrbGold.style.background = settings.goldOrb;
        if (heroOrbRose) heroOrbRose.style.background = settings.roseOrb;

        window.showToast(settings.msg, 'info', 'Lighting Atmosphere Adjusted');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 18. Interactive Evening Timeline Controller
  // --------------------------------------------------------------------------
  function initEveningTimeline() {
    const stepBtns = document.querySelectorAll('[data-timeline-step]');
    const card = document.getElementById('timeline-display-card');
    if (!stepBtns.length || !card) return;

    const timeBadge = card.querySelector('#timeline-time-badge');
    const titleEl = card.querySelector('#timeline-title');
    const descEl = card.querySelector('#timeline-desc');
    const imgEl = card.querySelector('#timeline-img');
    const vibeEl = card.querySelector('#timeline-vibe');

    const timelineData = {
      'step-1': {
        time: '5:30 PM · The Arrival & Apertif',
        title: 'Walled Veranda & Courtyard Champagne Welcome',
        desc: 'Guests arrive along the lantern-lit cobblestone path. Greeted with flutes of chilled Blanc de Blancs, botanical spritzes, and passed artisanal tartlets as acoustic guitar plays under the pergolas.',
        vibe: '🎷 Ambiance: Live French Gypsy Jazz & Garden Breezes',
        img: 'assets/images/veranda-champagne-welcome.jpg',
        alt: 'Guests enjoying chilled champagne flutes and artisanal canapés in the sunlit walled veranda courtyard'
      },
      'step-2': {
        time: '6:45 PM · The Seated Banquet',
        title: 'Candlelit 4-Course Dinner in The Glasshouse',
        desc: 'As twilight settles across the Hudson Valley, guests take their seats beneath the Belgian glass cupola. Hand-rolled pasta, grass-fed prime tenderloin, and reserve Barolo are served family-style with unhurried warmth.',
        vibe: '🕯️ Ambiance: 120 Floating Taper Candles & Dimmable Chandeliers',
        img: 'assets/images/glasshouse-candlelit-dinner.jpg',
        alt: 'Atmospheric twilight candlelit 4-course banquet dinner under the glasshouse conservatory dome'
      },
      'step-3': {
        time: '8:15 PM · Speeches & Heartfelt Toasts',
        title: 'Emotional Family Stories & Dessert Revelry',
        desc: 'Tears, roaring laughter, and unforgettable stories from maid-of-honor and best-man speeches. Accompanied by Meyer lemon tartlets, dark chocolate soufflés, and espresso martinis.',
        vibe: '🎙️ Ambiance: Whisper-Clear Acoustic Speech Amplification',
        img: 'assets/images/family-toasts-desserts.jpg',
        alt: 'Emotional maid of honor speech and family toasts over artisanal desserts and espresso martinis in the glasshouse conservatory'
      },
      'step-4': {
        time: '9:30 PM · The After-Hours Speakeasy',
        title: 'Late Night Spirits in The Brick Wine Cellar',
        desc: 'The celebration transitions into the subterranean 19th-century cellar. Velvet banquettes, vintage vinyl jazz records, rare aged bourbons, and private late-night conversations with your closest circle.',
        vibe: '🥃 Ambiance: Subterranean Brick Vaults & Vintage Vinyl Selection',
        img: 'assets/images/cellar-speakeasy-spirits.jpg',
        alt: 'Atmospheric subterranean brick wine cellar speakeasy with candlelit seating, vintage wine casks, and bourbon glasses'
      }
    };

    stepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const stepId = btn.getAttribute('data-timeline-step');
        const data = timelineData[stepId];
        if (!data) return;

        stepBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        // Smooth crossfade
        card.style.opacity = '0.35';
        card.style.transform = 'translateY(6px)';

        setTimeout(() => {
          if (timeBadge) timeBadge.textContent = data.time;
          if (titleEl) titleEl.textContent = data.title;
          if (descEl) descEl.textContent = data.desc;
          if (vibeEl) vibeEl.textContent = data.vibe;
          if (imgEl) {
            imgEl.src = data.img;
            imgEl.alt = data.alt;
          }
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 180);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 19. Curated Luxury FAQ Accordion
  // --------------------------------------------------------------------------
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (!questionBtn) return;

      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle clicked item
        item.classList.toggle('is-open', !isOpen);
        questionBtn.setAttribute('aria-expanded', (!isOpen).toString());
      });
    });
  }

  // --------------------------------------------------------------------------
  // 20. Luminous Cursor Aura (Desktop Fine Pointer Only)
  // --------------------------------------------------------------------------
  function initCursorAura() {
    const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    let aura = document.querySelector('.cursor-aura');
    if (!aura) {
      aura = document.createElement('div');
      aura.className = 'cursor-aura';
      document.body.appendChild(aura);
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateAura() {
      currentX += (mouseX - currentX) * 0.14;
      currentY += (mouseY - currentY) * 0.14;

      aura.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
      requestAnimationFrame(animateAura);
    }

    animateAura();
  }

  // --------------------------------------------------------------------------
  // 21. Gallery Category Filter Controller
  // --------------------------------------------------------------------------
  function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('[data-gallery-filter]');
    const galleryItems = document.querySelectorAll('.gallery-grid [data-category]');
    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-gallery-filter');
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        galleryItems.forEach(item => {
          const itemCat = item.getAttribute('data-category') || '';
          const categories = itemCat.split(/\s+/);
          const isMatch = cat === 'all' || categories.includes(cat);

          if (isMatch) {
            item.style.display = '';
            item.classList.remove('is-hidden');
            item.classList.remove('gallery-fade-in');
            void item.offsetWidth;
            item.classList.add('gallery-fade-in');
          } else {
            item.classList.remove('gallery-fade-in');
            item.classList.add('is-hidden');
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // Initialization on DOM Ready
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initPageTransitions();
    initButtonRipples();
    initTheme();
    initDirection();
    initMobileMenu();
    initHeaderScroll();
    initScrollReveals();
    initModals();
    initNewsletters();
    highlightActiveNavLink();
    initHeroAnimations();
    initHeroParticles();
    initParallax();
    initMagneticButtons();
    initCardTilt();
    initCounters();
    initSmoothAnchorScroll();
    initMoodSwitcher();
    initEveningTimeline();
    initFaqAccordion();
    initCursorAura();
    initGalleryFilters();
  });

})();
