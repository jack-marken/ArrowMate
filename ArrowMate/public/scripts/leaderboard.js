
const lbData=[
  {name:'Jacob Shiel',  pts:956, avatar:'TempJacob.jpg', ranges:[320,318,318]},
  {name:'Jack Marken',  pts:903, avatar:'TempJack.jpg',  ranges:[300,301,302]},
  {name:'Patrick Lunney',pts:881,avatar:'TempUser.jpg',  ranges:[295,293,293]},
  {name:'Max Pattison', pts:860, avatar:'TempUser.jpg',  ranges:[287,286,287]},
  {name:'Tom Huynh',    pts:845, avatar:'TempUser.jpg',  ranges:[282,281,282]}
];

lbData.forEach((a,i)=>document.querySelector('#lb-list').insertAdjacentHTML('beforeend',`
  <li data-i="${i}"><span class="rank">${i+1}</span>
    <img class="avatar" src="assets/${a.avatar}" alt="">
    <span>${a.name}</span>
    <span class="pts">${a.pts}</span></li>`));

document.querySelector('#lb-list').onclick = e=>{
  const li=e.target.closest('li'); if(!li) return;
  const a = lbData[li.dataset.i];
  const rows = ['Range 1','Range 2','Range 3']
               .map((label,i)=>`<tr><td>${label}</td><td>${a.ranges[i]}</td></tr>`)
               .join('');
  document.querySelector('#lb-detail').innerHTML = `
    <h3>${a.name}</h3>
    <p><img src="assets/TempAus.jpg" class="flag-placeholder">&nbsp;Australia</p><br>
    <table class="table">
      <thead><tr><th>Series</th><th>Total</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><th>Overall</th><th>${a.pts}</th></tr></tfoot>
    </table>`;
};
