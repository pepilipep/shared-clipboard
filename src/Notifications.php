<?php

include 'Db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'user not logged in']);
    return;
}

$db = new Db;

$user_id = $_SESSION['user_id'];

try {
    $notifications = $db->getNotificationsForUser($user_id);
    // $db->seeNotificationsForUser($user_id);

    echo json_encode($notifications);
} catch (Exception $e) {
    error_log($e);
    echo json_encode(['error' => $e]);
}
