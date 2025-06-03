<?php
$BASE_DIR = '/cos20031/s105417647/ArrowMate/';
$users = [
  'Jacob' => '1234',
  'Jack'  => '4321',
  'Max'  => '1122',
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $usrInput = $_POST['user'];
  $pwdInput = $_POST['pwd'];

  if (array_key_exists($usrInput, $users)) {
    if ($users[$usrInput] == $pwdInput) {
      $_SESSION['user'] = $usrInput;
      header("Location: ". $BASE_DIR);
    } else {
      echo("Incorrect username or password");
    }
  } else {
    echo("Incorrect username or password");
  }
  echo('<br><br>' . $usrInput . ' ' . $pwdInput);
}
?>

<form action="" method="post" id="login-form" class="stack" style="max-width:280px;margin:0 auto;">
  <label>Username <input type="text" name="user" id="login-user"></label>
  <label>Password <input type="password" name="pwd" id="login-pass"></label>
  <input type="submit" value="Login" class="primary" />
</form>

<div style="margin-top:30px;" class="pad">
  <h2>Users:</h2>
  <h3>Jacob</h3>
  <p>Username: Jacob</p>
  <p>Password: 1234</p>
  <h3>Jack</h3>
  <p>Username: Jack</p>
  <p>Password: 4321</p>
  <h3>Max</h3>
  <p>Username: Max</p>
  <p>Password: 1122</p>
</div>
