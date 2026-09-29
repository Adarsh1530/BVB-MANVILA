const fs = require('fs');
const path = require('path');

// 1. Update api/get_site_data.json
const jsonPath = path.join(__dirname, '..', 'api', 'get_site_data.json');
let jsonContent = fs.readFileSync(jsonPath, 'utf8');

// Replace old asset paths with mapped uploads/ paths
jsonContent = jsonContent
  .replace(/"assets\/documents\/mandatory-disclosure\//g, '"uploads/mandatory_disclosures/')
  .replace(/"images\/main page popup\/1\.jpg"/g, '"uploads/popup/popup-1.jpg"')
  .replace(/"assets\/images\/campus\/campus-view\.jpg"/g, '"uploads/auto_slides/campus-view.jpg"')
  .replace(/"assets\/images\/events\/investiture-1\.jpg"/g, '"uploads/auto_slides/investiture-1.jpg"')
  .replace(/"assets\/images\/events\/investiture-2\.jpg"/g, '"uploads/auto_slides/investiture-2.jpg"')
  .replace(/"assets\/images\/events\/investiture-oath\.jpg"/g, '"uploads/auto_slides/investiture-oath.jpg"')
  .replace(/"assets\/images\/events\/cultural-fest\.jpg"/g, '"uploads/auto_slides/cultural-fest.jpg"')
  .replace(/"assets\/images\/events\/school-parliament\.jpg"/g, '"uploads/gallery/school-parliament.jpg"')
  .replace(/"assets\/images\/events\/adharva-fest\.jpg"/g, '"uploads/gallery/adharva-fest.jpg"');

fs.writeFileSync(jsonPath, jsonContent, 'utf8');
console.log('✅ Updated api/get_site_data.json with uploads/ mapped paths');

// 2. Update bvb_manvila_db.sql
const sqlPath = path.join(__dirname, '..', 'bvb_manvila_db.sql');
let sqlContent = fs.readFileSync(sqlPath, 'utf8');

sqlContent = sqlContent
  .replace(/'assets\/documents\/mandatory-disclosure\//g, "'uploads/mandatory_disclosures/")
  .replace(/'images\/main page popup\/1\.jpg'/g, "'uploads/popup/popup-1.jpg'")
  .replace(/'assets\/images\/campus\/campus-view\.jpg'/g, "'uploads/auto_slides/campus-view.jpg'")
  .replace(/'assets\/images\/events\/investiture-1\.jpg'/g, "'uploads/auto_slides/investiture-1.jpg'")
  .replace(/'assets\/images\/events\/investiture-2\.jpg'/g, "'uploads/auto_slides/investiture-2.jpg'")
  .replace(/'assets\/images\/events\/investiture-oath\.jpg'/g, "'uploads/auto_slides/investiture-oath.jpg'")
  .replace(/'assets\/images\/events\/cultural-fest\.jpg'/g, "'uploads/auto_slides/cultural-fest.jpg'")
  .replace(/'assets\/images\/events\/school-parliament\.jpg'/g, "'uploads/gallery/school-parliament.jpg'")
  .replace(/'assets\/images\/events\/adharva-fest\.jpg'/g, "'uploads/gallery/adharva-fest.jpg'")
  .replace(/"assets\/images\/events\/investiture-1\.jpg"/g, '"uploads/gallery/investiture-1.jpg"')
  .replace(/"assets\/images\/events\/investiture-2\.jpg"/g, '"uploads/gallery/investiture-2.jpg"')
  .replace(/"assets\/images\/events\/investiture-oath\.jpg"/g, '"uploads/gallery/investiture-oath.jpg"')
  .replace(/"assets\/images\/events\/cultural-fest\.jpg"/g, '"uploads/gallery/cultural-fest.jpg"')
  .replace(/"assets\/images\/events\/school-parliament\.jpg"/g, '"uploads/gallery/school-parliament.jpg"')
  .replace(/"assets\/images\/events\/adharva-fest\.jpg"/g, '"uploads/gallery/adharva-fest.jpg"');

fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log('✅ Updated bvb_manvila_db.sql with uploads/ mapped paths');

// 3. Update admin/config/db.php
const dbPhpPath = path.join(__dirname, '..', 'admin', 'config', 'db.php');
let dbPhpContent = fs.readFileSync(dbPhpPath, 'utf8');

dbPhpContent = dbPhpContent
  .replace(/'assets\/documents\/mandatory-disclosure\//g, "'uploads/mandatory_disclosures/")
  .replace(/'images\/main page popup\/1\.jpg'/g, "'uploads/popup/popup-1.jpg'")
  .replace(/'assets\/images\/campus\/campus-view\.jpg'/g, "'uploads/auto_slides/campus-view.jpg'")
  .replace(/'assets\/images\/events\/investiture-1\.jpg'/g, "'uploads/auto_slides/investiture-1.jpg'")
  .replace(/'assets\/images\/events\/investiture-2\.jpg'/g, "'uploads/auto_slides/investiture-2.jpg'")
  .replace(/'assets\/images\/events\/investiture-oath\.jpg'/g, "'uploads/auto_slides/investiture-oath.jpg'")
  .replace(/'assets\/images\/events\/cultural-fest\.jpg'/g, "'uploads/auto_slides/cultural-fest.jpg'")
  .replace(/'assets\/images\/events\/school-parliament\.jpg'/g, "'uploads/gallery/school-parliament.jpg'")
  .replace(/'assets\/images\/events\/adharva-fest\.jpg'/g, "'uploads/gallery/adharva-fest.jpg'");

fs.writeFileSync(dbPhpPath, dbPhpContent, 'utf8');
console.log('✅ Updated admin/config/db.php with uploads/ mapped paths');

// 4. Update admin/js/admin.js BVB_DEFAULT_SEED_DATA
const adminJsPath = path.join(__dirname, '..', 'admin', 'js', 'admin.js');
let adminJsContent = fs.readFileSync(adminJsPath, 'utf8');

adminJsContent = adminJsContent
  .replace(/"assets\/documents\/mandatory-disclosure\//g, '"uploads/mandatory_disclosures/')
  .replace(/"images\/main page popup\/1\.jpg"/g, '"uploads/popup/popup-1.jpg"')
  .replace(/"assets\/images\/campus\/campus-view\.jpg"/g, '"uploads/auto_slides/campus-view.jpg"')
  .replace(/"assets\/images\/events\/investiture-1\.jpg"/g, '"uploads/auto_slides/investiture-1.jpg"')
  .replace(/"assets\/images\/events\/investiture-2\.jpg"/g, '"uploads/auto_slides/investiture-2.jpg"')
  .replace(/"assets\/images\/events\/investiture-oath\.jpg"/g, '"uploads/auto_slides/investiture-oath.jpg"')
  .replace(/"assets\/images\/events\/cultural-fest\.jpg"/g, '"uploads/auto_slides/cultural-fest.jpg"')
  .replace(/"assets\/images\/events\/school-parliament\.jpg"/g, '"uploads/gallery/school-parliament.jpg"')
  .replace(/"assets\/images\/events\/adharva-fest\.jpg"/g, '"uploads/gallery/adharva-fest.jpg"');

fs.writeFileSync(adminJsPath, adminJsContent, 'utf8');
console.log('✅ Updated admin/js/admin.js with uploads/ mapped paths');
