<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=bvb_manvila_db;charset=utf8mb4', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = file_get_contents(__DIR__ . '/../bvb_manvila_db.sql');
    $pdo->exec($sql);

    echo "✅ Local XAMPP MySQL database 'bvb_manvila_db' reset successfully!\n";
} catch (Exception $e) {
    echo "Notice: " . $e->getMessage() . "\n";
}
