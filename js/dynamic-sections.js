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

    // 2. Fetch PHP MySQL API endpoint with fallback to JSON
    fetch('api/get_site_data.php?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success') {
          renderSiteContent(data);
        } else {
          fallbackJsonFetch();
        }
      })
      .catch(err => {
        console.log('PHP API fetch fallback to static JSON:', err);
        fallbackJsonFetch();
      });

    function fallbackJsonFetch() {
      fetch('api/get_site_data.json?t=' + Date.now())
        .then(res => res.json())
        .then(data => {
          if (data && data.status === 'success') {
            renderSiteContent(data);
          }
        })
        .catch(err => console.log('Dynamic sections fetch note:', err));
    }
  }

  function renderSiteContent(data) {
    const packages = data.image_packages || [];

    // Store packages globally for gallery lightbox
    window.bvbImagePackages = packages;

    // A. Render HERO AUTO SLIDES ("EDUCATION ROOTED IN VALUES")
    const heroSlider = document.getElementById('heroSlider');
    const heroSliderDots = document.getElementById('heroSliderDots');
    if (heroSlider && data.auto_slides && data.auto_slides.length > 0) {
      const activeSlides = data.auto_slides.filter(s => s.is_active == 1 || s.is_active === '1' || s.is_active === true);
      if (activeSlides.length > 0) {
        heroSlider.innerHTML = activeSlides.map((slide, idx) => `
          <div class="hero-slide ${idx === 0 ? 'active' : ''}">
            <img src="${escapeHtml(slide.image_url)}" alt="${escapeHtml(slide.title || 'Bhavan\'s Manvila Slide')}">
            <div class="hero-slide-caption">${escapeHtml(slide.title || '')}${slide.subtitle ? ' • ' + escapeHtml(slide.subtitle) : ''}</div>
          </div>
        `).join('');

        if (heroSliderDots) {
          heroSliderDots.innerHTML = activeSlides.map((_, idx) => `
            <button class="slider-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Go to slide ${idx + 1}"></button>
          `).join('');
        }

        window.dispatchEvent(new CustomEvent('heroSlidesUpdated'));
      }
    }

    // B. Render CAMPUS DISCOVERY
    const campusGrids = document.querySelectorAll('.campus-grid');
    const campusPkgs = packages.filter(p => p.target_sections && p.target_sections.campus_discovery);
    if (campusGrids.length > 0) {
      if (campusPkgs.length > 0) {
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
      } else {
        campusGrids.forEach(grid => {
          grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--color-text-secondary); background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px dashed var(--color-border); margin: 1rem 0;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.5rem; color: var(--color-primary);"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
              <h4 style="color: var(--color-deep-blue); margin-bottom: 0.25rem; font-size: 1.1rem; font-weight: 800;">Campus Discovery Awaiting Admin Uploads</h4>
              <p style="font-size: 0.875rem; max-width: 420px; margin: 0 auto; color: var(--color-text-secondary);">Upload image packages targeted for "CAMPUS DISCOVERY" from the Admin Panel to display them live here.</p>
            </div>
          `;
        });
      }
    }

    // C. Render LIFE AT BHAVAN'S
    const lifeGrids = document.querySelectorAll('.student-life-grid');
    const lifePkgs = packages.filter(p => p.target_sections && p.target_sections.life_at_bhavans);
    if (lifeGrids.length > 0) {
      if (lifePkgs.length > 0) {
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
      } else {
        lifeGrids.forEach(grid => {
          grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--color-text-secondary); background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px dashed var(--color-border); margin: 1rem 0;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.5rem; color: var(--color-primary);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <h4 style="color: var(--color-deep-blue); margin-bottom: 0.25rem; font-size: 1.1rem; font-weight: 800;">Life at Bhavan's Awaiting Admin Uploads</h4>
              <p style="font-size: 0.875rem; max-width: 420px; margin: 0 auto; color: var(--color-text-secondary);">Upload image packages targeted for "LIFE AT BHAVAN'S" from the Admin Panel to display them live here.</p>
            </div>
          `;
        });
      }
    }

    // D. Render WHAT'S HAPPENING
    const whatsCols = document.querySelectorAll('.events-columns');
    const whatsPkgs = packages.filter(p => p.target_sections && p.target_sections.whats_happening);
    if (whatsCols.length > 0) {
      if (whatsPkgs.length > 0) {
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
      } else {
        whatsCols.forEach(cols => {
          cols.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--color-text-secondary); background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px dashed var(--color-border); margin: 1rem 0;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.5rem; color: var(--color-primary);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <h4 style="color: var(--color-deep-blue); margin-bottom: 0.25rem; font-size: 1.1rem; font-weight: 800;">Events & Announcements Awaiting Admin Uploads</h4>
              <p style="font-size: 0.875rem; max-width: 420px; margin: 0 auto; color: var(--color-text-secondary);">Upload image packages targeted for "WHAT'S HAPPENING" from the Admin Panel to display them live here.</p>
            </div>
          `;
        });
      }
    }

    // E. Render MOMENTS AT BHAVAN'S (Gallery Grid with Auto-Category Recognition)
    const galleryGrids = document.querySelectorAll('.gallery-grid');
    const momentsPkgs = packages.filter(p => p.target_sections && p.target_sections.moments_at_bhavans);
    if (galleryGrids.length > 0) {
      if (momentsPkgs.length > 0) {
      const htmlContent = momentsPkgs.map((p, idx) => {
        let cats = ['all', 'events', 'student-life', 'culture'];
        if (p.target_sections) {
          if (p.target_sections.campus_discovery) cats.push('academics', 'community');
          if (p.target_sections.life_at_bhavans) cats.push('student-life', 'culture');
          if (p.target_sections.whats_happening) cats.push('events', 'achievements');
        }
        const textLower = ((p.title || '') + ' ' + (p.subtitle || '')).toLowerCase();
        if (textLower.includes('sport') || textLower.includes('game') || textLower.includes('athletic') || textLower.includes('ground') || textLower.includes('match')) cats.push('sports');
        if (textLower.includes('academic') || textLower.includes('study') || textLower.includes('class') || textLower.includes('science') || textLower.includes('lab')) cats.push('academics');
        if (textLower.includes('award') || textLower.includes('win') || textLower.includes('trophy') || textLower.includes('achievement')) cats.push('achievements');
        if (textLower.includes('community') || textLower.includes('social') || textLower.includes('parent') || textLower.includes('fest')) cats.push('community');

        const catString = Array.from(new Set(cats)).join(' ');

        return `
        <div class="gallery-item" data-package-id="${p.id}" data-category="${catString}" data-category-label="FEATURED" data-title="${escapeHtml(p.title)}">
          <img src="${escapeHtml(p.main_image)}" alt="${escapeHtml(p.title)}" loading="lazy">
          <div class="gallery-overlay">
            <span class="gallery-overlay-badge">MAIN HIGHLIGHT</span>
            <span class="gallery-overlay-title">${escapeHtml(p.title)}</span>
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
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
      } else {
        galleryGrids.forEach(grid => {
          grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--color-text-secondary); background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px dashed var(--color-border); margin: 1rem 0;">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.75rem; color: var(--color-primary);"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <h4 style="color: var(--color-deep-blue); margin-bottom: 0.35rem; font-size: 1.15rem; font-weight: 800;">Gallery Awaiting Admin Uploads</h4>
              <p style="font-size: 0.9rem; max-width: 460px; margin: 0 auto; color: var(--color-text-secondary);">Upload image packages from the Admin Panel to display them live in this section.</p>
            </div>
          `;
        });
      }
    }

    // F. Render MANDATORY DISCLOSURES (Sections A, B, C, D, E & SARAS PDF Banner)
    const disclosures = data.mandatory_disclosures || [];
    if (disclosures.length > 0) {
      // Top Banner Link
      const sarasBtn = document.getElementById('sarasPdfDownloadBtn');
      const mainSarasDoc = disclosures.find(d => d.category_code === 'B' && (d.sl_no === '11' || d.title.toLowerCase().includes('complete mandatory')));
      if (sarasBtn && mainSarasDoc && mainSarasDoc.file_link) {
        sarasBtn.href = escapeHtml(mainSarasDoc.file_link);
      }

      // Section A
      const tbodyA = document.getElementById('discTbodyA');
      const docsA = disclosures.filter(d => d.category_code === 'A');
      if (tbodyA && docsA.length > 0) {
        tbodyA.innerHTML = docsA.map((d, idx) => `
          <tr style="border-bottom: 1px solid var(--color-border); ${idx % 2 === 1 ? 'background: #F8FAFC;' : ''}">
            <td style="padding: 1rem 1.5rem; font-weight: 600;">${escapeHtml(d.sl_no)}</td>
            <td style="padding: 1rem 1.5rem; font-weight: 600;">${escapeHtml(d.title)}</td>
            <td style="padding: 1rem 1.5rem;">${escapeHtml(d.details)}</td>
          </tr>
        `).join('');
      }

      // Section B
      const tbodyB = document.getElementById('discTbodyB');
      const docsB = disclosures.filter(d => d.category_code === 'B');
      if (tbodyB && docsB.length > 0) {
        tbodyB.innerHTML = docsB.map((d, idx) => {
          const btnLabel = d.sl_no === '11' ? 'DOWNLOAD SARAS REPORT' : `VIEW ${escapeHtml(d.title.toUpperCase())} DOCUMENT`;
          const isMainBtn = d.sl_no === '11';
          return `
          <tr style="border-bottom: 1px solid var(--color-border); ${idx % 2 === 1 ? 'background: #F8FAFC;' : ''}">
            <td style="padding: 1rem 1.5rem;">${escapeHtml(d.sl_no)}</td>
            <td style="padding: 1rem 1.5rem; font-weight: 500;">${escapeHtml(d.title)}</td>
            <td style="padding: 1rem 1.5rem;">
              ${d.file_link ? `
                <a href="${escapeHtml(d.file_link)}" target="_blank" rel="noopener" class="btn ${isMainBtn ? 'btn-primary' : 'btn-outline'} btn-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  ${btnLabel}
                </a>
              ` : '<span style="color: #94A3B8;">Text Record</span>'}
            </td>
          </tr>
        `;
        }).join('');
      }

      // Section C
      const tbodyC = document.getElementById('discTbodyC');
      const docsC = disclosures.filter(d => d.category_code === 'C');
      if (tbodyC && docsC.length > 0) {
        tbodyC.innerHTML = docsC.map((d, idx) => `
          <tr style="border-bottom: 1px solid var(--color-border); ${idx % 2 === 1 ? 'background: #F8FAFC;' : ''}">
            <td style="padding: 1rem 1.5rem;">${escapeHtml(d.sl_no)}</td>
            <td style="padding: 1rem 1.5rem; font-weight: 500;">${escapeHtml(d.title)}</td>
            <td style="padding: 1rem 1.5rem;">
              ${d.file_link ? `
                <a href="${escapeHtml(d.file_link)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                  VIEW DETAILS / DOCUMENT
                </a>
              ` : '<span style="color: #94A3B8;">Text Record</span>'}
            </td>
          </tr>
        `).join('');
      }

      // Section D
      const tbodyD = document.getElementById('discTbodyD');
      const docsD = disclosures.filter(d => d.category_code === 'D');
      if (tbodyD && docsD.length > 0) {
        tbodyD.innerHTML = docsD.map((d, idx) => `
          <tr style="border-bottom: 1px solid var(--color-border); ${idx % 2 === 1 ? 'background: #F8FAFC;' : ''}">
            <td style="padding: 1rem 1.5rem; font-weight: 600;">${escapeHtml(d.sl_no)}</td>
            <td style="padding: 1rem 1.5rem; font-weight: 600;">${escapeHtml(d.title)}</td>
            <td style="padding: 1rem 1.5rem;">${escapeHtml(d.details)}</td>
          </tr>
        `).join('');
      }

      // Section E
      const tbodyE = document.getElementById('discTbodyE');
      const docsE = disclosures.filter(d => d.category_code === 'E');
      if (tbodyE && docsE.length > 0) {
        tbodyE.innerHTML = docsE.map((d, idx) => `
          <tr style="border-bottom: 1px solid var(--color-border); ${idx % 2 === 1 ? 'background: #F8FAFC;' : ''}">
            <td style="padding: 1rem 1.5rem; font-weight: 600;">${escapeHtml(d.sl_no)}</td>
            <td style="padding: 1rem 1.5rem; font-weight: 600;">${escapeHtml(d.title)}</td>
            <td style="padding: 1rem 1.5rem;">${escapeHtml(d.details)}</td>
          </tr>
        `).join('');
      }
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
