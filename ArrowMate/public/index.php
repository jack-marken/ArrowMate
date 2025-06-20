<?php
  $BASE_DIR = '/cos20031/s105417647/ArrowMate/';
  $HOME_PAGES_DIR = 'pages/home/';
  $PERIPHERAL_PAGES_DIR = 'pages/peripheral/';

  $home_pages = array(
    'home',
    'your-scores',
    'join-range',
    'leaderboard',
    'profile'
  );

  $peripheral_pages = array(
    'round-details',
    'archer-range-setup',
    'arrow-scores-input'
  );

  $database = 's105584279_db';
  $username = 's105584279';
  $password = '210605';
  /* $dbh = new PDO("mysql:host=feenix-mariadb.swin.edu.au;dbname=$database", $username, $password); */

  /* -------- QUERY TEMPLATE -------- */
  /* foreach($dbh->query('SELECT * from Archer') as $row) */
  /* { */
  /*    print_r($row); */
  /* } */
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ArrowMate</title>

  <!-- Font-Awesome (icons) -->
  <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
  <!-- Roboto Font -->
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <!-- Global styles -->
  <link rel="stylesheet" href="styles.css">

  <!-- jQuery -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>
<body>

<?php
/* require 'pages/auth/login.php'; */
session_start();

// Check if the user is logged in, if
// not then redirect them to the login page
if (!isset($_SESSION['user'])) {
  require 'pages/auth/login.php';
} else {
  $active_page = basename(parse_url($_SERVER['REQUEST_URI'])['path']); /* Final part of URL */
  $active_page = ($active_page == 'ArrowMate') ? 'main' : $active_page;
  if ($active_page == 'main') {
    foreach ($home_pages as $active_page) {
      require $HOME_PAGES_DIR . $active_page . '.php';
    }
    require 'components/bottom-nav.php';
    echo('<script src="scripts/home.js"></script>');
  } elseif (in_array($active_page, $peripheral_pages)) {
    require $PERIPHERAL_PAGES_DIR . $active_page . '.php';
  }
}
?>
</body>
</html>
