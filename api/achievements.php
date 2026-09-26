<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * API: Board Results & Achievements Endpoint
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

$achievements = [
    'status' => 'success',
    'summary' => [
        'aisse_pass_percent' => '100%',
        'aissce_commerce_pass_percent' => '100%',
        'library_volumes' => 5891,
        'campus_acres' => 2.89,
        'established_year' => 1995
    ]
];

echo json_encode($achievements, JSON_PRETTY_PRINT);
