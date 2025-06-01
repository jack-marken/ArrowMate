DEFAULT_HOME_PAGE = 'home';

/* -------- ROUTING -------- */
// All first-layer pages are loaded with PHP, and setting the '?page=' query
// in the URL toggles their '.active' class ('display: none;' -> 'display: flex;')

function SetPage(page) {
  window.history.pushState({ page: 1 }, "ArrowScores", "?page=" + page);
}

function ShowPage() {
  var urlParams = new URLSearchParams(window.location.search);
  activePage = urlParams.get('page');
  if (!activePage) {
    SetPage(DEFAULT_HOME_PAGE);
    activePage = DEFAULT_HOME_PAGE;
  }
  $('.screen').each(function () {
    if ($(this).attr('id') == activePage) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });
}
ShowPage();

$('.nav-btn').each(function () {
  var $navBtn = $(this);
  $navBtn.on("click", function () {
    SetPage($navBtn.data('goto'));
    ShowPage();
  });
});

/* ------ HOME PAGE ------- */
// TODO: Time/date/weather
