
<!----------------------------------------------------------------
  RECORDER FLOW
----------------------------------------------------------------->
<!-- pick archer -->
<section id="recorder-select">
  <header class="hero"><h1>Pick&nbsp;archer</h1></header>
  <main class="pad">
    <label>Active archers
      <select id="record-archer"></select>
    </label>
    <button id="rec-sel-btn" class="primary">Confirm</button>
  </main>
</section>

<!-- keypad -->
<section id="recorder-score">
  <header class="hero"><h1 id="score-head"></h1></header>
  <main class="pad">
    <div id="score-strip"  class="strip"></div>
    <div id="score-total"  class="total-box">0</div>
    <div id="num-grid"     class="num-grid"></div>

    <div class="flex gap">
      <button id="score-cancel" class="secondary flex-1">Undo</button>
      <button id="score-save"   class="primary  flex-1">Save&nbsp;end</button>
    </div>
  </main>
</section>

<!-- review -->
<section id="recorder-review">
  <header class="hero"><h1>Review&nbsp;score</h1></header>
  <main class="pad">
    <table id="review-table" class="table"></table>
    <button id="review-done" class="primary" style="margin-top:1.2rem;">Save&nbsp;&amp;&nbsp;Exit</button>
  </main>
</section>
