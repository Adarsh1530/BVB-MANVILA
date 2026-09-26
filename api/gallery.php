<?php
/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * API: Photo Gallery Endpoint
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

$gallery = [
    'status' => 'success',
    'total' => 8,
    'data' => [
        ['id' => 1, 'category' => 'events', 'title' => 'Investiture Ceremony Stage Assembly', 'src' => 'assets/images/events/investiture-1.jpg'],
        ['id' => 2, 'category' => 'student-life', 'title' => 'School Parliament Cabinet', 'src' => 'assets/images/events/school-parliament.jpg'],
        ['id' => 3, 'category' => 'culture', 'title' => 'Adharva Inter-School Fest Inauguration', 'src' => 'assets/images/events/adharva-fest.jpg'],
        ['id' => 4, 'category' => 'culture', 'title' => 'Classical Dance Drama', 'src' => 'assets/images/student-life/adharva-dance.jpg'],
        ['id' => 5, 'category' => 'events', 'title' => 'Investiture Oath Taking', 'src' => 'assets/images/events/investiture-oath.jpg'],
        ['id' => 6, 'category' => 'culture', 'title' => 'All Kerala Bhavan\'s Cultural Fest', 'src' => 'assets/images/events/cultural-fest.jpg'],
        ['id' => 7, 'category' => 'campus', 'title' => 'Manvila Campus Facade', 'src' => 'assets/images/campus/campus-view.jpg'],
        ['id' => 8, 'category' => 'sports', 'title' => 'Annual Sports Meet Athletics', 'src' => 'assets/images/campus/sports.svg']
    ]
];

echo json_encode($gallery, JSON_PRETTY_PRINT);
