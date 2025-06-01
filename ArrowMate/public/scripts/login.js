
/*──────────────── PROFILE / LOGIN ────────────────*/
function renderProfile(){
  const root = $('#profile-body');
  root.innerHTML = '';

  /* ---------- LOGIN FORM ---------- */
  if(!currentUser){
    root.insertAdjacentHTML('beforeend',`
      <form id="login-form" class="stack" style="max-width:280px;margin:0 auto;">
        <label>Username <input type="password" id="login-user"></label>
        <label>Password <input type="password" id="login-pass"></label>
        <button class="primary">Login</button>
      </form>`);

    $('#login-form').onsubmit = e => {
      e.preventDefault();
      const user = $('#login-user').value.trim();
      const pass = $('#login-pass').value.trim();
      if(user==='1234' && pass==='1234'){
        currentUser = { id:0, name:'Jacob Shiel', nation:'Australia' };
        saveSession(currentUser);
        nav.classList.add('show');
        show('home');
        renderProfile();
        refreshArchers();
        loadPBs();
      } else alert('Invalid credentials (hint: 1234 / 1234)');
    };
    return;
  }

  /* ---------- PROFILE CARD ---------- */
  root.insertAdjacentHTML('beforeend',`
    <div class="card center">
      <img src="assets/TempJacob.jpg" alt="pfp" class="pfp-placeholder">
      <h2>${currentUser.name}</h2>
      <p><img src="assets/TempAus.jpg" alt="flag" class="flag-placeholder">
         &nbsp;${currentUser.nation}</p>
      <button id="logout" class="primary" style="background:var(--rust);margin-top:1.4rem;">
        Log&nbsp;out
      </button>
    </div>`);
  $('#logout').onclick = doLogout;
}

/* login/logout buttons outside profile */
$('#swap-account').onclick = doLogout;

/* restore session on reload */
currentUser = loadSession();
if(currentUser){
  nav.classList.add('show');
  // show('home');
  // show('archer-range-input'); // Temporary for development
  // show('your-scores');
  show('round-details');
}
renderProfile();
