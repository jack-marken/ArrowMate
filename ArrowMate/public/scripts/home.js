DEFAULT_HOME_PAGE = 'home';

/* -------- ROUTING -------- */
// All first-layer pages are loaded with PHP, and setting the '?page=' query
// in the URL toggles their '.active' class ('display: none;' -> 'display: flex;')

function SetPage(page) {
  // lastPartOfUrl = $(location).attr('href').split('/').at(-1);
  // alert(lastPartOfUrl);
  // .substring(thePath.lastIndexOf('/') + 1)
  window.history.pushState({ page: page }, "ArrowScores", "?page=" + page);
}

function ShowPage() {
  // Parse the '?page=' query in the URL to find the active page
  // If it does not exist, set the default page
  var urlParams = new URLSearchParams(window.location.search);
  activePage = urlParams.get('page');
  if (!activePage) {
    SetPage(DEFAULT_HOME_PAGE);
    activePage = DEFAULT_HOME_PAGE;
  }
  // Display the active page
  $('.screen').each(function () {
    if ($(this).attr('id') == activePage) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });
  // Set the nav button to an active colour
  $('.nav-btn').each(function () {
    if ($(this).data('goto') == activePage) {
      $(this).addClass('nav-active');
    } else {
      $(this).removeClass('nav-active');
    }
  });
}
ShowPage();

$(window).on('popstate', function(e) {
  ShowPage();
});

$('.nav-btn').each(function () {
  var $navBtn = $(this);
  $navBtn.on("click", function () {
    SetPage($navBtn.data('goto'));
    ShowPage();
  });
});

/* ------ HOME PAGE ------- */
// TODO: Time/date/weather
