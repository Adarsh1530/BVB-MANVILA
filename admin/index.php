<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Admin Dashboard - Institutional UI/UX Design System
 */

require_once __DIR__ . '/config/db.php';

if (empty($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit;
}

$user = $_SESSION['admin_user'] ?? 'admin';
$role = $_SESSION['admin_role'] ?? 'admin';

// Fetch Categories & Images
$categories = $pdo->query("SELECT * FROM categories ORDER BY id ASC")->fetchAll();
$images_raw = $pdo->query("SELECT * FROM images ORDER BY category_id ASC, sort_order ASC, id ASC")->fetchAll();

$images_by_cat = [];
foreach ($images_raw as $img) {
    $cat_id = $img['category_id'];
    if (!isset($images_by_cat[$cat_id])) {
        $images_by_cat[$cat_id] = [];
    }
    $images_by_cat[$cat_id][] = $img;
}

// Fetch Notices
$notices = $pdo->query("SELECT * FROM notices ORDER BY notice_date DESC, id DESC")->fetchAll();

// Fetch Mandatory Disclosures
$disclosures = $pdo->query("SELECT * FROM mandatory_disclosures ORDER BY category_code ASC, sl_no ASC")->fetchAll();

// Fetch Popup Config
$popup = $pdo->query("SELECT * FROM popups ORDER BY id DESC LIMIT 1")->fetch() ?: [
    'title' => 'Welcome to Bhavan\'s Vivekananda Vidya Mandir, Manvila',
    'message' => 'Admissions are open for LKG to Class XI Science & Commerce streams.',
    'image_url' => 'images/main page popup/1.jpg',
    'button_text' => 'ADMISSION INFO',
    'button_url' => 'admissions.html',
    'is_active' => 1
];

// Fetch Users
$users = $pdo->query("SELECT id, username, full_name, role, created_at FROM users ORDER BY id ASC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>School Portal | Bhavan's Vivekananda Vidya Mandir, Manvila</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/variables.css">
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/components.css">
  <link rel="stylesheet" href="css/admin.css">
  <link rel="icon" type="image/png" href="../assets/images/bvb-manvila-logo.png">
</head>
<body>
  <!-- 1. TOP UTILITY BAR -->
  <header class="top-bar">
    <div class="container-wide top-bar-inner">
      <div class="top-bar-left">
        <div class="top-bar-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>Support: 0471 2594559</span>
        </div>
        <div class="top-bar-item">
          <span class="top-bar-badge">CBSE Affiliation No: 930460</span>
        </div>
      </div>
      <div class="top-bar-right">
        <span class="top-bar-item" style="color: rgba(255,255,255,0.9);">
          Logged in as: <strong><?php echo htmlspecialchars($user); ?></strong> <span class="badge badge-gold" style="font-size:0.7rem; padding: 2px 6px;"><?php echo strtoupper(htmlspecialchars($role)); ?></span>
        </span>
        <a href="../index.html" target="_blank" class="top-bar-link">View Public Site ↗</a>
        <a href="logout.php" class="top-bar-link" style="color: var(--color-accent-gold);">Logout</a>
      </div>
    </div>
  </header>

  <!-- 2. MAIN HEADER -->
  <nav class="main-header" id="mainHeader">
    <div class="container-wide header-container">
      <a href="../index.html" class="header-logo" aria-label="Bhavan's Vivekananda Vidya Mandir Home">
        <img src="../assets/images/bvb-manvila-logo.png" alt="Bhavan's Vivekananda Vidya Mandir Logo" width="60" height="60">
        <div class="header-logo-text">
          <span class="logo-title">BHAVAN'S VIVEKANANDA VIDYA MANDIR</span>
          <span class="logo-sub">MANVILA, THIRUVANANTHAPURAM • SCHOOL MANAGEMENT PORTAL</span>
        </div>
      </a>

      <div class="header-actions">
        <a href="../index.html" target="_blank" class="btn btn-primary btn-pill header-cta-desktop">VISIT WEBSITE</a>
      </div>
    </div>
  </nav>

  <!-- 3. PAGE BANNER -->
  <div class="page-banner">
    <div class="container-wide">
      <h1>Central Website Control Panel</h1>
      <div class="breadcrumbs">
        <a href="../index.html">Home</a>
        <span class="divider">/</span>
        <span class="current">Management Portal</span>
      </div>
    </div>
  </div>

  <main class="section-padding bg-white">
    <div class="container-wide">

      <!-- Notification Alert Box -->
      <div id="adminAlert" class="admin-alert hidden"></div>

      <!-- VERTICAL SIDEBAR LAYOUT -->
      <div class="admin-dashboard-layout">

        <!-- VERTICAL LEFT MENU BAR -->
        <aside class="admin-sidebar">
          <div class="admin-sidebar-header">MODULE MANAGEMENT</div>
          <nav class="admin-sidebar-nav">
            <button class="sidebar-nav-btn active" data-tab="tab-images">
              <span class="nav-icon">🖼️</span> <span>IMAGE & SECTIONS</span>
            </button>
            <button class="sidebar-nav-btn" data-tab="tab-notices">
              <span class="nav-icon">📢</span> <span>NOTICES & TICKER</span>
            </button>
            <button class="sidebar-nav-btn" data-tab="tab-disclosures">
              <span class="nav-icon">📜</span> <span>MANDATORY DISCLOSURE</span>
            </button>
            <button class="sidebar-nav-btn" data-tab="tab-popup">
              <span class="nav-icon">🔔</span> <span>ENTRANCE POPUP</span>
            </button>
            <?php if ($role !== 'editor'): ?>
            <button class="sidebar-nav-btn" data-tab="tab-users">
              <span class="nav-icon">👥</span> <span>USER MANAGEMENT</span>
            </button>
            <?php endif; ?>
          </nav>
        </aside>

        <!-- RIGHT MAIN CONTENT PANEL -->
        <div class="admin-main-panel">

          <!-- ========================================== -->
          <!-- TAB 1: IMAGE & MULTI-LOCATION CHECKBOXES   -->
          <!-- ========================================== -->
          <section id="tab-images" class="tab-pane active">
            <div class="card card-bordered admin-intro-banner">
              <div>
                <span class="badge badge-blue" style="margin-bottom: 0.5rem; display: inline-block;">IMAGE CONTROL MATRIX</span>
                <h3 style="color: var(--color-deep-blue); margin-bottom: 0.35rem;">Category Image Upload & Multi-Section Checkboxes</h3>
                <p style="color: var(--color-text-secondary); margin: 0; font-size: 0.9375rem;">
                  Maximum 6 images per category (1 Main Image + 5 Sub Images). Click the <strong>+</strong> button on any slot to upload an image from file explorer.
                </p>
              </div>
            </div>

            <div class="categories-grid" style="display: flex; flex-direction: column; gap: 2rem; margin-top: 2rem;">
              <?php foreach ($categories as $cat): 
                $cat_id = $cat['id'];
                $cat_imgs = $images_by_cat[$cat_id] ?? [];
                $total_imgs = count($cat_imgs);
                $main_img = null;
                $sub_imgs = [];

                foreach ($cat_imgs as $ci) {
                    if ($ci['image_type'] === 'main') {
                        $main_img = $ci;
                    } else {
                        $sub_imgs[] = $ci;
                    }
                }
              ?>
              <div class="card card-bordered category-card-block" data-category-id="<?php echo $cat_id; ?>" style="padding: 0; overflow: hidden;">
                <div class="category-header-bar">
                  <div>
                    <h4 style="color: var(--color-deep-blue); margin: 0 0 0.25rem 0; font-size: 1.15rem;"><?php echo htmlspecialchars($cat['name']); ?></h4>
                    <span class="badge <?php echo $total_imgs >= 6 ? 'badge-red' : 'badge-blue'; ?>">
                      Used: <?php echo $total_imgs; ?> / 6 Max
                    </span>
                  </div>
                </div>

                <div class="slots-matrix-container">
                  <!-- Main Image Slot -->
                  <div class="slot-box main-slot-box">
                    <span class="badge badge-navy" style="margin-bottom: 0.5rem; display: inline-block;">MAIN IMAGE (1 MAX)</span>
                    <?php if ($main_img): 
                      $locs = explode(',', $main_img['display_location']);
                    ?>
                      <div class="img-preview-box">
                        <img src="../<?php echo htmlspecialchars($main_img['file_path']); ?>" alt="Main Image">
                      </div>
                      <div class="slot-info-text">
                        <h5 style="color: var(--color-deep-blue); margin: 0.5rem 0 0.2rem 0;"><?php echo htmlspecialchars($main_img['title'] ?: 'Main Image'); ?></h5>
                      </div>
                      <form class="location-checkboxes-form" data-image-id="<?php echo $main_img['id']; ?>" style="margin-top: 0.75rem;">
                        <label class="checkbox-title">Select Website Display Sections:</label>
                        <div class="checkbox-options-list">
                          <label><input type="checkbox" name="loc" value="campus_discovery" <?php echo in_array('campus_discovery', $locs) ? 'checked' : ''; ?>> * A CAMPUS FOR DISCOVERY</label>
                          <label><input type="checkbox" name="loc" value="whats_happening" <?php echo in_array('whats_happening', $locs) ? 'checked' : ''; ?>> * WHAT'S HAPPENING</label>
                          <label><input type="checkbox" name="loc" value="life_at_bhavans" <?php echo in_array('life_at_bhavans', $locs) ? 'checked' : ''; ?>> * LIFE AT BHAVAN'S</label>
                          <label><input type="checkbox" name="loc" value="moments_at_bhavans" <?php echo in_array('moments_at_bhavans', $locs) ? 'checked' : ''; ?>> * MOMENTS AT BHAVAN'S</label>
                        </div>
                        <div class="slot-action-buttons">
                          <button type="submit" class="btn btn-primary btn-xs">Save Sections</button>
                          <button type="button" class="btn btn-outline btn-xs btn-slot-upload-trigger" data-category-id="<?php echo $cat_id; ?>" data-image-type="main" data-sort-order="1">Replace (+)</button>
                          <button type="button" class="btn btn-outline btn-xs btn-delete-image" data-image-id="<?php echo $main_img['id']; ?>" style="color: #DC2626; border-color: #FCA5A5;">Delete</button>
                        </div>
                      </form>
                    <?php else: ?>
                      <button type="button" class="slot-upload-plus-btn btn-slot-upload-trigger" data-category-id="<?php echo $cat_id; ?>" data-image-type="main" data-sort-order="1">
                        <div class="plus-icon">+</div>
                        <span>Upload Main Image</span>
                      </button>
                    <?php endif; ?>
                  </div>

                  <!-- Sub Images Slots (Up to 5) -->
                  <div class="sub-slots-matrix">
                    <?php for ($i = 0; $i < 5; $i++): 
                      $sub_img = $sub_imgs[$i] ?? null;
                    ?>
                      <div class="slot-box sub-slot-box">
                        <span class="badge badge-gold" style="margin-bottom: 0.5rem; display: inline-block;">SUB IMAGE <?php echo $i + 1; ?></span>
                        <?php if ($sub_img): 
                          $locs = explode(',', $sub_img['display_location']);
                        ?>
                          <div class="img-preview-box sm">
                            <img src="../<?php echo htmlspecialchars($sub_img['file_path']); ?>" alt="Sub Image">
                          </div>
                          <div class="slot-info-text">
                            <h5 style="color: var(--color-deep-blue); margin: 0.4rem 0 0 0; font-size: 0.875rem;"><?php echo htmlspecialchars($sub_img['title'] ?: 'Sub Image'); ?></h5>
                          </div>
                          <form class="location-checkboxes-form" data-image-id="<?php echo $sub_img['id']; ?>" style="margin-top: 0.5rem;">
                            <label class="checkbox-title" style="font-size:0.75rem;">Display Sections:</label>
                            <div class="checkbox-options-list">
                              <label><input type="checkbox" name="loc" value="campus_discovery" <?php echo in_array('campus_discovery', $locs) ? 'checked' : ''; ?>> * A CAMPUS FOR DISCOVERY</label>
                              <label><input type="checkbox" name="loc" value="whats_happening" <?php echo in_array('whats_happening', $locs) ? 'checked' : ''; ?>> * WHAT'S HAPPENING</label>
                              <label><input type="checkbox" name="loc" value="life_at_bhavans" <?php echo in_array('life_at_bhavans', $locs) ? 'checked' : ''; ?>> * LIFE AT BHAVAN'S</label>
                              <label><input type="checkbox" name="loc" value="moments_at_bhavans" <?php echo in_array('moments_at_bhavans', $locs) ? 'checked' : ''; ?>> * MOMENTS AT BHAVAN'S</label>
                            </div>
                            <div class="slot-action-buttons">
                              <button type="submit" class="btn btn-primary btn-xs">Save</button>
                              <button type="button" class="btn btn-outline btn-xs btn-set-main" data-image-id="<?php echo $sub_img['id']; ?>">Make Main</button>
                              <button type="button" class="btn btn-outline btn-xs btn-slot-upload-trigger" data-category-id="<?php echo $cat_id; ?>" data-image-type="sub" data-sort-order="<?php echo $i + 2; ?>">Replace (+)</button>
                              <button type="button" class="btn btn-outline btn-xs btn-delete-image" data-image-id="<?php echo $sub_img['id']; ?>" style="color: #DC2626; border-color: #FCA5A5;">Delete</button>
                            </div>
                          </form>
                        <?php else: ?>
                          <button type="button" class="slot-upload-plus-btn btn-slot-upload-trigger" data-category-id="<?php echo $cat_id; ?>" data-image-type="sub" data-sort-order="<?php echo $i + 2; ?>">
                            <div class="plus-icon">+</div>
                            <span>Upload Sub Image <?php echo $i + 1; ?></span>
                          </button>
                        <?php endif; ?>
                      </div>
                    <?php endfor; ?>
                  </div>
                </div>
              </div>
              <?php endforeach; ?>
            </div>
          </section>

      <!-- ========================================== -->
      <!-- TAB 2: NOTICE & SCROLL TICKER MANAGEMENT   -->
      <!-- ========================================== -->
      <section id="tab-notices" class="tab-pane">
        <div class="card card-bordered admin-intro-banner">
          <div>
            <span class="badge badge-gold" style="margin-bottom: 0.5rem; display: inline-block;">NOTICES & TICKER</span>
            <h3 style="color: var(--color-deep-blue); margin-bottom: 0.35rem;">School Notices & Scrolling Ticker Control</h3>
            <p style="color: var(--color-text-secondary); margin: 0; font-size: 0.9375rem;">
              Manage campus announcements and toggle notices to scroll in the site-wide scrolling ticker bar.
            </p>
          </div>
          <button class="btn btn-primary btn-pill" id="btnOpenNoticeModal">+ Create New Notice</button>
        </div>

        <div class="card card-bordered" style="padding: 0; overflow-x: auto; margin-top: 1.5rem;">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Notice Title</th>
                <th>Category</th>
                <th>Notice Date</th>
                <th>PDF Link</th>
                <th>Scrolling Ticker</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($notices as $n): ?>
              <tr>
                <td>#<?php echo $n['id']; ?></td>
                <td><strong><?php echo htmlspecialchars($n['title']); ?></strong></td>
                <td><span class="badge badge-blue"><?php echo htmlspecialchars($n['category']); ?></span></td>
                <td><?php echo htmlspecialchars($n['notice_date']); ?></td>
                <td>
                  <?php if ($n['pdf_link']): ?>
                    <a href="../<?php echo htmlspecialchars($n['pdf_link']); ?>" target="_blank" class="btn btn-outline btn-xs">View PDF</a>
                  <?php else: ?>
                    <span class="text-muted">None</span>
                  <?php endif; ?>
                </td>
                <td>
                  <button class="btn btn-xs <?php echo $n['is_ticker'] ? 'btn-primary' : 'btn-outline'; ?> btn-toggle-ticker" data-id="<?php echo $n['id']; ?>">
                    <?php echo $n['is_ticker'] ? '✓ Active Ticker' : 'Disabled'; ?>
                  </button>
                </td>
                <td>
                  <button class="btn btn-xs btn-outline btn-delete-notice" data-id="<?php echo $n['id']; ?>" style="color:#DC2626; border-color:#FCA5A5;">Delete</button>
                </td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 3: MANDATORY DISCLOSURE MANAGEMENT     -->
      <!-- ========================================== -->
      <section id="tab-disclosures" class="tab-pane">
        <div class="card card-bordered admin-intro-banner">
          <div>
            <span class="badge badge-blue" style="margin-bottom: 0.5rem; display: inline-block;">CBSE SARAS DISCLOSURE</span>
            <h3 style="color: var(--color-deep-blue); margin-bottom: 0.35rem;">Mandatory Public Disclosure Documents</h3>
            <p style="color: var(--color-text-secondary); margin: 0; font-size: 0.9375rem;">
              Manage official DEO certificates, building safety, affiliation letters, and academic calendar documents.
            </p>
          </div>
          <button class="btn btn-primary btn-pill" id="btnOpenDisclosureModal">+ Add Disclosure Document</button>
        </div>

        <div class="card card-bordered" style="padding: 0; overflow-x: auto; margin-top: 1.5rem;">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Sl No</th>
                <th>Document Type</th>
                <th>Document Name</th>
                <th>File Path</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($disclosures as $d): ?>
              <tr>
                <td><span class="badge badge-navy"><?php echo htmlspecialchars($d['category_code']); ?></span></td>
                <td><?php echo $d['sl_no']; ?></td>
                <td><?php echo htmlspecialchars($d['document_type']); ?></td>
                <td><strong><?php echo htmlspecialchars($d['document_name']); ?></strong></td>
                <td>
                  <a href="../<?php echo htmlspecialchars($d['file_path']); ?>" target="_blank" class="btn btn-outline btn-xs">Open Document</a>
                </td>
                <td>
                  <button class="btn btn-xs btn-outline btn-delete-disclosure" data-id="<?php echo $d['id']; ?>" style="color:#DC2626; border-color:#FCA5A5;">Delete</button>
                </td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 4: ENTRANCE POPUP MANAGEMENT          -->
      <!-- ========================================== -->
      <section id="tab-popup" class="tab-pane">
        <div class="card card-bordered admin-intro-banner">
          <div>
            <span class="badge badge-gold" style="margin-bottom: 0.5rem; display: inline-block;">ANNOUNCEMENT POPUP</span>
            <h3 style="color: var(--color-deep-blue); margin-bottom: 0.35rem;">Site Entrance Popup Modal Settings</h3>
            <p style="color: var(--color-text-secondary); margin: 0; font-size: 0.9375rem;">
              Enable or disable the entrance popup modal and upload pure announcement images (`images/main page popup/1.jpg`).
            </p>
          </div>
        </div>

        <div class="card card-bordered" style="max-width: 720px; margin-top: 1.5rem; padding: 2rem;">
          <form id="popupSettingsForm" enctype="multipart/form-data">
            <input type="hidden" name="action" value="save_popup">
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label class="toggle-switch-label" style="display: flex; align-items: center; gap: 0.6rem; font-weight: 700; color: var(--color-deep-blue); cursor: pointer;">
                <input type="checkbox" name="is_active" value="1" <?php echo !empty($popup['is_active']) ? 'checked' : ''; ?> style="width: 18px; height: 18px;">
                Enable Pure Image Entrance Announcement Popup
              </label>
            </div>

            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label style="display: block; font-weight: 600; color: var(--color-deep-blue); margin-bottom: 0.4rem;">Current Popup Image</label>
              <div style="width: 100%; max-height: 240px; border-radius: 8px; overflow: hidden; border: 1px solid var(--color-border); background: #0f172a; display: flex; align-items: center; justify-content: center;">
                <img src="../<?php echo htmlspecialchars($popup['image_url']); ?>" alt="Current Popup Image" style="max-height: 240px; width: auto; object-fit: contain;">
              </div>
              <label style="display: block; font-weight: 600; color: var(--color-deep-blue); margin: 1rem 0 0.4rem 0;">Upload New Pure Popup Image</label>
              <input type="file" name="popup_image" class="form-control" accept="image/*" style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
              <small class="text-muted" style="display: block; margin-top: 0.4rem;">Image path: <code>images/main page popup/1.jpg</code></small>
            </div>

            <button type="submit" class="btn btn-primary btn-pill btn-lg">Save Entrance Popup Settings</button>
          </form>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 5: USER MANAGEMENT                     -->
      <!-- ========================================== -->
      <section id="tab-users" class="tab-pane">
        <div class="card card-bordered admin-intro-banner">
          <div>
            <span class="badge badge-blue" style="margin-bottom: 0.5rem; display: inline-block;">ADMIN SECURITY</span>
            <h3 style="color: var(--color-deep-blue); margin-bottom: 0.35rem;">Admin User Accounts & Access Control</h3>
            <p style="color: var(--color-text-secondary); margin: 0; font-size: 0.9375rem;">
              Create new admin accounts, update credentials, and manage roles. Initial user: <code>admin</code> / <code>admin123</code>.
            </p>
          </div>
          <button class="btn btn-primary btn-pill" id="btnOpenUserModal">+ Create Admin User</button>
        </div>

        <div class="card card-bordered" style="padding: 0; overflow-x: auto; margin-top: 1.5rem;">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($users as $u): ?>
              <tr>
                <td>#<?php echo $u['id']; ?></td>
                <td><strong><?php echo htmlspecialchars($u['username']); ?></strong></td>
                <td><?php echo htmlspecialchars($u['full_name'] ?: 'Administrator'); ?></td>
                <td><span class="badge badge-gold"><?php echo strtoupper(htmlspecialchars($u['role'])); ?></span></td>
                <td><?php echo htmlspecialchars($u['created_at']); ?></td>
                <td>
                  <button class="btn btn-xs btn-outline btn-change-pass" data-id="<?php echo $u['id']; ?>" data-user="<?php echo htmlspecialchars($u['username']); ?>">Change Password</button>
                  <button class="btn btn-xs btn-outline btn-delete-user" data-id="<?php echo $u['id']; ?>" style="color:#DC2626; border-color:#FCA5A5;">Delete</button>
                </td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </section>

        </div><!-- /.admin-main-panel -->
      </div><!-- /.admin-dashboard-layout -->

    </div><!-- /.container-wide -->
  </main>

  <!-- Hidden File Input for Direct Slot Upload (+ Icon) -->
  <input type="file" id="directSlotFileInput" style="display: none;" accept="image/*">

  <!-- Upload Image Modal -->
  <div class="admin-modal" id="uploadImageModal">
    <div class="admin-modal-card">
      <button class="modal-close">&times;</button>
      <h3 style="color: var(--color-deep-blue); margin-bottom: 1rem;">Upload Image to <span id="modalCatName">Category</span></h3>
      <form id="uploadImageForm" enctype="multipart/form-data">
        <input type="hidden" name="action" value="upload_image">
        <input type="hidden" name="category_id" id="modalCatId" value="">

        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Image Type</label>
          <select name="image_type" class="form-control" style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
            <option value="sub">Sub Image (Up to 5)</option>
            <option value="main">Main Image (1 Max)</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Select Image File</label>
          <input type="file" name="image_file" class="form-control" accept="image/*" required style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
        </div>

        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Image Title / Caption</label>
          <input type="text" name="title" class="form-control" placeholder="e.g. Science Laboratory" style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
        </div>

        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Subtitle / Description</label>
          <input type="text" name="subtitle" class="form-control" placeholder="e.g. Modern Physics & Chemistry Labs" style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
        </div>

        <div class="form-group" style="margin-bottom: 1.25rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Select Display Sections:</label>
          <div class="checkbox-options-list" style="background: #F8FAFC; padding: 0.75rem; border-radius: 6px; border: 1px solid var(--color-border);">
            <label><input type="checkbox" name="locations[]" value="campus_discovery" checked> A CAMPUS FOR DISCOVERY</label>
            <label><input type="checkbox" name="locations[]" value="life_at_bhavans" checked> LIFE AT BHAVAN'S</label>
            <label><input type="checkbox" name="locations[]" value="whats_happening"> WHAT'S HAPPENING</label>
            <label><input type="checkbox" name="locations[]" value="moments_at_bhavans" checked> MOMENTS AT BHAVAN'S</label>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-pill" style="width:100%; padding: 0.75rem;">Upload Image Now</button>
      </form>
    </div>
  </div>

  <!-- Create User Modal -->
  <div class="admin-modal" id="createUserModal">
    <div class="admin-modal-card">
      <button class="modal-close">&times;</button>
      <h3 style="color: var(--color-deep-blue); margin-bottom: 1rem;">Create New Admin Account</h3>
      <form id="createUserForm">
        <input type="hidden" name="action" value="create_user">
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Username</label>
          <input type="text" name="username" class="form-control" required placeholder="e.g. editor1" style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
        </div>
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Full Name</label>
          <input type="text" name="full_name" class="form-control" placeholder="e.g. Staff Editor" style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
        </div>
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Password</label>
          <input type="password" name="password" class="form-control" required placeholder="••••••••" style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
        </div>
        <div class="form-group" style="margin-bottom: 1.25rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Role</label>
          <select name="role" class="form-control" style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary btn-pill" style="width:100%; padding: 0.75rem;">Create Account</button>
      </form>
    </div>
  </div>

  <!-- Create Notice Modal -->
  <div class="admin-modal" id="createNoticeModal">
    <div class="admin-modal-card">
      <button class="modal-close">&times;</button>
      <h3 style="color: var(--color-deep-blue); margin-bottom: 1rem;">Create New Notice</h3>
      <form id="createNoticeForm">
        <input type="hidden" name="action" value="save_notice">
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Notice Title</label>
          <input type="text" name="title" class="form-control" required placeholder="e.g. Admissions Open 2027-28" style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
        </div>
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Category</label>
          <select name="category" class="form-control" style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
            <option value="Admissions">Admissions</option>
            <option value="Academics">Academics</option>
            <option value="Events">Events</option>
            <option value="Achievements">Achievements</option>
            <option value="General">General</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Notice Date</label>
          <input type="date" name="notice_date" class="form-control" value="<?php echo date('Y-m-d'); ?>" style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
        </div>
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">PDF Link Path (Optional)</label>
          <input type="text" name="pdf_link" class="form-control" placeholder="images/Mandatory Disclosure/..." style="width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px;">
        </div>
        <div class="form-group" style="margin-bottom: 1.25rem;">
          <label><input type="checkbox" name="is_ticker" value="1" checked> Display in Scrolling Notice Ticker Bar</label>
        </div>
        <button type="submit" class="btn btn-primary btn-pill" style="width:100%; padding: 0.75rem;">Save Notice</button>
      </form>
    </div>
  </div>

  <footer class="site-footer" style="margin-top: 4rem;">
    <div class="container footer-bottom-inner" style="color: rgba(255,255,255,0.85); font-size: 0.875rem;">
      <div><strong>Bhavan's Vivekananda Vidya Mandir</strong> | Manvila, Pangappara P.O., Thiruvananthapuram – 695581</div>
      <div>Admin Control Panel System</div>
    </div>
  </footer>

  <script src="js/admin.js"></script>
</body>
</html>
