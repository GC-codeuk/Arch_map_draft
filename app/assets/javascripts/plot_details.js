$(document).ready(function() {
  $('.icon-menu').click(function() {
      $('#menu').animate({left: 0}, 550)
  });
  $('.icon-close').click(function() {
      $('#menu').animate({left: -620}, 550)
  });

  /*$('.icon-close').click(function() {
  	  alert('hello');
      $('#map').animate({ width: $('#map').width() + 215 }, 450);
      $('#plotdetails').animate({left: - 430}, 500).toggleClass( "hidden" );
  });*/

 });
