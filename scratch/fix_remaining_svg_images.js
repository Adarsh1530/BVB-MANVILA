const fs = require('fs');
const path = require('path');

const dirs = [
  'c:/xampp/htdocs/BVB MANVILA',
  'C:/Users/KEERTHI ADARSH M P/Desktop/BVB_MANVILA_cPanel_Upload'
];

dirs.forEach(baseDir => {
  if (!fs.existsSync(baseDir)) return;

  // 1. index.html
  const indexPath = path.join(baseDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');

    // Fix ACADEMIC ENVIRONMENT image
    html = html.replace(
      '<img src="assets/images/campus/science-labs.svg" alt="Modern Science Laboratory at Bhavan\'s Manvila" style="width: 100%; height: auto;">',
      '<img src="assets/images/campus/pdf_extracted/pdf_img_2.jpg" alt="Modern Science Laboratory at Bhavan\'s Manvila" style="width: 100%; height: auto; max-height: 420px; object-fit: cover; border-radius: var(--radius-xl); box-shadow: var(--shadow-lg);">'
    );

    // Fix Sports image
    html = html.replace(
      '<img src="assets/images/campus/sports.svg" alt="Annual Sports Meet Athletics & Basketball" loading="lazy">',
      '<img src="assets/images/events/cultural-fest.jpg" alt="Annual Sports Meet Athletics & Basketball" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">'
    );

    fs.writeFileSync(indexPath, html, 'utf8');
    console.log(`Fixed index.html SVG image placeholders in ${baseDir}`);
  }

  // 2. events.html
  const eventsPath = path.join(baseDir, 'events.html');
  if (fs.existsSync(eventsPath)) {
    let html = fs.readFileSync(eventsPath, 'utf8');
    html = html.replace(
      '<img src="assets/images/campus/sports.svg" alt="Annual Sports Meet">',
      '<img src="assets/images/events/cultural-fest.jpg" alt="Annual Sports Meet" style="width: 100%; height: 100%; object-fit: cover;">'
    );
    fs.writeFileSync(eventsPath, html, 'utf8');
    console.log(`Fixed events.html SVG image placeholders in ${baseDir}`);
  }

  // 3. gallery.html
  const galleryPath = path.join(baseDir, 'gallery.html');
  if (fs.existsSync(galleryPath)) {
    let html = fs.readFileSync(galleryPath, 'utf8');
    html = html.replace(
      '<img src="assets/images/campus/sports.svg" alt="Athletics & Sports Meet" loading="lazy">',
      '<img src="assets/images/events/cultural-fest.jpg" alt="Athletics & Sports Meet" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">'
    );
    fs.writeFileSync(galleryPath, html, 'utf8');
    console.log(`Fixed gallery.html SVG image placeholders in ${baseDir}`);
  }
});
