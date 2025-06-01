<!----------------------------------------------------------------
  LOGIN / PROFILE
----------------------------------------------------------------->
<section id="profile" class="screen">
  <header class="hero hero--navy"><h1>ARCHER&nbsp;PROFILE</h1></header>
  <main  id="profile-body" class="pad">
    <div class="card center">
      <img src="assets/TempJacob.jpg" alt="pfp" class="pfp-placeholder">
      <h2>${currentUser.name}</h2>
      <p><img src="assets/TempAus.jpg" alt="flag" class="flag-placeholder">
         &nbsp;${currentUser.nation}</p>
      <button id="logout" class="primary" style="background:var(--rust);margin-top:1.4rem;">
        Log&nbsp;out
      </button>
    </div>
  </main>
</section>
