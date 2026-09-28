<?php
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
