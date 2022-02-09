<?php

include 'Db.php';

session_start();

$random_id = uniqid();
$filename = basename($_FILES['file']['name']);
$dir = '../public/uploads/' . $random_id;
mkdir($dir, 0777, true);
move_uploaded_file($_FILES['file']['tmp_name'], $dir . '/' . $filename);

echo json_encode(['folder' => $random_id, 'filename' => $filename]);
