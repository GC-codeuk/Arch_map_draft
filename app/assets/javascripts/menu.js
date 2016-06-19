$(document).ready(function() {
  $('.icon-menu').click(function() {
      $('#menu').animate({left: 0}, 550);
      /*$('.icon-menu').hide();*/
  });
  $('.icon-close').click(function() {
      $('#menu').animate({left: -620}, 550);
      /*$('.icon-menu').show();*/
  });



/*Switch between map and list of buildings when icon clicked*/
  $("#map-plots-btn").click(function(event) {
    $(this).find('img').toggle();
    $('#map').toggle();
    $('#location-icon').toggle();
    $('#buildings').toggle();
    google.maps.event.trigger(handler.getMap(), 'resize');
    /*$('#buildings').animate({left: 0}, 0);*/
  });

});
