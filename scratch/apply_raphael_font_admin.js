const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\xampp\\htdocs\\BVB MANVILA';

console.log('=== Applying Raphael Font & Bharatiya Vidya Bhavan Title to Admin Panel ===');

// 1. Update admin/css/admin.css
const adminCssPath = path.join(projectRoot, 'admin', 'css', 'admin.css');
let adminCss = fs.readFileSync(adminCssPath, 'utf8');

const fontFaceAdminCss = `@font-face {
  font-family: 'Raphael';
  src: url('../../assets/fonts/raphael.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
`;

if (!adminCss.includes("font-family: 'Raphael'")) {
  adminCss = fontFaceAdminCss + '\n' + adminCss;
}

// Add logo classes if not present
const adminLogoCss = `
.logo-top-text {
  font-family: 'Raphael', 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  line-height: 1.1;
}

.logo-title-bhavan {
  font-family: 'Raphael', serif;
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: 0.02em;
}
`;

if (!adminCss.includes('.logo-title-bhavan')) {
  adminCss += '\n' + adminLogoCss;
}

fs.writeFileSync(adminCssPath, adminCss, 'utf8');
console.log('✅ Updated admin/css/admin.css with @font-face and logo classes');

// 2. Update admin/index.html header
const adminIndexPath = path.join(projectRoot, 'admin', 'index.html');
let adminIndexHtml = fs.readFileSync(adminIndexPath, 'utf8');

const oldSidebarHeaderPattern = /<div class="sidebar-header">\s*<img src="\.\.\/assets\/images\/bvb-manvila-logo\.png" alt="BVB Logo" class="sidebar-logo">\s*<div>\s*<div class="sidebar-brand-title">BHAVAN'S MANVILA<\/div>\s*<div class="sidebar-brand-sub">CONTROL CENTER<\/div>\s*<\/div>\s*<\/div>/;

const newSidebarHeaderHtml = `<div class="sidebar-header">
        <img src="../assets/images/bvb-manvila-logo.png" alt="BVB Logo" class="sidebar-logo">
        <div class="header-logo-text">
          <span class="logo-top-text" style="color: #FFFFFF; font-size: 0.8rem;">Bharatiya Vidya</span>
          <span class="logo-title-bhavan" style="color: var(--color-accent-gold, #F5B942); font-size: 1.5rem;">Bhavan</span>
          <span class="sidebar-brand-sub" style="font-size: 0.625rem; letter-spacing: 0.06em;">MANVILA CONTROL CENTER</span>
        </div>
      </div>`;

if (oldSidebarHeaderPattern.test(adminIndexHtml)) {
  adminIndexHtml = adminIndexHtml.replace(oldSidebarHeaderPattern, newSidebarHeaderHtml);
  fs.writeFileSync(adminIndexPath, adminIndexHtml, 'utf8');
  console.log('✅ Updated sidebar logo header in admin/index.html');
} else {
  // Regex fallback
  adminIndexHtml = adminIndexHtml.replace(/<div class="sidebar-header">[\s\S]*?<\/div>\s*<\/div>/, newSidebarHeaderHtml);
  fs.writeFileSync(adminIndexPath, adminIndexHtml, 'utf8');
  console.log('✅ Updated sidebar logo header in admin/index.html (fallback)');
}

// 3. Update admin/login.html header
const adminLoginPath = path.join(projectRoot, 'admin', 'login.html');
let adminLoginHtml = fs.readFileSync(adminLoginPath, 'utf8');

const oldLoginHeaderPattern = /<div class="login-header">\s*<img src="\.\.\/assets\/images\/bvb-manvila-logo\.png" alt="BVB Manvila Logo" class="login-logo">\s*<h1 class="login-title">INSTITUTIONAL CONTROL PANEL<\/h1>\s*<p class="login-subtitle">Bhavan's Vivekananda Vidya Mandir, Manvila<\/p>\s*<\/div>/;

const newLoginHeaderHtml = `<div class="login-header">
        <img src="../assets/images/bvb-manvila-logo.png" alt="BVB Manvila Logo" class="login-logo">
        <div class="header-logo-text" style="align-items: center;">
          <span class="logo-top-text" style="font-size: 1rem; color: var(--color-deep-blue);">Bharatiya Vidya</span>
          <span class="logo-title-bhavan" style="font-size: 2.3rem; color: var(--color-primary-blue, #0B4EA2);">Bhavan</span>
          <span class="logo-sub" style="margin-top: 4px; font-size: 0.725rem; font-weight: 700; color: var(--color-text-secondary); letter-spacing: 0.08em;">MANVILA, THIRUVANANTHAPURAM • CONTROL CENTER</span>
        </div>
      </div>`;

if (oldLoginHeaderPattern.test(adminLoginHtml)) {
  adminLoginHtml = adminLoginHtml.replace(oldLoginHeaderPattern, newLoginHeaderHtml);
  fs.writeFileSync(adminLoginPath, adminLoginHtml, 'utf8');
  console.log('✅ Updated header in admin/login.html');
} else {
  adminLoginHtml = adminLoginHtml.replace(/<div class="login-header">[\s\S]*?<\/div>/, newLoginHeaderHtml);
  fs.writeFileSync(adminLoginPath, adminLoginHtml, 'utf8');
  console.log('✅ Updated header in admin/login.html (fallback)');
}

console.log('=== Raphael Font & Bharatiya Vidya Bhavan Title Applied to Admin Panel ===');
