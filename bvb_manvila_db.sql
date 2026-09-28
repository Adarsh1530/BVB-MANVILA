-- Bhavan's Vivekananda Vidya Mandir, Manvila
-- cPanel phpMyAdmin Import Database Schema & Seed Data
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

INSERT INTO `notices` (`id`, `title`, `content`, `category`, `notice_date`, `pdf_link`, `is_ticker`, `status`) VALUES
(1, 'Admissions Open for Academic Session 2027–2028 (LKG to Class XI)', 'Registration forms for admission to LKG, Class I, Class XI Science & Commerce streams are available online and at the school office.', 'Admissions', '2026-09-15', '', 1, 'active'),
(2, 'Annual CBSE Board Examination Schedule & Guidelines Released', 'Classes X and XII CBSE Board examination instructions, timetable, and admit card download notifications have been released.', 'Academics', '2026-09-10', '', 1, 'active'),
(3, 'Adharva Inter-School Cultural Fest Winners Announced', 'Bhavan\'s Manvila won 1st Place overall champion trophy at the All Kerala Bhavan\'s Youth Festival.', 'Achievements', '2026-09-01', '', 1, 'active')
ON DUPLICATE KEY UPDATE `id`=`id`;

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
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `popups` (`id`, `title`, `message`, `image_url`, `button_text`, `button_url`, `is_active`) VALUES
(1, 'Welcome to Bhavan\'s Vivekananda Vidya Mandir, Manvila', 'Admissions are now open for LKG to Class XI Science & Commerce streams for 2027–2028 session.', '', 'ADMISSION INFO', 'admissions.html', 1)
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
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `popup_history` (`id`, `title`, `message`, `image_url`, `button_text`, `button_url`, `is_active`, `created_at`) VALUES
(1, 'Welcome to Bhavan\'s Vivekananda Vidya Mandir, Manvila', 'Admissions are now open for LKG to Class XI Science & Commerce streams for 2027–2028 session.', '', 'ADMISSION INFO', 'admissions.html', 1, '2026-09-25 10:00:00')
ON DUPLICATE KEY UPDATE `id`=`id`;

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

INSERT INTO `mandatory_disclosures` (`id`, `sl_no`, `category_code`, `category_name`, `title`, `details`, `file_link`) VALUES
(1, '1', 'A', 'General Information', 'NAME OF THE SCHOOL', 'BHAVANS VIVEKANANDA VIDYA MANDIR MANVILA TRIVANDRUM KERALA', ''),
(2, '2', 'A', 'General Information', 'AFFILIATION NO. (IF APPLICABLE)', '930776', ''),
(3, '3', 'A', 'General Information', 'SCHOOL CODE (IF APPLICABLE)', '75738', ''),
(4, '4', 'A', 'General Information', 'COMPLETE ADDRESS WITH PIN CODE', 'BHAVANS VIVEKANANDA VIDYA MANDIR, MANVILA, PANGAPPARA P.O., TRIVANDRUM - 695581', ''),
(5, '5', 'A', 'General Information', 'PRINCIPAL NAME & QUALIFICATION', 'MS. DEEPA CHANDRAN (M.Sc., B.Ed.)', ''),
(6, '6', 'A', 'General Information', 'SCHOOL EMAIL ID', 'bhavansvvm@gmail.com', ''),
(7, '7', 'A', 'General Information', 'CONTACT DETAILS (LANDLINE/MOBILE)', '0471 2594559', ''),
(8, '1', 'B', 'Documents & Compliance', 'COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSION OF AFFILIATION', 'Valid CBSE Affiliation Extension up to 2028', ''),
(9, '2', 'B', 'Documents & Compliance', 'COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE', 'Bharatiya Vidya Bhavan Society Registration', ''),
(10, '3', 'B', 'Documents & Compliance', 'COPY OF NO OBJECTION CERTIFICATE (NOC) ISSUED, IF APPLICABLE, BY THE STATE GOVT./UT', 'NOC Issued by Govt. of Kerala General Education Dept.', ''),
(11, '4', 'B', 'Documents & Compliance', 'COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND IT\'S RENEWAL IF APPLICABLE', 'RTE Recognition Certificate', ''),
(12, '5', 'B', 'Documents & Compliance', 'COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER THE NATIONAL BUILDING CODE', 'Approved PWD Building Safety Certificate', ''),
(13, '6', 'B', 'Documents & Compliance', 'COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPETENT AUTHORITY', 'Kerala Fire & Rescue Services Safety Clearance', ''),
(14, '7', 'B', 'Documents & Compliance', 'COPY OF THE DEO CERTIFICATE SUBMITTED BY THE SCHOOL FOR AFFILIATION', 'DEO Verification & Inspection Report', ''),
(15, '8', 'B', 'Documents & Compliance', 'COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES', 'Water Fitness & Sanitation Clearance Certificate', ''),
(16, '11', 'B', 'Documents & Compliance', 'COMPLETE MANDATORY DISCLOSURE (CBSE SARAS 5.0)', 'Full Verified SARAS 5.0 Disclosure Document', ''),
(17, '1', 'C', 'Result & Academics', 'FEE STRUCTURE OF THE SCHOOL', 'Annual Academic Fee Structure 2027-28', ''),
(18, '2', 'C', 'Result & Academics', 'ANNUAL ACADEMIC CALENDER', 'School Academic Calendar & Activity Schedule', '')
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

-- Table structure for `image_packages`
-- (Clean baseline - ready for admin uploads)

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

INSERT INTO `auto_slides` (`id`, `title`, `subtitle`, `image_url`, `is_active`) VALUES
(1, 'EDUCATION ROOTED IN VALUES. DRIVEN BY EXCELLENCE', 'Nurturing Future Leaders with Academic Rigor and Indian Cultural Heritage', '', 1),
(2, 'State-of-the-Art Science & Digital Learning Labs', 'Empowering students through hands-on discovery and modern technology', '', 1),
(3, 'Serene 2.89 Acres Campus Grounds', 'Safe, green, and inspiring environment for holistic child development', '', 1),
(4, 'Investiture & Student Leadership Ceremonies', 'Developing confidence, discipline, and ethical leadership', '', 1),
(5, 'All Kerala Bhavan\'s Youth & Cultural Fest', 'Celebrating artistic talents and cultural excellence', '', 1)
ON DUPLICATE KEY UPDATE `id`=`id`;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
