<?php

session_start();

include 'Db.php';

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);

$content_type = mb_strtoupper(htmlspecialchars($_POST['content-type']));
$content = htmlspecialchars($_POST['content']);

try {

    // handle notifications
    $clip = $db->getClip($url)[0];
    $users = $db->getUsersFollowingClips($clip['id']);
    foreach ($users as $user) {
        $db->insertNotification($user['user_id'], $_SESSION['user_id'], $clip['id']);
    }

    // actual update
    $db->updateClip($url, $content_type, $content);
    echo json_encode([
        'msg' => 'Clip updated successfully!'
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e]);
}
