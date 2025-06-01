// Set the landing page
$('#your-scores').addClass('active');

// All first-layer pages are loaded with PHP, and pressing buttons in the
// nav bar toggles their 'active' class ('display: none;' -> 'display: flex;')
$('.nav-btn').each(function () {
  var $navBtn = $(this);
  $navBtn.on("click", function () {
    $('.screen').each(function () {
      if ($(this).attr('id') == $navBtn.data('goto')) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
  });
});


/* ------ HOME PAGE ------- */
// TODO: Time/date/weather
