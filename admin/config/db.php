<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Database Configuration & Auto-Initialization (SQLite PDO / cPanel Compatible)
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$db_dir = __DIR__ . '/../../database';
if (!file_exists($db_dir)) {
    mkdir($db_dir, 0755, true);
}

$db_path = $db_dir . '/bvb_admin.db';

try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // 1. Create Users Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT DEFAULT '',
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Seed Initial Admin User if empty
    $user_count = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    if ($user_count == 0) {
        $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, full_name, role) VALUES (:user, :pass, :name, 'superadmin')");
        $stmt->execute([
            'user' => 'admin',
            'pass' => password_hash('admin123', PASSWORD_DEFAULT),
            'name' => 'System Administrator'
        ]);
    } else {
        // Upgrade default 'admin' user to 'superadmin' if role is 'admin'
        $pdo->exec("UPDATE users SET role = 'superadmin' WHERE username = 'admin' AND role = 'admin'");
    }

    // 2. Create Categories Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Seed Default Categories if empty
    $cat_count = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    if ($cat_count == 0) {
        $cats = [
            ['name' => 'Campus & Infrastructure', 'slug' => 'campus-infrastructure'],
            ['name' => 'Student Life & Activities', 'slug' => 'student-life'],
            ['name' => 'Events & News', 'slug' => 'events-news'],
            ['name' => 'Cultural Excellence', 'slug' => 'cultural-excellence'],
            ['name' => 'Sports & Athletics', 'slug' => 'sports-athletics'],
            ['name' => 'Leadership & Parliament', 'slug' => 'leadership-parliament']
        ];
        $stmt = $pdo->prepare("INSERT INTO categories (name, slug) VALUES (:name, :slug)");
        foreach ($cats as $c) {
            $stmt->execute($c);
        }
    }

    // 3. Create Images Table (Supports comma-separated display_location e.g. 'campus_discovery,life_at_bhavans')
    $pdo->exec("CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        image_type TEXT NOT NULL DEFAULT 'sub', -- 'main' or 'sub'
        file_path TEXT NOT NULL,
        title TEXT DEFAULT '',
        subtitle TEXT DEFAULT '',
        display_location TEXT NOT NULL DEFAULT 'moments_at_bhavans',
        sort_order INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )");

    // Seed Initial Images if empty
    $img_count = $pdo->query("SELECT COUNT(*) FROM images")->fetchColumn();
    if ($img_count == 0) {
        $seed_images = [
            // Campus Discovery (Category 1)
            ['cat' => 1, 'type' => 'main', 'path' => 'assets/images/campus/campus-view.jpg', 'title' => '3 Academic Blocks', 'sub' => 'Bhishma Main Block, Vyasa Block, and MG Nursery Block', 'loc' => 'campus_discovery,moments_at_bhavans', 'order' => 1],
            ['cat' => 1, 'type' => 'sub', 'path' => 'assets/images/campus/computer-lab.svg', 'title' => 'Hi-Tech Computer Lab', 'sub' => 'Modern networked terminals with programming compilers', 'loc' => 'campus_discovery', 'order' => 2],
            ['cat' => 1, 'type' => 'sub', 'path' => 'assets/images/campus/science-labs.svg', 'title' => 'Science Laboratories', 'sub' => 'Individual Physics, Chemistry, and Biology labs', 'loc' => 'campus_discovery', 'order' => 3],
            ['cat' => 1, 'type' => 'sub', 'path' => 'assets/images/campus/library.svg', 'title' => 'Library (5,891+ Books)', 'sub' => 'Comprehensive knowledge repository with national journals', 'loc' => 'campus_discovery', 'order' => 4],
            ['cat' => 1, 'type' => 'sub', 'path' => 'assets/images/campus/auditorium.svg', 'title' => 'Bhishma Block Auditorium', 'sub' => 'Multipurpose indoor auditorium hosting assemblies and fests', 'loc' => 'campus_discovery', 'order' => 5],
            ['cat' => 1, 'type' => 'sub', 'path' => 'assets/images/campus/nakshathravanam.svg', 'title' => 'Nakshathravanam Grove', 'sub' => '28 indigenous trees representing 28 zodiac stars', 'loc' => 'campus_discovery', 'order' => 6],

            // Life at Bhavan's (Category 2)
            ['cat' => 2, 'type' => 'main', 'path' => 'assets/images/student-life/investiture-awards.jpg', 'title' => 'Investiture Ceremony & Parliament', 'sub' => 'Democratic election of Head Boy, Head Girl, and House Prefects', 'loc' => 'life_at_bhavans,moments_at_bhavans', 'order' => 1],
            ['cat' => 2, 'type' => 'sub', 'path' => 'assets/images/student-life/adharva-dance.jpg', 'title' => 'Adharva Inter-School Fest', 'sub' => 'Flagship inter-school extravaganza bringing hundreds of students', 'loc' => 'life_at_bhavans', 'order' => 2],
            ['cat' => 2, 'type' => 'sub', 'path' => 'assets/images/student-life/fest-crowd.jpg', 'title' => 'Onam & Festivities', 'sub' => 'Traditional Onam pookkalam and cultural celebrations', 'loc' => 'life_at_bhavans', 'order' => 3],

            // What's Happening (Category 3)
            ['cat' => 3, 'type' => 'main', 'path' => 'assets/images/events/investiture-1.jpg', 'title' => 'Annual Day Celebrations 2025–2026', 'sub' => 'Grand spectacle of theatrical drama, music, and dance', 'loc' => 'whats_happening,moments_at_bhavans', 'order' => 1],
            ['cat' => 3, 'type' => 'sub', 'path' => 'assets/images/events/cultural-fest.jpg', 'title' => 'All Kerala Bhavan\'s Cultural Fest', 'sub' => 'High-spirited inter-Bhavan competitions across Kerala', 'loc' => 'whats_happening', 'order' => 2],
            ['cat' => 3, 'type' => 'sub', 'path' => 'assets/images/events/adharva-fest.jpg', 'title' => 'Adharva Inter-School Fest Stage', 'sub' => 'Inter-school talent contest and youth parliament', 'loc' => 'whats_happening', 'order' => 3],

            // Moments at Bhavan's (Category 4)
            ['cat' => 4, 'type' => 'main', 'path' => 'assets/images/events/investiture-1.jpg', 'title' => 'Investiture Ceremony Grand Stage', 'sub' => 'Annual Day Stage & Guest Induction', 'loc' => 'moments_at_bhavans', 'order' => 1],
            ['cat' => 4, 'type' => 'sub', 'path' => 'assets/images/events/school-parliament.jpg', 'title' => 'Elected School Parliament Cabinet', 'sub' => 'Full Student Assembly Hall', 'loc' => 'moments_at_bhavans', 'order' => 2],
            ['cat' => 4, 'type' => 'sub', 'path' => 'assets/images/events/adharva-fest.jpg', 'title' => 'Adharva Inter-School Fest', 'sub' => 'Cultural Arts & Stage Competitions', 'loc' => 'moments_at_bhavans', 'order' => 3],
            ['cat' => 4, 'type' => 'sub', 'path' => 'assets/images/student-life/adharva-dance.jpg', 'title' => 'Classical Dance Drama', 'sub' => 'Traditional Kerala Classical Performance', 'loc' => 'moments_at_bhavans', 'order' => 4],
            ['cat' => 4, 'type' => 'sub', 'path' => 'assets/images/events/investiture-oath.jpg', 'title' => 'Investiture Oath Taking', 'sub' => 'Student Council Solemn Pledge', 'loc' => 'moments_at_bhavans', 'order' => 5],
            ['cat' => 4, 'type' => 'sub', 'path' => 'assets/images/events/cultural-fest.jpg', 'title' => 'All Kerala Bhavan\'s Fest', 'sub' => 'Statewide Inter-Bhavan Cultural Gathering', 'loc' => 'moments_at_bhavans', 'order' => 6]
        ];

        $stmt = $pdo->prepare("INSERT INTO images (category_id, image_type, file_path, title, subtitle, display_location, sort_order, status) 
                               VALUES (:cat, :type, :path, :title, :sub, :loc, :order, 'active')");
        foreach ($seed_images as $img) {
            $stmt->execute($img);
        }
    }

    // 4. Create Notices Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS notices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT DEFAULT '',
        category TEXT DEFAULT 'General',
        notice_date DATE DEFAULT (DATE('now')),
        pdf_link TEXT DEFAULT '',
        is_ticker INTEGER DEFAULT 1,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Seed Notices if empty
    $notice_count = $pdo->query("SELECT COUNT(*) FROM notices")->fetchColumn();
    if ($notice_count == 0) {
        $seed_notices = [
            [
                'title' => 'Admissions Open for Academic Session 2027–2028 (LKG to Class XI)',
                'content' => 'Registration forms for admission to LKG, Class I, Class XI Science & Commerce streams are available online and at the school office.',
                'cat' => 'Admissions',
                'date' => '2026-09-15',
                'pdf' => 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/Mandatory-Disclosure.pdf',
                'ticker' => 1
            ],
            [
                'title' => 'Annual CBSE Board Examination Schedule & Guidelines Released',
                'content' => 'Classes X and XII CBSE Board examination instructions, timetable, and admit card download notifications have been released.',
                'cat' => 'Academics',
                'date' => '2026-09-10',
                'pdf' => 'images/Mandatory Disclosure/C. RESULT AND ACADEMICS/Academic-Calendar.csv',
                'ticker' => 1
            ],
            [
                'title' => 'Adharva Inter-School Cultural Fest Winners Announced',
                'content' => 'Bhavan\'s Manvila won 1st Place overall champion trophy at the All Kerala Bhavan\'s Youth Festival.',
                'cat' => 'Achievements',
                'date' => '2026-09-01',
                'pdf' => '',
                'ticker' => 1
            ]
        ];
        $stmt = $pdo->prepare("INSERT INTO notices (title, content, category, notice_date, pdf_link, is_ticker, status) VALUES (:title, :content, :cat, :date, :pdf, :ticker, 'active')");
        foreach ($seed_notices as $n) {
            $stmt->execute($n);
        }
    }

    // 5. Create Mandatory Disclosures Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS mandatory_disclosures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_code TEXT NOT NULL, -- 'GENERAL_INFO', 'DOCUMENTS_INFO', 'RESULT_ACADEMICS', 'STAFF_TEACHING', 'INFRASTRUCTURE'
        sl_no INTEGER NOT NULL,
        document_type TEXT NOT NULL,
        document_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Seed Mandatory Disclosures if empty
    $md_count = $pdo->query("SELECT COUNT(*) FROM mandatory_disclosures")->fetchColumn();
    if ($md_count == 0) {
        $seed_md = [
            ['cat' => 'DOCUMENTS_INFO', 'sl' => 1, 'type' => 'Copies of Affiliation Letter', 'name' => 'CBSE Affiliation Grant Letter (Affiliation No: 930460)', 'path' => 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/AFFILIATION LETTER.pdf'],
            ['cat' => 'DOCUMENTS_INFO', 'sl' => 2, 'type' => 'Copies of Societies/Trust Registration', 'name' => 'Bharatiya Vidya Bhavan Trust Registration Certificate', 'path' => 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/TRUST.pdf'],
            ['cat' => 'DOCUMENTS_INFO', 'sl' => 3, 'type' => 'Copy of No Objection Certificate (NOC)', 'name' => 'State Government NOC for CBSE Affiliation', 'path' => 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/NOC.pdf'],
            ['cat' => 'DOCUMENTS_INFO', 'sl' => 4, 'type' => 'Copies of Recognition Certificate under RTE Act', 'name' => 'DEO Recognition Certificate', 'path' => 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/DEO-certificate.pdf'],
            ['cat' => 'DOCUMENTS_INFO', 'sl' => 5, 'type' => 'Copy of Building Safety Certificate', 'name' => 'Public Works Department Building Fitness Certificate', 'path' => 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/building-fitness.pdf'],
            ['cat' => 'DOCUMENTS_INFO', 'sl' => 6, 'type' => 'Copy of Fire Safety Certificate', 'name' => 'Fire & Rescue Services Department Safety Certificate', 'path' => 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/fire-safety.pdf'],
            ['cat' => 'DOCUMENTS_INFO', 'sl' => 7, 'type' => 'Copy of Water, Health & Sanitation Certificate', 'name' => 'Safe Drinking Water and Health Sanitation Certificate', 'path' => 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/SANITATION.pdf'],
            ['cat' => 'DOCUMENTS_INFO', 'sl' => 8, 'type' => 'Copy of Transport Safety Certificate', 'name' => 'Motor Vehicles Department Bus Transport Safety Clearance', 'path' => 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/transport safety.pdf'],
            ['cat' => 'RESULT_ACADEMICS', 'sl' => 1, 'type' => 'Fee Structure of the School', 'name' => 'Approved Fee Schedule 2026–2027', 'path' => 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/Mandatory-Disclosure.pdf'],
            ['cat' => 'RESULT_ACADEMICS', 'sl' => 2, 'type' => 'Annual Academic Calendar', 'name' => 'School Academic Calendar & Activity Schedule', 'path' => 'images/Mandatory Disclosure/C. RESULT AND ACADEMICS/Academic-Calendar.csv'],
            ['cat' => 'RESULT_ACADEMICS', 'sl' => 3, 'type' => 'School Management Committee (SMC)', 'name' => 'List of School Management Committee Members', 'path' => 'images/Mandatory Disclosure/C. RESULT AND ACADEMICS/SMC.pdf'],
            ['cat' => 'RESULT_ACADEMICS', 'sl' => 4, 'type' => 'Parents Teachers Association (PTA)', 'name' => 'PTA Executive Committee & Members', 'path' => 'images/Mandatory Disclosure/B. DOCUMENTS AND INFORMATION/pta.pdf']
        ];
        $stmt = $pdo->prepare("INSERT INTO mandatory_disclosures (category_code, sl_no, document_type, document_name, file_path) VALUES (:cat, :sl, :type, :name, :path)");
        foreach ($seed_md as $m) {
            $stmt->execute($m);
        }
    }

    // 6. Create Popups Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS popups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT DEFAULT 'Admissions Open 2027–2028',
        message TEXT DEFAULT 'Welcome to Bhavan''s Vivekananda Vidya Mandir, Manvila! Admissions are now open for LKG to Class XI.',
        image_url TEXT DEFAULT 'images/main page popup/1.jpg',
        button_text TEXT DEFAULT 'APPLY ONLINE NOW',
        button_url TEXT DEFAULT 'admissions.html',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Seed Popup if empty
    $popup_count = $pdo->query("SELECT COUNT(*) FROM popups")->fetchColumn();
    if ($popup_count == 0) {
        $stmt = $pdo->prepare("INSERT INTO popups (title, message, image_url, button_text, button_url, is_active) 
                               VALUES (:title, :msg, :img, :btn_text, :btn_url, 1)");
        $stmt->execute([
            'title' => 'Welcome to Bhavan\'s Vivekananda Vidya Mandir, Manvila',
            'msg' => 'Admissions are now open for LKG to Class XI Science & Commerce streams. Register today for high quality holistic education.',
            'img' => 'images/main page popup/1.jpg',
            'btn_text' => 'ADMISSION INFO',
            'btn_url' => 'admissions.html'
        ]);
    }

} catch (PDOException $e) {
    die("Database Connection Error: " . $e->getMessage());
}
