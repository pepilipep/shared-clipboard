<?php

include 'Db.php';

session_start();

$db = new Db;

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['logged_in' => false]);
    return;
}

try {
    $users = $db->getUserByID($_SESSION['user_id']);
    if (count($users) != 1) {
        echo json_encode([
            'logged_in' => false,
            'error' => 'user doesnt exist',
        ]);
    } else {
        $user = $users[0];
        echo json_encode([
            'logged_in' => true,
            'email' => $user['email'],
            'username' => $user['username'],
        ]);
    }
} catch (Exception $e) {
    echo json_encode(['logged_in' => false, 'error' => $e]);
}
