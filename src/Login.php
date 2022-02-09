<?php

include 'Db.php';

$db = new Db;

if (session_status() === PHP_SESSION_ACTIVE) {
    echo json_encode(['msg' => 'already logged in!']);
    return;
}

session_start();

function validateInput()
{
    if (!filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)) {
        return 'Email is not set.';
    }

    if (!isset($_POST['password']) || empty($_POST['password'])) {
        return 'Password is not set.';
    }

    return NULL;
}

$err = validateInput();
if (!is_null($err)) {
    echo json_encode(['error' => $err]);
    return;
}


$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$password = htmlspecialchars($_POST['password']);

$users = $db->getUser($email);

if (count($users) != 1) {
    echo json_encode(['error' => 'incorrect credentials', 'users' => $users]);
    return;
}
$user = $users[0];

if (!password_verify($password, $user['password'])) {
    echo json_encode(['error' => 'incorrect credentials']);
    return;
}

$_SESSION['user_id'] = $user['id'];

echo json_encode(['msg' => 'Login successful!']);
