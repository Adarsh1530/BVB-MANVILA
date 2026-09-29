const fs = require('fs');
const path = require('path');

const dirs = [
  'c:/xampp/htdocs/BVB MANVILA',
  'C:/Users/KEERTHI ADARSH M P/Desktop/BVB_MANVILA_cPanel_Upload'
];

dirs.forEach(baseDir => {
  if (!fs.existsSync(baseDir)) return;

  // 1. Clean index.html LIFE AT BHAVAN'S static cards
  const indexPath = path.join(baseDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    html = html.replace(
      /<div class="student-life-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<!-- 15\. LEADERSHIP/,
      `<div class="student-life-grid" id="homeLifeGrid"></div>\n      </div>\n    </section>\n\n    <!-- 15. LEADERSHIP`
    );
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log(`Cleaned static LIFE AT BHAVAN'S items in ${baseDir}/index.html`);
  }

  // 2. Clean student-life.html TRADITIONS & CELEBRATIONS static cards
  const studentLifePath = path.join(baseDir, 'student-life.html');
  if (fs.existsSync(studentLifePath)) {
    let html = fs.readFileSync(studentLifePath, 'utf8');
    html = html.replace(
      /<div class="student-life-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<\/main>/,
      `<div class="student-life-grid" id="publicLifeGrid"></div>\n      </div>\n    </section>\n  </main>`
    );
    fs.writeFileSync(studentLifePath, html, 'utf8');
    console.log(`Cleaned static LIFE AT BHAVAN'S items in ${baseDir}/student-life.html`);
  }

  // 3. Update js/dynamic-sections.js with clean empty state handling for all sections
  const jsPath = path.join(baseDir, 'js/dynamic-sections.js');
  if (fs.existsSync(jsPath)) {
    let js = fs.readFileSync(jsPath, 'utf8');

    // Update CAMPUS DISCOVERY
    const oldCampus = `    // B. Render CAMPUS DISCOVERY
    const campusGrids = document.querySelectorAll('.campus-grid');
    const campusPkgs = packages.filter(p => p.target_sections && p.target_sections.campus_discovery);
    if (campusGrids.length > 0 && campusPkgs.length > 0) {
      const htmlContent = campusPkgs.map(p => \`
        <div class="campus-card">
          <div class="campus-thumb">
            <img src="\${escapeHtml(p.main_image)}" alt="\${escapeHtml(p.title)}">
          </div>
          <div class="campus-body">
            <h4>\${escapeHtml(p.title)}</h4>
            <p>\${escapeHtml(p.subtitle || '')}</p>
          </div>
        </div>
      \`).join('');
      campusGrids.forEach(grid => grid.innerHTML = htmlContent);
    }`;

    const newCampus = `    // B. Render CAMPUS DISCOVERY
    const campusGrids = document.querySelectorAll('.campus-grid');
    const campusPkgs = packages.filter(p => p.target_sections && p.target_sections.campus_discovery);
    if (campusGrids.length > 0) {
      if (campusPkgs.length > 0) {
        const htmlContent = campusPkgs.map(p => \`
          <div class="campus-card">
            <div class="campus-thumb">
              <img src="\${escapeHtml(p.main_image)}" alt="\${escapeHtml(p.title)}">
            </div>
            <div class="campus-body">
              <h4>\${escapeHtml(p.title)}</h4>
              <p>\${escapeHtml(p.subtitle || '')}</p>
            </div>
          </div>
        \`).join('');
        campusGrids.forEach(grid => grid.innerHTML = htmlContent);
      } else {
        campusGrids.forEach(grid => {
          grid.innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--color-text-secondary); background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px dashed var(--color-border); margin: 1rem 0;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.5rem; color: var(--color-primary);"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
              <h4 style="color: var(--color-deep-blue); margin-bottom: 0.25rem; font-size: 1.1rem; font-weight: 800;">Campus Discovery Awaiting Admin Uploads</h4>
              <p style="font-size: 0.875rem; max-width: 420px; margin: 0 auto; color: var(--color-text-secondary);">Upload image packages targeted for "CAMPUS DISCOVERY" from the Admin Panel to display them live here.</p>
            </div>
          \`;
        });
      }
    }`;

    // Update LIFE AT BHAVAN'S
    const oldLife = `    // C. Render LIFE AT BHAVAN'S
    const lifeGrids = document.querySelectorAll('.student-life-grid');
    const lifePkgs = packages.filter(p => p.target_sections && p.target_sections.life_at_bhavans);
    if (lifeGrids.length > 0 && lifePkgs.length > 0) {
      const htmlContent = lifePkgs.map(p => \`
        <div class="card card-hover" style="overflow: hidden;">
          <div style="aspect-ratio: 16/11; overflow: hidden;">
            <img src="\${escapeHtml(p.main_image)}" alt="\${escapeHtml(p.title)}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 1.5rem;">
            <span class="badge badge-blue" style="margin-bottom: 0.5rem;">CAMPUS LIFE</span>
            <h4>\${escapeHtml(p.title)}</h4>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary);">\${escapeHtml(p.subtitle || '')}</p>
          </div>
        </div>
      \`).join('');
      lifeGrids.forEach(grid => grid.innerHTML = htmlContent);
    }`;

    const newLife = `    // C. Render LIFE AT BHAVAN'S
    const lifeGrids = document.querySelectorAll('.student-life-grid');
    const lifePkgs = packages.filter(p => p.target_sections && p.target_sections.life_at_bhavans);
    if (lifeGrids.length > 0) {
      if (lifePkgs.length > 0) {
        const htmlContent = lifePkgs.map(p => \`
          <div class="card card-hover" style="overflow: hidden;">
            <div style="aspect-ratio: 16/11; overflow: hidden;">
              <img src="\${escapeHtml(p.main_image)}" alt="\${escapeHtml(p.title)}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="padding: 1.5rem;">
              <span class="badge badge-blue" style="margin-bottom: 0.5rem;">CAMPUS LIFE</span>
              <h4>\${escapeHtml(p.title)}</h4>
              <p style="font-size: 0.875rem; color: var(--color-text-secondary);">\${escapeHtml(p.subtitle || '')}</p>
            </div>
          </div>
        \`).join('');
        lifeGrids.forEach(grid => grid.innerHTML = htmlContent);
      } else {
        lifeGrids.forEach(grid => {
          grid.innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--color-text-secondary); background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px dashed var(--color-border); margin: 1rem 0;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.5rem; color: var(--color-primary);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <h4 style="color: var(--color-deep-blue); margin-bottom: 0.25rem; font-size: 1.1rem; font-weight: 800;">Life at Bhavan's Awaiting Admin Uploads</h4>
              <p style="font-size: 0.875rem; max-width: 420px; margin: 0 auto; color: var(--color-text-secondary);">Upload image packages targeted for "LIFE AT BHAVAN'S" from the Admin Panel to display them live here.</p>
            </div>
          \`;
        });
      }
    }`;

    // Update WHAT'S HAPPENING
    const oldWhats = `    // D. Render WHAT'S HAPPENING
    const whatsCols = document.querySelectorAll('.events-columns');
    const whatsPkgs = packages.filter(p => p.target_sections && p.target_sections.whats_happening);
    if (whatsCols.length > 0 && whatsPkgs.length > 0) {
      const htmlContent = whatsPkgs.map(p => \`
        <div class="event-card">
          <div class="event-thumb">
            <img src="\${escapeHtml(p.main_image)}" alt="\${escapeHtml(p.title)}">
            <div class="event-date-badge">FEATURED</div>
          </div>
          <div class="event-body">
            <span class="event-category">EVENT</span>
            <h4 class="event-title">\${escapeHtml(p.title)}</h4>
            <p class="event-desc">\${escapeHtml(p.subtitle || '')}</p>
          </div>
        </div>
      \`).join('');
      whatsCols.forEach(cols => cols.innerHTML = htmlContent);
    }`;

    const newWhats = `    // D. Render WHAT'S HAPPENING
    const whatsCols = document.querySelectorAll('.events-columns');
    const whatsPkgs = packages.filter(p => p.target_sections && p.target_sections.whats_happening);
    if (whatsCols.length > 0) {
      if (whatsPkgs.length > 0) {
        const htmlContent = whatsPkgs.map(p => \`
          <div class="event-card">
            <div class="event-thumb">
              <img src="\${escapeHtml(p.main_image)}" alt="\${escapeHtml(p.title)}">
              <div class="event-date-badge">FEATURED</div>
            </div>
            <div class="event-body">
              <span class="event-category">EVENT</span>
              <h4 class="event-title">\${escapeHtml(p.title)}</h4>
              <p class="event-desc">\${escapeHtml(p.subtitle || '')}</p>
            </div>
          </div>
        \`).join('');
        whatsCols.forEach(cols => cols.innerHTML = htmlContent);
      } else {
        whatsCols.forEach(cols => {
          cols.innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--color-text-secondary); background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px dashed var(--color-border); margin: 1rem 0;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.5rem; color: var(--color-primary);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <h4 style="color: var(--color-deep-blue); margin-bottom: 0.25rem; font-size: 1.1rem; font-weight: 800;">Events & Announcements Awaiting Admin Uploads</h4>
              <p style="font-size: 0.875rem; max-width: 420px; margin: 0 auto; color: var(--color-text-secondary);">Upload image packages targeted for "WHAT'S HAPPENING" from the Admin Panel to display them live here.</p>
            </div>
          \`;
        });
      }
    }`;

    if (js.includes(oldCampus)) js = js.replace(oldCampus, newCampus);
    if (js.includes(oldLife)) js = js.replace(oldLife, newLife);
    if (js.includes(oldWhats)) js = js.replace(oldWhats, newWhats);

    fs.writeFileSync(jsPath, js, 'utf8');
    console.log(`Updated js/dynamic-sections.js in ${baseDir}`);
  }
});
