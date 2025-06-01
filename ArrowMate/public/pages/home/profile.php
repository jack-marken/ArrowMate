
<!----------------------------------------------------------------
  PROFILE
----------------------------------------------------------------->
<section id="profile" class="screen">
  <header class="hero hero--navy"><h1>ARCHER&nbsp;PROFILE</h1></header>
  <main  id="profile-body" class="pad">
    <div class="card center">
      <img src="assets/TempJacob.jpg" alt="pfp" class="pfp-placeholder">
      <h2><?php echo($_SESSION['user']); ?></h2>
      <p><img src="assets/TempAus.jpg" alt="flag" class="flag-placeholder"></p>
      <form action="pages/auth/logout.php" method="post">
        <input type="submit" id="logout" value="Log out" class="primary" style="background:var(--rust);margin-top:1.4rem;"/>
      </form>
    </div>
  </main>
</section>
