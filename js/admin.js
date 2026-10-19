/**
 * THE ROSEWOOD GLASSHOUSE & ATRIUM
 * Admin Portal Dashboard Controller with SVG Charts & Booking Management
 */

(function () {
  'use strict';

  function initAdminDashboard() {
    const adminRoot = document.getElementById('admin-dashboard-page');
    if (!adminRoot || !window.RosewoodData) return;

    const adminData = window.RosewoodData.adminData;

    // 1. Render SVG Revenue Trend Chart
    function renderRevenueChart() {
      const chartContainer = document.getElementById('admin-revenue-chart');
      if (!chartContainer) return;

      const points = [
        { month: 'Jun', val: 54 },
        { month: 'Jul', val: 68 },
        { month: 'Aug', val: 74 },
        { month: 'Sep', val: 92 },
        { month: 'Oct', val: 84 },
        { month: 'Nov', val: 105 }
      ];

      const svgWidth = 600;
      const svgHeight = 220;
      const padding = 35;

      const minVal = 40;
      const maxVal = 120;

      const coords = points.map((pt, i) => {
        const x = padding + (i / (points.length - 1)) * (svgWidth - padding * 2);
        const y = svgHeight - padding - ((pt.val - minVal) / (maxVal - minVal)) * (svgHeight - padding * 2);
        return { x, y, ...pt };
      });

      const pathD = coords.reduce((acc, pt, i) => {
        return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
      }, '');

      const areaD = `${pathD} L ${coords[coords.length - 1].x} ${svgHeight - padding} L ${coords[0].x} ${svgHeight - padding} Z`;

      let labelsSvg = '';
      coords.forEach(pt => {
        labelsSvg += `
          <circle cx="${pt.x}" cy="${pt.y}" r="5" fill="#C29B58" stroke="#1D151A" stroke-width="2"/>
          <text x="${pt.x}" y="${svgHeight - 10}" font-size="11" fill="var(--text-muted)" text-anchor="middle">${pt.month}</text>
          <text x="${pt.x}" y="${pt.y - 10}" font-size="11" font-weight="600" fill="var(--text-primary)" text-anchor="middle">$${pt.val}k</text>
        `;
      });

      chartContainer.innerHTML = `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="chart-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#C29B58" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#C29B58" stop-opacity="0.02"/>
            </linearGradient>
          </defs>
          <!-- Horizontal grid lines -->
          <line x1="${padding}" y1="${padding}" x2="${svgWidth - padding}" y2="${padding}" stroke="var(--border-color)" stroke-dasharray="3 3"/>
          <line x1="${padding}" y1="${svgHeight / 2}" x2="${svgWidth - padding}" y2="${svgHeight / 2}" stroke="var(--border-color)" stroke-dasharray="3 3"/>
          <line x1="${padding}" y1="${svgHeight - padding}" x2="${svgWidth - padding}" y2="${svgHeight - padding}" stroke="var(--border-color)"/>

          <!-- Area & Line -->
          <path d="${areaD}" fill="url(#chartAreaGrad)" />
          <path d="${pathD}" fill="none" stroke="#C29B58" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          ${labelsSvg}
        </svg>
      `;
    }

    renderRevenueChart();

    // 2. Render Bookings Table
    const tableBody = document.getElementById('admin-bookings-table-body');
    const searchInput = document.getElementById('admin-booking-search');
    const filterSelect = document.getElementById('admin-status-filter');

    function renderBookings() {
      if (!tableBody) return;
      tableBody.innerHTML = '';

      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const statusFilter = (filterSelect ? filterSelect.value : 'all').toLowerCase();

      const filtered = adminData.bookings.filter(b => {
        const matchesQuery = !query || b.client.toLowerCase().includes(query) || b.id.toLowerCase().includes(query) || b.space.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter;
        return matchesQuery && matchesStatus;
      });

      if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No bookings match your filter.</td></tr>`;
        return;
      }

      filtered.forEach(b => {
        const tr = document.createElement('tr');
        const badgeClass = b.status === 'Confirmed' ? 'status-confirmed' :
                           b.status === 'Pending' ? 'status-pending' : 'status-declined';

        tr.innerHTML = `
          <td><strong>${b.id}</strong></td>
          <td>
            <div style="font-weight:600;">${b.client}</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">${b.event}</div>
          </td>
          <td>${b.space}</td>
          <td>${b.date}</td>
          <td><strong>${b.guests}</strong></td>
          <td>${b.total}</td>
          <td><span class="status-badge ${badgeClass}">${b.status}</span></td>
          <td>
            <div style="display:flex; gap:6px;">
              ${b.status !== 'Confirmed' ? `<button class="btn btn-sm btn-outline" data-action="approve" data-id="${b.id}" style="padding:4px 8px; font-size:0.75rem;">Approve</button>` : ''}
              ${b.status !== 'Declined' ? `<button class="btn btn-sm btn-outline" data-action="decline" data-id="${b.id}" style="padding:4px 8px; font-size:0.75rem; color:#D32F2F;">Decline</button>` : ''}
              <button class="btn btn-sm btn-outline" data-action="view-details" data-id="${b.id}" style="padding:4px 8px; font-size:0.75rem;">View</button>
            </div>
          </td>
        `;

        // Action listeners
        const approveBtn = tr.querySelector('[data-action="approve"]');
        if (approveBtn) {
          approveBtn.addEventListener('click', () => {
            b.status = 'Confirmed';
            renderBookings();
            window.showToast(`Booking ${b.id} for ${b.client} has been approved and confirmation dispatched.`, 'success');
          });
        }

        const declineBtn = tr.querySelector('[data-action="decline"]');
        if (declineBtn) {
          declineBtn.addEventListener('click', () => {
            b.status = 'Declined';
            renderBookings();
            window.showToast(`Booking ${b.id} marked as declined.`, 'info');
          });
        }

        const viewBtn = tr.querySelector('[data-action="view-details"]');
        if (viewBtn) {
          viewBtn.addEventListener('click', () => {
            const detailModal = document.getElementById('admin-booking-modal');
            if (detailModal) {
              const body = detailModal.querySelector('#admin-booking-detail-content');
              if (body) {
                body.innerHTML = `
                  <h3 style="margin-bottom:1rem;">Booking Details: ${b.id}</h3>
                  <p><strong>Couple / Host:</strong> ${b.client}</p>
                  <p><strong>Celebration:</strong> ${b.event}</p>
                  <p><strong>Venue Space:</strong> ${b.space}</p>
                  <p><strong>Date:</strong> ${b.date}</p>
                  <p><strong>Expected Guest Count:</strong> ${b.guests} guests</p>
                  <p><strong>Financial Subtotal:</strong> ${b.total}</p>
                  <p><strong>Current Status:</strong> <span class="status-badge ${badgeClass}">${b.status}</span></p>
                  <hr style="margin-block:1rem; border:0; border-top:1px solid var(--border-color);"/>
                  <p style="font-size:0.875rem; color:var(--text-secondary);">Included: Sommelier pairing, floral arches, dedicated coordinator. Dietary notes verified.</p>
                `;
              }
              detailModal.classList.add('is-open');
              document.body.style.overflow = 'hidden';
            }
          });
        }

        tableBody.appendChild(tr);
      });
    }

    if (searchInput) searchInput.addEventListener('input', renderBookings);
    if (filterSelect) filterSelect.addEventListener('change', renderBookings);
    renderBookings();

    // 3. Export Bookings CSV Simulation
    const exportCsvBtn = document.getElementById('btn-export-admin-csv');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        let csvContent = "ID,Client,Event,Space,Date,Guests,Total,Status\n";
        adminData.bookings.forEach(b => {
          csvContent += `"${b.id}","${b.client}","${b.event}","${b.space}","${b.date}","${b.guests}","${b.total}","${b.status}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Rosewood_Admin_Bookings_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.showToast('Bookings report exported to CSV successfully.', 'success', 'Export Complete');
      });
    }

    // 4. Messages replies
    document.querySelectorAll('.btn-reply-message').forEach(btn => {
      btn.addEventListener('click', () => {
        window.showToast('Concierge response composer opened. Message drafted to client.', 'info');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initAdminDashboard);
})();
