/**
 * E-Worth - Interactive E-Waste Recovery Calculator & UI Logic
 * Responsive SaaS Landing Page Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Drawer Toggle
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileToggleBtn && mobileMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      mobileToggleBtn.innerHTML = isOpen 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
    });

    // Close mobile menu on clicking any link
    document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
      });
    });
  }

  // Device Material Database
  const deviceData = {
    smartphone: {
      name: 'Smartphone',
      gold: 0.034,     // grams per device
      silver: 0.35,    // grams per device
      copper: 15,      // grams per device
      aluminum: 25,    // grams per device
      unitValue: 785   // ₹ per device
    },
    laptop: {
      name: 'Laptop',
      gold: 0.20,
      silver: 1.20,
      copper: 120,
      aluminum: 250,
      unitValue: 2450
    },
    desktop: {
      name: 'Desktop PC',
      gold: 0.45,
      silver: 2.50,
      copper: 450,
      aluminum: 850,
      unitValue: 5200
    },
    tablet: {
      name: 'Tablet',
      gold: 0.08,
      silver: 0.60,
      copper: 45,
      aluminum: 90,
      unitValue: 1250
    },
    monitor: {
      name: 'LED Monitor',
      gold: 0.05,
      silver: 0.40,
      copper: 180,
      aluminum: 600,
      unitValue: 1800
    },
    smartwatch: {
      name: 'Smartwatch',
      gold: 0.015,
      silver: 0.12,
      copper: 6,
      aluminum: 12,
      unitValue: 320
    }
  };

  // DOM Elements for Calculator
  const deviceSelect = document.getElementById('deviceSelect');
  const qtyInput = document.getElementById('qtyInput');
  const qtyBadge = document.getElementById('qtyBadge');
  const conditionButtons = document.querySelectorAll('.condition-btn');
  
  const valGold = document.getElementById('valGold');
  const valSilver = document.getElementById('valSilver');
  const valCopper = document.getElementById('valCopper');
  const valAluminum = document.getElementById('valAluminum');
  
  const barGold = document.getElementById('barGold');
  const barSilver = document.getElementById('barSilver');
  const barCopper = document.getElementById('barCopper');
  const barAluminum = document.getElementById('barAluminum');

  const totalValueEl = document.getElementById('totalValue');
  const ecoBadgeEl = document.getElementById('ecoBadge');

  let currentConditionMultiplier = 1.0;

  // Handle Condition Button Selection
  conditionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      conditionButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentConditionMultiplier = parseFloat(e.target.dataset.multiplier || 1.0);
      calculateRecovery();
    });
  });

  // Calculate & Update Results
  function calculateRecovery() {
    if (!deviceSelect || !qtyInput) return;

    const deviceType = deviceSelect.value;
    const qty = parseInt(qtyInput.value, 10) || 1;
    const device = deviceData[deviceType] || deviceData.smartphone;

    // Update Quantity Badge
    if (qtyBadge) qtyBadge.textContent = qty;

    // Calculated amounts
    const totalGold = (device.gold * qty * currentConditionMultiplier).toFixed(3);
    const totalSilver = (device.silver * qty * currentConditionMultiplier).toFixed(2);
    const totalCopper = Math.round(device.copper * qty * currentConditionMultiplier);
    const totalAluminum = Math.round(device.aluminum * qty * currentConditionMultiplier);

    const totalVal = Math.round(device.unitValue * qty * currentConditionMultiplier);
    const co2Saved = (qty * 1.25).toFixed(1);

    // Render Values
    if (valGold) valGold.textContent = `${totalGold} g`;
    if (valSilver) valSilver.textContent = `${totalSilver} g`;
    if (valCopper) valCopper.textContent = totalCopper >= 1000 ? `${(totalCopper / 1000).toFixed(2)} kg` : `${totalCopper} g`;
    if (valAluminum) valAluminum.textContent = totalAluminum >= 1000 ? `${(totalAluminum / 1000).toFixed(2)} kg` : `${totalAluminum} g`;

    // Render Progress Bars (relative scaling for aesthetic UI)
    const maxGold = 5.0;
    const maxSilver = 25.0;
    const maxCopper = 5000;
    const maxAluminum = 10000;

    if (barGold) barGold.style.width = `${Math.min(100, Math.max(12, (totalGold / maxGold) * 100))}%`;
    if (barSilver) barSilver.style.width = `${Math.min(100, Math.max(12, (totalSilver / maxSilver) * 100))}%`;
    if (barCopper) barCopper.style.width = `${Math.min(100, Math.max(12, (totalCopper / maxCopper) * 100))}%`;
    if (barAluminum) barAluminum.style.width = `${Math.min(100, Math.max(12, (totalAluminum / maxAluminum) * 100))}%`;

    // Render Total Value
    if (totalValueEl) {
      totalValueEl.textContent = `₹${totalVal.toLocaleString('en-IN')}`;
    }

    if (ecoBadgeEl) {
      ecoBadgeEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> ${co2Saved} kg CO₂ Offset`;
    }
  }

  // Event Listeners for inputs
  if (deviceSelect) deviceSelect.addEventListener('change', calculateRecovery);
  if (qtyInput) qtyInput.addEventListener('input', calculateRecovery);

  // Initial Run
  calculateRecovery();
});
