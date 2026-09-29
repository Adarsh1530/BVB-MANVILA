const fs = require('fs');
const path = require('path');

const backupBase = 'C:\\Users\\KEERTHI ADARSH M P\\Desktop\\bvb mva backup';

const dirsToCreate = [
  path.join(backupBase, 'mandatory disclosure'),
  path.join(backupBase, 'latest notices'),
  path.join(backupBase, 'entrance popup'),
  path.join(backupBase, 'gallery and auto slides')
];

dirsToCreate.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

const projectRoot = 'c:\\xampp\\htdocs\\BVB MANVILA';

function copyFileIfExists(src, destDir, newName = null) {
  if (fs.existsSync(src)) {
    const filename = newName || path.basename(src);
    const dest = path.join(destDir, filename);
    fs.copyFileSync(src, dest);
    console.log(`Backed up: ${path.basename(src)} -> ${dest}`);
  } else {
    console.log(`Source not found: ${src}`);
  }
}

// 1. Mandatory Disclosure files
const mandatoryDir = path.join(backupBase, 'mandatory disclosure');

// Look in images/Mandatory Disclosure/
const docDirB = path.join(projectRoot, 'images', 'Mandatory Disclosure', 'B. DOCUMENTS AND INFORMATION');
if (fs.existsSync(docDirB)) {
  fs.readdirSync(docDirB).forEach(f => {
    copyFileIfExists(path.join(docDirB, f), mandatoryDir);
  });
}

const docDirC = path.join(projectRoot, 'images', 'Mandatory Disclosure', 'C. RESULT AND ACADEMICS');
if (fs.existsSync(docDirC)) {
  fs.readdirSync(docDirC).forEach(f => {
    copyFileIfExists(path.join(docDirC, f), mandatoryDir);
  });
}

// Look in assets/documents/mandatory-disclosure/
const assetsDocDir = path.join(projectRoot, 'assets', 'documents', 'mandatory-disclosure');
if (fs.existsSync(assetsDocDir)) {
  fs.readdirSync(assetsDocDir).forEach(f => {
    copyFileIfExists(path.join(assetsDocDir, f), mandatoryDir);
  });
}

// 2. Latest Notices files
const noticesDir = path.join(backupBase, 'latest notices');
// Copy notice PDFs/CSVs
if (fs.existsSync(assetsDocDir)) {
  fs.readdirSync(assetsDocDir).forEach(f => {
    copyFileIfExists(path.join(assetsDocDir, f), noticesDir);
  });
}

// 3. Entrance Popup images
const popupDir = path.join(backupBase, 'entrance popup');
const mainPopupDir = path.join(projectRoot, 'images', 'main page popup');
if (fs.existsSync(mainPopupDir)) {
  fs.readdirSync(mainPopupDir).forEach(f => {
    copyFileIfExists(path.join(mainPopupDir, f), popupDir);
  });
}

// 4. Gallery and Auto Slides
const galleryDir = path.join(backupBase, 'gallery and auto slides');
const eventsDir = path.join(projectRoot, 'images', 'events');
if (fs.existsSync(eventsDir)) {
  fs.readdirSync(eventsDir).forEach(f => {
    copyFileIfExists(path.join(eventsDir, f), galleryDir);
  });
}
const campusDir = path.join(projectRoot, 'images', 'campus');
if (fs.existsSync(campusDir)) {
  fs.readdirSync(campusDir).forEach(f => {
    copyFileIfExists(path.join(campusDir, f), galleryDir);
  });
}

console.log('--- Backup Completed Successfully ---');
