var mymap;
var key = 'NeNAJsQv8JMJX1LGXiPKgRfC6iHyuGBT';

/*
**  onLoad function, detect when button or form is used
*/

window.onload = function () {
  init();

  $("#locate").on("click", function() {
    findMe();
  });

  $("#geoSearch").on("change", function(){
    var value = $("#geoSearch").val();
    geoposition(value);
  });

  $("#geoStart").on("change", function(){
    if ($("#geoStart").val() != "" && $("#geoEnd").val() != "") {
      routing($("#geoStart").val(), $("#geoEnd").val());
    }
  });

  $("#geoEnd").on("change", function(){
    if ($("#geoStart").val() != "" && $("#geoEnd").val() != ""){
      routing($("#geoStart").val(), $("#geoEnd").val());
    }
  });

//  var polyline = L.polyline([[48.81, 7.78], [48.46, 7.48]]).addTo(mymap);
//  mymap.fitBounds(polyline.getBounds());
}

/*
**  Map initialisation
*/

function init() {
  L.mapquest.key = key;
  mymap = L.mapquest.map('map', {
    center: [48.58, 7.76],
    layers: L.mapquest.tileLayer('map'),
    zoom: 10
  });
}

/*
**  Geolocalisation of the user
*/

function findMe() {
  mymap.locate({ setView: true });
  mymap.on("locationfound", function (e) {
    myposition = e.latlng;
  });
  console.log(myposition);
}

/*
**  place search via remote server from mapquestapi
*/

function geoposition(value){
  var dataSend = {
    "location": value,
    "options": {
      "thumbMaps": false
    },
  };
  $.post('http://www.mapquestapi.com/geocoding/v1/address?key=' + key, dataSend, function(data) {
    for (var result of data.results[0].locations) {
      console.log(result);
      marker(result);
    }
  });
}

/*
**  Place a marker at given coordinate
*/

function marker(data){
  var marker = L.marker(data.latLng, {autoPan: true}).addTo(mymap);
  marker.bindPopup('<p>'+data.adminArea5+'<br/>'+data.latLng.lat+', '+data.latLng.lng+'</p>').openPopup();
}

/*
**  Routing AJAX function
*/

function routing(start, end){
  var dataSend = {
    "locations": [
      start,
      end
    ],
    "options": {
      "locale": "fr_FR",
      "unit": "k",
    }
  };
  $.ajax({
    type: 'POST',
    url: 'http://www.mapquestapi.com/directions/v2/route?key=' + key,
    data: JSON.stringify(dataSend),
    contentType: "application/json",
    dataType: 'json'
  }).done(function(data) {
    shape(data.route.sessionId);
    flag(data.route.locations[0].latLng, data.route.locations[1].latLng);
    narrative(data.route.legs[0].maneuvers);
  });
}

/*
**  Trace the route on the map
*/

function shape(sessionId){
  var latlngs = [];
  var lng;
  var lat;
  var i=0;
  $.get('http://www.mapquestapi.com/directions/v2/routeshape?key='+key+'&sessionId='+sessionId+'&fullShape=true', function(data){
    for (point of data.route.shape.shapePoints) {
      if (i == 0){
        lat = point;
        i=1;
      }
      else {
        lng = point;
        latlngs.push([lat, lng]);
        i=0;
      }
    }
    var polyline = L.polyline(latlngs).addTo(mymap);
    mymap.fitBounds(polyline.getBounds());
  });
}

/*
**  Place the start and end marker of the route
*/

function flag(start, end){
  var marker = L.marker(start).addTo(mymap);
  marker.bindPopup('<p>Start</p>').openPopup();
  var marker = L.marker(end).addTo(mymap);
  marker.bindPopup('<p>End</p>').openPopup();
}

/*
**  routing with narrative method
*/

function narrative(maneuvers){
  console.log(maneuvers);
  for (maneuver of maneuvers) {
    console.log(maneuver);
    $(".narrative").append('<p>'+maneuver.narrative+'<p>');
  }
}
