/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Dynamic Public Site Renderer & Image Package Engine
 * Binds Admin Panel Data (Main Image Highlights & 5 Sub-Images Lightbox) to Public Pages
 */

document.addEventListener('DOMContentLoaded', () => {
  loadAndRenderSiteData();

  function loadAndRenderSiteData() {
    // 1. Try loading from LocalStorage state if edited in Admin Panel
    const localData = localStorage.getItem('bvb_site_data');
    if (localData) {
      try {
        const data = JSON.parse(localData);
        renderSiteContent(data);
        return;
      } catch (e) {
        console.error('LocalStorage parse error:', e);
      }
    }

    // 2. Fetch JSON endpoint
    fetch('api/get_site_data.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success') {
          renderSiteContent(data);
        }
      })
      .catch(err => console.log('Dynamic sections fetch note:', err));
  }

  function renderSiteContent(data) {
    const packages = data.image_packages || [];

    // Store packages globally for gallery lightbox
    window.bvbImagePackages = packages;

    // A. Render CAMPUS DISCOVERY
    const campusGrids = document.querySelectorAll('.campus-grid');
    const campusPkgs = packages.filter(p => p.target_sections && p.target_sections.campus_discovery);
    if (campusGrids.length > 0 && campusPkgs.length > 0) {
      const htmlContent = campusPkgs.map(p => `
        <div class="campus-card">
          <div class="campus-thumb">
            <img src="${escapeHtml(p.main_image)}" alt="${escapeHtml(p.title)}">
          </div>
          <div class="campus-body">
            <h4>${escapeHtml(p.title)}</h4>
            <p>${escapeHtml(p.subtitle || '')}</p>
          </div>
        </div>
      `).join('');
      campusGrids.forEach(grid => grid.innerHTML = htmlContent);
    }

    // B. Render LIFE AT BHAVAN'S
    const lifeGrids = document.querySelectorAll('.student-life-grid');
    const lifePkgs = packages.filter(p => p.target_sections && p.target_sections.life_at_bhavans);
    if (lifeGrids.length > 0 && lifePkgs.length > 0) {
      const htmlContent = lifePkgs.map(p => `
        <div class="card card-hover" style="overflow: hidden;">
          <div style="aspect-ratio: 16/11; overflow: hidden;">
            <img src="${escapeHtml(p.main_image)}" alt="${escapeHtml(p.title)}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 1.5rem;">
            <span class="badge badge-blue" style="margin-bottom: 0.5rem;">CAMPUS LIFE</span>
            <h4>${escapeHtml(p.title)}</h4>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary);">${escapeHtml(p.subtitle || '')}</p>
          </div>
        </div>
      `).join('');
      lifeGrids.forEach(grid => grid.innerHTML = htmlContent);
    }

    // C. Render WHAT'S HAPPENING
    const whatsCols = document.querySelectorAll('.events-columns');
    const whatsPkgs = packages.filter(p => p.target_sections && p.target_sections.whats_happening);
    if (whatsCols.length > 0 && whatsPkgs.length > 0) {
      const htmlContent = whatsPkgs.map(p => `
        <div class="event-card">
          <div class="event-thumb">
            <img src="${escapeHtml(p.main_image)}" alt="${escapeHtml(p.title)}">
            <div class="event-date-badge">FEATURED</div>
          </div>
          <div class="event-body">
            <span class="event-category">EVENT</span>
            <h4 class="event-title">${escapeHtml(p.title)}</h4>
            <p class="event-desc">${escapeHtml(p.subtitle || '')}</p>
          </div>
        </div>
      `).join('');
      whatsCols.forEach(cols => cols.innerHTML = htmlContent);
    }

    // D. Render MOMENTS AT BHAVAN'S (Gallery Grid)
    const galleryGrids = document.querySelectorAll('.gallery-grid');
    const momentsPkgs = packages.filter(p => p.target_sections && p.target_sections.moments_at_bhavans);
    if (galleryGrids.length > 0 && momentsPkgs.length > 0) {
      const htmlContent = momentsPkgs.map((p, idx) => `
        <div class="gallery-item" data-package-id="${p.id}" data-category="all events student-life culture" data-category-label="FEATURED" data-title="${escapeHtml(p.title)}">
          <img src="${escapeHtml(p.main_image)}" alt="${escapeHtml(p.title)}" loading="lazy">
          <div class="gallery-overlay">
            <span class="gallery-overlay-badge">MAIN HIGHLIGHT</span>
            <span class="gallery-overlay-title">${escapeHtml(p.title)}</span>
          </div>
          <div class="gallery-zoom-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          </div>
        </div>
      `).join('');

      galleryGrids.forEach(grid => grid.innerHTML = htmlContent);
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
    }
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/&/g, "&amp;")
                       .replace(/</g, "&lt;")
                       .replace(/>/g, "&gt;")
                       .replace(/"/g, "&quot;")
                       .replace(/'/g, "&#039;");
  }
});
