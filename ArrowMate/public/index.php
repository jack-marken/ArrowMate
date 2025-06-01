<?php
  $BASE_DIR = '/cos20031/s105417647/ArrowMate/';
  $PAGES_DIR = 'pages/';

  $page_list = array(
    'your-scores',
    'round-details',
    'action-picker',
    'archer-range-setup',
    'leaderboard',
    'login',
    'round-details',
    'your-scores'
  );

  $database = 's105584279_db';
  $username = 's105584279';
  $password = '210605';
  /* $dbh = new PDO("mysql:host=feenix-mariadb.swin.edu.au;dbname=$database", $username, $password); */

  $active_page = 'your-scores';
  $request = $_SERVER['REQUEST_URI'];

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
</head>
<body>

<?php
$page = basename(parse_url($request)['path']);

if ($page == 'ArrowMate') {
  $page = 'your-scores';
}

if (in_array($page, $page_list)) {
  include $PAGES_DIR . $page . '.php';
}
/* foreach ($page_list as $active_page) { */
/*   include $PAGES_DIR . $active_page . '.php'; */
/* } */

include 'components/bottom-nav.php';
?>

  <script src="script.js"></script>
</body>
</html>
