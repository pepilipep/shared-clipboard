<?php

include 'Db.php';

session_start();

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);

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

try {
    $db->updateClip($url, $content_type, $content);
    echo json_encode([
        'msg' => 'Clip updated successfully!'
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e]);
}