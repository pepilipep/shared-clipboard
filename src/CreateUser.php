<?php

include 'Db.php';

$db = new Db;


function validateInput()
{
    if (!filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)) {
        return 'Email is not set.';
    }

    if (!isset($_POST['username']) || empty($_POST['username'])) {
        return 'Username is not set.';
    }

    if (!isset($_POST['password']) || empty($_POST['password'])) {
        return 'Password is not set.';
    }

    if (!isset($_POST['confirmPassword']) || empty($_POST['confirmPassword'])) {
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
$username = htmlspecialchars($_POST['username']);
$password = htmlspecialchars($_POST['password']);
$confirmPassword = htmlspecialchars($_POST['confirmPassword']);

if ($password !== $confirmPassword) {
    echo json_encode(['error' => "Passwords don't match"]);
    return;
}

$hashedPass = password_hash($password, PASSWORD_DEFAULT);

try {
    $db->createUser($email, $username, $hashedPass);
    echo json_encode([
        'msg' => 'User created successfully!'
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e]);
}
