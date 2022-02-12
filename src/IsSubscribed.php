<?php

include 'Db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo 0;
    return;
}

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);

try {
    $subscriptions = $db->isSubscribed($_SESSION['user_id'], $url);
    if (count($subscriptions) > 0) {
        echo 1;
    } else {
        echo 0;
    }
} catch (Exception $e) {
    error_log($e);
    echo json_encode(['error' => $e]);
}
