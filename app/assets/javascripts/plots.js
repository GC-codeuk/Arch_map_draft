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
          $('#plotdetails').animate({left: 0}, 500).toggleClass( "hidden" );
          $('#map').delay(150).animate({ width: $(window).width() - 215 }, 350); // Shift map so infoxbox not hidden by plotdetails
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
        background: "url('https://db.tt/qVR2aExf') no-repeat"
      },
      infoBoxClearance: new google.maps.Size(1, 1),
      closeBoxURL: ""
    };
  };

  return InfoBoxBuilder;

})

(Gmaps.Google.Builders.Marker);

// Map style array settings
var mapStyleZoomedOut = [
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
  {
    "featureType": "poi.business",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  }    
];

 
var mapStyleZoomedIn = [
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
      { visibility: "on" }
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
  {
    "featureType": "poi.business",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  }   
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
      styles: mapStyleZoomedOut,
    },
    internal: {
      id: 'map',
      //disableAutoPanTo: true
    }
  }, 
  function() {
    markers = handler.addMarkers(markers);
    handler.bounds.extendWith(markers);
    handler.getMap().setZoom(12);
    handler.getMap().setCenter({lat: 51.50742, lng: -0.127716});
    

    //Function to hide plot details and resize map to full screen
    function hidePlotDetails() {
      if (!$('#plotdetails').hasClass("hidden")) {
        $('#map').animate({ width: $(window).width() }, 350, function() {
          /* Run map resize as per Google API documentation following programatic resize of map div*/
          google.maps.event.trigger(handler.getMap(), 'resize'); 
          $("#map").css("width", "100%");
        });
        $('#plotdetails').animate({left: - 620}, 500).toggleClass( "hidden" );
      };
    };


    //Close infowindow on click anywhere on map and hide plot details
    google.maps.event.addListener(handler.getMap(), 'click', function() {
      handler.currentInfowindow().close();
      hidePlotDetails();
    });

 
    //Hide plot details div using swipe action on touchscreen
    $("#plotdetails").on("swipeleft",function(){
      hidePlotDetails();
    });


    /* Resize map div when window is resized and plot details are shown. Prevents
    unwanted white space*/
    $(window).resize(function(){
      if (!$('#plotdetails').hasClass("hidden")) {
        $('#map').width($(window).width() - 215);
        /* Resize as per Google API documentation following programatic resize of map div*/
        google.maps.event.trigger(handler.getMap(), 'resize');
      };
    });


   /* Set map style based on zoom level so street names only appear when zoomed in */
    var styledMapOptions = {map: handler, name: 'minimial'}; 
    var styledMapOptions2 = {map: handler, name: 'maximial'};

    var sMapType = new google.maps.StyledMapType(mapStyleZoomedOut,styledMapOptions); 
    handler.getMap().mapTypes.set('minimial', sMapType); 
    handler.getMap().setMapTypeId('minimial');

    var sMapType2 = new google.maps.StyledMapType(mapStyleZoomedIn,styledMapOptions2); 
    handler.getMap().mapTypes.set('maximial', sMapType2);

    google.maps.event.addListener(handler.getMap(), 'zoom_changed', function() { 
      var zoomLevel = handler.getMap().getZoom();
      var sMapType;
      // === IF Zoom Level <= 16 use mapStyleZoomedIn 
      if(zoomLevel <=16)
        handler.getMap().setMapTypeId('minimial');
      // === If Zoom Level > 16 use mapStyleZoomedOut 
      else
        handler.getMap().setMapTypeId('maximial'); 
    });


    
    /* Find geolocation when location icon is clicked */
    $('#location-icon').click(function() {
      if ($('#location-icon').hasClass("off")) {
        $("#location-icon").attr("src","https://db.tt/ildt6X1d").toggleClass( "off" );  
        GeoMarker = new GeolocationMarker();
        GeoMarker.setCircleOptions({fillColor: '#999', strokeColor: '#fff'});
        //GeoMarker.setMarkerOptions({icon: 'https://db.tt/HxfPDM2y', width: 8, height: 8, x:14, y:14});

        google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function() {
          handler.getMap().setCenter(this.getPosition());
          handler.getMap().setZoom(17);
        });

        google.maps.event.addListener(GeoMarker, 'geolocation_error', function(e) {
          alert('There was an error obtaining your position. Message: ' + e.message);
        });

        GeoMarker.setMap(handler.getMap());
      }
      else {
        GeoMarker.setMap(null);
        $("#location-icon").attr("src","https://db.tt/AeustLSb").toggleClass( "off" );
      };
        
    });


  });
};
