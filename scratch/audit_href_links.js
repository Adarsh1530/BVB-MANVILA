const fs = require('fs');
const path = require('path');

const rootDir = 'c:/xampp/htdocs/BVB MANVILA';

const htmlFiles = [
  'index.html',
  'about.html',
  'academics.html',
  'admissions.html',
  'campus.html',
  'student-life.html',
  'achievements.html',
  'events.html',
  'gallery.html',
  'leadership.html',
  'contact.html',
  'mandatory-disclosure.html',
  'admin/index.html',
  'admin/login.html'
];

let totalHrefChecked = 0;
let brokenHrefCount = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  // Match all href="..." attributes
  const hrefRegex = /href=["']([^"']+)["']/g;
  let match;

  while ((match = hrefRegex.exec(content)) !== null) {
    let href = match[1];
    totalHrefChecked++;

    // Skip javascript:, mailto:, tel:, external URLs, or empty/hash-only anchors
    if (
      href.startsWith('javascript:') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href === '#' ||
      href.startsWith('#')
    ) {
      continue;
    }

    // Handle relative file path (strip anchor if present)
    const pageTarget = href.split('#')[0];
    if (!pageTarget) continue;

    const fileDir = path.dirname(filePath);
    const resolvedPath = path.resolve(fileDir, pageTarget);

    if (!fs.existsSync(resolvedPath)) {
      console.log(`[BROKEN HREF LINK] File: ${file} | href: "${href}" | resolved: "${resolvedPath}"`);
      brokenHrefCount++;
    }
  }
});

console.log(`\nHref Audit Complete: Checked ${totalHrefChecked} href link references. Found ${brokenHrefCount} broken internal page link(s).`);
