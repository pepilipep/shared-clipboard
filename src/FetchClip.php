<?php

include 'Db.php';

session_start();

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);

try {
    $clips = $db->getClip($url);
    if (count($clips) != 1) {
        echo json_encode([]);
        return;
    }

    $clip = $clips[0];

    $now = new DateTime('now');
    $expiry_time = new Datetime($clip["expiry_time"]);

    if ($_SESSION['user_id']) {
        $db->recordAccessEvent($_SESSION['user_id'], $clip['id']);
    }

    if ($now > $expiry_time) {
        $db->deleteClip($url);
        echo json_encode([]);
        return;
    }

    echo json_encode([
        'content' => $clip['content']
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e]);
}
