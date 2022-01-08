<?php

include 'db.php';

$db = new Db;
$conn = $db->getConnection();

$sql = "SELECT * FROM clip";

$stmt = $conn->query($sql);

$rows = $stmt->fetchAll();

foreach ($rows as $row) {
    echo $row['url'];
}
