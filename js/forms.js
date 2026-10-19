/**
 * THE ROSEWOOD GLASSHOUSE & ATRIUM
 * Forms, Validation, Tabs, Accordions & Auth Controller
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Accordion Component
  // --------------------------------------------------------------------------
  function initAccordions() {
    document.addEventListener('click', (e) => {
      const header = e.target.closest('.accordion-header');
      if (!header) return;

      const item = header.closest('.accordion-item');
      if (!item) return;

      const isAlreadyOpen = item.classList.contains('is-open');

      // Close siblings if in single-expand mode
      const parent = item.parentElement;
      if (parent && parent.getAttribute('data-single-open') === 'true') {
        parent.querySelectorAll('.accordion-item').forEach(sibling => {
          sibling.classList.remove('is-open');
        });
      }

      item.classList.toggle('is-open', !isAlreadyOpen);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Tabs Component
  // --------------------------------------------------------------------------
  function initTabs() {
    document.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.tab-btn');
      if (!tabBtn) return;

      const targetId = tabBtn.getAttribute('data-tab');
      const container = tabBtn.closest('.tabs-wrapper') || document;

      // Update button active states
      const nav = tabBtn.closest('.tabs-nav');
      if (nav) {
        nav.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('is-active'));
      }
      tabBtn.classList.add('is-active');

      // Update panel visibility
      container.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('is-active');
      });

      const activePanel = container.querySelector(`#${targetId}`);
      if (activePanel) {
        activePanel.classList.add('is-active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Form Validation Engine & Strict Character Filters
  // --------------------------------------------------------------------------

  // Detect if an input is for Name fields (Full Name, Host Name, Guest Name, etc.)
  function isNameInput(input) {
    if (!input || input.tagName !== 'INPUT') return false;
    const type = (input.type || 'text').toLowerCase();
    if (['hidden', 'password', 'email', 'tel', 'number', 'date', 'datetime-local', 'time', 'checkbox', 'radio', 'range', 'submit', 'button'].includes(type)) {
      return false;
    }
    const id = (input.id || '').toLowerCase();
    const name = (input.name || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    const autocomplete = (input.getAttribute('autocomplete') || '').toLowerCase();
    const label = input.parentElement ? (input.parentElement.querySelector('label') ? input.parentElement.querySelector('label').innerText.toLowerCase() : '') : '';

    return id.includes('name') ||
           name.includes('name') ||
           placeholder.includes('name') ||
           placeholder.includes('victoria') ||
           placeholder.includes('julian') ||
           placeholder.includes('camille') ||
           autocomplete.includes('name') ||
           label.includes('name') ||
           label.includes('host') ||
           label.includes('couple') ||
           label.includes('client');
  }

  // Detect if an input is for Phone or Numeric fields
  function isNumberOrPhoneInput(input) {
    if (!input || input.tagName !== 'INPUT') return false;
    const type = (input.type || 'text').toLowerCase();
    if (type === 'tel' || type === 'number') return true;
    const id = (input.id || '').toLowerCase();
    const name = (input.name || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    const autocomplete = (input.getAttribute('autocomplete') || '').toLowerCase();
    const label = input.parentElement ? (input.parentElement.querySelector('label') ? input.parentElement.querySelector('label').innerText.toLowerCase() : '') : '';

    return id.includes('phone') ||
           id.includes('tel') ||
           id.includes('guest') ||
           id.includes('count') ||
           id.includes('budget') ||
           id.includes('number') ||
           name.includes('phone') ||
           name.includes('tel') ||
           name.includes('guest') ||
           name.includes('count') ||
           placeholder.includes('phone') ||
           placeholder.includes('+1') ||
           placeholder.includes('guests') ||
           autocomplete.includes('tel') ||
           label.includes('phone') ||
           label.includes('telephone') ||
           label.includes('mobile') ||
           label.includes('guest count') ||
           label.includes('number of guests');
  }

  function triggerFieldShake(input) {
    input.classList.remove('input-shake');
    void input.offsetWidth;
    input.classList.add('input-shake');
    setTimeout(() => {
      input.classList.remove('input-shake');
    }, 380);
  }

  function showInputWarning(input, message) {
    triggerFieldShake(input);
    let errorEl = input.parentElement ? input.parentElement.querySelector('.form-error') : null;
    if (!errorEl && input.parentElement) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      input.parentElement.appendChild(errorEl);
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('is-visible');
      input.classList.add('is-invalid');
    }
  }

  function clearInputWarning(input) {
    const errorEl = input.parentElement ? input.parentElement.querySelector('.form-error') : null;
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('is-visible');
    }
    input.classList.remove('is-invalid');
  }

  // Real-time input interceptor
  function initStrictInputFilters() {
    // 1. Keydown: Block prohibited keystrokes instantly
    document.addEventListener('keydown', (e) => {
      const input = e.target;
      if (!input || input.tagName !== 'INPUT') return;

      // Allow navigation, modifier shortcuts, backspace, and delete
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab' ||
          e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
          e.key === 'Home' || e.key === 'End' || e.key === 'Enter' || e.key === 'Escape' ||
          e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Name inputs: Prohibit numbers (0-9)
      if (isNameInput(input)) {
        if (/^[0-9]$/.test(e.key)) {
          e.preventDefault();
          showInputWarning(input, 'Numbers are not allowed in name fields.');
        }
      }

      // Number / Phone inputs: Prohibit alphabet letters (a-z, A-Z)
      else if (isNumberOrPhoneInput(input)) {
        if (/^[a-zA-Z]$/.test(e.key)) {
          e.preventDefault();
          showInputWarning(input, 'Alphabet letters are not allowed in number fields.');
        }
      }
    });

    // 2. Input event: Sanitize value immediately (catches virtual keyboards, drag-drop, autofill)
    document.addEventListener('input', (e) => {
      const input = e.target;
      if (!input || input.tagName !== 'INPUT') return;

      if (isNameInput(input)) {
        if (/[0-9]/.test(input.value)) {
          const originalPos = input.selectionStart || input.value.length;
          input.value = input.value.replace(/[0-9]/g, '');
          const newPos = Math.max(0, originalPos - 1);
          input.setSelectionRange && input.setSelectionRange(newPos, newPos);
          showInputWarning(input, 'Numbers are not allowed in name fields.');
        } else if (input.classList.contains('is-invalid') && input.value.trim()) {
          clearInputWarning(input);
        }
      } else if (isNumberOrPhoneInput(input)) {
        if (/[a-zA-Z]/.test(input.value)) {
          const originalPos = input.selectionStart || input.value.length;
          input.value = input.value.replace(/[a-zA-Z]/g, '');
          const newPos = Math.max(0, originalPos - 1);
          input.setSelectionRange && input.setSelectionRange(newPos, newPos);
          showInputWarning(input, 'Alphabet letters are not allowed in number fields.');
        } else if (input.classList.contains('is-invalid') && input.value.trim()) {
          clearInputWarning(input);
        }
      }
    });

    // 3. Paste event: Sanitize clipboard text before inserting
    document.addEventListener('paste', (e) => {
      const input = e.target;
      if (!input || input.tagName !== 'INPUT') return;

      const clipboard = e.clipboardData || window.clipboardData;
      if (!clipboard) return;
      const text = clipboard.getData('text');
      if (!text) return;

      if (isNameInput(input) && /[0-9]/.test(text)) {
        e.preventDefault();
        const cleaned = text.replace(/[0-9]/g, '');
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        input.value = input.value.slice(0, start) + cleaned + input.value.slice(end);
        const newPos = start + cleaned.length;
        input.setSelectionRange && input.setSelectionRange(newPos, newPos);
        showInputWarning(input, 'Numbers were removed from pasted name.');
      } else if (isNumberOrPhoneInput(input) && /[a-zA-Z]/.test(text)) {
        e.preventDefault();
        const cleaned = text.replace(/[a-zA-Z]/g, '');
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        input.value = input.value.slice(0, start) + cleaned + input.value.slice(end);
        const newPos = start + cleaned.length;
        input.setSelectionRange && input.setSelectionRange(newPos, newPos);
        showInputWarning(input, 'Letters were removed from pasted number.');
      }
    });
  }

  function validateField(input) {
    const errorEl = input.parentElement ? input.parentElement.querySelector('.form-error') : null;
    let isValid = true;
    let message = '';

    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      message = 'This field is required.';
    } else if (isNameInput(input) && /[0-9]/.test(input.value)) {
      isValid = false;
      message = 'Name cannot contain numbers.';
    } else if (isNumberOrPhoneInput(input) && /[a-zA-Z]/.test(input.value)) {
      isValid = false;
      message = 'Please enter numbers only (no alphabet letters).';
    } else if (input.type === 'email' && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        isValid = false;
        message = 'Please provide a valid email address.';
      }
    } else if (input.type === 'tel' && input.value.trim()) {
      if (input.value.replace(/[^0-9]/g, '').length < 7) {
        isValid = false;
        message = 'Please enter a valid telephone number.';
      }
    } else if (input.id === 'reg-confirm-password') {
      const pass = document.getElementById('reg-password');
      if (pass && pass.value !== input.value) {
        isValid = false;
        message = 'Passwords do not match.';
      }
    }

    if (!isValid) {
      input.classList.add('is-invalid');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('is-visible');
      }
    } else {
      input.classList.remove('is-invalid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('is-visible');
      }
    }

    return isValid;
  }

  function setupFormValidation(formId, onSuccess) {
    const form = document.getElementById(formId);
    if (!form) return;

    // Real-time blur validation
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateField(input);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;

      form.querySelectorAll('input, select, textarea').forEach(input => {
        const isFieldValid = validateField(input);
        if (!isFieldValid) allValid = false;
      });

      if (allValid) {
        onSuccess(form);
      } else {
        window.showToast('Please correct highlighted fields before submitting.', 'error');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Specific Form Submissions
  // --------------------------------------------------------------------------
  function initForms() {
    // Contact Form
    setupFormValidation('contact-inquiry-form', (form) => {
      window.showToast('Inquiry submitted! Our concierge team will reach out within 24 hours.', 'success', 'Tour Request Received');
      form.reset();
    });

    // Quick Tour Modal Form
    setupFormValidation('quick-tour-form', (form) => {
      window.showToast('Your private estate tour has been scheduled. Check your email for details.', 'success', 'Private Tour Booked');
      form.reset();
      const modal = form.closest('.modal-backdrop');
      if (modal) {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });

    // Auth Login
    setupFormValidation('login-form', (form) => {
      const email = document.getElementById('login-email').value;
      if (email.includes('admin')) {
        window.showToast('Welcome back, Venue Director! Redirecting to Admin Dashboard...', 'success');
        setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
      } else {
        window.showToast('Welcome back, Victoria & Liam! Redirecting to your Couple Portal...', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
      }
    });

    // Auth Register
    setupFormValidation('register-form', (form) => {
      window.showToast('Account successfully created! Welcome to The Rosewood.', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
    });

    // Demo Autofill Helpers
    const autofillCoupleBtn = document.getElementById('btn-autofill-couple');
    if (autofillCoupleBtn) {
      autofillCoupleBtn.addEventListener('click', () => {
        const emailEl = document.getElementById('login-email');
        const passEl = document.getElementById('login-password');
        if (emailEl) emailEl.value = 'victoria.hastings@celebrations.com';
        if (passEl) passEl.value = 'Rosewood2026!';
        window.showToast('Prefilled credentials for Demo Couple (Victoria & Liam)', 'info');
      });
    }

    const autofillAdminBtn = document.getElementById('btn-autofill-admin');
    if (autofillAdminBtn) {
      autofillAdminBtn.addEventListener('click', () => {
        const emailEl = document.getElementById('login-email');
        const passEl = document.getElementById('login-password');
        if (emailEl) emailEl.value = 'admin@rosewoodatrium.com';
        if (passEl) passEl.value = 'DirectorPass2026!';
        window.showToast('Prefilled credentials for Venue Director (Admin Portal)', 'info');
      });
    }
  }

  // --------------------------------------------------------------------------
  // 5. Blog Search & Filter
  // --------------------------------------------------------------------------
  function initBlogFilter() {
    const searchInput = document.getElementById('blog-search');
    const categoryChips = document.querySelectorAll('[data-blog-category]');
    const blogCards = document.querySelectorAll('.card-blog-item');

    if (!blogCards.length) return;

    let activeCategory = 'all';

    function filterPosts() {
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

      blogCards.forEach(card => {
        const title = (card.querySelector('.card-title') || {}).textContent || '';
        const excerpt = (card.querySelector('.card-excerpt') || {}).textContent || '';
        const category = card.getAttribute('data-category') || '';

        const matchesQuery = !query || title.toLowerCase().includes(query) || excerpt.toLowerCase().includes(query);
        const matchesCategory = activeCategory === 'all' || category.toLowerCase() === activeCategory.toLowerCase();

        if (matchesQuery && matchesCategory) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterPosts);
    }

    categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        categoryChips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        activeCategory = chip.getAttribute('data-blog-category') || 'all';
        filterPosts();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Spaces Filter (Capacity & Type)
  // --------------------------------------------------------------------------
  function initSpacesFilter() {
    const chips = document.querySelectorAll('[data-space-filter]');
    const cards = document.querySelectorAll('.space-card-wrapper');

    if (!chips.length || !cards.length) return;

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');

        const filterVal = chip.getAttribute('data-space-filter');

        cards.forEach(card => {
          const capacity = parseInt(card.getAttribute('data-capacity') || '100', 10);
          let match = false;

          if (filterVal === 'all') match = true;
          else if (filterVal === 'intimate' && capacity <= 50) match = true;
          else if (filterVal === 'medium' && capacity > 50 && capacity <= 100) match = true;
          else if (filterVal === 'grand' && capacity > 100) match = true;

          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initStrictInputFilters();
    initAccordions();
    initTabs();
    initForms();
    initBlogFilter();
    initSpacesFilter();
  });
})();
