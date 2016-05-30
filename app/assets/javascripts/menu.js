$(document).ready(function() {
  $('.icon-menu').click(function() {
      $('#menu').animate({left: 0}, 550)
  });
  $('.icon-close').click(function() {
      $('#menu').animate({left: -620}, 550)
  });
});
