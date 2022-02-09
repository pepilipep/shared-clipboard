<?php

include 'Db.php';

session_start();

$db = new Db;

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'user not logged in']);
    return;
}

$user_id = $_SESSION['user_id'];

try {
    $clips = $db->getFollowedClips($user_id);
    foreach ($clips as &$clip) {
        $clip = [
            "url" => $clip["url"],
            "content_type" => $clip["content_type"],
            "time" => $clip["action_time"],
        ];
    }
    echo json_encode($clips);
} catch (Exception $e) {
    echo json_encode(['error' => $e]);
}
