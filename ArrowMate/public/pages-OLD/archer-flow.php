
<!----------------------------------------------------------------
  ARCHER FLOW
----------------------------------------------------------------->
<!-- step-1: details -->
<section id="archer-setup">
  <header class="hero"><h1>Archer&nbsp;details</h1></header>
  <main class="pad">
    <form id="archer-form" class="stack">
      <label>Use existing
        <select id="archer-existing"><option value="">-- none --</option></select>
      </label>

      <!-- new-archer fields (auto-hidden when existing chosen) -->
      <div id="archer-fields">
        <label>First name    <input id="a-fname" required></label>
        <label>Last  name    <input id="a-lname" required></label>
        <label>Membership ID <input id="a-id"></label>
        <label>Date of birth <input type="date" id="a-dob" required></label>

        <label>Class
          <select id="a-class" required>
            <option>Under 14</option><option>Under 16</option><option>Under 18</option>
            <option>Under 21</option><option>Open</option><option>50 +</option>
            <option>60 +</option><option>70 +</option>
          </select>
        </label>

        <label>Division
          <select id="a-div" required>
            <option>Recurve</option><option>Compound</option><option>Longbow</option>
            <option>Barebow Recurve</option><option>Barebow Compound</option>
          </select>
        </label>
      </div>

      <button class="primary">Confirm</button>
    </form>
  </main>
</section>

<!-- step-2: choose championship -->
<section id="champ-select" class="screen">
  <header class="hero"><h1>Select&nbsp;championship</h1></header>
  <main class="pad"><ul id="champ-list" class="list"></ul></main>
</section>

<!-- step-3: range info -->
<section id="range-info" class="screen">
  <header class="hero"><h1>Range&nbsp;details</h1></header>
  <main id="range-body" class="pad"></main>
</section>
