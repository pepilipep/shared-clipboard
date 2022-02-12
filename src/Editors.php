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
    $editors = $db->getEditors($url);
    echo json_encode($editors);
} catch (Exception $e) {
    error_log($e);
    echo json_encode(['error' => $e]);
}
