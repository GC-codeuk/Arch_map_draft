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
    return this.infowindow = new InfoBox(this.infobox(boxText));
  };

  InfoBoxBuilder.prototype.infobox = function(boxText) {
    return {
      content: boxText,
      pixelOffset: new google.maps.Size(-150, 0),
      disableAutoPan: true,
      maxWidth: 400,
      zIndex: null,
      boxStyle: {
        width: "400px",
        background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat"
      },
      infoBoxClearance: new google.maps.Size(1, 1),
      closeBoxURL: ""
    };
  };

  return InfoBoxBuilder;

})(Gmaps.Google.Builders.Marker);


this.buildMap = function(markers) {
  handler = Gmaps.build('Google', { 
    internal: { disableAutoPanTo: true }, //This isn't working
    builders: { Marker: InfoBoxBuilder }
  });
  
  handler.buildMap({
    provider: {
      disableDefaultUI: true,
      zoomControl: true,
      //center_on_user: true,
      //auto_zoom: false,
      //zoom : 10, 
      styles: styles
    },
    internal: {
      id: 'map'
    }
  }, 
  function() {
    markers = handler.addMarkers(markers);
    handler.bounds.extendWith(markers);
    handler.fitMapToBounds();
    handler.getMap().setZoom(12);
    google.maps.event.addListener(handler.getMap(), 'click', function() {
      handler.currentInfowindow().close();
    });
  });
};
