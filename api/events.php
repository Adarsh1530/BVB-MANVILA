<?php
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
