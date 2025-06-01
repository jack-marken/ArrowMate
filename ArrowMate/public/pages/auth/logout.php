<?php
$BASE_DIR = '/cos20031/s105417647/ArrowMate/';

// Start the session
session_start();

// Unset all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Redirect to the login page
header("Location: ". $BASE_DIR);
exit();
?>
