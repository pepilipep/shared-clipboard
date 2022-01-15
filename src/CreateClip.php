<?php

include 'Db.php';

$db = new Db;


$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);
$content = htmlspecialchars($_POST['content']);

$content_type = 'TEXT';
$expiry_time = 'doesntmatter';
$created_by = NULL;

try {
    $db->createClip($url, $content_type, $content, $created_by, $expiry_time);
    echo json_encode([
        'msg' => 'Clip created successfully!'
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e]);
}
