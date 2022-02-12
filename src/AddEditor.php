<?php

include 'Db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'user not logged in']);
    return;
}

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);
$editor = htmlspecialchars($_POST['editor']);

try {
    $rowsCount = $db->addEditor($url, $_SESSION['user_id'], $editor);
    if ($rowsCount > 0) {
        echo json_encode(['msg' => 'successfull']);
    } else {
        echo json_encode(['rbac' => 'Permission denied']);
    }
} catch (Exception $e) {
    error_log($e);
    echo json_encode(['error' => $e]);
}
