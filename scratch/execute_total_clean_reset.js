const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\xampp\\htdocs\\BVB MANVILA';

console.log('=== Executing Total Clean Reset for Website Admin & Public Pages ===');

// 1. Mandatory Disclosures Clean Baseline Schema (Titles & Sl Nos intact, Details & File Links Empty)
const cleanDisclosures = [
  { id: 1, sl_no: "1", category_code: "A", category_name: "General Information", title: "NAME OF THE SCHOOL", details: "", file_link: "" },
  { id: 2, sl_no: "2", category_code: "A", category_name: "General Information", title: "AFFILIATION NO. (IF APPLICABLE)", details: "", file_link: "" },
  { id: 3, sl_no: "3", category_code: "A", category_name: "General Information", title: "SCHOOL CODE (IF APPLICABLE)", details: "", file_link: "" },
  { id: 4, sl_no: "4", category_code: "A", category_name: "General Information", title: "COMPLETE ADDRESS WITH PIN CODE", details: "", file_link: "" },
  { id: 5, sl_no: "5", category_code: "A", category_name: "General Information", title: "PRINCIPAL NAME & QUALIFICATION", details: "", file_link: "" },
  { id: 6, sl_no: "6", category_code: "A", category_name: "General Information", title: "SCHOOL EMAIL ID", details: "", file_link: "" },
  { id: 7, sl_no: "7", category_code: "A", category_name: "General Information", title: "CONTACT DETAILS (LANDLINE/MOBILE)", details: "", file_link: "" },
  { id: 8, sl_no: "1", category_code: "B", category_name: "Documents & Compliance", title: "COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSION OF AFFILIATION", details: "", file_link: "" },
  { id: 9, sl_no: "2", category_code: "B", category_name: "Documents & Compliance", title: "COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE", details: "", file_link: "" },
  { id: 10, sl_no: "3", category_code: "B", category_name: "Documents & Compliance", title: "COPY OF NO OBJECTION CERTIFICATE (NOC) ISSUED, IF APPLICABLE, BY THE STATE GOVT./UT", details: "", file_link: "" },
  { id: 11, sl_no: "4", category_code: "B", category_name: "Documents & Compliance", title: "COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND IT'S RENEWAL IF APPLICABLE", details: "", file_link: "" },
  { id: 12, sl_no: "5", category_code: "B", category_name: "Documents & Compliance", title: "COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER THE NATIONAL BUILDING CODE", details: "", file_link: "" },
  { id: 13, sl_no: "6", category_code: "B", category_name: "Documents & Compliance", title: "COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPETENT AUTHORITY", details: "", file_link: "" },
  { id: 14, sl_no: "7", category_code: "B", category_name: "Documents & Compliance", title: "COPY OF THE DEO CERTIFICATE SUBMITTED BY THE SCHOOL FOR AFFILIATION", details: "", file_link: "" },
  { id: 15, sl_no: "8", category_code: "B", category_name: "Documents & Compliance", title: "COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES", details: "", file_link: "" },
  { id: 16, sl_no: "11", category_code: "B", category_name: "Documents & Compliance", title: "COMPLETE MANDATORY DISCLOSURE (CBSE SARAS 5.0)", details: "", file_link: "" },
  { id: 17, sl_no: "1", category_code: "C", category_name: "Result & Academics", title: "FEE STRUCTURE OF THE SCHOOL", details: "", file_link: "" },
  { id: 18, sl_no: "2", category_code: "C", category_name: "Result & Academics", title: "ANNUAL ACADEMIC CALENDER", details: "", file_link: "" }
];

const cleanData = {
  status: "success",
  users: [
    { id: 1, username: "superadmin", password: "superadmin123", name: "Principal / Director", role: "super admin" },
    { id: 2, username: "admin", password: "admin123", name: "Administrative Officer", role: "admin" },
    { id: 3, username: "school", password: "school123", name: "School Office Staff", role: "school" }
  ],
  popup: {
    id: 1,
    title: "",
    message: "",
    image_url: "",
    button_text: "ADMISSION INFO",
    button_url: "admissions.html",
    is_active: 0
  },
  popup_history: [],
  auto_slides: [],
  notices: [],
  ticker: [],
  mandatory_disclosures: cleanDisclosures,
  image_packages: []
};

// 1. Update api/get_site_data.json
const jsonPath = path.join(projectRoot, 'api', 'get_site_data.json');
fs.writeFileSync(jsonPath, JSON.stringify(cleanData, null, 4), 'utf8');
console.log('✅ Cleaned api/get_site_data.json (auto_slides: [], notices: [], image_packages: [], popup: empty)');

// 2. Update api/get_site_data.php
const phpApiPath = path.join(projectRoot, 'api', 'get_site_data.php');
let phpApiCode = fs.readFileSync(phpApiPath, 'utf8');
phpApiCode = phpApiCode.replace(
  /if \(!empty\(\$notices\) \|\| !empty\(\$disclosures\) \|\| !empty\(\$image_packages\) \|\| !empty\(\$slides\)\)/g,
  'if ($pdo)'
);
fs.writeFileSync(phpApiPath, phpApiCode, 'utf8');
console.log('✅ Updated api/get_site_data.php to return live PDO data cleanly');

// 3. Update bvb_manvila_db.sql
const sqlPath = path.join(projectRoot, 'bvb_manvila_db.sql');
const newSql = `-- Bhavan's Vivekananda Vidya Mandir, Manvila
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
-- Table structure for \`users\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`role\` ENUM('super admin', 'admin', 'school') NOT NULL DEFAULT 'school',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`users\` (\`id\`, \`username\`, \`password\`, \`name\`, \`role\`) VALUES
(1, 'superadmin', 'superadmin123', 'Principal / Director', 'super admin'),
(2, 'admin', 'admin123', 'Administrative Officer', 'admin'),
(3, 'school', 'school123', 'School Office Staff', 'school')
ON DUPLICATE KEY UPDATE \`username\`=\`username\`;

-- --------------------------------------------------------
-- Table structure for \`notices\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`notices\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`content\` TEXT,
  \`category\` VARCHAR(50) DEFAULT 'General',
  \`notice_date\` DATE NOT NULL,
  \`pdf_link\` VARCHAR(255) DEFAULT '',
  \`is_ticker\` TINYINT(1) DEFAULT 1,
  \`status\` VARCHAR(20) DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE \`notices\`;

-- --------------------------------------------------------
-- Table structure for \`popups\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`popups\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`message\` TEXT,
  \`image_url\` LONGTEXT,
  \`button_text\` VARCHAR(100) DEFAULT 'ADMISSION INFO',
  \`button_url\` VARCHAR(255) DEFAULT 'admissions.html',
  \`is_active\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE \`popups\`;
INSERT INTO \`popups\` (\`id\`, \`title\`, \`message\`, \`image_url\`, \`button_text\`, \`button_url\`, \`is_active\`) VALUES
(1, '', '', '', 'ADMISSION INFO', 'admissions.html', 0)
ON DUPLICATE KEY UPDATE \`id\`=\`id\`;

-- --------------------------------------------------------
-- Table structure for \`popup_history\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`popup_history\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`message\` TEXT,
  \`image_url\` LONGTEXT,
  \`button_text\` VARCHAR(100) DEFAULT 'ADMISSION INFO',
  \`button_url\` VARCHAR(255) DEFAULT 'admissions.html',
  \`is_active\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE \`popup_history\`;

-- --------------------------------------------------------
-- Table structure for \`mandatory_disclosures\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`mandatory_disclosures\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`sl_no\` VARCHAR(20) NOT NULL,
  \`category_code\` CHAR(1) NOT NULL DEFAULT 'B',
  \`category_name\` VARCHAR(100) DEFAULT 'Documents & Compliance',
  \`title\` VARCHAR(255) NOT NULL,
  \`details\` TEXT,
  \`file_link\` LONGTEXT,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE \`mandatory_disclosures\`;
INSERT INTO \`mandatory_disclosures\` (\`id\`, \`sl_no\`, \`category_code\`, \`category_name\`, \`title\`, \`details\`, \`file_link\`) VALUES
${cleanDisclosures.map(d => `(${d.id}, '${d.sl_no}', '${d.category_code}', '${d.category_name}', '${d.title.replace(/'/g, "''")}', '', '')`).join(',\n')}
ON DUPLICATE KEY UPDATE \`id\`=\`id\`;

-- --------------------------------------------------------
-- Table structure for \`image_packages\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`image_packages\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`subtitle\` VARCHAR(255) DEFAULT '',
  \`main_image\` LONGTEXT NOT NULL,
  \`sub_images\` LONGTEXT,
  \`target_sections\` LONGTEXT,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE \`image_packages\`;

-- --------------------------------------------------------
-- Table structure for \`auto_slides\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`auto_slides\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`subtitle\` VARCHAR(255) DEFAULT '',
  \`image_url\` LONGTEXT NOT NULL,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE \`auto_slides\`;

COMMIT;
`;

fs.writeFileSync(sqlPath, newSql, 'utf8');
console.log('✅ Cleaned bvb_manvila_db.sql with TRUNCATE statements and empty baseline rows');

console.log('=== Total Reset Script Completed Successfully ===');
