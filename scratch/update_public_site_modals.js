const fs = require('fs');
const path = require('path');

const dirs = [
  'c:/xampp/htdocs/BVB MANVILA',
  'C:/Users/KEERTHI ADARSH M P/Desktop/BVB_MANVILA_cPanel_Upload'
];

dirs.forEach(baseDir => {
  if (!fs.existsSync(baseDir)) return;

  const indexPath = path.join(baseDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');

    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="Annual Day" style="border-radius: var(--radius-md); margin-bottom: 1rem; width: 100%;">',
      '<img src="assets/images/events/cultural-fest.jpg" alt="Annual Day" style="border-radius: var(--radius-md); margin-bottom: 1rem; width: 100%; max-height: 320px; object-fit: cover;">'
    );

    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="Cultural Fest" style="border-radius: var(--radius-md); margin-bottom: 1rem; width: 100%;">',
      '<img src="assets/images/events/cultural-fest.jpg" alt="Cultural Fest" style="border-radius: var(--radius-md); margin-bottom: 1rem; width: 100%; max-height: 320px; object-fit: cover;">'
    );

    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="Adharva Fest" style="border-radius: var(--radius-md); margin-bottom: 1rem; width: 100%;">',
      '<img src="assets/images/events/adharva-fest.jpg" alt="Adharva Fest" style="border-radius: var(--radius-md); margin-bottom: 1rem; width: 100%; max-height: 320px; object-fit: cover;">'
    );

    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="Investiture Ceremony" style="border-radius: var(--radius-md); margin-bottom: 1rem; width: 100%;">',
      '<img src="assets/images/events/investiture-1.jpg" alt="Investiture Ceremony" style="border-radius: var(--radius-md); margin-bottom: 1rem; width: 100%; max-height: 320px; object-fit: cover;">'
    );

    fs.writeFileSync(indexPath, html, 'utf8');
    console.log(`Successfully updated public website modal images in ${baseDir}/index.html`);
  }
});
