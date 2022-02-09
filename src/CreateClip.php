<?php

include 'Db.php';

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);
$expiry_time = filter_input(INPUT_POST, 'expiry-time', FILTER_SANITIZE_NUMBER_INT);


$content_type = mb_strtoupper(htmlspecialchars($_POST['content-type']));

if ($content_type == 'FILE') {
    $random_id = uniqid();
    $filename = basename($_FILES['content']['name']);
    $dir = '../uploads/' . $random_id;
    mkdir($dir, 0777, true);
    move_uploaded_file($_FILES['content']['tmp_name'], $dir . '/' . $filename);
    $content = $random_id . '/' . $filename;
} else {
    $content = htmlspecialchars($_POST['content']);
}

$future = new DateTime('now');
if ($expiry_time == 0) {
    $expiry_time = null;
} else {
    $future->modify("+{$expiry_time} minutes");
    $expiry_time = $future->format('Y-m-d H:i:s');
}


$created_by = NULL;
if (session_status() === PHP_SESSION_ACTIVE) {
    session_start();
    $created_by = $_SESSION['user_id'];
}

try {
    $db->createClip($url, $content_type, $content, $created_by, $expiry_time);
    echo json_encode([
        'msg' => 'Clip created successfully!'
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e]);
}
