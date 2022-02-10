<?php

session_start();

session_unset();
session_destroy();
echo json_encode(['msg' => 'Logout successful!']);
