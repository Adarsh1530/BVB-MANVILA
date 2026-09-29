-- Bhavan's Vivekananda Vidya Mandir, Manvila
-- cPanel phpMyAdmin Import Database Schema & Clean Baseline Seed Data
-- Database Name: bvb_manvila_db

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` ENUM('super admin', 'admin', 'school') NOT NULL DEFAULT 'school',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `username`, `password`, `name`, `role`) VALUES
(1, 'superadmin', 'superadmin123', 'Principal / Director', 'super admin'),
(2, 'admin', 'admin123', 'Administrative Officer', 'admin'),
(3, 'school', 'school123', 'School Office Staff', 'school')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- --------------------------------------------------------
-- Table structure for `notices`
-- --------------------------------------------------------
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

TRUNCATE TABLE `notices`;

-- --------------------------------------------------------
-- Table structure for `popups`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `popups` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT,
  `image_url` LONGTEXT,
  `button_text` VARCHAR(100) DEFAULT 'ADMISSION INFO',
  `button_url` VARCHAR(255) DEFAULT 'admissions.html',
  `is_active` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE `popups`;
INSERT INTO `popups` (`id`, `title`, `message`, `image_url`, `button_text`, `button_url`, `is_active`) VALUES
(1, '', '', '', 'ADMISSION INFO', 'admissions.html', 0)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- --------------------------------------------------------
-- Table structure for `popup_history`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `popup_history` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT,
  `image_url` LONGTEXT,
  `button_text` VARCHAR(100) DEFAULT 'ADMISSION INFO',
  `button_url` VARCHAR(255) DEFAULT 'admissions.html',
  `is_active` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE `popup_history`;

-- --------------------------------------------------------
-- Table structure for `mandatory_disclosures`
-- --------------------------------------------------------
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

TRUNCATE TABLE `mandatory_disclosures`;
INSERT INTO `mandatory_disclosures` (`id`, `sl_no`, `category_code`, `category_name`, `title`, `details`, `file_link`) VALUES
(1, '1', 'A', 'General Information', 'NAME OF THE SCHOOL', 'BHAVAN\'S VIVEKANANDA VIDYA MANDIR', ''),
(2, '2', 'A', 'General Information', 'AFFILIATION NO. (IF APPLICABLE)', '930460', ''),
(3, '3', 'A', 'General Information', 'SCHOOL CODE (IF APPLICABLE)', '75429', ''),
(4, '4', 'A', 'General Information', 'COMPLETE ADDRESS WITH PIN CODE', 'Manvila, Pangappara P.O., Thiruvananthapuram, Kerala – 695581', ''),
(5, '5', 'A', 'General Information', 'PRINCIPAL NAME & QUALIFICATION', 'Smt. Deepa V (M.Sc., B.Ed.)', ''),
(6, '6', 'A', 'General Information', 'SCHOOL EMAIL ID', 'bhavansvvm@gmail.com', ''),
(7, '7', 'A', 'General Information', 'CONTACT DETAILS (LANDLINE/MOBILE)', '0471 2594559 / 8590066808', ''),
(8, '1', 'B', 'Documents & Compliance', 'COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSION OF AFFILIATION', '', ''),
(9, '2', 'B', 'Documents & Compliance', 'COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE', '', ''),
(10, '3', 'B', 'Documents & Compliance', 'COPY OF NO OBJECTION CERTIFICATE (NOC) ISSUED, IF APPLICABLE, BY THE STATE GOVT./UT', '', ''),
(11, '4', 'B', 'Documents & Compliance', 'COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND IT\'S RENEWAL IF APPLICABLE', '', ''),
(12, '5', 'B', 'Documents & Compliance', 'COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER THE NATIONAL BUILDING CODE', '', ''),
(13, '6', 'B', 'Documents & Compliance', 'COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPETENT AUTHORITY', '', ''),
(14, '7', 'B', 'Documents & Compliance', 'COPY OF THE DEO CERTIFICATE SUBMITTED BY THE SCHOOL FOR AFFILIATION', '', ''),
(15, '8', 'B', 'Documents & Compliance', 'COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES', '', ''),
(16, '11', 'B', 'Documents & Compliance', 'COMPLETE MANDATORY DISCLOSURE (CBSE SARAS 5.0)', '', ''),
(17, '1', 'C', 'Result & Academics', 'FEE STRUCTURE OF THE SCHOOL', '', ''),
(18, '2', 'C', 'Result & Academics', 'ANNUAL ACADEMIC CALENDER', '', '')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- --------------------------------------------------------
-- Table structure for `image_packages`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `image_packages` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT '',
  `main_image` LONGTEXT NOT NULL,
  `sub_images` LONGTEXT,
  `target_sections` LONGTEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE `image_packages`;

-- --------------------------------------------------------
-- Table structure for `auto_slides`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `auto_slides` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT '',
  `image_url` LONGTEXT NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE `auto_slides`;

COMMIT;
