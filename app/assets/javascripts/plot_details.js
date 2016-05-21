$(document).ready(function() {
  $('.icon-menu').click(function() {
    	$('#menu').animate({left: 0}, 'slow')
  });
  $('.icon-close').click(function() {
    	$('#menu').animate({left: -430}, 'slow')
  });

  /*$('.icon-close').click(function() {
    	$('#plotdetails').animate({left: -380}, 'slow')
  });*/

 });
