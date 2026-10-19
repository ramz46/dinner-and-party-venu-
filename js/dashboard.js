/**
 * THE ROSEWOOD GLASSHOUSE & ATRIUM
 * Client Couple Dashboard Module
 */

(function () {
  'use strict';

  function initClientDashboard() {
    const dashboardRoot = document.getElementById('client-dashboard-page');
    if (!dashboardRoot || !window.RosewoodData) return;

    const eventData = window.RosewoodData.clientEvent;

    // 1. Live Countdown Timer
    function startCountdown() {
      const targetDate = new Date(eventData.eventDate).getTime();

      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minsEl = document.getElementById('cd-mins');
      const secsEl = document.getElementById('cd-secs');

      function tick() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
          if (daysEl) daysEl.textContent = '00';
          if (hoursEl) hoursEl.textContent = '00';
          if (minsEl) minsEl.textContent = '00';
          if (secsEl) secsEl.textContent = '00';
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
      }

      tick();
      setInterval(tick, 1000);
    }

    startCountdown();

    // 2. RSVP Table & Counters
    const rsvpTableBody = document.getElementById('rsvp-table-body');
    const rsvpFilterBtns = document.querySelectorAll('[data-rsvp-filter]');
    let currentRsvpFilter = 'all';

    function renderGuests() {
      if (!rsvpTableBody) return;
      rsvpTableBody.innerHTML = '';

      let attendingCount = 0;
      let pendingCount = 0;
      let declinedCount = 0;

      eventData.guests.forEach(g => {
        if (g.status === 'attending') attendingCount++;
        else if (g.status === 'pending') pendingCount++;
        else if (g.status === 'declined') declinedCount++;
      });

      // Update counters
      const attEl = document.getElementById('count-attending');
      const pendEl = document.getElementById('count-pending');
      const decEl = document.getElementById('count-declined');
      const totalEl = document.getElementById('count-total-guests');

      if (attEl) attEl.textContent = attendingCount;
      if (pendEl) pendEl.textContent = pendingCount;
      if (decEl) decEl.textContent = declinedCount;
      if (totalEl) totalEl.textContent = eventData.guests.length;

      // Filtered guests
      const filtered = eventData.guests.filter(g => {
        if (currentRsvpFilter === 'all') return true;
        return g.status === currentRsvpFilter;
      });

      if (filtered.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No guests found matching this filter.</td>`;
        rsvpTableBody.appendChild(tr);
        return;
      }

      filtered.forEach(guest => {
        const tr = document.createElement('tr');
        const badgeClass = guest.status === 'attending' ? 'status-attending' :
                           guest.status === 'pending' ? 'status-pending' : 'status-declined';
        const statusLabel = guest.status.charAt(0).toUpperCase() + guest.status.slice(1);

        tr.innerHTML = `
          <td class="td-guest-name"><strong>${guest.name}</strong></td>
          <td class="td-party-role"><span class="guest-role-text">${guest.party}</span></td>
          <td class="td-rsvp-status">
            <button class="status-badge ${badgeClass}" data-guest-id="${guest.id}" title="Click to cycle status: Attending → Pending → Declined">
              ${statusLabel}
            </button>
          </td>
          <td class="td-meal"><span class="guest-meal-text">${guest.meal}</span></td>
          <td class="td-table"><span class="guest-table-badge">${guest.table}</span></td>
        `;

        // Toggle status on click
        const badgeBtn = tr.querySelector('.status-badge');
        badgeBtn.addEventListener('click', () => {
          if (guest.status === 'attending') guest.status = 'pending';
          else if (guest.status === 'pending') guest.status = 'declined';
          else guest.status = 'attending';

          renderGuests();
          window.showToast(`Updated ${guest.name}'s RSVP status to ${guest.status.toUpperCase()}`, 'info');
        });

        rsvpTableBody.appendChild(tr);
      });
    }

    rsvpFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        rsvpFilterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentRsvpFilter = btn.getAttribute('data-rsvp-filter');
        renderGuests();
      });
    });

    renderGuests();

    // 3. Add Guest Modal Form
    const addGuestForm = document.getElementById('add-guest-form');
    if (addGuestForm) {
      addGuestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('guest-name');
        const partyInput = document.getElementById('guest-party');
        const mealInput = document.getElementById('guest-meal');
        const statusInput = document.getElementById('guest-status');

        if (!nameInput.value.trim()) return;

        const newGuest = {
          id: 'g_' + Date.now(),
          name: nameInput.value.trim(),
          party: partyInput ? partyInput.value.trim() : 'Guest',
          meal: mealInput ? mealInput.value : 'Chef Selection',
          table: 'Table ' + (Math.floor(Math.random() * 5) + 1),
          status: statusInput ? statusInput.value : 'pending'
        };

        eventData.guests.push(newGuest);
        renderGuests();

        window.showToast(`${newGuest.name} has been added to your guestlist.`, 'success');
        addGuestForm.reset();

        const modal = addGuestForm.closest('.modal-backdrop');
        if (modal) {
          modal.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
    }

    // 4. Package Switcher
    const packageSelect = document.getElementById('dashboard-package-select');
    if (packageSelect) {
      packageSelect.value = eventData.selectedPackage;
      packageSelect.addEventListener('change', () => {
        eventData.selectedPackage = packageSelect.value;
        const perPerson = packageSelect.value === 'The Grand Gala Celebration' ? 215 :
                          packageSelect.value === 'The Golden Hour Soirée' ? 165 : 145;
        eventData.pricePerPerson = perPerson;

        const costDisplay = document.getElementById('package-cost-display');
        if (costDisplay) costDisplay.textContent = `$${perPerson} / guest`;

        window.showToast(`Catering package updated to "${packageSelect.value}". Estimated per-guest: $${perPerson}`, 'success');
      });
    }

    // 5. Export Event Summary
    const exportBtn = document.getElementById('btn-export-summary');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const summary = `
======================================================
THE ROSEWOOD GLASSHOUSE & ATRIUM - EVENT SUMMARY
======================================================
Couple: ${eventData.coupleNames}
Event: ${eventData.eventType}
Date: ${new Date(eventData.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Space: ${eventData.space}
Selected Package: ${eventData.selectedPackage} ($${eventData.pricePerPerson}/guest)

GUESTLIST BREAKDOWN:
Total Registered: ${eventData.guests.length}
Attending: ${eventData.guests.filter(g => g.status === 'attending').length}
Pending: ${eventData.guests.filter(g => g.status === 'pending').length}
Declined: ${eventData.guests.filter(g => g.status === 'declined').length}

VENUE CONTACT:
Concierge: +1 (845) 555-0194 | concierge@rosewoodatrium.com
Address: 428 Rosewood Estate Lane, Hudson Valley, NY
======================================================
        `.trim();

        const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Rosewood_Celebration_Summary_${eventData.coupleNames.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.showToast('Event summary exported successfully as text document!', 'success', 'Summary Exported');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initClientDashboard);
})();
