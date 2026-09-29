const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

console.log('--- Cleaning All Demo Files and Resetting Hardcoded Upload Data ---');

// 1. Clean uploads subfolders
const uploadSubfolders = ['auto_slides', 'gallery', 'mandatory_disclosures', 'notices', 'popup'];
uploadSubfolders.forEach(sub => {
  const dirPath = path.join(projectRoot, 'uploads', sub);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      if (file !== '.gitkeep') {
        fs.unlinkSync(path.join(dirPath, file));
        console.log(`Deleted file: uploads/${sub}/${file}`);
      }
    });
  }
});

// 2. Reset api/get_site_data.json
const jsonPath = path.join(projectRoot, 'api', 'get_site_data.json');
if (fs.existsSync(jsonPath)) {
  const siteData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Clear popup image
  if (siteData.popup) {
    siteData.popup.image_url = "";
  }

  // Clear notices pdf_link
  if (Array.isArray(siteData.notices)) {
    siteData.notices.forEach(n => { n.pdf_link = ""; });
  }

  // Clear ticker pdf_link
  if (Array.isArray(siteData.ticker)) {
    siteData.ticker.forEach(t => { t.pdf_link = ""; });
  }

  // Clear mandatory disclosures file_link
  if (Array.isArray(siteData.mandatory_disclosures)) {
    siteData.mandatory_disclosures.forEach(d => { d.file_link = ""; });
  }

  // Clear image packages
  siteData.image_packages = [];

  // Clear auto slides images
  if (Array.isArray(siteData.auto_slides)) {
    siteData.auto_slides.forEach(s => { s.image_url = ""; });
  }

  siteData.popup_history = [];

  fs.writeFileSync(jsonPath, JSON.stringify(siteData, null, 4), 'utf8');
  console.log('✅ Cleaned api/get_site_data.json');
}

// 3. Reset bvb_manvila_db.sql
const sqlPath = path.join(projectRoot, 'bvb_manvila_db.sql');
if (fs.existsSync(sqlPath)) {
  let sqlContent = fs.readFileSync(sqlPath, 'utf8');

  // Replace file_links in mandatory_disclosures seed
  sqlContent = sqlContent.replace(/('uploads\/mandatory_disclosures\/[^']+')/g, "''");

  // Replace pdf_links in notices seed
  sqlContent = sqlContent.replace(/('uploads\/notices\/[^']+')/g, "''");

  // Replace image_urls in popups seed
  sqlContent = sqlContent.replace(/('uploads\/popup\/[^']+')/g, "''");

  // Replace image_urls in auto_slides seed
  sqlContent = sqlContent.replace(/('uploads\/auto_slides\/[^']+')/g, "''");

  // Clear image_packages seed data
  sqlContent = sqlContent.replace(/INSERT INTO `image_packages`[\s\S]*?ON DUPLICATE KEY UPDATE `id`=`id`;/g, 
    `-- Table structure for \`image_packages\`\n-- (Clean baseline - ready for admin uploads)`);

  fs.writeFileSync(sqlPath, sqlContent, 'utf8');
  console.log('✅ Cleaned bvb_manvila_db.sql');
}

// 4. Reset admin/js/admin.js defaultData
const adminJsPath = path.join(projectRoot, 'admin', 'js', 'admin.js');
if (fs.existsSync(adminJsPath)) {
  let adminJs = fs.readFileSync(adminJsPath, 'utf8');

  // Replace hardcoded uploads in defaultData
  adminJs = adminJs.replace(/file_link:\s*"uploads\/mandatory_disclosures\/[^"]*"/g, 'file_link: ""');
  adminJs = adminJs.replace(/pdf_link:\s*"uploads\/[^\"]*"/g, 'pdf_link: ""');
  adminJs = adminJs.replace(/image_url:\s*"uploads\/[^\"]*"/g, 'image_url: ""');
  adminJs = adminJs.replace(/main_image:\s*"uploads\/[^\"]*"/g, 'main_image: ""');
  adminJs = adminJs.replace(/"uploads\/(gallery|auto_slides)\/[^"]*"/g, '""');

  fs.writeFileSync(adminJsPath, adminJs, 'utf8');
  console.log('✅ Cleaned admin/js/admin.js');
}

console.log('--- Data Cleaning Script Finished ---');
