const fs = require('fs');
const path = require('path');

const pdfMap = [
  { src: 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/AFFILIATION LETTER.pdf', dest: 'uploads/mandatory_disclosures/CBSE-Affiliation-Extension.pdf' },
  { src: 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/TRUST.pdf', dest: 'uploads/mandatory_disclosures/Trust-Registration.pdf' },
  { src: 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/NOC.pdf', dest: 'uploads/mandatory_disclosures/Govt-NOC.pdf' },
  { src: 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/building-fitness.pdf', dest: 'uploads/mandatory_disclosures/Building-Safety-Certificate.pdf' },
  { src: 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/fire-safety.pdf', dest: 'uploads/mandatory_disclosures/Fire-Safety-Certificate.pdf' },
  { src: 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/DEO-certificate.pdf', dest: 'uploads/mandatory_disclosures/DEO-Certificate.pdf' },
  { src: 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/SANITATION.pdf', dest: 'uploads/mandatory_disclosures/Sanitation-Certificate.pdf' },
  { src: 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/Mandatory-Disclosure.pdf', dest: 'uploads/mandatory_disclosures/Mandatory-Disclosure.pdf' },
  { src: 'images/Mandatory Disclosure/C. RESULT AND ACADEMICS/Academic-Calendar.csv', dest: 'uploads/mandatory_disclosures/Academic-Calendar.csv' },
  { src: 'images/Mandatory Disclosure/C. RESULT AND ACADEMICS/pta.pdf', dest: 'uploads/mandatory_disclosures/Fee-Structure.pdf' }
];

pdfMap.forEach(m => {
  const srcPath = path.join(__dirname, '..', m.src);
  const destPath = path.join(__dirname, '..', m.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Successfully mapped & copied ${m.src} -> ${m.dest}`);
  }
});
