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

let totalSrcChecked = 0;
let missingCount = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  // Match all src="..." attributes
  const srcRegex = /src=["']([^"']+)["']/g;
  let match;

  while ((match = srcRegex.exec(content)) !== null) {
    let src = match[1];
    totalSrcChecked++;

    // Skip data URIs or external HTTP URLs
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
      continue;
    }

    // Resolve relative path based on file location
    const fileDir = path.dirname(filePath);
    const resolvedPath = path.resolve(fileDir, src);

    if (!fs.existsSync(resolvedPath)) {
      console.log(`[MISSING IMAGE] File: ${file} | src: "${src}" | resolved: "${resolvedPath}"`);
      missingCount++;
    }
  }
});

console.log(`\nAudit Complete: Checked ${totalSrcChecked} image src references. Found ${missingCount} missing image file(s).`);
