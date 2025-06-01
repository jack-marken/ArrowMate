
<!----------------------------------------------------------------
  YOUR SCORES – The user's round information
----------------------------------------------------------------->
<section id="your-scores">
  <header class="hero hero--white-blue hero--tall big-title"><h1>YOUR SCORES</h1></header>

  <main>
    <form id="input-form" class="pad stack">
      <label>Category:
        <select id="category" required>
          <option value="1">All</option>
          <option value="2">Open Female Recurve</option>
          <option value="3">18+ Female Recurve</option>
        </select>
      </label>
      <Label for="date-from">From:</label>
      <input type="date" id="date-from" name="date-from" />
      <Label for="date-to">To:</label>
      <input type="date" id="date-to" name="date-to" />
    </form>

    <hr class="line-break" />

    <div class="pad">
      <div class="card flex-row">
        <div class="card-section flex-column flex-start">
          <p>27/12/2015</p>
          <p class="text-grey"><i class="fa-solid fa-bullseye"></i> Drake</p>
          <p class="text-grey"><img src="assets/BowAndArrow.svg" class="svg-icon-sm filter-grey" />Recurve</p>
        </div>
        <div class="card-section flex-column flex-end">
          <h1>754</h1>
          <a href="round-details">View details <i class="bi bi-caret-right-fill"></i></a>
        </div>
      </div>
    </div>
  </main>
</section>

