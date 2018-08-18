var mymap;
var myposition;
var key = 'NeNAJsQv8JMJX1LGXiPKgRfC6iHyuGBT';


window.onload = function () {
  init();

  $("#locate").on("click", function() {
    findMe();
  });

  $("#geoposition").on("change", function(){
    var value = $("#geoposition").val();
    console.log(value);
    geoposition(value);
  });
}

function init() {
  L.mapquest.key = key;
  mymap = L.mapquest.map('map', {
    center: [48.58, 7.76],
    layers: L.mapquest.tileLayer('map'),
    zoom: 10
  });
}

function findMe() {
  mymap.locate({ setView: true });
  mymap.on("locationfound", function (e) {
    myposition = e.latlng;
  });
  console.log(myposition);
}

function geoposition(value){
  value = value.replace(/ /g, "+");
  var dataSend = {
    "location": value,
    "option": [{
      "thumbMaps": false
    }],
  };

  $.post('http://www.mapquestapi.com/geocoding/v1/address?key=' + key, dataSend, function(data) {
    for (var result of data.results[0].locations) {
      console.log(result);
      marker(result);
    }
  });
}

function marker(data){
  var marker = L.marker(data.latLng, {autoPan: true}).addTo(mymap);
  marker.bindPopup('<p>'+data.adminArea5+'<br/>'+data.latLng.lat+', '+data.latLng.lng+'</p>').openPopup();
}
