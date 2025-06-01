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

