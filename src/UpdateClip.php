<?php

session_start();

include 'Db.php';

$db = new Db;

$url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);

$content_type = mb_strtoupper(htmlspecialchars($_POST['content-type']));
$content = htmlspecialchars($_POST['content']);

$action_url = NULL;
if (isset($_POST['action-url']) && mb_strlen($_POST['action-url'])) {
    $action_url = htmlspecialchars($_POST['action-url']);
}

try {
    // actual update
    $rowsUpdated = $db->updateClip($url, $content_type, $content, $_SESSION['user_id'] ?? NULL, $action_url);
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

    if (!is_null($action_url)) {
        $action_url = str_replace('${content}', urlencode($content), $action_url);
        $action_url = str_replace('${content-type}', $content_type, $action_url);
        $result = file_get_contents($action_url);
    }

    echo json_encode([
        'msg' => 'Clip updated successfully!'
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e]);
}
