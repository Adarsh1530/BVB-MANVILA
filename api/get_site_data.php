<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Public API: Fetch Site Data (Notices, Ticker, Popup, Mandatory Disclosures, Image Packages, Auto Slides)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../admin/config/db.php';
$jsonFile = __DIR__ . '/get_site_data.json';

// If MySQL PDO is available, attempt DB fetch
if ($pdo) {
    try {
        // Users
        $users = $pdo->query("SELECT id, username, password, name, role FROM users ORDER BY id ASC")->fetchAll();

        // Popup
        $popup = $pdo->query("SELECT id, title, message, image_url, button_text, button_url, is_active FROM popups ORDER BY id DESC LIMIT 1")->fetch();

        // Notices
        $notices = $pdo->query("SELECT id, title, content, category, notice_date, pdf_link, is_ticker FROM notices WHERE status = 'active' ORDER BY notice_date DESC, id DESC")->fetchAll();
        $ticker = array_values(array_filter($notices ?: [], function($n) { return (int)$n['is_ticker'] === 1; }));

        // Mandatory Disclosures
        $disclosures = $pdo->query("SELECT id, sl_no, category_code, category_name, title, details, file_link FROM mandatory_disclosures ORDER BY category_code ASC, CAST(sl_no AS UNSIGNED) ASC, id ASC")->fetchAll();

        // Image Packages
        $packages_raw = $pdo->query("SELECT id, title, subtitle, main_image, sub_images, target_sections FROM image_packages ORDER BY id DESC")->fetchAll();
        $image_packages = array_map(function($p) {
            return [
                'id' => (int)$p['id'],
                'title' => $p['title'],
                'subtitle' => $p['subtitle'],
                'main_image' => $p['main_image'],
                'sub_images' => json_decode($p['sub_images'], true) ?: [],
                'target_sections' => json_decode($p['target_sections'], true) ?: []
            ];
        }, $packages_raw ?: []);

        // Auto Slides
        $slides = $pdo->query("SELECT id, title, subtitle, image_url, is_active FROM auto_slides ORDER BY id ASC")->fetchAll();

        // Popup History
        $popup_history = $pdo->query("SELECT id, title, message, image_url, button_text, button_url, is_active, created_at FROM popup_history ORDER BY id DESC")->fetchAll();

        // Only return MySQL data if site content records (notices, disclosures, or packages) actually exist
        if (!empty($notices) || !empty($disclosures) || !empty($image_packages) || !empty($slides)) {
            echo json_encode([
                'status' => 'success',
                'users' => $users ?: [],
                'popup' => $popup ?: ['is_active' => 0],
                'notices' => $notices ?: [],
                'ticker' => $ticker ?: [],
                'mandatory_disclosures' => $disclosures ?: [],
                'image_packages' => $image_packages ?: [],
                'auto_slides' => $slides ?: [],
                'popup_history' => $popup_history ?: []
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            exit();
        }
    } catch (Exception $e) {
        error_log("DB Query Error: " . $e->getMessage());
    }
}

// Fallback: Read JSON file
if (file_exists($jsonFile)) {
    echo file_get_contents($jsonFile);
} else {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Site data source unavailable']);
}
