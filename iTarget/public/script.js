/*────────────────────────────────────────────────────────────────────────
  ArrowMate  –  Single-Page Front-End
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
  // show('home');
  // show('archer-range-input'); // Temporary for development
  // show('your-scores');
  show('round-details');
}
renderProfile();

/*─────────────────── ROUND DETAILS ───────────────────*/
// Description: Generate and style the 'round-details' tables from a set of data
// TODO: Replace constant values by database query result
const scoreTitle = 'Large target face at 50m';
const rangeScoreEg1 = {
  'End 1':['X', '9', '9', '8', '8', '8'],
  'End 2':['9', '9', '9', '8', '7', '6'],
  'End 3':['X', '9', '9', '7', '7', '7'],
  'End 4':['X', '9', '9', '9', '9', '8'],
  'End 5':['X', '10', '8', '8', '8', '8'],
};

const rangeScoreEg2 = {
  'End 1':['M', 'M', '1', '2', '3', '4'],
  'End 2':['5', '6', '7', '8', '9', '10'],
  'End 3':['X', 'X', 'X', 'X', 'X', 'X'],
  'End 4':['X', 'X', 'X', 'X', 'X', 'X'],
  'End 5':['X', 'X', 'X', 'X', 'X', 'X'],
};

allData = [rangeScoreEg1, rangeScoreEg2]
scoreTotals = [];

totalProgression = 0;
tenCount = 0;
xCount = 0;

const scoresSection = document.querySelector('.scores-section');

allData.forEach((data) => {
  const tableElement = document.createElement('table');
  const colString = [
    '<col class="col-med-w">',
    '<col class="col-arrow">'.repeat(6),
    '<col class="col-med-w">',
    '<col class="col-med-w">'
  ].join('');

  tableElement.insertAdjacentHTML('beforeend', colString);
  tableElement.insertAdjacentHTML('beforeend', `
    <thead>
      <tr>
        <th colspan="7" class="cell-dark text-left">${scoreTitle}</th>
        <th class="cell-dark-grey">End</th>
        <th class="cell-dark-grey">Prog</th>
      </tr>
    </thead>
    `);

  tableBodyElement = document.createElement('tbody');
  for (var key in data) {
    const row = document.createElement('tr');
    rowTotal = 0;
    row.innerHTML = `<td>${key}</td>`;
    data[key].forEach((arrow) => {
      row.insertAdjacentHTML('beforeend', `<td class="cell-arrow">${arrow}</td>`);
      if (isNaN(arrow)) {
        if (arrow === 'X') {
          rowTotal += 10;
          xCount += 1;
        }
      } else {
        rowTotal += parseInt(arrow);
        if (arrow === '10') {
          tenCount += 1;
        }
      }
    });
    totalProgression += rowTotal;
    row.insertAdjacentHTML('beforeend', `
      <td>${rowTotal}</td>
      <td>${totalProgression}</td>
      `);
    tableBodyElement.appendChild(row);
  }
  tableElement.appendChild(tableBodyElement);

  tableElement.insertAdjacentHTML('beforeend', `
    <tr class="text-center cell-h-med">
      <td colspan="3">10's &amp; X's: <strong>${tenCount + xCount}</strong></td>
      <td colspan="3">X's: <strong>${xCount}</strong></td>
      <td colspan="5" class="text-right"><h2>Total: ${totalProgression}</h2></td>
    </tr>
  `);

  scoresSection.appendChild(tableElement);
  scoreTotals.push(totalProgression);
  totalProgression = 0;
  tenCount = 0;
  xCount = 0;
})

// Style each arrow scores cell by their value to match their associated colour on the target face
archerScores = document.querySelectorAll('.cell-arrow');
archerScores.forEach(element => {
  if (['X','10','9'].includes(element.textContent)) { element.style.backgroundColor = 'var(--yellow)'; }
  else if (['8','7'].includes(element.textContent)) { element.style.backgroundColor = 'var(--red)'; }
  else if (['6','5'].includes(element.textContent)) { element.style.backgroundColor = 'var(--blue)'; element.style.color = 'var(--off-white)'; }
  else if (['4','3'].includes(element.textContent)) { element.style.backgroundColor = 'var(--black)'; element.style.color = 'var(--off-white)'; }
  else if (['2','1'].includes(element.textContent)) { element.style.backgroundColor = 'var(--off-white)'; }
  else if (['M'].includes(element.textContent)) { element.style.backgroundColor = 'var(--light-grey)'; }
});

scoresSection.insertAdjacentHTML('beforeend', `
  <hr class="line-break" style="margin: 2rem 0;">
  <h3>All Ranges</h3>
  `);

const totalsTable = document.createElement('table');
totalsTable.insertAdjacentHTML('beforeend', `
  <thead>
    <tr>
      <th class="cell-dark text-left">Distance</th>
      <th class="cell-dark-grey">Total</th>
    </tr>
  </thead>
  `);

tableBodyElement = document.createElement('tbody');

scoreTotals.forEach((total) => {
  tableBodyElement.insertAdjacentHTML('beforeend', `
    <tr>
      <td class="text-left">Large target face at 50m</td>
      <td class="text-left">${total}</td>
    </tr>
  `);
});


totalsTable.appendChild(tableBodyElement);
scoresSection.appendChild(totalsTable);
scoresSection.insertAdjacentHTML('beforeend', `<h3 class="big-box">Total: 500</h3>`);


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

/*─────────── ARROW SCORES INPUT ────────────*/
$('#arrow-scores-input')?.addEventListener('keypress', async e=> {
  upperKey = e.key.toUpperCase();
  // Limit input to only 0-9, M, or X
  if ((e.which >= 48 && e.which <= 57) || upperKey == 'M' || upperKey == 'X') {
    e.target.value = upperKey;
    let active = document.activeElement;
    let target = $('[tabindex="' + (active.tabIndex + 1) + '"]');
    target.focus();
  } else {
    e.preventDefault();
  }
})
/*─────────────────────────────────────────────────────────────────
  Archer flow improvements
─────────────────────────────────────────────────────────────────*/
const championships=[{id:1,name:'State Indoor 720',distance:'18m',range:'Indoor 2'},
                     {id:2,name:'Regional 1440',distance:'70m',range:'Range A'}];
const activeArchers=[];   // objects {name, class, div, dob}

function resetArcherForm(){
  $('#archer-existing').value='';
  $('#a-fname').value='';$('#a-lname').value='';
  $('#a-id').value=''; $('#a-dob').value='';
  $('#a-class').selectedIndex=0; $('#a-div').selectedIndex=0;
  $('#archer-fields').style.display='block';
}
document.querySelector('[data-goto="archer-setup"]').addEventListener('click', resetArcherForm);

$('#archer-existing').onchange = e=>{
  $('#archer-fields').style.display = e.target.value ? 'none':'block';
};

$('#archer-form').onsubmit = e=>{
  e.preventDefault();
  const existing = $('#archer-existing').value;
  let archer;
  if(existing){
    archer = activeArchers.find(a=>a.name===existing);
  }else{
    /* validate new entry */
    if(!$('#a-fname').value.trim()||!$('#a-lname').value.trim()||!$('#a-dob').value)
      return alert('Fill all required fields');
    archer = {
      name  : `${$('#a-fname').value.trim()} ${$('#a-lname').value.trim()}`,
      id    : $('#a-id').value.trim(),
      dob   : $('#a-dob').value,
      class : $('#a-class').value,
      div   : $('#a-div').value
    };
    activeArchers.push(archer);
    refreshPickers();
  }
  currentArcherSession = archer;
  show('champ-select');
};

/* refresh dropdowns whenever list changes */
function refreshPickers(){
  const opts = activeArchers.map(a=>`<option>${a.name}</option>`).join('');
  $('#archer-existing').innerHTML = '<option value="">-- none --</option>'+opts;
  $('#record-archer').innerHTML   = '<option value="">-- select --</option>'+opts;
}
refreshPickers();

/*──────────────── Recorder flow fixes ───────────*/
let recArcher,end=1,arrows=[],ends=[];
$('#rec-sel-btn').onclick = ()=>{
  const name=$('#record-archer').value;
  recArcher = activeArchers.find(a=>a.name===name);
  if(!recArcher) return alert('Pick an archer');
  end=1; arrows=[]; ends=[];
  $('#score-head').textContent=`${recArcher.name} • End 1`;
  setKeypad(); updateStrip();
  show('recorder-score');
};

function setKeypad(){
  const keys=['X','10','9','8','7','6','5','4','3','2','1','M'];
  $('#num-grid').innerHTML = keys.map(k=>`<button class="${colour(k)}">${k}</button>`).join('');
}

function updateStrip(){
  const boxes = Array.from({length:6},(_,i)=>arrows[i]??'');
  $('#score-strip').innerHTML = boxes.map(s=>`<span class="${colour(s)}">${s}</span>`).join('');
  $('#score-total').textContent = arrows.reduce((t,a)=>t+(a==='X'?10:(+a||0)),0);
}

$('#num-grid').addEventListener('click',e=>{
  if(e.target.tagName!=='BUTTON') return;
  if(arrows.length<6){ arrows.push(e.target.textContent); updateStrip(); }
});
$('#score-cancel').addEventListener('click', ()=>{ arrows.pop(); updateStrip(); });

$('#score-save').addEventListener('click', ()=>{
  if(arrows.length!==6) return alert('Need 6 arrows');
  ends.push({end,total:+$('#score-total').textContent,arrows:[...arrows]});
  arrows=[]; end++;
  if(end>5){ buildReview(); show('recorder-review'); }
  else{
    $('#score-head').textContent = `${recArcher.name} • End ${end}`;
    updateStrip();
  }
});

/* review */
function buildReview(){
  const rows = ends.map(e=>`
    <tr><td>End ${e.end}</td>`+
      e.arrows.map(a=>`<td class="${colour(a)}">${a}</td>`).join('')+
      `<td>${e.total}</td></tr>`).join('');
  $('#review-table').innerHTML = `<thead><tr><th></th><th colspan="6">Arrows</th><th>Total</th></tr></thead><tbody>${rows}</tbody>`;
}
$('#review-done').addEventListener('click',()=>{
  alert('Score saved (stub).'); show('home');
});

/* fire custom show event each time recorder-select becomes active - Unsure about usability as of the moment */
const observer = new MutationObserver(()=>{
  if($('#recorder-select').classList.contains('active')){
    $('#recorder-select').dispatchEvent(new Event('show'));
  }
});
observer.observe($('#recorder-select'),{attributes:true,attributeFilter:['class']});

/*──────────────── Leaderboard mock ───────────────*/
const lbData=[
  {name:'Jacob Shiel',  pts:956, avatar:'TempJacob.jpg', ranges:[320,318,318]},
  {name:'Jack Marken',  pts:903, avatar:'TempJack.jpg',  ranges:[300,301,302]},
  {name:'Patrick Lunney',pts:881,avatar:'TempUser.jpg',  ranges:[295,293,293]},
  {name:'Max Pattison', pts:860, avatar:'TempUser.jpg',  ranges:[287,286,287]},
  {name:'Tom Huynh',    pts:845, avatar:'TempUser.jpg',  ranges:[282,281,282]}
];

lbData.forEach((a,i)=>$('#lb-list').insertAdjacentHTML('beforeend',`
  <li data-i="${i}"><span class="rank">${i+1}</span>
    <img class="avatar" src="assets/${a.avatar}" alt="">
    <span>${a.name}</span>
    <span class="pts">${a.pts}</span></li>`));

$('#lb-list').onclick = e=>{
  const li=e.target.closest('li'); if(!li) return;
  const a = lbData[li.dataset.i];
  const rows = ['Range 1','Range 2','Range 3']
               .map((label,i)=>`<tr><td>${label}</td><td>${a.ranges[i]}</td></tr>`)
               .join('');
  $('#lb-detail').innerHTML = `
    <h3>${a.name}</h3>
    <p><img src="assets/TempAus.jpg" class="flag-placeholder">&nbsp;Australia</p><br>
    <table class="table">
      <thead><tr><th>Series</th><th>Total</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><th>Overall</th><th>${a.pts}</th></tr></tfoot>
    </table>`;
};
