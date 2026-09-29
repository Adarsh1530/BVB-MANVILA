const fs = require('fs');
const path = require('path');

const mappings = [
  // Mandatory Disclosures
  { src: 'assets/documents/mandatory-disclosure/CBSE-Affiliation-Extension.pdf', dest: 'uploads/mandatory_disclosures/CBSE-Affiliation-Extension.pdf' },
  { src: 'assets/documents/mandatory-disclosure/Trust-Registration.pdf', dest: 'uploads/mandatory_disclosures/Trust-Registration.pdf' },
  { src: 'assets/documents/mandatory-disclosure/Govt-NOC.pdf', dest: 'uploads/mandatory_disclosures/Govt-NOC.pdf' },
  { src: 'assets/documents/mandatory-disclosure/RTE-Recognition.pdf', dest: 'uploads/mandatory_disclosures/RTE-Recognition.pdf' },
  { src: 'assets/documents/mandatory-disclosure/Building-Safety-Certificate.pdf', dest: 'uploads/mandatory_disclosures/Building-Safety-Certificate.pdf' },
  { src: 'assets/documents/mandatory-disclosure/Fire-Safety-Certificate.pdf', dest: 'uploads/mandatory_disclosures/Fire-Safety-Certificate.pdf' },
  { src: 'assets/documents/mandatory-disclosure/DEO-Certificate.pdf', dest: 'uploads/mandatory_disclosures/DEO-Certificate.pdf' },
  { src: 'assets/documents/mandatory-disclosure/Sanitation-Certificate.pdf', dest: 'uploads/mandatory_disclosures/Sanitation-Certificate.pdf' },
  { src: 'assets/documents/mandatory-disclosure/Mandatory-Disclosure.pdf', dest: 'uploads/mandatory_disclosures/Mandatory-Disclosure.pdf' },
  { src: 'assets/documents/mandatory-disclosure/Fee-Structure.pdf', dest: 'uploads/mandatory_disclosures/Fee-Structure.pdf' },
  { src: 'assets/documents/mandatory-disclosure/Academic-Calendar.csv', dest: 'uploads/mandatory_disclosures/Academic-Calendar.csv' },

  // Notices
  { src: 'assets/documents/mandatory-disclosure/Mandatory-Disclosure.pdf', dest: 'uploads/notices/Mandatory-Disclosure.pdf' },
  { src: 'assets/documents/mandatory-disclosure/Academic-Calendar.csv', dest: 'uploads/notices/Academic-Calendar.csv' },

  // Gallery
  { src: 'assets/images/events/school-parliament.jpg', dest: 'uploads/gallery/school-parliament.jpg' },
  { src: 'assets/images/events/adharva-fest.jpg', dest: 'uploads/gallery/adharva-fest.jpg' },
  { src: 'assets/images/events/investiture-1.jpg', dest: 'uploads/gallery/investiture-1.jpg' },
  { src: 'assets/images/events/investiture-2.jpg', dest: 'uploads/gallery/investiture-2.jpg' },
  { src: 'assets/images/events/investiture-oath.jpg', dest: 'uploads/gallery/investiture-oath.jpg' },
  { src: 'assets/images/events/cultural-fest.jpg', dest: 'uploads/gallery/cultural-fest.jpg' },

  // Auto Slides
  { src: 'assets/images/campus/campus-view.jpg', dest: 'uploads/auto_slides/campus-view.jpg' },
  { src: 'assets/images/events/investiture-1.jpg', dest: 'uploads/auto_slides/investiture-1.jpg' },
  { src: 'assets/images/events/investiture-2.jpg', dest: 'uploads/auto_slides/investiture-2.jpg' },
  { src: 'assets/images/events/investiture-oath.jpg', dest: 'uploads/auto_slides/investiture-oath.jpg' },
  { src: 'assets/images/events/cultural-fest.jpg', dest: 'uploads/auto_slides/cultural-fest.jpg' },

  // Popup
  { src: 'images/main page popup/1.jpg', dest: 'uploads/popup/popup-1.jpg' }
];

mappings.forEach(m => {
  const srcPath = path.join(__dirname, '..', m.src);
  const destPath = path.join(__dirname, '..', m.dest);
  
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied ${m.src} -> ${m.dest}`);
  } else {
    // If source file not found, check fallback in images/Mandatory Disclosure/
    console.log(`⚠️ Source file missing: ${m.src}`);
  }
});
