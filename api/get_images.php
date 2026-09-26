<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Public API: Fetch Active Images by Display Location
 * Supports delimiter-aware multi-location checkbox filtering
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../admin/config/db.php';

$location = trim($_GET['location'] ?? '');
$category = trim($_GET['category'] ?? '');

try {
    $sql = "SELECT id, category_id, image_type, file_path, title, subtitle, display_location, sort_order 
            FROM images 
            WHERE status = 'active'";
    $params = [];

    if (!empty($location)) {
        // Delimiter-aware exact matching for comma-separated display_location list
        $sql .= " AND (',' || display_location || ',') LIKE :loc";
        $params['loc'] = '%,' . $location . ',%';
    }

    if (!empty($category)) {
        $sql .= " AND category_id = :cat";
        $params['cat'] = $category;
    }

    $sql .= " ORDER BY sort_order ASC, id ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $images = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'count' => count($images),
        'location' => $location ?: 'all',
        'data' => $images
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
