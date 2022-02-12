<?php

include 'Db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'user not logged in']);
    return;
}

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);
$access_type = htmlspecialchars($_POST['access_type']);

try {
    $rowsCount = $db->changeVisibility($url, $access_type, $_SESSION['user_id']);
    if ($rowsCount > 0) {
        echo json_encode(['msg' => 'successfull']);
    } else {
        echo json_encode(['rbac' => 'Permission denied']);
    }
} catch (Exception $e) {
    error_log($e);
    echo json_encode(['error' => $e]);
}
