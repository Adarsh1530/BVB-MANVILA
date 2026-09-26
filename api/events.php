<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * API: School Calendar & Events Endpoint
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

$events = [
    'status' => 'success',
    'timestamp' => date('c'),
    'data' => [
        [
            'id' => 1,
            'title' => 'Annual Day 2025–2026',
            'category' => 'Annual Event',
            'thumbnail' => 'assets/images/events/investiture-1.jpg',
            'description' => 'Flagship cultural day celebration honoring academic toppers and performing arts.'
        ],
        [
            'id' => 2,
            'title' => 'All Kerala Bhavan\'s Cultural Fest 2025',
            'category' => 'State Fest',
            'thumbnail' => 'assets/images/events/cultural-fest.jpg',
            'description' => 'Inter-Bhavan state cultural competition across Category I and IV.'
        ],
        [
            'id' => 3,
            'title' => 'Adharva – Inter School Fest',
            'category' => 'Inter-School',
            'thumbnail' => 'assets/images/events/adharva-fest.jpg',
            'description' => 'Annual inter-school festival of debate, art, and IT competitions.'
        ],
        [
            'id' => 4,
            'title' => 'Investiture Ceremony 2025–2026',
            'category' => 'Leadership',
            'thumbnail' => 'assets/images/events/investiture-2.jpg',
            'description' => 'Formal oath-taking by the elected student council leaders.'
        ]
    ]
];

echo json_encode($events, JSON_PRETTY_PRINT);
