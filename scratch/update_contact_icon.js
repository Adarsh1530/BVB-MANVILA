const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'academics.html',
  'achievements.html',
  'admissions.html',
  'campus.html',
  'contact.html',
  'events.html',
  'gallery.html',
  'leadership.html',
  'mandatory-disclosure.html',
  'student-life.html'
];

const oldClockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>';
const newPhoneSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';

files.forEach(fileName => {
  const filePath = path.join(__dirname, '..', fileName);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(oldClockSvg)) {
      content = content.replace(oldClockSvg, newPhoneSvg);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated CONTACT icon in ${fileName}`);
    } else {
      console.log(`⚠️ Clock SVG pattern not found in ${fileName}, checking regex...`);
      // Try regex replacement near CONTACT
      const regex = /<svg[^>]*>.*?<\/svg>\s*<span>CONTACT<\/span>/s;
      if (regex.test(content)) {
        content = content.replace(regex, `${newPhoneSvg}\n      <span>CONTACT</span>`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated CONTACT icon via regex in ${fileName}`);
      }
    }
  }
});
