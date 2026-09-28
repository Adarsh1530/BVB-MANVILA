<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Database Connection & Configuration (cPanel & Local XAMPP MySQL)
 */

$db_host = getenv('DB_HOST') ?: '127.0.0.1';
$db_port = getenv('DB_PORT') ?: '3306';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';
$db_name = getenv('DB_NAME') ?: 'bvb_manvila_db';

$pdo = null;

try {
    // 1. Direct connection to the specified database
    $pdo = new PDO("mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (Exception $e) {
    // 2. If database doesn't exist yet (e.g. local XAMPP first run), attempt host connection & auto-creation
    try {
        $init_pdo = new PDO("mysql:host={$db_host};port={$db_port};charset=utf8mb4", $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        $init_pdo->exec("CREATE DATABASE IF NOT EXISTS `{$db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        
        $pdo = new PDO("mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    } catch (Exception $ex) {
        error_log("Database connection notice: " . $ex->getMessage());
    }
}

if ($pdo) {
    try {
        // Auto-Create Required Tables if missing
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `users` (
                `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                `username` VARCHAR(50) NOT NULL UNIQUE,
                `password` VARCHAR(255) NOT NULL,
                `name` VARCHAR(100) NOT NULL,
                `role` ENUM('super admin', 'admin', 'school') NOT NULL DEFAULT 'school',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `notices` (
                `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                `title` VARCHAR(255) NOT NULL,
                `content` TEXT,
                `category` VARCHAR(50) DEFAULT 'General',
                `notice_date` DATE NOT NULL,
                `pdf_link` VARCHAR(255) DEFAULT '',
                `is_ticker` TINYINT(1) DEFAULT 1,
                `status` VARCHAR(20) DEFAULT 'active',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `popups` (
                `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                `title` VARCHAR(255) NOT NULL,
                `message` TEXT,
                `image_url` LONGTEXT,
                `button_text` VARCHAR(100) DEFAULT 'ADMISSION INFO',
                `button_url` VARCHAR(255) DEFAULT 'admissions.html',
                `is_active` TINYINT(1) DEFAULT 1,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `popup_history` (
                `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                `title` VARCHAR(255) NOT NULL,
                `message` TEXT,
                `image_url` LONGTEXT,
                `button_text` VARCHAR(100) DEFAULT 'ADMISSION INFO',
                `button_url` VARCHAR(255) DEFAULT 'admissions.html',
                `is_active` TINYINT(1) DEFAULT 1,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `mandatory_disclosures` (
                `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                `sl_no` VARCHAR(20) NOT NULL,
                `category_code` CHAR(1) NOT NULL DEFAULT 'B',
                `category_name` VARCHAR(100) DEFAULT 'Documents & Compliance',
                `title` VARCHAR(255) NOT NULL,
                `details` TEXT,
                `file_link` LONGTEXT,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `image_packages` (
                `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                `title` VARCHAR(255) NOT NULL,
                `subtitle` VARCHAR(255) DEFAULT '',
                `main_image` LONGTEXT NOT NULL,
                `sub_images` LONGTEXT,
                `target_sections` LONGTEXT,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `auto_slides` (
                `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                `title` VARCHAR(255) NOT NULL,
                `subtitle` VARCHAR(255) DEFAULT '',
                `image_url` LONGTEXT NOT NULL,
                `is_active` TINYINT(1) DEFAULT 1,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        // Upgrade existing columns if needed
        try {
            $pdo->exec("ALTER TABLE `users` MODIFY `id` BIGINT AUTO_INCREMENT");
            $pdo->exec("ALTER TABLE `notices` MODIFY `id` BIGINT AUTO_INCREMENT");
            $pdo->exec("ALTER TABLE `mandatory_disclosures` MODIFY `id` BIGINT AUTO_INCREMENT, MODIFY `file_link` LONGTEXT");
            $pdo->exec("ALTER TABLE `image_packages` MODIFY `id` BIGINT AUTO_INCREMENT");
            $pdo->exec("ALTER TABLE `auto_slides` MODIFY `id` BIGINT AUTO_INCREMENT");
            $pdo->exec("ALTER TABLE `popups` MODIFY `id` BIGINT AUTO_INCREMENT, MODIFY `image_url` LONGTEXT");
            $pdo->exec("ALTER TABLE `popup_history` MODIFY `id` BIGINT AUTO_INCREMENT, MODIFY `image_url` LONGTEXT");
        } catch (Exception $ex) {
            // Ignore alter notice
        }

        // Seed initial default users if empty
        $user_check = $pdo->query("SELECT COUNT(*) FROM `users`")->fetchColumn();
        if ((int)$user_check === 0) {
            $pdo->exec("
                INSERT INTO `users` (`id`, `username`, `password`, `name`, `role`) VALUES
                (1, 'superadmin', 'superadmin123', 'Principal / Director', 'super admin'),
                (2, 'admin', 'admin123', 'Administrative Officer', 'admin'),
                (3, 'school', 'school123', 'School Office Staff', 'school');
            ");
        }
    } catch (Exception $e) {
        error_log("Table initialization notice: " . $e->getMessage());
    }
}
