<?php

include 'Db.php';

session_start();

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);
$expiry_time = filter_input(INPUT_POST, 'expiry-time', FILTER_SANITIZE_NUMBER_INT);

$content_type = mb_strtoupper(htmlspecialchars($_POST['content-type']));
$content = htmlspecialchars($_POST['content']);

$action_url = NULL;
if (isset($_POST['action-url']) && mb_strlen($_POST['action-url'])) {
    $action_url = htmlspecialchars($_POST['action-url']);
}

$future = new DateTime('now');
if ($expiry_time == 0) {
    $expiry_time = null;
} else {
    $future->modify("+{$expiry_time} minutes");
    $expiry_time = $future->format('Y-m-d H:i:s');
}


$created_by = NULL;
if (isset($_SESSION['user_id'])) {
    $created_by = $_SESSION['user_id'];
}

try {
    $db->createClip($url, $content_type, $content, $created_by, $expiry_time, $action_url);
    echo json_encode([
        'msg' => 'Clip created successfully!'
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e]);
}
