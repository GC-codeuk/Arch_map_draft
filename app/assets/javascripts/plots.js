var InfoBoxBuilder,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

InfoBoxBuilder = (function(superClass) {
  extend(InfoBoxBuilder, superClass);

  function InfoBoxBuilder() {
    return InfoBoxBuilder.__super__.constructor.apply(this, arguments);
  }


  InfoBoxBuilder.prototype.create_infowindow = function() {
    var boxText;
    if (!_.isString(this.args.infowindow)) {
      return null;
    }
    boxText = document.createElement("div");
    boxText.setAttribute('class', 'marker_container');
    boxText.innerHTML = this.args.infowindow;
    // Render plot details partial with plot and animate to show
    $(boxText).on('click', function() {
        $.ajax({
          url: "/plots/" + $('#plot_id').val() + "/plotdetails",
          format: 'js',
          data: {
            id: $('#plot_id').val()
          }
        });
    
        if ( $('#plotdetails').hasClass( "hidden" ) ) {   
          $('#plotdetails').animate({left: 0}, 450).toggleClass( "hidden" );
          $('#map').animate({ width: $(window).width() - 215 }, 550); // Shift map so infoxbox not hidden by plotdetails
        };
        
    });
    return this.infowindow = new InfoBox(this.infobox(boxText));
  };



  InfoBoxBuilder.prototype.infobox = function(boxText) {
    return {
      content: boxText,
      pixelOffset: new google.maps.Size(-150, 0),
      disableAutoPan: true,
      //maxWidth: 250,
      zIndex: null,
      pane: "floatPane",
      enableEventPropagation: false,
      boxStyle: {
        //width: "250px",
        background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat"
      },
      infoBoxClearance: new google.maps.Size(1, 1),
      closeBoxURL: ""
    };
  };

  return InfoBoxBuilder;

})

(Gmaps.Google.Builders.Marker);

// Map style array settings
var styles = [
// Hue of map setting
  {
    stylers: [
      { hue: "#00ffe6" },
      { saturation: -20 }
    ]
  },
 // Simplify road features
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 100 },
      { visibility: "simplified" }
    ]
  },
  // Remove street names
  {
    featureType: "road",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  },
  {
  "featureType": "water",
  "stylers": [
    { "saturation": -6 },
    { "lightness": -74 },
    { "color": "#2580cb" }
  ]
  },     
];



this.buildMap = function(markers) {
  handler = Gmaps.build('Google', { 
    internal: { disableAutoPanTo: true }, //This isn't working
    builders: { Marker: InfoBoxBuilder }
  });
  
  handler.buildMap({
    provider: {
      disableDefaultUI: true,
      zoomControl: true,
      clickableIcons: false,
      //center_on_plot: true,
      //auto_zoom: false,
      //zoom : 10,
      styles: styles,
    },
    internal: {
      id: 'map',
      //disableAutoPanTo: true
    }
  }, 
  function() {
    markers = handler.addMarkers(markers);
    handler.bounds.extendWith(markers);
    handler.fitMapToBounds();
    handler.getMap().setZoom(12);

    //Close infowindow on click anywhere on map
    google.maps.event.addListener(handler.getMap(), 'click', function() {
      handler.currentInfowindow().close();
      if (!$('#plotdetails').hasClass("hidden")) {
        $('#map').animate({ width: $(window).width() }, 450, function() {
            /* Resize as per Google API documentation following programatic resize of map div*/
            google.maps.event.trigger(handler.getMap(), 'resize'); 
            $("#map").css("width", "100%");
        });
        $('#plotdetails').animate({left: - 620}, 550).toggleClass( "hidden" );
      };
    });


    /* Resize map div when window is resized at the same time as plot details shown. Prevents
    unwanted white space*/
    
    $(window).resize(function(){
      if (!$('#plotdetails').hasClass("hidden")) {
        $('#map').width($(window).width() - 215);
        /* Resize as per Google API documentation following programatic resize of map div*/
        google.maps.event.trigger(handler.getMap(), 'resize');
      };
    });

    
    // Change map style based on zoom level
    /*var mapStyleZoomedOut = [
      { 
        featureType: "road",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ] 
      }]; 
    var mapStyleZoomedIn = [
      { 
        featureType: "road",
        elementType: "labels",
        stylers: [
          { visibility: "on" }
        ] 
      }];

    var styledMapOptions = {map: handler, name: 'minimial'}; 
    var styledMapOptions2 = {map: handler, name: 'maximial'}; 

    var sMapType = new google.maps.StyledMapType(mapStyleZoomedOut,styledMapOptions); 
    handler.mapTypes.set('minimial', sMapType); 
    handler.setMapTypeId('minimial'); 

    var sMapType2 = new google.maps.StyledMapType(mapStyleZoomedIn,styledMapOptions2); 
    handler.mapTypes.set('maximial', sMapType2);

    google.maps.event.addListener(handler.getMap(), 'zoom_changed', function() { 
      var zoomLevel = handler.getZoom();
        alert(zoomLevel+', '+handler.getMapTypeId());
      var sMapType;
      // === IF Zoom Level <= 8 use mapStyleZoomedIn 
      if(zoomLevel <=14)
        handler.setMapTypeId('minimial');
      // === If Zoom Level > 8 use mapStyleZoomedOut 
      else
        handler.setMapTypeId('maximial'); 
    });*/

  });
};
