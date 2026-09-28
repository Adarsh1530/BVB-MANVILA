<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Admin Data API (MySQL Database & JSON Dual Sync Engine)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$jsonFile = __DIR__ . '/get_site_data.json';
require_once __DIR__ . '/../admin/config/db.php';

// GET REQUEST: Return site data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($jsonFile)) {
        echo file_get_contents($jsonFile);
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Site data file not found']);
    }
    exit();
}

// POST REQUEST: Sync data
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if ($data && isset($data['action']) && $data['action'] === 'sync_data' && isset($data['data'])) {
    $updatedData = $data['data'];
    $updatedData['status'] = 'success';
    
    // 1. Sync to MySQL Database if PDO connected
    if ($pdo) {
        try {
            // Sync Users
            if (isset($updatedData['users']) && is_array($updatedData['users'])) {
                foreach ($updatedData['users'] as $u) {
                    $stmt = $pdo->prepare("INSERT INTO `users` (`id`, `username`, `password`, `name`, `role`) 
                        VALUES (:id, :username, :password, :name, :role) 
                        ON DUPLICATE KEY UPDATE `username` = VALUES(`username`), `password` = VALUES(`password`), `name` = VALUES(`name`), `role` = VALUES(`role`)");
                    $stmt->execute([
                        ':id' => $u['id'],
                        ':username' => $u['username'],
                        ':password' => $u['password'],
                        ':name' => $u['name'] ?? $u['username'],
                        ':role' => $u['role'] ?? 'school'
                    ]);
                }
            }

            // Sync Active Popup
            if (isset($updatedData['popup']) && is_array($updatedData['popup'])) {
                $p = $updatedData['popup'];
                $stmt = $pdo->prepare("INSERT INTO `popups` (`id`, `title`, `message`, `image_url`, `button_text`, `button_url`, `is_active`) 
                    VALUES (1, :title, :message, :image_url, :button_text, :button_url, :is_active) 
                    ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `message` = VALUES(`message`), `image_url` = VALUES(`image_url`), `button_text` = VALUES(`button_text`), `button_url` = VALUES(`button_url`), `is_active` = VALUES(`is_active`)");
                $stmt->execute([
                    ':title' => $p['title'] ?? '',
                    ':message' => $p['message'] ?? '',
                    ':image_url' => $p['image_url'] ?? '',
                    ':button_text' => $p['button_text'] ?? 'ADMISSION INFO',
                    ':button_url' => $p['button_url'] ?? 'admissions.html',
                    ':is_active' => isset($p['is_active']) ? (int)$p['is_active'] : 1
                ]);
            }

            // Sync Notices
            if (isset($updatedData['notices']) && is_array($updatedData['notices'])) {
                $pdo->exec("TRUNCATE TABLE `notices`");
                foreach ($updatedData['notices'] as $n) {
                    $stmt = $pdo->prepare("INSERT INTO `notices` (`id`, `title`, `content`, `category`, `notice_date`, `pdf_link`, `is_ticker`, `status`) 
                        VALUES (:id, :title, :content, :category, :notice_date, :pdf_link, :is_ticker, 'active')");
                    $stmt->execute([
                        ':id' => $n['id'],
                        ':title' => $n['title'] ?? '',
                        ':content' => $n['content'] ?? '',
                        ':category' => $n['category'] ?? 'General',
                        ':notice_date' => $n['notice_date'] ?? date('Y-m-d'),
                        ':pdf_link' => $n['pdf_link'] ?? '',
                        ':is_ticker' => isset($n['is_ticker']) ? (int)$n['is_ticker'] : 1
                    ]);
                }
            }

            // Sync Mandatory Disclosures
            if (isset($updatedData['mandatory_disclosures']) && is_array($updatedData['mandatory_disclosures'])) {
                $pdo->exec("TRUNCATE TABLE `mandatory_disclosures`");
                foreach ($updatedData['mandatory_disclosures'] as $d) {
                    $stmt = $pdo->prepare("INSERT INTO `mandatory_disclosures` (`id`, `sl_no`, `category_code`, `category_name`, `title`, `details`, `file_link`) 
                        VALUES (:id, :sl_no, :category_code, :category_name, :title, :details, :file_link)");
                    $stmt->execute([
                        ':id' => $d['id'],
                        ':sl_no' => $d['sl_no'] ?? '1',
                        ':category_code' => $d['category_code'] ?? 'B',
                        ':category_name' => $d['category_name'] ?? 'Documents & Compliance',
                        ':title' => $d['title'] ?? '',
                        ':details' => $d['details'] ?? '',
                        ':file_link' => $d['file_link'] ?? ''
                    ]);
                }
            }

            // Sync Image Packages
            if (isset($updatedData['image_packages']) && is_array($updatedData['image_packages'])) {
                $pdo->exec("TRUNCATE TABLE `image_packages`");
                foreach ($updatedData['image_packages'] as $pkg) {
                    $stmt = $pdo->prepare("INSERT INTO `image_packages` (`id`, `title`, `subtitle`, `main_image`, `sub_images`, `target_sections`) 
                        VALUES (:id, :title, :subtitle, :main_image, :sub_images, :target_sections)");
                    $stmt->execute([
                        ':id' => $pkg['id'],
                        ':title' => $pkg['title'] ?? '',
                        ':subtitle' => $pkg['subtitle'] ?? '',
                        ':main_image' => $pkg['main_image'] ?? '',
                        ':sub_images' => json_encode($pkg['sub_images'] ?? []),
                        ':target_sections' => json_encode($pkg['target_sections'] ?? [])
                    ]);
                }
            }

            // Sync Auto Slides
            if (isset($updatedData['auto_slides']) && is_array($updatedData['auto_slides'])) {
                $pdo->exec("TRUNCATE TABLE `auto_slides`");
                foreach ($updatedData['auto_slides'] as $slide) {
                    $stmt = $pdo->prepare("INSERT INTO `auto_slides` (`id`, `title`, `subtitle`, `image_url`, `is_active`) 
                        VALUES (:id, :title, :subtitle, :image_url, :is_active)");
                    $stmt->execute([
                        ':id' => $slide['id'],
                        ':title' => $slide['title'] ?? '',
                        ':subtitle' => $slide['subtitle'] ?? '',
                        ':image_url' => $slide['image_url'] ?? '',
                        ':is_active' => isset($slide['is_active']) ? (int)$slide['is_active'] : 1
                    ]);
                }
            }

            // Sync Popup History
            if (isset($updatedData['popup_history']) && is_array($updatedData['popup_history'])) {
                $pdo->exec("TRUNCATE TABLE `popup_history`");
                foreach ($updatedData['popup_history'] as $ph) {
                    $stmt = $pdo->prepare("INSERT INTO `popup_history` (`id`, `title`, `message`, `image_url`, `button_text`, `button_url`, `is_active`) 
                        VALUES (:id, :title, :message, :image_url, :button_text, :button_url, :is_active)");
                    $stmt->execute([
                        ':id' => $ph['id'],
                        ':title' => $ph['title'] ?? '',
                        ':message' => $ph['message'] ?? '',
                        ':image_url' => $ph['image_url'] ?? '',
                        ':button_text' => $ph['button_text'] ?? 'ADMISSION INFO',
                        ':button_url' => $ph['button_url'] ?? 'admissions.html',
                        ':is_active' => isset($ph['is_active']) ? (int)$ph['is_active'] : 1
                    ]);
                }
            }
        } catch (Exception $e) {
            error_log("MySQL sync notice: " . $e->getMessage());
        }
    }

    // 2. Write to get_site_data.json
    $jsonString = json_encode($updatedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if (file_put_contents($jsonFile, $jsonString)) {
        echo json_encode(['status' => 'success', 'message' => 'Site data successfully synchronized to MySQL & JSON']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to write to data storage']);
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid action or payload']);
}
