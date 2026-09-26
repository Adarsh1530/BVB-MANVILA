<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Admin Action Handler (Image Uploads, Multi-Location Checkboxes, Notices, Popup, Disclosures, Users)
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config/db.php';

// Auth check
if (empty($_SESSION['admin_logged_in'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
    exit;
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';

try {
    switch ($action) {

        // ==========================================
        // 1. IMAGE & MULTI-LOCATION CHECKBOX ACTIONS
        // ==========================================
        case 'upload_image':
            $category_id = (int)($_POST['category_id'] ?? 0);
            $image_type = trim($_POST['image_type'] ?? 'sub'); // 'main' or 'sub'
            $title = trim($_POST['title'] ?? '');
            $subtitle = trim($_POST['subtitle'] ?? '');
            
            // Collect checkbox locations array and implode with commas
            $locations = $_POST['locations'] ?? [];
            if (is_string($locations)) {
                $locations = array_map('trim', explode(',', $locations));
            }
            $location_str = !empty($locations) ? implode(',', array_filter($locations)) : 'moments_at_bhavans';

            if ($category_id <= 0) {
                throw new Exception("Invalid category selection.");
            }

            // Check Max 6 images per category rule
            $count_stmt = $pdo->prepare("SELECT COUNT(*) FROM images WHERE category_id = :cat");
            $count_stmt->execute(['cat' => $category_id]);
            $total_images = $count_stmt->fetchColumn();

            if ($total_images >= 6) {
                throw new Exception("Maximum limit reached: A category can contain at most 6 images (1 Main + 5 Sub).");
            }

            // Enforce max 1 Main image per category
            if ($image_type === 'main') {
                $main_stmt = $pdo->prepare("SELECT COUNT(*) FROM images WHERE category_id = :cat AND image_type = 'main'");
                $main_stmt->execute(['cat' => $category_id]);
                if ($main_stmt->fetchColumn() > 0) {
                    throw new Exception("A Main Image already exists for this category. Please replace or convert it first.");
                }
            }

            // File Upload Handling
            if (empty($_FILES['image_file']['name'])) {
                throw new Exception("Please select an image file to upload.");
            }

            $upload_dir = __DIR__ . '/../uploads/';
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }

            $ext = strtolower(pathinfo($_FILES['image_file']['name'], PATHINFO_EXTENSION));
            $allowed_exts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
            if (!in_array($ext, $allowed_exts)) {
                throw new Exception("Invalid file format. Allowed: " . implode(', ', $allowed_exts));
            }

            $filename = 'img_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
            $target_path = $upload_dir . $filename;

            if (!move_uploaded_file($_FILES['image_file']['tmp_name'], $target_path)) {
                throw new Exception("Failed to save uploaded image file.");
            }

            $db_file_path = 'uploads/' . $filename;

            $stmt = $pdo->prepare("INSERT INTO images (category_id, image_type, file_path, title, subtitle, display_location, sort_order, status) 
                                   VALUES (:cat, :type, :path, :title, :sub, :loc, :order, 'active')");
            $stmt->execute([
                'cat' => $category_id,
                'type' => $image_type,
                'path' => $db_file_path,
                'title' => $title,
                'sub' => $subtitle,
                'loc' => $location_str,
                'order' => $total_images + 1
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Image uploaded successfully with multi-location assignment.']);
            break;

        case 'update_locations':
            $id = (int)($_POST['image_id'] ?? 0);
            $locations = $_POST['locations'] ?? [];
            if (is_string($locations)) {
                $locations = array_map('trim', explode(',', $locations));
            }
            $location_str = !empty($locations) ? implode(',', array_filter($locations)) : 'moments_at_bhavans';

            if ($id <= 0) {
                throw new Exception("Invalid image ID.");
            }

            $stmt = $pdo->prepare("UPDATE images SET display_location = :loc WHERE id = :id");
            $stmt->execute(['loc' => $location_str, 'id' => $id]);

            echo json_encode(['status' => 'success', 'message' => 'Display sections updated successfully.']);
            break;

        case 'set_main_image':
            $id = (int)($_POST['image_id'] ?? 0);
            if ($id <= 0) throw new Exception("Invalid image ID.");

            $img_stmt = $pdo->prepare("SELECT category_id FROM images WHERE id = :id");
            $img_stmt->execute(['id' => $id]);
            $cat_id = $img_stmt->fetchColumn();

            if (!$cat_id) throw new Exception("Image not found.");

            // Demote all images in category to sub
            $demote = $pdo->prepare("UPDATE images SET image_type = 'sub' WHERE category_id = :cat");
            $demote->execute(['cat' => $cat_id]);

            // Promote target image to main
            $promote = $pdo->prepare("UPDATE images SET image_type = 'main' WHERE id = :id");
            $promote->execute(['id' => $id]);

            echo json_encode(['status' => 'success', 'message' => 'Designated as Main Image for this category.']);
            break;

        case 'delete_image':
            $id = (int)($_POST['image_id'] ?? 0);
            if ($id <= 0) throw new Exception("Invalid image ID.");

            $stmt = $pdo->prepare("SELECT file_path FROM images WHERE id = :id");
            $stmt->execute(['id' => $id]);
            $file = $stmt->fetchColumn();

            if ($file && strpos($file, 'uploads/') === 0) {
                $abs_file = __DIR__ . '/../' . $file;
                if (file_exists($abs_file)) {
                    @unlink($abs_file);
                }
            }

            $del_stmt = $pdo->prepare("DELETE FROM images WHERE id = :id");
            $del_stmt->execute(['id' => $id]);

            echo json_encode(['status' => 'success', 'message' => 'Image deleted successfully.']);
            break;

        // ==========================================
        // 2. USER MANAGEMENT ACTIONS
        // ==========================================
        case 'create_user':
            $current_role = $_SESSION['admin_role'] ?? 'admin';
            if ($current_role === 'editor') {
                throw new Exception("Access Denied: Staff Editors do not have permission to manage user accounts.");
            }

            $username = trim($_POST['username'] ?? '');
            $password = trim($_POST['password'] ?? '');
            $full_name = trim($_POST['full_name'] ?? '');
            $role = trim($_POST['role'] ?? 'admin');

            if (empty($username) || empty($password)) {
                throw new Exception("Username and password are required.");
            }

            $chk = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = :u");
            $chk->execute(['u' => $username]);
            if ($chk->fetchColumn() > 0) {
                throw new Exception("Username already exists. Please choose a different username.");
            }

            $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, full_name, role) VALUES (:u, :p, :n, :r)");
            $stmt->execute([
                'u' => $username,
                'p' => password_hash($password, PASSWORD_DEFAULT),
                'n' => $full_name,
                'r' => $role
            ]);

            echo json_encode(['status' => 'success', 'message' => 'New user account created successfully.']);
            break;

        case 'delete_user':
            $current_role = $_SESSION['admin_role'] ?? 'admin';
            if ($current_role === 'editor') {
                throw new Exception("Access Denied: Staff Editors do not have permission to delete user accounts.");
            }

            $id = (int)($_POST['user_id'] ?? 0);
            if ($id <= 0) throw new Exception("Invalid user ID.");

            // Check target user role
            $target_stmt = $pdo->prepare("SELECT role FROM users WHERE id = :id");
            $target_stmt->execute(['id' => $id]);
            $target_role = $target_stmt->fetchColumn();

            if ($target_role === 'superadmin' && $current_role !== 'superadmin') {
                throw new Exception("Permission Denied: Only Super Admin can delete Super Admin accounts.");
            }

            $total_users = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
            if ($total_users <= 1) {
                throw new Exception("Cannot delete the only remaining admin account.");
            }

            $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
            $stmt->execute(['id' => $id]);

            echo json_encode(['status' => 'success', 'message' => 'User deleted successfully.']);
            break;

        case 'change_password':
            $current_role = $_SESSION['admin_role'] ?? 'admin';
            if ($current_role === 'editor') {
                throw new Exception("Access Denied: Staff Editors do not have permission to change user passwords.");
            }

            $id = (int)($_POST['user_id'] ?? 0);
            $new_pass = trim($_POST['new_password'] ?? '');

            if ($id <= 0 || empty($new_pass)) {
                throw new Exception("Invalid request or empty password.");
            }

            $stmt = $pdo->prepare("UPDATE users SET password_hash = :p WHERE id = :id");
            $stmt->execute([
                'p' => password_hash($new_pass, PASSWORD_DEFAULT),
                'id' => $id
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Password updated successfully.']);
            break;

        // ==========================================
        // 3. NOTICE MANAGEMENT ACTIONS
        // ==========================================
        case 'save_notice':
            $id = (int)($_POST['notice_id'] ?? 0);
            $title = trim($_POST['title'] ?? '');
            $content = trim($_POST['content'] ?? '');
            $category = trim($_POST['category'] ?? 'General');
            $notice_date = trim($_POST['notice_date'] ?? date('Y-m-d'));
            $pdf_link = trim($_POST['pdf_link'] ?? '');
            $is_ticker = !empty($_POST['is_ticker']) ? 1 : 0;

            if (empty($title)) throw new Exception("Notice title cannot be empty.");

            if ($id > 0) {
                $stmt = $pdo->prepare("UPDATE notices SET title = :t, content = :c, category = :cat, notice_date = :d, pdf_link = :p, is_ticker = :tk WHERE id = :id");
                $stmt->execute(['t' => $title, 'c' => $content, 'cat' => $category, 'd' => $notice_date, 'p' => $pdf_link, 'tk' => $is_ticker, 'id' => $id]);
                $msg = "Notice updated successfully.";
            } else {
                $stmt = $pdo->prepare("INSERT INTO notices (title, content, category, notice_date, pdf_link, is_ticker, status) VALUES (:t, :c, :cat, :d, :p, :tk, 'active')");
                $stmt->execute(['t' => $title, 'c' => $content, 'cat' => $category, 'd' => $notice_date, 'p' => $pdf_link, 'tk' => $is_ticker]);
                $msg = "Notice created successfully.";
            }

            echo json_encode(['status' => 'success', 'message' => $msg]);
            break;

        case 'delete_notice':
            $id = (int)($_POST['notice_id'] ?? 0);
            if ($id <= 0) throw new Exception("Invalid notice ID.");

            $stmt = $pdo->prepare("DELETE FROM notices WHERE id = :id");
            $stmt->execute(['id' => $id]);

            echo json_encode(['status' => 'success', 'message' => 'Notice deleted successfully.']);
            break;

        case 'toggle_ticker':
            $id = (int)($_POST['notice_id'] ?? 0);
            if ($id <= 0) throw new Exception("Invalid notice ID.");

            $stmt = $pdo->prepare("UPDATE notices SET is_ticker = CASE WHEN is_ticker = 1 THEN 0 ELSE 1 END WHERE id = :id");
            $stmt->execute(['id' => $id]);

            echo json_encode(['status' => 'success', 'message' => 'Notice scroll ticker status toggled.']);
            break;

        // ==========================================
        // 4. POPUP MANAGEMENT ACTIONS
        // ==========================================
        case 'save_popup':
            $title = trim($_POST['title'] ?? '');
            $message = trim($_POST['message'] ?? '');
            $button_text = trim($_POST['button_text'] ?? '');
            $button_url = trim($_POST['button_url'] ?? '');
            $is_active = !empty($_POST['is_active']) ? 1 : 0;
            $image_url = trim($_POST['image_url'] ?? 'images/main page popup/1.jpg');

            // Optional new image upload for popup
            if (!empty($_FILES['popup_image']['name'])) {
                $upload_dir = __DIR__ . '/../uploads/';
                if (!file_exists($upload_dir)) mkdir($upload_dir, 0755, true);
                
                $ext = strtolower(pathinfo($_FILES['popup_image']['name'], PATHINFO_EXTENSION));
                $filename = 'popup_' . time() . '.' . $ext;
                if (move_uploaded_file($_FILES['popup_image']['tmp_name'], $upload_dir . $filename)) {
                    $image_url = 'uploads/' . $filename;
                }
            }

            $stmt = $pdo->prepare("UPDATE popups SET title = :t, message = :m, image_url = :img, button_text = :bt, button_url = :bu, is_active = :act WHERE id = 1");
            $stmt->execute([
                't' => $title,
                'm' => $message,
                'img' => $image_url,
                'bt' => $button_text,
                'bu' => $button_url,
                'act' => $is_active
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Entrance Popup settings saved successfully.']);
            break;

        // ==========================================
        // 5. MANDATORY DISCLOSURE ACTIONS
        // ==========================================
        case 'save_disclosure':
            $id = (int)($_POST['disclosure_id'] ?? 0);
            $cat_code = trim($_POST['category_code'] ?? 'DOCUMENTS_INFO');
            $sl_no = (int)($_POST['sl_no'] ?? 1);
            $doc_type = trim($_POST['document_type'] ?? '');
            $doc_name = trim($_POST['document_name'] ?? '');
            $file_path = trim($_POST['file_path'] ?? '');

            if (empty($doc_name)) throw new Exception("Document name is required.");

            // File upload if attached
            if (!empty($_FILES['doc_file']['name'])) {
                $upload_dir = __DIR__ . '/../uploads/docs/';
                if (!file_exists($upload_dir)) mkdir($upload_dir, 0755, true);
                
                $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $_FILES['doc_file']['name']);
                if (move_uploaded_file($_FILES['doc_file']['tmp_name'], $upload_dir . $filename)) {
                    $file_path = 'uploads/docs/' . $filename;
                }
            }

            if ($id > 0) {
                $stmt = $pdo->prepare("UPDATE mandatory_disclosures SET category_code = :cat, sl_no = :sl, document_type = :dt, document_name = :dn, file_path = :fp, updated_at = CURRENT_TIMESTAMP WHERE id = :id");
                $stmt->execute(['cat' => $cat_code, 'sl' => $sl_no, 'dt' => $doc_type, 'dn' => $doc_name, 'fp' => $file_path, 'id' => $id]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO mandatory_disclosures (category_code, sl_no, document_type, document_name, file_path) VALUES (:cat, :sl, :dt, :dn, :fp)");
                $stmt->execute(['cat' => $cat_code, 'sl' => $sl_no, 'dt' => $doc_type, 'dn' => $doc_name, 'fp' => $file_path]);
            }

            echo json_encode(['status' => 'success', 'message' => 'Mandatory Disclosure document saved successfully.']);
            break;

        case 'delete_disclosure':
            $id = (int)($_POST['disclosure_id'] ?? 0);
            if ($id <= 0) throw new Exception("Invalid disclosure ID.");

            $stmt = $pdo->prepare("DELETE FROM mandatory_disclosures WHERE id = :id");
            $stmt->execute(['id' => $id]);

            echo json_encode(['status' => 'success', 'message' => 'Mandatory disclosure document deleted successfully.']);
            break;

        default:
            throw new Exception("Invalid or unspecified action.");
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
