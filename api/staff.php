<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * API: Faculty & Leadership Endpoint
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

$staff = [
    'status' => 'success',
    'leadership' => [
        ['role' => 'Chairman', 'name' => 'T. Balakrishnan IAS (R)'],
        ['role' => 'Hon. Secretary', 'name' => 'Shri S. Srinivasan IAS (R)'],
        ['role' => 'Principal', 'name' => 'Smt. Deepa V', 'qualification' => 'M.Sc, B.Ed']
    ],
    'departments' => [
        'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science',
        'Commerce & Accountancy', 'Economics', 'English', 'Social Science',
        'Malayalam', 'Hindi', 'Physical Education', 'Arts & Music'
    ]
];

echo json_encode($staff, JSON_PRETTY_PRINT);
