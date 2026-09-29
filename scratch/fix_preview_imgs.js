const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

// Replace any img tag that has id starting with subPreview or batchPrev
html = html.replace(/<img\s+([^>]*?)id=["'](subPreview\d+|batchPrev\d+)["']([^>]*?)>/g, (match) => {
  if (match.includes('onerror')) return match;
  return match.replace('>', ' onerror="this.onerror=null; this.src=\'../assets/images/bvb-manvila-logo.png\';">');
});

fs.writeFileSync('admin/index.html', html, 'utf8');
console.log('Successfully updated index.html preview image onerror handlers.');
