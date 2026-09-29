<?php
require_once __DIR__ . '/../admin/config/db.php';

try {
    $pdo->exec("UPDATE `popups` SET `is_active` = 0, `image_url` = '' WHERE `id` = 1");
    $pdo->exec("TRUNCATE TABLE `popup_history`");
    echo "SUCCESS: Database popup table cleared and deactivated.\n";
} catch (Exception $e) {
    echo "NOTICE: " . $e->getMessage() . "\n";
}
