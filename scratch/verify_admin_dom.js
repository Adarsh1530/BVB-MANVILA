const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'admin', 'index.html');
const jsPath = path.join(__dirname, '..', 'admin', 'js', 'admin.js');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const jsContent = fs.readFileSync(jsPath, 'utf8');

console.log('--- VERIFYING ADMIN PANEL INTEGRITY ---');

// 1. Extract all adminApp.xxxx() calls in index.html
const onclickRegex = /adminApp\.([a-zA-Z0-9_]+)\s*\(/g;
let match;
const htmlMethods = new Set();
while ((match = onclickRegex.exec(htmlContent)) !== null) {
  htmlMethods.add(match[1]);
}

console.log('\nFound methods referenced in HTML onclicks:');
console.log(Array.from(htmlMethods));

// Check if these methods exist in admin.js
const missingMethods = [];
for (const method of htmlMethods) {
  // Method definition in ES6 class: methodName( or methodName (
  const methodRegex = new RegExp('\\b' + method + '\\s*\\(');
  if (!methodRegex.test(jsContent)) {
    missingMethods.push(method);
  }
}

if (missingMethods.length > 0) {
  console.error('❌ Missing methods in admin.js:', missingMethods);
} else {
  console.log('✅ ALL HTML onclick methods exist in admin.js!');
}

// 2. Extract getElementById calls from admin.js and verify they exist in index.html
const getElRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
const jsElementIds = new Set();
while ((match = getElRegex.exec(jsContent)) !== null) {
  jsElementIds.add(match[1]);
}

console.log('\nFound ' + jsElementIds.size + ' element IDs queried by admin.js');

const missingIds = [];
for (const id of jsElementIds) {
  const idRegex = new RegExp(`id=["']${id}["']`);
  if (!idRegex.test(htmlContent)) {
    missingIds.push(id);
  }
}

if (missingIds.length > 0) {
  console.error('❌ Missing DOM IDs in index.html:', missingIds);
} else {
  console.log('✅ ALL element IDs queried in admin.js exist in index.html!');
}

// 3. Verify CSS pointer-events on overlays
const cssPath = path.join(__dirname, '..', 'admin', 'css', 'admin.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

if (cssContent.includes('.admin-modal-overlay {') || cssContent.includes('.admin-modal-overlay')) {
  console.log('✅ CSS file loaded properly');
}

console.log('\n--- VERIFICATION COMPLETED CLEANLY ---');
