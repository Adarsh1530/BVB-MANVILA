const fs = require('fs');
const path = require('path');

const rootDir = 'c:/xampp/htdocs/BVB MANVILA';

const filesToUpdate = [
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
  'mandatory-disclosure.html',
  'admin/login.html'
];

let updatedCount = 0;

filesToUpdate.forEach(relPath => {
  const filePath = path.join(rootDir, relPath);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('MANVILA, THIRUVANANTHAPURAM')) {
    content = content.replace(/MANVILA,\s*THIRUVANANTHAPURAM/g, 'MANVILA, TVM');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${relPath}`);
    updatedCount++;
  }
});

console.log(`Finished updating ${updatedCount} files.`);
