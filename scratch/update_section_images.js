const fs = require('fs');
const path = require('path');

const dirs = [
  'c:/xampp/htdocs/BVB MANVILA',
  'C:/Users/KEERTHI ADARSH M P/Desktop/BVB_MANVILA_cPanel_Upload'
];

dirs.forEach(baseDir => {
  if (!fs.existsSync(baseDir)) return;

  console.log(`Processing directory: ${baseDir}`);

  // 1. about.html
  const aboutPath = path.join(baseDir, 'about.html');
  if (fs.existsSync(aboutPath)) {
    let html = fs.readFileSync(aboutPath, 'utf8');
    // AN ADVENTURE IN FAITH image
    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="BVB Manvila Campus View">',
      '<img src="assets/images/campus/campus-view.jpg" alt="BVB Manvila Campus View" style="width: 100%; border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); object-fit: cover;">'
    );
    // A Campus for Discovery image
    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="A Campus for Discovery" style="width: 100%; border-radius: 12px; box-shadow: var(--shadow-md); border: 2px solid var(--color-border); object-fit: cover; max-height: 280px;">',
      '<img src="assets/images/campus/campus-view.jpg" alt="A Campus for Discovery" style="width: 100%; border-radius: 12px; box-shadow: var(--shadow-md); border: 2px solid var(--color-border); object-fit: cover; max-height: 280px;">'
    );
    fs.writeFileSync(aboutPath, html, 'utf8');
    console.log(`Updated about.html in ${baseDir}`);
  }

  // 2. campus.html
  const campusPath = path.join(baseDir, 'campus.html');
  if (fs.existsSync(campusPath)) {
    let html = fs.readFileSync(campusPath, 'utf8');
    // A SANCTUARY OF NATURE & LEARNING image
    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="Manvila Campus Grounds" style="border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); width: 100%;">',
      '<img src="assets/images/campus/campus-view.jpg" alt="Manvila Campus Grounds" style="border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); width: 100%; object-fit: cover;">'
    );
    // A Campus for Discovery image
    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="A Campus for Discovery" style="width: 100%; border-radius: 12px; box-shadow: var(--shadow-md); border: 2px solid var(--color-border); object-fit: cover; max-height: 280px;">',
      '<img src="assets/images/campus/campus-view.jpg" alt="A Campus for Discovery" style="width: 100%; border-radius: 12px; box-shadow: var(--shadow-md); border: 2px solid var(--color-border); object-fit: cover; max-height: 280px;">'
    );
    fs.writeFileSync(campusPath, html, 'utf8');
    console.log(`Updated campus.html in ${baseDir}`);
  }

  // 3. academics.html
  const academicsPath = path.join(baseDir, 'academics.html');
  if (fs.existsSync(academicsPath)) {
    let html = fs.readFileSync(academicsPath, 'utf8');
    // INNOVATION IN TEACHING image
    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="Academic Environment & Smart Labs" style="border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); width: 100%; max-height: 380px; object-fit: cover;">',
      '<img src="assets/images/campus/pdf_extracted/pdf_img_2.jpg" alt="Academic Environment & Smart Labs" style="border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); width: 100%; max-height: 380px; object-fit: cover;">'
    );
    fs.writeFileSync(academicsPath, html, 'utf8');
    console.log(`Updated academics.html in ${baseDir}`);
  }

  // 4. student-life.html
  const studentLifePath = path.join(baseDir, 'student-life.html');
  if (fs.existsSync(studentLifePath)) {
    let html = fs.readFileSync(studentLifePath, 'utf8');
    // SCHOOL PARLIAMENT & LEADERSHIP
    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="BVB Manvila School Parliament" style="border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); width: 100%;">',
      '<img src="assets/images/events/school-parliament.jpg" alt="BVB Manvila School Parliament" style="border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); width: 100%; object-fit: cover;">'
    );
    // TRADITIONS & CELEBRATIONS
    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="Adharva Fest Dance" style="width: 100%; height: 100%; object-fit: cover;">',
      '<img src="assets/images/student-life/adharva-dance.jpg" alt="Adharva Fest Dance" style="width: 100%; height: 100%; object-fit: cover;">'
    );
    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="Bhavanotsav Cultural Fest" style="width: 100%; height: 100%; object-fit: cover;">',
      '<img src="assets/images/events/cultural-fest.jpg" alt="Bhavanotsav Cultural Fest" style="width: 100%; height: 100%; object-fit: cover;">'
    );
    html = html.replace(
      '<img src="assets/images/bvb-manvila-logo.png" alt="Investiture and Merit Day" style="width: 100%; height: 100%; object-fit: cover;">',
      '<img src="assets/images/student-life/investiture-awards.jpg" alt="Investiture and Merit Day" style="width: 100%; height: 100%; object-fit: cover;">'
    );
    fs.writeFileSync(studentLifePath, html, 'utf8');
    console.log(`Updated student-life.html in ${baseDir}`);
  }

  // 5. events.html
  const eventsPath = path.join(baseDir, 'events.html');
  if (fs.existsSync(eventsPath)) {
    let html = fs.readFileSync(eventsPath, 'utf8');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Annual Day">', '<img src="assets/images/events/cultural-fest.jpg" alt="Annual Day">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="All Kerala Bhavan\'s Fest">', '<img src="assets/images/events/cultural-fest.jpg" alt="All Kerala Bhavan\'s Fest">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Adharva Fest">', '<img src="assets/images/events/adharva-fest.jpg" alt="Adharva Fest">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Investiture Ceremony">', '<img src="assets/images/events/investiture-1.jpg" alt="Investiture Ceremony">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Onam Celebrations">', '<img src="assets/images/events/cultural-fest.jpg" alt="Onam Celebrations">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="School Parliament Election">', '<img src="assets/images/events/school-parliament.jpg" alt="School Parliament Election">');
    fs.writeFileSync(eventsPath, html, 'utf8');
    console.log(`Updated events.html in ${baseDir}`);
  }

  // 6. gallery.html
  const galleryPath = path.join(baseDir, 'gallery.html');
  if (fs.existsSync(galleryPath)) {
    let html = fs.readFileSync(galleryPath, 'utf8');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Investiture Ceremony Grand Stage" loading="lazy">', '<img src="assets/images/events/investiture-1.jpg" alt="Investiture Ceremony Grand Stage" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Elected School Parliament Cabinet" loading="lazy">', '<img src="assets/images/events/school-parliament.jpg" alt="Elected School Parliament Cabinet" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Adharva Inter-School Fest" loading="lazy">', '<img src="assets/images/events/adharva-fest.jpg" alt="Adharva Inter-School Fest" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Classical Dance Drama" loading="lazy">', '<img src="assets/images/student-life/adharva-dance.jpg" alt="Classical Dance Drama" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Investiture Oath Taking" loading="lazy">', '<img src="assets/images/events/investiture-oath.jpg" alt="Investiture Oath Taking" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="All Kerala Bhavan\'s Fest" loading="lazy">', '<img src="assets/images/events/cultural-fest.jpg" alt="All Kerala Bhavan\'s Fest" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Manvila Campus Facade" loading="lazy">', '<img src="assets/images/campus/campus-view.jpg" alt="Manvila Campus Facade" loading="lazy">');
    fs.writeFileSync(galleryPath, html, 'utf8');
    console.log(`Updated gallery.html in ${baseDir}`);
  }

  // 7. index.html
  const indexPath = path.join(baseDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Bhavan\'s Vivekananda Vidya Mandir Manvila Main Building">', '<img src="assets/images/campus/campus-view.jpg" alt="Bhavan\'s Vivekananda Vidya Mandir Manvila Main Building">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Bhavan\'s Manvila Campus Grounds & Assembly">', '<img src="assets/images/events/fest-crowd.jpg" alt="Bhavan\'s Manvila Campus Grounds & Assembly">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Academic Block & Campus View">', '<img src="assets/images/campus/campus-view.jpg" alt="Academic Block & Campus View">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Investiture Ceremony and Student Leadership">', '<img src="assets/images/events/investiture-1.jpg" alt="Investiture Ceremony and Student Leadership">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="All Kerala Bhavan\'s Cultural Fest">', '<img src="assets/images/events/cultural-fest.jpg" alt="All Kerala Bhavan\'s Cultural Fest">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Bhavan\'s Vivekananda Vidya Mandir School Campus Building">', '<img src="assets/images/campus/campus-view.jpg" alt="Bhavan\'s Vivekananda Vidya Mandir School Campus Building">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Annual Day Celebration at Bhavan\'s Manvila">', '<img src="assets/images/events/cultural-fest.jpg" alt="Annual Day Celebration at Bhavan\'s Manvila">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="All Kerala Bhavan\'s Cultural Fest">', '<img src="assets/images/events/cultural-fest.jpg" alt="All Kerala Bhavan\'s Cultural Fest">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Adharva Inter School Fest">', '<img src="assets/images/events/adharva-fest.jpg" alt="Adharva Inter School Fest">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Investiture Ceremony and School Parliament">', '<img src="assets/images/events/investiture-1.jpg" alt="Investiture Ceremony and School Parliament">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Investiture Ceremony and Student Council" style="width: 100%; height: 100%; object-fit: cover;">', '<img src="assets/images/events/investiture-2.jpg" alt="Investiture Ceremony and Student Council" style="width: 100%; height: 100%; object-fit: cover;">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Adharva Inter-School Fest Cultural Dance" style="width: 100%; height: 100%; object-fit: cover;">', '<img src="assets/images/student-life/adharva-dance.jpg" alt="Adharva Inter-School Fest Cultural Dance" style="width: 100%; height: 100%; object-fit: cover;">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Student Audience and Celebration" style="width: 100%; height: 100%; object-fit: cover;">', '<img src="assets/images/student-life/fest-crowd.jpg" alt="Student Audience and Celebration" style="width: 100%; height: 100%; object-fit: cover;">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Investiture Ceremony Stage Assembly" loading="lazy">', '<img src="assets/images/events/investiture-1.jpg" alt="Investiture Ceremony Stage Assembly" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="School Parliament Elected Members" loading="lazy">', '<img src="assets/images/events/school-parliament.jpg" alt="School Parliament Elected Members" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Adharva Inter-School Fest Inauguration" loading="lazy">', '<img src="assets/images/events/adharva-fest.jpg" alt="Adharva Inter-School Fest Inauguration" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Classical Dance Performance at Adharva Fest" loading="lazy">', '<img src="assets/images/student-life/adharva-dance.jpg" alt="Classical Dance Performance at Adharva Fest" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Solemn Pledge & Investiture Oath" loading="lazy">', '<img src="assets/images/events/investiture-oath.jpg" alt="Solemn Pledge & Investiture Oath" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="All Kerala Bhavan\'s Cultural Fest" loading="lazy">', '<img src="assets/images/events/cultural-fest.jpg" alt="All Kerala Bhavan\'s Cultural Fest" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="Manvila Campus Facade & Grounds" loading="lazy">', '<img src="assets/images/campus/campus-view.jpg" alt="Manvila Campus Facade & Grounds" loading="lazy">');
    html = html.replace('<img src="assets/images/bvb-manvila-logo.png" alt="A Campus for Discovery" style="width: 100%; border-radius: 12px; box-shadow: var(--shadow-md); border: 2px solid var(--color-border); object-fit: cover; max-height: 280px;">', '<img src="assets/images/campus/campus-view.jpg" alt="A Campus for Discovery" style="width: 100%; border-radius: 12px; box-shadow: var(--shadow-md); border: 2px solid var(--color-border); object-fit: cover; max-height: 280px;">');
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log(`Updated index.html in ${baseDir}`);
  }
});
