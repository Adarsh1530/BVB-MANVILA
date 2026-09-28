const fs = require('fs');
const path = require('path');

const subfolders = [
  'auto_slides',
  'gallery',
  'mandatory_disclosures',
  'notices',
  'popup'
];

const baseDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

subfolders.forEach(folder => {
  const dir = path.join(baseDir, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const gitkeep = path.join(dir, '.gitkeep');
  if (!fs.existsSync(gitkeep)) {
    fs.writeFileSync(gitkeep, '');
  }
  console.log(`✅ Created directory uploads/${folder}`);
});
