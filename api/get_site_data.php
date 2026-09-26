<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Public API: Fetch Site Data (Notices, Scrolling Ticker, Entrance Popup, Mandatory Disclosures)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../admin/config/db.php';

try {
    // 1. Fetch Active Popup
    $popup_stmt = $pdo->query("SELECT id, title, message, image_url, button_text, button_url, is_active FROM popups ORDER BY id DESC LIMIT 1");
    $popup = $popup_stmt->fetch() ?: [
        'is_active' => 0,
        'title' => '',
        'message' => '',
        'image_url' => 'images/main page popup/1.jpg',
        'button_text' => '',
        'button_url' => '#'
    ];

    // 2. Fetch Active Notices & Tickers
    $notices_stmt = $pdo->query("SELECT id, title, content, category, notice_date, pdf_link, is_ticker FROM notices WHERE status = 'active' ORDER BY notice_date DESC, id DESC");
    $all_notices = $notices_stmt->fetchAll();

    $ticker_notices = array_filter($all_notices, function($n) {
        return (int)$n['is_ticker'] === 1;
    });

    // 3. Fetch Mandatory Disclosures
    $md_stmt = $pdo->query("SELECT id, category_code, sl_no, document_type, document_name, file_path, updated_at FROM mandatory_disclosures ORDER BY category_code ASC, sl_no ASC");
    $disclosures = $md_stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'popup' => $popup,
        'notices' => array_values($all_notices),
        'ticker' => array_values($ticker_notices),
        'mandatory_disclosures' => $disclosures
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
