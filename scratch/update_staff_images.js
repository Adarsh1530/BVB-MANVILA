const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\xampp\\htdocs\\BVB MANVILA';
const staffsDir = path.join(projectRoot, 'staffs');
const targetLeadershipDir = path.join(projectRoot, 'assets', 'images', 'leadership');

if (!fs.existsSync(targetLeadershipDir)) {
  fs.mkdirSync(targetLeadershipDir, { recursive: true });
}

console.log('=== Copying Official Staff & Leadership Images ===');

const files = fs.readdirSync(staffsDir);

files.forEach(file => {
  const lower = file.toLowerCase();
  const src = path.join(staffsDir, file);

  if (lower.includes('balakrishnan') || lower.includes('chairman')) {
    const dest = path.join(targetLeadershipDir, 'chairman.jpg');
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied Chairman photo (${file}) -> assets/images/leadership/chairman.jpg`);
  } else if (lower.includes('srinivasan') || lower.includes('secretary')) {
    const dest = path.join(targetLeadershipDir, 'secretary.jpg');
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied Secretary photo (${file}) -> assets/images/leadership/secretary.jpg`);
  } else if (lower.includes('deepa') || lower.includes('principal')) {
    const dest = path.join(targetLeadershipDir, 'principal.jpg');
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied Principal photo (${file}) -> assets/images/leadership/principal.jpg`);
  }
});

console.log('=== Staff & Leadership Image Copy Complete ===');
