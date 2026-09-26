/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Dynamic Section & Image Renderer Engine
 * Fetches active images from api/get_images.php by display_location
 * and dynamically populates public website sections.
 */

document.addEventListener('DOMContentLoaded', () => {
  const apiEndpoint = 'api/get_images.php';

  // 1. Render A CAMPUS FOR DISCOVERY
  const campusGrids = document.querySelectorAll('.campus-grid');
  if (campusGrids.length > 0) {
    fetch(`${apiEndpoint}?location=campus_discovery`)
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success' && res.data && res.data.length > 0) {
          const htmlContent = res.data.map(img => `
            <div class="campus-card">
              <div class="campus-thumb">
                <img src="${escapeHtml(img.file_path)}" alt="${escapeHtml(img.title)}">
              </div>
              <div class="campus-body">
                <h4>${escapeHtml(img.title || 'Campus Facility')}</h4>
                <p>${escapeHtml(img.subtitle || '')}</p>
              </div>
            </div>
          `).join('');

          campusGrids.forEach(grid => {
            grid.innerHTML = htmlContent;
          });
        }
      })
      .catch(err => console.log('Campus Discovery dynamic fetch info:', err));
  }

  // 2. Render LIFE AT BHAVAN'S
  const lifeGrids = document.querySelectorAll('.student-life-grid');
  if (lifeGrids.length > 0) {
    fetch(`${apiEndpoint}?location=life_at_bhavans`)
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success' && res.data && res.data.length > 0) {
          const htmlContent = res.data.map(img => `
            <div class="card card-hover" style="overflow: hidden;">
              <div style="aspect-ratio: 16/11; overflow: hidden;">
                <img src="${escapeHtml(img.file_path)}" alt="${escapeHtml(img.title)}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div style="padding: 1.5rem;">
                <span class="badge badge-blue" style="margin-bottom: 0.5rem;">CAMPUS LIFE</span>
                <h4>${escapeHtml(img.title || 'Student Life')}</h4>
                <p style="font-size: 0.875rem; color: var(--color-text-secondary);">${escapeHtml(img.subtitle || '')}</p>
              </div>
            </div>
          `).join('');

          lifeGrids.forEach(grid => {
            grid.innerHTML = htmlContent;
          });
        }
      })
      .catch(err => console.log('Life at Bhavans dynamic fetch info:', err));
  }

  // 3. Render WHAT'S HAPPENING
  const eventsColsList = document.querySelectorAll('.events-columns');
  if (eventsColsList.length > 0) {
    fetch(`${apiEndpoint}?location=whats_happening`)
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success' && res.data && res.data.length > 0) {
          const itemsToRender = res.data.filter(i => i.image_type === 'sub');
          const finalItems = itemsToRender.length > 0 ? itemsToRender : res.data;

          const htmlContent = finalItems.map(img => `
            <div class="event-card">
              <div class="event-thumb">
                <img src="${escapeHtml(img.file_path)}" alt="${escapeHtml(img.title)}">
                <div class="event-date-badge">FEATURED</div>
              </div>
              <div class="event-body">
                <span class="event-category">EVENT</span>
                <h4 class="event-title">${escapeHtml(img.title || 'School Event')}</h4>
                <p class="event-desc">${escapeHtml(img.subtitle || '')}</p>
              </div>
            </div>
          `).join('');

          eventsColsList.forEach(cols => {
            cols.innerHTML = htmlContent;
          });
        }
      })
      .catch(err => console.log('Whats Happening dynamic fetch info:', err));
  }

  // 4. Render MOMENTS AT BHAVAN'S (Gallery Grid)
  const galleryGrids = document.querySelectorAll('.gallery-grid');
  if (galleryGrids.length > 0) {
    fetch(`${apiEndpoint}?location=moments_at_bhavans`)
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success' && res.data && res.data.length > 0) {
          const htmlContent = res.data.map(img => {
            const catLabel = img.image_type === 'main' ? 'MAIN EVENT' : 'MOMENTS';
            const catData = 'all events student-life culture academics sports achievements community';
            return `
              <div class="gallery-item" data-category="${catData}" data-category-label="${catLabel}" data-title="${escapeHtml(img.title)}">
                <img src="${escapeHtml(img.file_path)}" alt="${escapeHtml(img.title)}" loading="lazy">
                <div class="gallery-overlay">
                  <span class="gallery-overlay-badge">${catLabel}</span>
                  <span class="gallery-overlay-title">${escapeHtml(img.title)}</span>
                </div>
                <div class="gallery-zoom-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                </div>
              </div>
            `;
          }).join('');

          galleryGrids.forEach(grid => {
            grid.innerHTML = htmlContent;
          });

          // Dispatch event so gallery lightbox knows grid content was updated
          window.dispatchEvent(new CustomEvent('galleryUpdated'));
        }
      })
      .catch(err => console.log('Moments at Bhavans dynamic fetch info:', err));
  }

  // Helper function to escape HTML special characters
  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
  }
});
