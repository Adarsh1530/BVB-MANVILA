const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\xampp\\htdocs\\BVB MANVILA';

// 1. Update admin/js/admin.js
const adminJsPath = path.join(projectRoot, 'admin', 'js', 'admin.js');
let adminJs = fs.readFileSync(adminJsPath, 'utf8');

adminJs = adminJs.replace(
  /fetch\('\.\.\/api\/get_site_data\.php'\)/g,
  "fetch('../api/get_site_data.php?t=' + Date.now())"
).replace(
  /fetch\('api\/get_site_data\.php'\)/g,
  "fetch('api/get_site_data.php?t=' + Date.now())"
).replace(
  /fetch\('\/api\/get_site_data\.php'\)/g,
  "fetch('/api/get_site_data.php?t=' + Date.now())"
).replace(
  /fetch\('\.\.\/api\/get_site_data\.json'\)/g,
  "fetch('../api/get_site_data.json?t=' + Date.now())"
).replace(
  /fetch\('api\/get_site_data\.json'\)/g,
  "fetch('api/get_site_data.json?t=' + Date.now())"
).replace(
  /fetch\('\/api\/get_site_data\.json'\)/g,
  "fetch('/api/get_site_data.json?t=' + Date.now())"
);

fs.writeFileSync(adminJsPath, adminJs, 'utf8');
console.log('✅ Updated admin/js/admin.js with fetch cache-busting');

// 2. Update js/dynamic-sections.js
const dynamicJsPath = path.join(projectRoot, 'js', 'dynamic-sections.js');
let dynamicJs = fs.readFileSync(dynamicJsPath, 'utf8');

dynamicJs = dynamicJs.replace(
  /fetch\('api\/get_site_data\.php'\)/g,
  "fetch('api/get_site_data.php?t=' + Date.now())"
).replace(
  /fetch\('api\/get_site_data\.json'\)/g,
  "fetch('api/get_site_data.json?t=' + Date.now())"
);

fs.writeFileSync(dynamicJsPath, dynamicJs, 'utf8');
console.log('✅ Updated js/dynamic-sections.js with fetch cache-busting');

// 3. Update js/popup-ticker.js
const popupJsPath = path.join(projectRoot, 'js', 'popup-ticker.js');
let popupJs = fs.readFileSync(popupJsPath, 'utf8');

popupJs = popupJs.replace(
  /fetch\('api\/get_site_data\.php'\)/g,
  "fetch('api/get_site_data.php?t=' + Date.now())"
).replace(
  /fetch\('api\/get_site_data\.json'\)/g,
  "fetch('api/get_site_data.json?t=' + Date.now())"
);

fs.writeFileSync(popupJsPath, popupJs, 'utf8');
console.log('✅ Updated js/popup-ticker.js with fetch cache-busting');
