/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Pure Image Entrance Popup Modal & Scrolling Notice Ticker Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  fetch('api/get_site_data.php')
    .then(res => {
      if (!res.ok) throw new Error('PHP endpoint unavailable');
      return res.json();
    })
    .then(data => {
      if (data.status === 'success') {
        initEntrancePopup(data.popup);
        initNoticeTicker(data.ticker, data.notices);
      }
    })
    .catch(err => {
      fetch('api/get_site_data.json')
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            initEntrancePopup(data.popup);
            initNoticeTicker(data.ticker, data.notices);
          }
        })
        .catch(e => console.log('Static site data fallback info:', e));
    });

  // 1. Pure Image Entrance Popup Modal Engine
  function initEntrancePopup(popup) {
    if (!popup || !popup.is_active || popup.is_active == 0) return;

    // Session check to prevent repeated popups on every page navigation
    if (sessionStorage.getItem('bvb_popup_dismissed') === '1') return;

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'site-entrance-popup-overlay';
    modalOverlay.id = 'siteEntrancePopup';

    const imgSrc = popup.image_url || 'images/main page popup/1.jpg';

    // Pure image popup card with ONLY the image and top-right close button
    modalOverlay.innerHTML = `
      <div class="site-entrance-popup-card pure-image">
        <button class="site-entrance-popup-close" aria-label="Close Announcement">&times;</button>
        <div class="site-entrance-popup-img-wrap">
          <img src="${escapeHtml(imgSrc)}" alt="Entrance Announcement">
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    // Fade in popup after short delay
    setTimeout(() => {
      modalOverlay.classList.add('active');
    }, 300);

    const closePopup = () => {
      sessionStorage.setItem('bvb_popup_dismissed', '1');
      modalOverlay.classList.remove('active');
      setTimeout(() => {
        if (modalOverlay.parentNode) {
          modalOverlay.parentNode.removeChild(modalOverlay);
        }
      }, 300);
    };

    const closeBtn = modalOverlay.querySelector('.site-entrance-popup-close');
    if (closeBtn) closeBtn.addEventListener('click', closePopup);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closePopup();
      }
    });
  }

  // 2. Scrolling Notice Ticker Engine
  function initNoticeTicker(tickerItems, allNotices) {
    const tickerWrap = document.getElementById('noticeTickerWrap');
    if (!tickerWrap || !tickerItems || tickerItems.length === 0) return;

    const tickerContent = tickerItems.map(n => `
      <a href="#events" class="notice-ticker-item" data-id="${n.id}">
        <span class="notice-ticker-badge">${escapeHtml(n.category || 'NOTICE')}</span>
        <span class="notice-ticker-title">${escapeHtml(n.title)}</span>
        <span class="notice-ticker-date">(${escapeHtml(n.notice_date)})</span>
      </a>
    `).join(' <span class="notice-ticker-sep">•</span> ');

    tickerWrap.innerHTML = `
      <div class="notice-ticker-bar">
        <div class="notice-ticker-label">
          <span class="pulse-dot"></span>
          LATEST NOTICES
        </div>
        <div class="notice-ticker-track-wrap">
          <div class="notice-ticker-track">${tickerContent}</div>
        </div>
      </div>
    `;

    // Click listener to navigate directly to Notice content
    tickerWrap.addEventListener('click', (e) => {
      const link = e.target.closest('.notice-ticker-item');
      if (link) {
        e.preventDefault();
        const targetSection = document.getElementById('events');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = 'events.html';
        }
      }
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
  }
});
