<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Database Connection & Configuration (cPanel Live & Local XAMPP MySQL)
 */

// Host candidates for cPanel / XAMPP environments
$db_hosts = array_unique(array_filter([
    getenv('DB_HOST') ?: '',
    'localhost',
    '127.0.0.1'
]));

$cpanel_dbname = getenv('DB_NAME') ?: 'vmsprosparkitts_bvb_manvila_db';
$cpanel_pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : 'H5YhT5@mspark';

// Candidate database users for cPanel
$cpanel_users = array_unique(array_filter([
    getenv('DB_USER') ?: '',
    'vmsprosparkitts_bvb_manvila_db',
    'vmsprosparkitts_admin',
    'vmsprosparkitts_bvb_user',
    'vmsprosparkitts_user',
    'vmsprosparkitts',
    'root'
]));

$pdo = null;
$db_name = $cpanel_dbname;

// 1. Try candidate connections for Live cPanel MySQL Database
foreach ($db_hosts as $h) {
    foreach ($cpanel_users as $u) {
        try {
            $test_pdo = new PDO("mysql:host={$h};dbname={$cpanel_dbname};charset=utf8mb4", $u, $cpanel_pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            if ($test_pdo) {
                $pdo = $test_pdo;
                $db_name = $cpanel_dbname;
                break 2;
            }
        } catch (Exception $e) {
            // Continue testing next host/user candidate
        }
    }
}

// 2. Fallback: Try local XAMPP Database (bvb_manvila_db)
if (!$pdo) {
    foreach ($db_hosts as $h) {
        try {
            $test_pdo = new PDO("mysql:host={$h};dbname=bvb_manvila_db;charset=utf8mb4", 'root', '', [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            if ($test_pdo) {
                $pdo = $test_pdo;
                $db_name = 'bvb_manvila_db';
                break;
            }
        } catch (Exception $e) {
            // Continue testing local host
        }
    }
}

// 3. Auto-Create Database & Required Tables if missing on local XAMPP
if (!$pdo) {
    try {
        $init_pdo = new PDO("mysql:host=127.0.0.1;charset=utf8mb4", 'root', '', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        $init_pdo->exec("CREATE DATABASE IF NOT EXISTS `bvb_manvila_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        
        $pdo = new PDO("mysql:host=127.0.0.1;dbname=bvb_manvila_db;charset=utf8mb4", 'root', '', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        $db_name = 'bvb_manvila_db';
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
    } catch (Exception $e) {
        error_log("Table initialization notice: " . $e->getMessage());
    }
}
