/**
 * THE ROSEWOOD GLASSHOUSE & ATRIUM
 * Interactive Event Pricing & Calculator Module
 */

(function () {
  'use strict';

  function initCalculator() {
    const calcForm = document.getElementById('event-cost-calculator');
    if (!calcForm) return;

    // Elements
    const guestInput = document.getElementById('calc-guests');
    const guestValueDisplay = document.getElementById('calc-guests-display');
    const packageSelect = document.getElementById('calc-package');
    const spaceSelect = document.getElementById('calc-space');
    const seasonRadios = document.querySelectorAll('input[name="calc-season"]');
    const addonCheckboxes = document.querySelectorAll('input[name="calc-addons"]');

    // Display elements
    const subtotalDisplay = document.getElementById('calc-subtotal');
    const perGuestDisplay = document.getElementById('calc-per-guest');
    const serviceFeeDisplay = document.getElementById('calc-service');
    const totalDisplay = document.getElementById('calc-total');

    function calculate() {
      const guests = parseInt(guestInput.value, 10) || 50;
      if (guestValueDisplay) guestValueDisplay.textContent = guests;

      // Base package per guest
      let packageRate = 145;
      if (packageSelect) {
        packageRate = parseFloat(packageSelect.value) || 145;
      }

      // Space base hire
      let spaceHire = 4200;
      if (spaceSelect) {
        spaceHire = parseFloat(spaceSelect.value) || 4200;
      }

      // Season multiplier
      let seasonMultiplier = 1.0;
      seasonRadios.forEach(radio => {
        if (radio.checked) {
          seasonMultiplier = parseFloat(radio.value) || 1.0;
        }
      });
      const adjustedSpaceHire = spaceHire * seasonMultiplier;

      // Food & Beverage
      const fbTotal = guests * packageRate;

      // Addons
      let addonsTotal = 0;
      addonCheckboxes.forEach(cb => {
        if (cb.checked) {
          const type = cb.getAttribute('data-type'); // 'flat' or 'per-guest'
          const price = parseFloat(cb.value) || 0;
          if (type === 'per-guest') {
            addonsTotal += price * guests;
          } else {
            addonsTotal += price;
          }
        }
      });

      const subtotal = adjustedSpaceHire + fbTotal + addonsTotal;
      const serviceTaxFee = subtotal * 0.22; // 22% admin & local hospitality
      const grandTotal = subtotal + serviceTaxFee;
      const effectivePerGuest = Math.round(grandTotal / guests);

      // Render formatted currency
      if (subtotalDisplay) subtotalDisplay.textContent = formatCurrency(subtotal);
      if (serviceFeeDisplay) serviceFeeDisplay.textContent = formatCurrency(serviceTaxFee);
      if (totalDisplay) totalDisplay.textContent = formatCurrency(grandTotal);
      if (perGuestDisplay) perGuestDisplay.textContent = `$${effectivePerGuest} / guest`;
    }

    function formatCurrency(num) {
      return '$' + Math.round(num).toLocaleString('en-US');
    }

    // Attach listeners
    if (guestInput) {
      guestInput.addEventListener('input', calculate);
    }
    if (packageSelect) {
      packageSelect.addEventListener('change', calculate);
    }
    if (spaceSelect) {
      spaceSelect.addEventListener('change', calculate);
    }
    seasonRadios.forEach(radio => radio.addEventListener('change', calculate));
    addonCheckboxes.forEach(cb => cb.addEventListener('change', calculate));

    // Initial run
    calculate();
  }

  document.addEventListener('DOMContentLoaded', initCalculator);
})();
