<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * API: Contact Form Enquiries Endpoint
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    
    // In Phase 2: Send email to bhavansvvm@gmail.com and save to MySQL database
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you for reaching out. The school administration office has received your enquiry.',
        'received_at' => date('c')
    ]);
    exit;
}

echo json_encode([
    'status' => 'active',
    'email' => 'bhavansvvm@gmail.com',
    'phone' => '0471 2594559'
]);
