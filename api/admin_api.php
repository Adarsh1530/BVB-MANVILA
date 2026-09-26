<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Admin PHP Persistence API
 * Synchronizes admin panel updates directly into get_site_data.json
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

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if ($data && isset($data['action']) && $data['action'] === 'sync_data' && isset($data['data'])) {
    $updatedData = $data['data'];
    $updatedData['status'] = 'success';
    
    $jsonString = json_encode($updatedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
    if (file_put_contents($jsonFile, $jsonString)) {
        echo json_encode(['status' => 'success', 'message' => 'Site data synced to get_site_data.json']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to write to JSON file']);
    }
} else {
    if (file_exists($jsonFile)) {
        echo file_get_contents($jsonFile);
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Site data file not found']);
    }
}
