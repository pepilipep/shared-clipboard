<?php

include 'Db.php';

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);

try {
    $clips = $db->getClip($url);
    if (count($clips) != 1) {
        echo json_encode([]);
        return;
    }

    $now = new DateTime('now');
    $expiry_time = $db->getExpiryTime($url);

    if ($now > $expiry_time) {
        $db->deleteClip($url);
        echo json_encode([]);
        return;
    }

    $clip = $clips[0];

    echo json_encode([
        'content' => $clip['content']
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e]);
}
