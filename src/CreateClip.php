<?php

include 'Db.php';

$db = new Db;


$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);
$content = htmlspecialchars($_POST['content']);
$expiry_time = filter_input(INPUT_POST, 'expiry-time', FILTER_SANITIZE_NUMBER_INT);


$content_type = mb_strtoupper(htmlspecialchars($_POST['content-type']));

if ($content_type == 'FILE') {
    $target_dir = '../uploads/' . basename($_FILES['content']['name']);
    move_uploaded_file($_FILES['content']['tmp_name'], $target_dir);
}

error_log($expiry_time);

$future = new DateTime('now');
$future->modify("+{$expiry_time} minutes");
$expiry_time = $future->format('Y-m-d H:i:s');

$created_by = NULL;

try {
    $db->createClip($url, $content_type, $content, $created_by, $expiry_time);
    echo json_encode([
        'msg' => 'Clip created successfully!'
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e]);
}
