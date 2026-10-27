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
    const clearBtn = document.getElementById('blog-search-clear');
    const statusEl = document.getElementById('blog-search-status');
    const noResultsEl = document.getElementById('blog-no-results');
    const noResultsTerm = document.getElementById('no-results-term');
    const resetBtn = document.getElementById('blog-reset-filters');
    const categoryChips = document.querySelectorAll('[data-blog-category]');
    const blogCards = document.querySelectorAll('.card-blog-item');
    const suggestedChips = document.querySelectorAll('[data-suggest]');

    if (!blogCards.length) return;

    let activeCategory = 'all';

    // Normalize text: lowercase, strip punctuation, collapse whitespace
    function normalize(str) {
      return (str || '')
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Stemming variations (singular/plural resilience: e.g. "cocktails" -> "cocktail", "wines" -> "wine")
    function getWordVariants(word) {
      const variants = [word];
      if (word.endsWith('ies') && word.length > 4) {
        variants.push(word.slice(0, -3) + 'y');
      } else if (word.endsWith('es') && word.length > 3) {
        variants.push(word.slice(0, -2));
      } else if (word.endsWith('s') && word.length > 2) {
        variants.push(word.slice(0, -1));
      } else {
        variants.push(word + 's');
      }
      return variants;
    }

    // Pre-index cards for instant high-performance search
    const cardIndex = Array.from(blogCards).map(card => {
      const title = (card.querySelector('.card-title') || {}).textContent || '';
      const excerpt = (card.querySelector('.card-excerpt') || {}).textContent || '';
      const category = card.getAttribute('data-category') || '';
      const tags = card.getAttribute('data-tags') || '';
      const author = card.getAttribute('data-author') || (card.querySelector('.card-footer') || {}).textContent || '';
      const meta = (card.querySelector('.card-body > div') || {}).textContent || '';

      const fullCorpus = normalize(`${title} ${excerpt} ${category} ${tags} ${author} ${meta}`);

      return {
        card,
        category: category.toLowerCase().trim(),
        corpus: fullCorpus
      };
    });

    function filterPosts() {
      const rawQuery = (searchInput ? searchInput.value : '').trim();
      const normQuery = normalize(rawQuery);
      const tokens = normQuery.split(/\s+/).filter(Boolean);

      // Toggle clear button
      if (clearBtn) {
        if (rawQuery.length > 0) {
          clearBtn.classList.add('is-visible');
        } else {
          clearBtn.classList.remove('is-visible');
        }
      }

      let visibleCount = 0;
      let matchesAnyCategoryCount = 0;

      cardIndex.forEach(({ card, category, corpus }) => {
        // Test query tokens: card matches if EVERY token (or its variants) is present in corpus
        const matchesQuery = tokens.length === 0 || tokens.every(token => {
          const variants = getWordVariants(token);
          return variants.some(v => corpus.includes(v));
        });

        if (matchesQuery) {
          matchesAnyCategoryCount++;
        }

        const matchesCategory = activeCategory === 'all' || category === activeCategory.toLowerCase();

        if (matchesQuery && matchesCategory) {
          card.style.display = '';
          card.classList.add('is-revealed');
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update Empty State
      if (noResultsEl) {
        if (visibleCount === 0) {
          noResultsEl.classList.add('is-visible');
          if (noResultsTerm) {
            if (rawQuery && activeCategory !== 'all') {
              noResultsTerm.textContent = `"${rawQuery}" in ${activeCategory}`;
            } else if (rawQuery) {
              noResultsTerm.textContent = `"${rawQuery}"`;
            } else if (activeCategory !== 'all') {
              noResultsTerm.textContent = `category "${activeCategory}"`;
            } else {
              noResultsTerm.textContent = 'your criteria';
            }
          }
        } else {
          noResultsEl.classList.remove('is-visible');
        }
      }

      // Update Live Status Pill
      if (statusEl) {
        if (rawQuery.length > 0) {
          if (visibleCount === 0 && matchesAnyCategoryCount > 0 && activeCategory !== 'all') {
            statusEl.innerHTML = `No results in <em>${activeCategory}</em>, but <span class="status-count">${matchesAnyCategoryCount}</span> article${matchesAnyCategoryCount > 1 ? 's' : ''} found in other categories. <button type="button" class="btn-link" id="blog-switch-all" style="color:var(--accent-gold); text-decoration:underline; background:none; border:none; cursor:pointer; font-size:inherit; padding:0 0.25rem;">View all categories</button>`;
            const switchBtn = document.getElementById('blog-switch-all');
            if (switchBtn) {
              switchBtn.addEventListener('click', () => {
                setActiveCategory('all');
              });
            }
          } else if (visibleCount > 0) {
            statusEl.innerHTML = `Showing <span class="status-count">${visibleCount}</span> of ${cardIndex.length} stories for "<strong>${escapeHtml(rawQuery)}</strong>"`;
          } else {
            statusEl.innerHTML = `No stories found for "<strong>${escapeHtml(rawQuery)}</strong>"`;
          }
        } else if (activeCategory !== 'all') {
          statusEl.innerHTML = `Showing <span class="status-count">${visibleCount}</span> stories in <em>${activeCategory}</em>`;
        } else {
          statusEl.innerHTML = `Showing all <span class="status-count">${cardIndex.length}</span> curated journal stories`;
        }
      }
    }

    function escapeHtml(str) {
      return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function setActiveCategory(cat) {
      activeCategory = cat;
      categoryChips.forEach(chip => {
        const chipCat = chip.getAttribute('data-blog-category') || 'all';
        const isActive = chipCat.toLowerCase() === cat.toLowerCase();
        chip.classList.toggle('is-active', isActive);
        chip.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      filterPosts();
    }

    function resetAll() {
      if (searchInput) {
        searchInput.value = '';
      }
      setActiveCategory('all');
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Input event
    if (searchInput) {
      searchInput.addEventListener('input', filterPosts);

      // Keyboard Esc to clear search
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (searchInput.value) {
            searchInput.value = '';
            filterPosts();
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
        }
      });
    }

    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        filterPosts();
      });
    }

    // Category chips
    categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-blog-category') || 'all';
        setActiveCategory(cat);
      });
    });

    // Reset button in empty state
    if (resetBtn) {
      resetBtn.addEventListener('click', resetAll);
    }

    // Suggested search chips
    suggestedChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const term = chip.getAttribute('data-suggest') || chip.textContent.trim();
        if (searchInput) {
          searchInput.value = term;
          setActiveCategory('all');
          searchInput.focus();
        }
      });
    });

    // Initial filter run to set counter and state
    filterPosts();
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
