<?php

include 'Db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'user not logged in']);
    return;
}

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);

try {
    $db->subscribe($_SESSION['user_id'], $url);
    echo json_encode(['msg' => 'successfull']);
} catch (Exception $e) {
    error_log($e);
    echo json_encode(['error' => $e]);
}
