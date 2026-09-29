const fs = require('fs');
const jsPath = 'admin/js/admin.js';
const jsContent = fs.readFileSync(jsPath, 'utf8');

const getElRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const lines = jsContent.split('\n');

console.log('--- CHECKING GETELEMENTBYID USAGES ---');
lines.forEach((line, idx) => {
  if (line.includes('document.getElementById(')) {
    // Check if line accesses .value or .innerHTML or .style directly on getElementById without null check or variable storage
    if (line.match(/document\.getElementById\('[^']+'\)\.(value|innerHTML|style|classList|getAttribute|addEventListener|focus)/)) {
      console.log(`Line ${idx + 1}: Direct property access: ${line.trim()}`);
    }
  }
});
