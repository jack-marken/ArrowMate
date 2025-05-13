/* ──────────────────────────────────────────
   iTarget – front-end single-page script
   (no demo seeding; DB must supply data)
   ────────────────────────────────────────── */

/* compact fetch helper */
const api = (q, opts = {}) => fetch(`/api/${q}`, opts).then(r => r.json());

/* global elements */
const nav        = document.querySelector('.bottom-nav');
const pbTable    = document.getElementById('pb-table');
const clubSelect = document.getElementById('club-select');
const scoreList  = document.getElementById('score-list');
const dTable     = document.getElementById('d-table');
const dTitle     = document.getElementById('d-title');

let currentUser = null;   // { id, name, flag, nation }

/* ─────────── Router + nav slide-in ─────────── */
function show(view){
  document.querySelectorAll('.screen')
          .forEach(s => s.classList.toggle('active', s.id === view));
  document.querySelectorAll('.nav-btn')
          .forEach(b => b.classList.toggle('nav-active', b.dataset.goto === view));
}

document.addEventListener('click', e => {
  const go = e.target.closest('[data-goto]');
  const bk = e.target.closest('[data-back]');
  if (go && nav.classList.contains('show')) show(go.dataset.goto);
  if (bk) show(bk.dataset.back);
});

document.getElementById('target-btn').onclick =
  () => alert('Range-scoring screen coming soon!');

/* ─────────── Profile / Login ─────────── */
function renderProfile(){
  const root = document.getElementById('profile-body');
  root.innerHTML = '';

  if(!currentUser){
    /* login form */
    root.insertAdjacentHTML('beforeend',`
      <form id="login-form" class="stack" style="max-width:280px;margin:0 auto;">
        <label>Username <input type="password" id="login-user"></label>
        <label>Password <input type="password" id="login-pass"></label>
        <button class="primary">Login</button>
      </form>`);

    document.getElementById('login-form').onsubmit = e=>{
      e.preventDefault();
      const u = document.getElementById('login-user').value.trim();
      const p = document.getElementById('login-pass').value.trim();
      if(u==='1234' && p==='1234'){
        /* simple mock user (you can replace when real auth arrives) */
        currentUser = { id: 0, name: 'Jacob Shiel', flag: '🇦🇺', nation: 'Australia' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        nav.classList.add('show');
        show('home');
        renderProfile();
        refreshArchers();
        loadPBs();
      } else {
        alert('Invalid credentials (hint: 1234 / 1234)');
      }
    };
  } else {
    /* profile summary card */
    root.insertAdjacentHTML('beforeend',`
      <div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:1.2rem;max-width:320px;margin:0 auto;">
        <img src="https://raw.githubusercontent.com/encharm/Font-Awesome-SVG-PNG/master/black/png/128/user.png"
             alt="avatar" style="width:90px;height:90px;border-radius:50%;object-fit:cover;margin-bottom:.8rem;">
        <h2 style="margin-bottom:.3rem;">${currentUser.name}</h2>
        <p style="font-size:.95rem;margin-bottom:1.1rem;">
          ${currentUser.flag}&nbsp;&nbsp;${currentUser.nation}
        </p>

        <button id="logout" class="primary" style="background:var(--rust);max-width:180px;margin:0 auto;">
          Log&nbsp;out
        </button>
      </div>`);

    document.getElementById('logout').onclick = ()=>{
      currentUser = null;
      localStorage.removeItem('currentUser');
      nav.classList.remove('show');
      show('profile');
      renderProfile();
    };
  }
}
renderProfile();

/* restore session after refresh */
if(localStorage.getItem('currentUser')){
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  nav.classList.add('show');
  show('home');
  renderProfile();
}

/* ─────────── Recorder page ─────────── */
async function refreshArchers(){
  const sel = document.getElementById('sel-archer');
  if(!sel) return;
  const list = await api('archers');
  sel.innerHTML = '<option value="">select…</option>';
  list.forEach(a =>
    sel.insertAdjacentHTML('beforeend',`<option value="${a.id}">${a.name}</option>`)
  );
  if(currentUser) sel.value = currentUser.id;
}
refreshArchers();

document.getElementById('add-archer').onclick = async ()=>{
  const name = prompt('Archer name?');
  if(!name) return;
  await api('archers', {
    method: 'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name })
  });
  refreshArchers();
};

document.getElementById('recorder-form').onsubmit = async e=>{
  e.preventDefault();
  const archer_id = document.getElementById('sel-archer').value;
  const date      = document.getElementById('round-date').value;
  const location  = document.getElementById('round-loc').value;
  const end_no    = document.getElementById('end-no').value;
  const arrowsRaw = document.getElementById('arrows').value.trim();
  if(!archer_id||!date||!location||!arrowsRaw) return alert('All fields required');

  const { id: round_id } = await api('rounds', {
    method: 'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ date, location })
  });

  const arr   = arrowsRaw.split(/\s+/);
  const val   = s => s==='X'?10 : s==='M'?0 : (+s||0);
  const total = arr.reduce((t,a)=>t+val(a),0);

  await api('scores',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ archer_id, round_id, end_no, arrows:arr.join(' '), total })
  });

  document.getElementById('entry-confirm').classList.remove('hidden');
  setTimeout(()=>document.getElementById('entry-confirm').classList.add('hidden'),1500);
  setTimeout(loadPBs, 800);           // refresh PBs
};

/* ─────────── Shared round-detail helper ─────────── */
async function openDetail(roundId){
  const rows = await api(`scores?round=${roundId}`);
  if(!rows.length) return;
  dTable.innerHTML = `
    <thead><tr><th>End</th><th>Arrows</th><th>Total</th></tr></thead>
    <tbody>${rows.map(r=>`<tr><td>${r.end_no}</td><td>${r.arrows}</td><td>${r.total}</td></tr>`).join('')}</tbody>`;
  dTitle.textContent = `${rows[0].location} • ${rows[0].date}`;
  show('detail');
}

/* ─────────── Archer round list ─────────── */
document.getElementById('filter-bar').onsubmit = e=>{
  e.preventDefault(); listScores();
};

async function listScores(){
  if(!currentUser) return;
  const qs = new URLSearchParams({
    archer   : currentUser.id,
    from     : document.getElementById('f-from').value,
    to       : document.getElementById('f-to').value,
    location : document.getElementById('f-loc').value
  });
  const ends   = await api(`scores?${qs}`);
  const groups = {};
  ends.forEach(r=>{
    if(!groups[r.round_id])
      groups[r.round_id]={round_id:r.round_id,location:r.location,date:r.date,total:0};
    groups[r.round_id].total += r.total;
  });

  scoreList.innerHTML='';
  Object.values(groups)
    .sort((a,b)=>b.date.localeCompare(a.date))
    .forEach(r=>scoreList.insertAdjacentHTML('beforeend',`
      <li>
        <div><small>${r.date}</small><small>${r.location}</small></div>
        <div class="score-val">${r.total}</div>
        <div class="details-link" data-id="${r.round_id}">details &rsaquo;</div>
      </li>`));
}
listScores();

scoreList.addEventListener('click',e=>{
  const l=e.target.closest('.details-link');
  if(l) openDetail(l.dataset.id);
});

/* ─────────── Personal Bests tab ─────────── */
async function loadPBs(){
  if(!currentUser) return;
  const ends = await api(`scores?archer=${currentUser.id}`);
  const byRound = {};
  ends.forEach(r=>{
    if(!byRound[r.round_id])
      byRound[r.round_id]={round_id:r.round_id,location:r.location,date:r.date,equipment:r.equipment,total:0};
    byRound[r.round_id].total += r.total;
  });

  const rows = Object.values(byRound).sort((a,b)=>b.total-a.total);
  pbTable.innerHTML = `
    <thead><tr><th>Location</th><th>Date</th><th>Equipment</th><th>Total</th></tr></thead>
    <tbody>
      ${rows.map(r=>`
        <tr>
          <td><a href="#" class="pb-loc-link" data-loc="${r.location}">${r.location}</a></td>
          <td>${r.date}</td>
          <td>${r.equipment}</td>
          <td><a href="#" class="pb-score-link" data-id="${r.round_id}">${r.total}</a></td>
        </tr>`).join('')}
    </tbody>`;
}
if(currentUser) loadPBs();

/* click delegation for PB rows */
pbTable.addEventListener('click', e=>{
  const loc  = e.target.closest('.pb-loc-link');
  const score= e.target.closest('.pb-score-link');
  if(loc){
    clubSelect.value = loc.dataset.loc;
    clubSelect.dispatchEvent(new Event('change'));
    show('clubs');
    return;
  }
  if(score) openDetail(score.dataset.id);
});

/* ─────────── Clubs tab ─────────── */
async function loadClubs(){
  const list = await api('clubs');
  clubSelect.innerHTML = '<option value="">select…</option>';
  list.forEach(c=>clubSelect.insertAdjacentHTML('beforeend',`<option>${c.location}</option>`));
}
loadClubs();

clubSelect.onchange = async e=>{
  const loc = e.target.value;
  if(!loc) return;
  const data = await api(`club-bests?location=${encodeURIComponent(loc)}`);
  const tbl  = document.getElementById('club-table');
  tbl.innerHTML = `
    <thead><tr><th>Archer</th><th>Equipment</th><th>Shot on</th><th>Total</th></tr></thead>
    <tbody>${data.map(r=>`
      <tr><td>${r.name}</td><td>${r.equipment}</td><td>${r.shot_on}</td><td>${r.best_total}</td></tr>
    `).join('')}</tbody>`;
};
