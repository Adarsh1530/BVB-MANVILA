<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * API: Admission Enquiries Handler
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Process incoming JSON payload
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    
    // In Phase 2: Insert into MySQL database 'bvb_admissions' table
    echo json_encode([
        'status' => 'success',
        'message' => 'Admission inquiry received successfully. Reference ID: BVB-' . rand(1000, 9999),
        'data' => $input
    ]);
    exit;
}

echo json_encode([
    'status' => 'ready',
    'academic_year' => '2027-28',
    'erp_url' => 'https://bvbmva.amserp.in/index.php/user/login/loginguest'
]);
