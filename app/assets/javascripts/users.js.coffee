# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

#class RichMarkerBuilder extends Gmaps.Google.Builders.Marker #inherit from builtin builder
#  #override create_marker method
#  create_marker: ->
#    options = _.extend @marker_options(), @rich_marker_options()
#    @serviceObject = new RichMarker options #assign marker to @serviceObject

#  rich_marker_options: ->
#    marker = document.createElement("div")
#    marker.setAttribute 'class', 'marker_container'
#    marker.innerHTML = @args.title
#    { content: marker }

class InfoBoxBuilder extends Gmaps.Google.Builders.Marker 
# inherit from base builder
  # override method
  create_infowindow: ->
    return null unless _.isString @args.infowindow

    boxText = document.createElement("div")
    boxText.setAttribute('class', 'marker_container') #to customize
    boxText.innerHTML = @args.infowindow
    @infowindow = new InfoBox(@infobox(boxText))

    #@bind_infowindow() for < 2.1

  infobox: (boxText)->
    content: boxText
    pixelOffset: new google.maps.Size(-140, 0)
    #closeBoxURL: ""
    boxStyle:
      width: "280px"

#handler = Gmaps.build 'Google', { builders: { Marker: InfoBoxBuilder} 

@buildMap = (markers)->
  handler = Gmaps.build 'Google', { builders: { Marker: InfoBoxBuilder} } #dependency injection

  #then standard use
  handler.buildMap { provider: {styles: styles}, internal: {id: 'map'} }, ->
    markers = handler.addMarkers(markers)
    handler.bounds.extendWith(markers)
    handler.fitMapToBounds()


