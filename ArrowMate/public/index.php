<?php
  $database = 's105584279_db';
  $username = 's105584279';
  $password = '210605';
  $dbh = new PDO("mysql:host=feenix-mariadb.swin.edu.au;dbname=$database", $username, $password);
  foreach($dbh->query('SELECT * from Archer') as $row)
  {
     print_r($row);
  }
?>
<html>
<head>
  <title>Index</title>
</head>
<body>
  <h1>Testing</h1>
</body>
</html>
