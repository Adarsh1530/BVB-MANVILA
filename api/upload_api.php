<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * File Upload API Endpoint (Categorized cPanel File Manager Storage)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$rawInput = file_get_contents('php://input');
$jsonPayload = json_decode($rawInput, true) ?: [];

// Allowed category subfolder mapping
$categoryMap = [
    'mandatory_disclosures' => 'mandatory_disclosures',
    'disclosure'            => 'mandatory_disclosures',
    'notices'               => 'notices',
    'notice'                => 'notices',
    'gallery'               => 'gallery',
    'images'                => 'gallery',
    'auto_slides'           => 'auto_slides',
    'slides'                => 'auto_slides',
    'popup'                 => 'popup',
    'popups'                => 'popup'
];

$requestedCategory = strtolower($_POST['category'] ?? ($jsonPayload['category'] ?? 'general'));
$subfolder = $categoryMap[$requestedCategory] ?? 'general';

$uploadBaseDir = __DIR__ . '/../uploads/';
$targetDir = $uploadBaseDir . $subfolder . '/';

if (!file_exists($targetDir)) {
    @mkdir($targetDir, 0755, true);
}

// 1. Direct Multipart Form Upload
if (!empty($_FILES['file'])) {
    $file = $_FILES['file'];
    if ($file['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'csv'];
        if (in_array($ext, $allowed)) {
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '', basename($file['name']));
            $targetPath = $targetDir . $filename;
            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                echo json_encode([
                    'status' => 'success',
                    'file_url' => 'uploads/' . $subfolder . '/' . $filename,
                    'message' => 'File uploaded successfully'
                ]);
                exit();
            }
        }
    }
}

// 2. Base64 Data Payload Upload
if (!empty($jsonPayload['data_url'])) {
    $dataUrl = $jsonPayload['data_url'];
    if (preg_match('/^data:(image\/(jpeg|png|jpg)|application\/pdf);base64,/', $dataUrl, $matches)) {
        $mime = $matches[1];
        $ext = ($mime === 'application/pdf') ? 'pdf' : (($matches[2] === 'png') ? 'png' : 'jpg');
        $base64Data = substr($dataUrl, strpos($dataUrl, ',') + 1);
        $decoded = base64_decode($base64Data);
        if ($decoded !== false) {
            $filename = time() . '_' . uniqid() . '.' . $ext;
            $targetPath = $targetDir . $filename;
            if (file_put_contents($targetPath, $decoded) !== false) {
                echo json_encode([
                    'status' => 'success',
                    'file_url' => 'uploads/' . $subfolder . '/' . $filename,
                    'message' => 'Base64 file saved successfully'
                ]);
                exit();
            }
        }
    }
}

echo json_encode(['status' => 'error', 'message' => 'No valid file received or file write failed']);
