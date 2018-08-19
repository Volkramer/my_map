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
  console.log(dataSend);
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

function routing(start, end){
  console.log(start);
  console.log(end);
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
  console.log(dataSend);
  $.ajax({
    type: 'POST',
    url: 'http://www.mapquestapi.com/directions/v2/route?key=' + key,
    data: JSON.stringify( dataSend ),
    contentType: "application/json",
    dataType: 'json'
  }).done(function(data) {
    console.log(data);
  });
}
