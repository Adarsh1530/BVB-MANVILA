const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\xampp\\htdocs\\BVB MANVILA';

console.log('=== Removing All Hardcoded Upload Images from Public Pages ===');

const placeholderImg = 'assets/images/bvb-manvila-logo.png';

// List of demo image paths to replace with placeholderImg in HTML files
const demoImagePatterns = [
  /assets\/images\/events\/[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp|svg)/g,
  /assets\/images\/campus\/[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp)/g,
  /assets\/images\/student-life\/[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp)/g,
  /assets\/images\/campus\/downloaded\/[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp)/g
];

const htmlFiles = [
  'index.html',
  'events.html',
  'gallery.html',
  'about.html',
  'academics.html',
  'campus.html',
  'student-life.html',
  'achievements.html',
  'admissions.html',
  'leadership.html',
  'mandatory-disclosure.html'
];

htmlFiles.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // Replace demo images
    demoImagePatterns.forEach(pattern => {
      html = html.replace(pattern, placeholderImg);
    });

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Cleaned hardcoded content images in ${file}`);
  }
});

// Update api/events.php to return live/empty data
const eventsPhpPath = path.join(projectRoot, 'api', 'events.php');
const newEventsPhp = `<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * API: School Calendar & Events Endpoint
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../admin/config/db.php';

$eventsData = [];

if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT id, title, content as description, category, notice_date as event_date, pdf_link as thumbnail FROM notices WHERE status = 'active' ORDER BY notice_date DESC");
        $eventsData = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    } catch (Exception $e) {}
}

echo json_encode([
    'status' => 'success',
    'timestamp' => date('c'),
    'data' => $eventsData
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
`;

fs.writeFileSync(eventsPhpPath, newEventsPhp, 'utf8');
console.log('✅ Cleaned api/events.php to return live/empty data from DB');

// Update api/gallery.php to return live/empty data
const galleryPhpPath = path.join(projectRoot, 'api', 'gallery.php');
const newGalleryPhp = `<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * API: Photo Gallery Endpoint
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../admin/config/db.php';

$galleryItems = [];

if ($pdo) {
    try {
        $pkgs = $pdo->query("SELECT id, title, main_image FROM image_packages ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
        foreach ($pkgs as $p) {
            $galleryItems[] = [
                'id' => (int)$p['id'],
                'category' => 'events',
                'title' => $p['title'],
                'src' => $p['main_image']
            ];
        }
    } catch (Exception $e) {}
}

echo json_encode([
    'status' => 'success',
    'total' => count($galleryItems),
    'data' => $galleryItems
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
`;

fs.writeFileSync(galleryPhpPath, newGalleryPhp, 'utf8');
console.log('✅ Cleaned api/gallery.php to return live/empty data from DB');

console.log('=== All Public Pages Cleaned of Hardcoded Upload Images ===');
