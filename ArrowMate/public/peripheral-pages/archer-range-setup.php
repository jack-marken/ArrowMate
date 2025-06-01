
<!----------------------------------------------------------------
  ARCHER RANGE SETUP
----------------------------------------------------------------->
<!-- step-1: details -->
<section id="archer-range-setup">
  <header class="hero hero--short hero--simple flex-row">
    <i class="bi bi-caret-left-fill" data-goto="actions"></i>
    <h3 class="flex-grow">JOIN&nbsp;A&nbsp;RANGE</h3>
  </header>
  <main class="pad">
    <form id="archer-form" class="stack">
      <p>Name: <span class="text-grey">Jacob Shiel</span></p>
      <label>Division:
        <select id="division" required>
            <option>Recurve</option><option>Compound</option><option>Longbow</option>
            <option>Barebow Recurve</option><option>Barebow Compound</option>
        </select>
      </label>
    </form>

    <button class="card card--underlined card--mustard">
      <div class="card-section flex-row">
        <div class="flex-start"><h3>ID: 2</h3></div>
        <div class="flex-end"><h3>End 2/5</h3></div>
      </div>
      <div class="card-section flex-column flex-start text-grey">
        <p><i class="fa-solid fa-bullseye" /></i> Launceston</p>
        <p>Open Female Compound</p>
      </div>
    </button>
    <button class="card card--underlined">
      <div class="card-section flex-row">
        <div class="flex-start"><h3>ID: 2</h3></div>
        <div class="flex-end"><h3>End 2/5</h3></div>
      </div>
      <div class="card-section flex-column flex-start text-grey">
        <p><i class="fa-solid fa-bullseye" /></i> Launceston</p>
        <p>Open Female Compound</p>
      </div>
    </button>
    <button class="primary" data-goto="archer-range-input">BEGIN</button>
  </main>
</section>

