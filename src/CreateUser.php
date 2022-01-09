<?php

include 'Db.php';

$db = new Db;

if (!filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)) {
    echo 'Email is not set.';
    return;
}

if (!isset($_POST['username']) || empty($_POST['username'])) {
    echo 'Username is not set.';
    return;
}

if (!isset($_POST['password']) || empty($_POST['password'])) {
    echo 'Password is not set.';
    return;
}

if (!isset($_POST['confirmPassword']) || empty($_POST['confirmPassword'])) {
    echo 'Password is not set.';
    return;
}

$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$username = htmlspecialchars($_POST['username']);
$password = htmlspecialchars($_POST['password']);
$confirmPassword = htmlspecialchars($_POST['confirmPassword']);

if ($password !== $confirmPassword) {
    echo "Passwords don't match";
    return;
}

$hashedPass = password_hash($password, PASSWORD_DEFAULT);

$db->createUser($email, $username, $hashedPass);

echo 'User created successfully!';
