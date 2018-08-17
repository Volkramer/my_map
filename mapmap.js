var mymap;
var myposition;
L.mapquest.key = 'NeNAJsQv8JMJX1LGXiPKgRfC6iHyuGBT';

window.onload = function () {
  init();

  $("#locate").on("click", function () {
    findMe();
  });
}

function init() {
  mymap = L.mapquest.map('map', {
    center: [37.7749, -122.4194],
    layers: L.mapquest.tileLayer('map'),
    zoom: 12
  });
}

function findMe() {
  mymap.locate({ setView: true });
  mymap.on("locationfound", function (e) {
    myposition = e.latlng;
  });
  console.log(myposition);
}
