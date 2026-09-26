<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * API: News & Circulars Endpoint (Prepared for PHP / MySQL / cPanel)
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

// Sample JSON payload representing verified school news announcements
$response = [
    'status' => 'success',
    'timestamp' => date('c'),
    'data' => [
        [
            'id' => 1,
            'title' => 'Admission Notice 2027–28 Open for LKG to Class XI',
            'category' => 'Admissions',
            'published_at' => '2026-09-01',
            'summary' => 'Registrations are now open for prospective students for the upcoming academic session via the online ERP portal.'
        ],
        [
            'id' => 2,
            'title' => 'Adharva Inter-School Fest Announced',
            'category' => 'Cultural',
            'published_at' => '2026-08-20',
            'summary' => 'Flagship inter-school event inviting schools across Thiruvananthapuram for arts, coding, and debate championships.'
        ]
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
