<?php

session_start();

include 'Db.php';

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);

$content_type = mb_strtoupper(htmlspecialchars($_POST['content-type']));
$content = htmlspecialchars($_POST['content']);

try {
    // actual update
    $rowsUpdated = $db->updateClip($url, $content_type, $content, $_SESSION['user_id'] ?? NULL);
    if ($rowsUpdated == 0) {
        echo json_encode(['rbac' => 'Permission denied']);
        return;
    }

    // handle notifications
    $clip = $db->getClip($url, $_SESSION['user_id'] ?? NULL)[0];
    $users = $db->getUsersFollowingClips($clip['id']);
    foreach ($users as $user) {
        if (!isset($_SESSION['user_id'])) {
            $db->insertNotification($user['user_id'], NULL, $clip['id']);
        } else if ($user['user_id'] !== $_SESSION['user_id']) {
            $db->insertNotification($user['user_id'], $_SESSION['user_id'], $clip['id']);
        }
    }

    echo json_encode([
        'msg' => 'Clip updated successfully!'
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e]);
}
