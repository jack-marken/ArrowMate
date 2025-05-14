/*────────────────────────────────────────────────────────────────────────
  iTarget  –  Single-Page Front-End (No Active Frameworks - can be included at a later date)
  ─  Features  ────────────────────────────────────────────────────────────
  • Credential gate & local-storage session
  • Live date / time / Melbourne weather on Home screen
  • Recorder → end-by-end score entry (auto-total)
  • Personal-best & club-best views
  • Robust   doLogout()   shared by “Swap” + profile “Log out”
─────────────────────────────────────────────────────────────────────────*/

/*== Utility ============================================================*/
const api = (url, opts={}) => fetch(`/api/${url}`, opts).then(r => r.json());
const $   = sel => document.querySelector(sel);

/* Cache frequently-used DOM nodes */
const nav   = $('.bottom-nav');
const dateE = $('#home-date');
const timeE = $('#home-time');
const tempE = $('#home-weather');

let currentUser = null;

/*──────────────── ROUTER & NAV ────────────────*/
function show(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  document.querySelectorAll('.nav-btn' ).forEach(b => b.classList.toggle('nav-active', b.dataset.goto === id));
}

/* Delegated clicks for nav / back links */
document.addEventListener('click', e=>{
  const go = e.target.closest('[data-goto]');
  const bk = e.target.closest('[data-back]');
  if(go && nav.classList.contains('show')) show(go.dataset.goto);
  if(bk) show(bk.dataset.back);
});

/*──────────────── Home: live clock & weather ────────────────*/
(function initClock(){
  const pad = n => String(n).padStart(2,'0');
  setInterval(()=>{
    const d = new Date();
    dateE.textContent = d.toLocaleDateString(undefined, {weekday:'long',day:'numeric',month:'long',year:'numeric'});
    timeE.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  },1000);
})();

/* One-shot fetch for Melbourne temperature */
fetch('https://api.open-meteo.com/v1/forecast?latitude=-37.8136&longitude=144.9631&current_weather=true')
  .then(r => r.json())
  .then(d => tempE.textContent = `🌤  ${Math.round(d.current_weather.temperature)}°C`)
  .catch(()=> tempE.textContent = '🌤  --°C');

/*──────────────── SESSION helpers ────────────────*/
function saveSession(u){ localStorage.setItem('currentUser', JSON.stringify(u)); }
function loadSession(){ return JSON.parse(localStorage.getItem('currentUser')||'null'); }
function clearSession(){ localStorage.removeItem('currentUser'); }

/* Central logout used by *both* buttons */
function doLogout(){
  currentUser = null;
  clearSession();
  nav.classList.remove('show');
  nav.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('nav-active'));
  show('profile');
  renderProfile();          // rebuild login form
}

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
  show('home');
}
renderProfile();

/*──────────────── RECORDER (add ends) ────────────────*/
async function refreshArchers(){
  const sel = $('#sel-archer'); if(!sel) return;
  const list = await api('archers');
  sel.innerHTML = '<option value="">select…</option>';
  list.forEach(a => sel.insertAdjacentHTML('beforeend',`<option value="${a.id}">${a.name}</option>`));
  if(currentUser) sel.value = currentUser.id;
}
refreshArchers();

$('#add-archer')?.addEventListener('click', async ()=>{
  const name = prompt('Archer name?'); if(!name) return;
  await api('archers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});
  refreshArchers();
});

$('#recorder-form')?.addEventListener('submit', async e=>{
  e.preventDefault();
  const archer_id = $('#sel-archer').value;
  const date      = $('#round-date').value;
  const location  = $('#round-loc').value;
  const end_no    = $('#end-no').value;
  const raw       = $('#arrows').value.trim();

  if(!archer_id||!date||!location||!raw) return alert('All fields required');

  /* ensure round exists */
  const { id: round_id } = await api('rounds',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({date,location})});

  const arrows = raw.split(/\s+/);
  const score  = arrows.reduce((t,a)=> t + (a==='X'?10 : a==='M'?0 : (+a||0)),0);

  await api('scores',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({archer_id,round_id,end_no,arrows:arrows.join(' '),total:score})});

  $('#entry-confirm').classList.remove('hidden');
  setTimeout(()=>$('#entry-confirm').classList.add('hidden'),1500);
  setTimeout(loadPBs,800);
});

/*──────────────── DETAIL VIEW (shared) ────────────────*/
async function openDetail(roundId){
  const rows = await api(`scores?round=${roundId}`); if(!rows.length) return;
  const rowsHtml = rows.map(r=>`<tr><td>${r.end_no}</td><td>${r.arrows}</td><td>${r.total}</td></tr>`).join('');
  $('#d-table').innerHTML = `<thead><tr><th>End</th><th>Arrows</th><th>Total</th></tr></thead><tbody>${rowsHtml}</tbody>`;
  $('#d-title').textContent = `${rows[0].location} • ${rows[0].date}`;
  show('detail');
}

/*──────────────── ROUND LIST (Archer tab) ────────────────*/
$('#filter-bar')?.addEventListener('submit', e=>{ e.preventDefault(); listScores(); });

async function listScores(){
  if(!currentUser) return;
  const qs = new URLSearchParams({
    archer: currentUser.id,
    from  : $('#f-from').value,
    to    : $('#f-to').value,
    location: $('#f-loc').value
  });
  const ends = await api(`scores?${qs}`);
  const totals = ends.reduce((o,r)=>{
    o[r.round_id] ??= {...r,total:0};
    o[r.round_id].total += r.total;
    return o;
  },{});

  const liHtml = Object.values(totals)
    .sort((a,b)=>b.date.localeCompare(a.date))
    .map(r=>`
      <li>
        <div><small>${r.date}</small><small>${r.location}</small></div>
        <div class="score-val">${r.total}</div>
        <div class="details-link" data-id="${r.round_id}">details &rsaquo;</div>
      </li>`).join('');

  $('#score-list').innerHTML = liHtml;
}
listScores();

$('#score-list')?.addEventListener('click', e=>{
  const link = e.target.closest('.details-link');
  if(link) openDetail(link.dataset.id);
});

/*──────────────── PERSONAL BESTS ────────────────*/
async function loadPBs(){
  if(!currentUser) return;
  const ends = await api(`scores?archer=${currentUser.id}`);
  const byRound = ends.reduce((o,r)=>{
    o[r.round_id] ??= {...r,total:0};
    o[r.round_id].total += r.total; return o;
  },{});

  const rowsHtml = Object.values(byRound)
    .sort((a,b)=>b.total-a.total)
    .map(r=>`
      <tr>
        <td><a href="#" class="pb-loc-link" data-loc="${r.location}">${r.location}</a></td>
        <td>${r.date}</td>
        <td>${r.equipment}</td>
        <td><a href="#" class="pb-score-link" data-id="${r.round_id}">${r.total}</a></td>
      </tr>`).join('');

  $('#pb-table').innerHTML = `<thead><tr><th>Location</th><th>Date</th><th>Equipment</th><th>Total</th></tr></thead><tbody>${rowsHtml}</tbody>`;
}
if(currentUser) loadPBs();

$('#pb-table')?.addEventListener('click', e=>{
  if(e.target.closest('.pb-score-link')) openDetail(e.target.dataset.id);
  const loc = e.target.closest('.pb-loc-link');
  if(loc){
    $('#club-select').value = loc.dataset.loc;
    $('#club-select').dispatchEvent(new Event('change'));
    show('clubs');
  }
});

/*──────────────── CLUB BESTS ────────────────*/
async function loadClubs(){
  const clubs = await api('clubs');
  const optHtml = ['<option value="">select…</option>', ...clubs.map(c=>`<option>${c.location}</option>`)].join('');
  $('#club-select').innerHTML = optHtml;
}
loadClubs();

$('#club-select')?.addEventListener('change', async e=>{
  const loc = e.target.value; if(!loc) return;
  const bests = await api(`club-bests?location=${encodeURIComponent(loc)}`);
  const rows = bests.map(r=>`
    <tr><td>${r.name}</td><td>${r.equipment}</td><td>${r.shot_on}</td><td>${r.best_total}</td></tr>`).join('');
  $('#club-table').innerHTML = `<thead><tr><th>Archer</th><th>Equipment</th><th>Shot on</th><th>Total</th></tr></thead><tbody>${rows}</tbody>`;
});
