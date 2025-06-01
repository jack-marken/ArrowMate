
<!----------------------------------------------------------------
  ARROW SCORES INPUT
----------------------------------------------------------------->
<section id="archer-range-input">
  <header class="hero hero--short hero--simple flex-row">
    <a href="archer-range-setup"><i class="bi bi-caret-left-fill"></i></a>
    <h3 class="flex-grow">SCORE&nbsp;YOUR&nbsp;END</h3>
  </header>
  <main class="pad">
    <div class="flex-column flex-center stack">
      <h1 id="test-heading">End 1/5</h1>
      <p class="text-grey">Enter your score when the end is complete</p>
      <form id="arrow-scores-input">
        <input id="arrow-score-1" type="text" tabindex="0" maxlength="1" autocomplete="off" autofocus>
        <input id="arrow-score-2" type="text" tabindex="1" maxlength="1" autocomplete="off">
        <input id="arrow-score-3" type="text" tabindex="2" maxlength="1" autocomplete="off">
        <input id="arrow-score-4" type="text" tabindex="3" maxlength="1" autocomplete="off">
        <input id="arrow-score-5" type="text" tabindex="4" maxlength="1" autocomplete="off">
        <input id="arrow-score-6" type="text" tabindex="5" maxlength="1" autocomplete="off">
      </form>
    </div>
  </main>

<script>
// Move to next input when a key is pressed, and limit input to only valid characters
$('#arrow-scores-input').keypress(function (e) {
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
</script>
</section>
