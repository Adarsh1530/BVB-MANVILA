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

        // Seed initial default notices if empty
        $notice_check = $pdo->query("SELECT COUNT(*) FROM `notices`")->fetchColumn();
        if ((int)$notice_check === 0) {
            $pdo->exec("
                INSERT INTO `notices` (`id`, `title`, `content`, `category`, `notice_date`, `pdf_link`, `is_ticker`, `status`) VALUES
                (1, 'Admissions Open for Academic Session 2027–2028 (LKG to Class XI)', 'Registration forms for admission to LKG, Class I, Class XI Science & Commerce streams are available online and at the school office.', 'Admissions', '2026-09-15', 'assets/documents/mandatory-disclosure/Mandatory-Disclosure.pdf', 1, 'active'),
                (2, 'Annual CBSE Board Examination Schedule & Guidelines Released', 'Classes X and XII CBSE Board examination instructions, timetable, and admit card download notifications have been released.', 'Academics', '2026-09-10', 'assets/documents/mandatory-disclosure/Academic-Calendar.csv', 1, 'active'),
                (3, 'Adharva Inter-School Cultural Fest Winners Announced', 'Bhavan\'s Manvila won 1st Place overall champion trophy at the All Kerala Bhavan\'s Youth Festival.', 'Achievements', '2026-09-01', '', 1, 'active');
            ");
        }

        // Seed initial mandatory disclosures if empty
        $disc_check = $pdo->query("SELECT COUNT(*) FROM `mandatory_disclosures`")->fetchColumn();
        if ((int)$disc_check === 0) {
            $pdo->exec("
                INSERT INTO `mandatory_disclosures` (`id`, `sl_no`, `category_code`, `category_name`, `title`, `details`, `file_link`) VALUES
                (1, '1', 'A', 'General Information', 'NAME OF THE SCHOOL', 'BHAVANS VIVEKANANDA VIDYA MANDIR MANVILA TRIVANDRUM KERALA', ''),
                (2, '2', 'A', 'General Information', 'AFFILIATION NO. (IF APPLICABLE)', '930776', ''),
                (3, '3', 'A', 'General Information', 'SCHOOL CODE (IF APPLICABLE)', '75738', ''),
                (4, '4', 'A', 'General Information', 'COMPLETE ADDRESS WITH PIN CODE', 'BHAVANS VIVEKANANDA VIDYA MANDIR, MANVILA, PANGAPPARA P.O., TRIVANDRUM - 695581', ''),
                (5, '5', 'A', 'General Information', 'PRINCIPAL NAME & QUALIFICATION', 'MS. DEEPA CHANDRAN (M.Sc., B.Ed.)', ''),
                (6, '6', 'A', 'General Information', 'SCHOOL EMAIL ID', 'bhavansvvm@gmail.com', ''),
                (7, '7', 'A', 'General Information', 'CONTACT DETAILS (LANDLINE/MOBILE)', '0471 2594559', ''),
                (8, '1', 'B', 'Documents & Compliance', 'COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSION OF AFFILIATION', 'Valid CBSE Affiliation Extension up to 2028', 'assets/documents/mandatory-disclosure/CBSE-Affiliation-Extension.pdf'),
                (9, '2', 'B', 'Documents & Compliance', 'COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE', 'Bharatiya Vidya Bhavan Society Registration', 'assets/documents/mandatory-disclosure/Trust-Registration.pdf'),
                (10, '3', 'B', 'Documents & Compliance', 'COPY OF NO OBJECTION CERTIFICATE (NOC) ISSUED, IF APPLICABLE, BY THE STATE GOVT./UT', 'NOC Issued by Govt. of Kerala General Education Dept.', 'assets/documents/mandatory-disclosure/Govt-NOC.pdf'),
                (11, '4', 'B', 'Documents & Compliance', 'COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND IT\'S RENEWAL IF APPLICABLE', 'RTE Recognition Certificate', 'assets/documents/mandatory-disclosure/RTE-Recognition.pdf'),
                (12, '5', 'B', 'Documents & Compliance', 'COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER THE NATIONAL BUILDING CODE', 'Approved PWD Building Safety Certificate', 'assets/documents/mandatory-disclosure/Building-Safety-Certificate.pdf'),
                (13, '6', 'B', 'Documents & Compliance', 'COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPETENT AUTHORITY', 'Kerala Fire & Rescue Services Safety Clearance', 'assets/documents/mandatory-disclosure/Fire-Safety-Certificate.pdf'),
                (14, '7', 'B', 'Documents & Compliance', 'COPY OF THE DEO CERTIFICATE SUBMITTED BY THE SCHOOL FOR AFFILIATION', 'DEO Verification & Inspection Report', 'assets/documents/mandatory-disclosure/DEO-Certificate.pdf'),
                (15, '8', 'B', 'Documents & Compliance', 'COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES', 'Water Fitness & Sanitation Clearance Certificate', 'assets/documents/mandatory-disclosure/Sanitation-Certificate.pdf'),
                (16, '11', 'B', 'Documents & Compliance', 'COMPLETE MANDATORY DISCLOSURE (CBSE SARAS 5.0)', 'Full Verified SARAS 5.0 Disclosure Document', 'assets/documents/mandatory-disclosure/Mandatory-Disclosure.pdf'),
                (17, '1', 'C', 'Result & Academics', 'FEE STRUCTURE OF THE SCHOOL', 'Annual Academic Fee Structure 2027-28', 'assets/documents/mandatory-disclosure/Fee-Structure.pdf'),
                (18, '2', 'C', 'Result & Academics', 'ANNUAL ACADEMIC CALENDER', 'School Academic Calendar & Activity Schedule', 'assets/documents/mandatory-disclosure/Academic-Calendar.csv');
            ");
        }

        // Seed initial auto_slides if empty
        $slide_check = $pdo->query("SELECT COUNT(*) FROM `auto_slides`")->fetchColumn();
        if ((int)$slide_check === 0) {
            $pdo->exec("
                INSERT INTO `auto_slides` (`id`, `title`, `subtitle`, `image_url`, `is_active`) VALUES
                (1, 'EDUCATION ROOTED IN VALUES. DRIVEN BY EXCELLENCE', 'Nurturing Future Leaders with Academic Rigor and Indian Cultural Heritage', 'assets/images/campus/campus-view.jpg', 1),
                (2, 'State-of-the-Art Science & Digital Learning Labs', 'Empowering students through hands-on discovery and modern technology', 'assets/images/events/investiture-1.jpg', 1),
                (3, 'Serene 2.89 Acres Campus Grounds', 'Safe, green, and inspiring environment for holistic child development', 'assets/images/events/investiture-2.jpg', 1),
                (4, 'Investiture & Student Leadership Ceremonies', 'Developing confidence, discipline, and ethical leadership', 'assets/images/events/investiture-3.jpg', 1),
                (5, 'All Kerala Bhavan\'s Youth & Cultural Fest', 'Celebrating artistic talents and cultural excellence', 'assets/images/events/investiture-4.jpg', 1);
            ");
        }

        // Seed initial image_packages if empty
        $pkg_check = $pdo->query("SELECT COUNT(*) FROM `image_packages`")->fetchColumn();
        if ((int)$pkg_check === 0) {
            $pdo->exec("
                INSERT INTO `image_packages` (`id`, `title`, `subtitle`, `main_image`, `sub_images`, `target_sections`) VALUES
                (1, 'Annual Sports & Athletic Meet Highlights', 'Celebrated at Manvila Campus Grounds', 'assets/images/events/sports-day-1.jpg', '[\"assets/images/events/sports-day-1.jpg\",\"assets/images/events/annual-day-1.jpg\"]', '{\"welcome_section\":true,\"whats_happening\":true,\"life_at_bhavans\":true,\"moments_at_bhavans\":true,\"campus_discovery\":true,\"academic_environment\":true}'),
                (2, 'Investiture & Student Council Leadership Ceremony', 'Empowering Student Leaders', 'assets/images/events/investiture-1.jpg', '[\"assets/images/events/investiture-1.jpg\",\"assets/images/events/investiture-2.jpg\",\"assets/images/events/investiture-3.jpg\",\"assets/images/events/investiture-4.jpg\"]', '{\"welcome_section\":true,\"whats_happening\":true,\"life_at_bhavans\":true,\"moments_at_bhavans\":true,\"campus_discovery\":true,\"academic_environment\":true}');
            ");
        }

        // Seed initial popup if empty
        $pop_check = $pdo->query("SELECT COUNT(*) FROM `popups`")->fetchColumn();
        if ((int)$pop_check === 0) {
            $pdo->exec("
                INSERT INTO `popups` (`id`, `title`, `message`, `image_url`, `button_text`, `button_url`, `is_active`) VALUES
                (1, 'Welcome to Bhavan\'s Vivekananda Vidya Mandir, Manvila', 'Admissions are now open for LKG to Class XI Science & Commerce streams for 2027–2028 session.', 'images/main page popup/1.jpg', 'ADMISSION INFO', 'admissions.html', 1);
            ");
        }
    } catch (Exception $e) {
        error_log("Table initialization notice: " . $e->getMessage());
    }
}
