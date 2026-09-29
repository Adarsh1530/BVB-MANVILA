const fs = require('fs');
const path = require('path');

const dirs = [
  'c:/xampp/htdocs/BVB MANVILA',
  'C:/Users/KEERTHI ADARSH M P/Desktop/BVB_MANVILA_cPanel_Upload'
];

dirs.forEach(baseDir => {
  if (!fs.existsSync(baseDir)) return;

  // 1. Clean gallery.html static cards
  const galleryPath = path.join(baseDir, 'gallery.html');
  if (fs.existsSync(galleryPath)) {
    let html = fs.readFileSync(galleryPath, 'utf8');
    html = html.replace(
      /<div class="gallery-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
      `<div class="gallery-grid" id="publicGalleryGrid"></div>\n      </div>\n    </section>`
    );
    fs.writeFileSync(galleryPath, html, 'utf8');
    console.log(`Cleaned static gallery items in ${baseDir}/gallery.html`);
  }

  // 2. Clean index.html static gallery cards
  const indexPath = path.join(baseDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    html = html.replace(
      /<div class="gallery-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<!-- 6\. WHY BHAVAN'S/,
      `<div class="gallery-grid" id="homeGalleryGrid"></div>\n      </div>\n    </section>\n\n    <!-- 6. WHY BHAVAN'S`
    );
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log(`Cleaned static gallery items in ${baseDir}/index.html`);
  }

  // 3. Clean events.html static cards
  const eventsPath = path.join(baseDir, 'events.html');
  if (fs.existsSync(eventsPath)) {
    let html = fs.readFileSync(eventsPath, 'utf8');
    html = html.replace(
      /<div class="events-columns" style="margin-top: 3rem;">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
      `<div class="events-columns" id="publicEventsColumns" style="margin-top: 3rem;"></div>\n      </div>\n    </section>`
    );
    fs.writeFileSync(eventsPath, html, 'utf8');
    console.log(`Cleaned static event items in ${baseDir}/events.html`);
  }

  // 4. Update js/dynamic-sections.js to render clean empty state when no admin packages exist
  const jsPath = path.join(baseDir, 'js/dynamic-sections.js');
  if (fs.existsSync(jsPath)) {
    let js = fs.readFileSync(jsPath, 'utf8');

    const oldGalleryBlock = `    // E. Render MOMENTS AT BHAVAN'S (Gallery Grid with Auto-Category Recognition)
    const galleryGrids = document.querySelectorAll('.gallery-grid');
    const momentsPkgs = packages.filter(p => p.target_sections && p.target_sections.moments_at_bhavans);
    if (galleryGrids.length > 0 && momentsPkgs.length > 0) {`;

    const newGalleryBlock = `    // E. Render MOMENTS AT BHAVAN'S (Gallery Grid with Auto-Category Recognition)
    const galleryGrids = document.querySelectorAll('.gallery-grid');
    const momentsPkgs = packages.filter(p => p.target_sections && p.target_sections.moments_at_bhavans);
    if (galleryGrids.length > 0) {
      if (momentsPkgs.length > 0) {`;

    if (js.includes(oldGalleryBlock)) {
      js = js.replace(oldGalleryBlock, newGalleryBlock);
      const oldEndGallery = `      galleryGrids.forEach(grid => {
        grid.innerHTML = htmlContent;
      });
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
    }`;
      const newEndGallery = `      galleryGrids.forEach(grid => {
        grid.innerHTML = htmlContent;
      });
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
      } else {
        galleryGrids.forEach(grid => {
          grid.innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--color-text-secondary); background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px dashed var(--color-border); margin: 1rem 0;">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.75rem; color: var(--color-primary);"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <h4 style="color: var(--color-deep-blue); margin-bottom: 0.35rem; font-size: 1.15rem; font-weight: 800;">Gallery Awaiting Admin Uploads</h4>
              <p style="font-size: 0.9rem; max-width: 460px; margin: 0 auto; color: var(--color-text-secondary);">Upload image packages from the Admin Panel to display them live in this section.</p>
            </div>
          \`;
        });
      }
    }`;
      js = js.replace(oldEndGallery, newEndGallery);
      fs.writeFileSync(jsPath, js, 'utf8');
      console.log(`Updated dynamic-sections.js empty state handling in ${baseDir}`);
    }
  }
});
