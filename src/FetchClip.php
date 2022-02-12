<?php

include 'Db.php';

session_start();

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);

try {
    $clips = $db->getClip($url, $_SESSION['user_id'] ?? NULL);
    if (count($clips) != 1) {
        echo json_encode([]);
        return;
    }

    $clip = $clips[0];

    if (!$clip['can_read']) {
        echo json_encode(['rbac' => 'Permission denied']);
        return;
    }

    $expiry_time = $clip['expiry_time'];

    if (isset($_SESSION['user_id'])) {
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

    echo json_encode([
        'content' => $clip['content'],
        'content_type' => $clip['content_type']
    ]);
} catch (Exception $e) {
    error_log($e);
    echo json_encode(['error' => $e]);
}
