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

    $clip = $clips[0];

    $expiry_time = $clip['expiry_time'];

    if (session_status() === PHP_SESSION_ACTIVE) {
        session_start();
        $db->recordAccessEvent($_SESSION['user_id'], $clip['id']);
    }

    if (is_null($expiry_time)) {
        $db->bombClip($url);
    } else {
        $now = new DateTime('now');
        $expiry_time = new DateTime($expiry_time);
        if ($now > $expiry_time) {
            $db->deleteClip($url);
            echo json_encode([]);
            return;
        }
    }

    if ($clip['content_type'] == 'FILE') {
        $clip['content'] = basename($clip['content']);
    }

    echo json_encode([
        'content' => $clip['content'],
        'content_type' => $clip['content_type']
    ]);
} catch (Exception $e) {
    error_log($e);
    echo json_encode(['error' => $e]);
}
