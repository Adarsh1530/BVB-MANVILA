<?php
require_once __DIR__ . '/../admin/config/db.php';
if ($pdo) {
    $sql = file_get_contents(__DIR__ . '/../bvb_manvila_db.sql');
    try {
        $pdo->exec($sql);
        echo "SUCCESS: MySQL Database updated successfully!\n";
    } catch (PDOException $e) {
        echo "PDO ERROR: " . $e->getMessage() . "\n";
    }
} else {
    echo "ERROR: Could not connect to MySQL database.\n";
}
