const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\xampp\\htdocs\\BVB MANVILA';

console.log('=== Applying Raphael Font & Bharatiya Vidya Bhavan Title ===');

// 1. Copy font file
const srcFont = path.join(projectRoot, 'raphael.ttf');
const fontsDir = path.join(projectRoot, 'assets', 'fonts');
const destFont = path.join(fontsDir, 'raphael.ttf');

if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

if (fs.existsSync(srcFont)) {
  fs.copyFileSync(srcFont, destFont);
  console.log('✅ Copied raphael.ttf to assets/fonts/raphael.ttf');
} else {
  console.error('❌ Source font raphael.ttf not found at:', srcFont);
}

// 2. Update css/main.css with @font-face and header logo classes
const cssPath = path.join(projectRoot, 'css', 'main.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const fontFaceCss = `@font-face {
  font-family: 'Raphael';
  src: url('../assets/fonts/raphael.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
`;

if (!cssContent.includes("font-family: 'Raphael'")) {
  cssContent = fontFaceCss + '\n' + cssContent;
}

// Update header logo CSS
const newHeaderLogoCss = `.header-logo-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1;
}

.logo-top-text {
  font-family: 'Raphael', 'Plus Jakarta Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-deep-blue);
  letter-spacing: 0.02em;
  line-height: 1.1;
}

.logo-title-bhavan {
  font-family: 'Raphael', serif;
  font-size: 1.95rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 0.95;
  margin-top: 1px;
  margin-bottom: 2px;
  letter-spacing: 0.02em;
}

.logo-sub {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1.1;
  white-space: nowrap;
}`;

cssContent = cssContent.replace(/\.header-logo-text\s*\{[\s\S]*?\.logo-sub\s*\{[\s\S]*?\}/, newHeaderLogoCss);

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('✅ Updated css/main.css with @font-face and logo styling');

// 3. Update all HTML files with the new logo structure
const htmlFiles = [
  'index.html',
  'about.html',
  'academics.html',
  'events.html',
  'gallery.html',
  'campus.html',
  'student-life.html',
  'achievements.html',
  'admissions.html',
  'leadership.html',
  'contact.html',
  'mandatory-disclosure.html'
];

const targetOldHtmlPattern = /<div class="header-logo-text">\s*<span class="logo-title">BHAVAN'S VIVEKANANDA VIDYA MANDIR<\/span>\s*<span class="logo-sub">MANVILA, THIRUVANANTHAPURAM • CBSE AFFILIATED<\/span>\s*<\/div>/g;

const newHeaderLogoHtml = `<div class="header-logo-text">
          <span class="logo-top-text">Bharatiya Vidya</span>
          <span class="logo-title-bhavan">Bhavan</span>
          <span class="logo-sub">MANVILA, THIRUVANANTHAPURAM • CBSE AFFILIATED</span>
        </div>`;

htmlFiles.forEach(fileName => {
  const filePath = path.join(projectRoot, fileName);
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    if (html.includes('<span class="logo-title">BHAVAN\'S VIVEKANANDA VIDYA MANDIR</span>')) {
      html = html.replace(targetOldHtmlPattern, newHeaderLogoHtml);
      fs.writeFileSync(filePath, html, 'utf8');
      console.log(`✅ Updated header logo text in ${fileName}`);
    } else {
      // General replacement
      html = html.replace(/<div class="header-logo-text">[\s\S]*?<\/div>/, newHeaderLogoHtml);
      fs.writeFileSync(filePath, html, 'utf8');
      console.log(`✅ Updated header logo text in ${fileName} (fallback replacement)`);
    }
  }
});

console.log('=== Raphael Font & Bharatiya Vidya Bhavan Title Applied ===');
