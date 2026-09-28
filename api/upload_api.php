<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * File Upload API Endpoint (cPanel File Manager & Local Storage)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uploadDir = __DIR__ . '/../uploads/';
if (!file_exists($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

// 1. Direct Multipart Form Upload
if (!empty($_FILES['file'])) {
    $file = $_FILES['file'];
    if ($file['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'csv'];
        if (in_array($ext, $allowed)) {
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '', basename($file['name']));
            $targetPath = $uploadDir . $filename;
            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                echo json_encode([
                    'status' => 'success',
                    'file_url' => 'uploads/' . $filename,
                    'message' => 'File uploaded successfully'
                ]);
                exit();
            }
        }
    }
}

// 2. Base64 Data Payload Upload
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if ($data && !empty($data['data_url'])) {
    $dataUrl = $data['data_url'];
    if (preg_match('/^data:(image\/(jpeg|png|jpg)|application\/pdf);base64,/', $dataUrl, $matches)) {
        $mime = $matches[1];
        $ext = ($mime === 'application/pdf') ? 'pdf' : (($matches[2] === 'png') ? 'png' : 'jpg');
        $base64Data = substr($dataUrl, strpos($dataUrl, ',') + 1);
        $decoded = base64_decode($base64Data);
        if ($decoded !== false) {
            $filename = time() . '_' . uniqid() . '.' . $ext;
            $targetPath = $uploadDir . $filename;
            if (file_put_contents($targetPath, $decoded) !== false) {
                echo json_encode([
                    'status' => 'success',
                    'file_url' => 'uploads/' . $filename,
                    'message' => 'Base64 file saved successfully'
                ]);
                exit();
            }
        }
    }
}

echo json_encode(['status' => 'error', 'message' => 'No valid file received or file write failed']);
