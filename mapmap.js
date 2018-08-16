var mymap;
var myposition;

window.onload = function () {
    init();

    $("#locate").on("click", function () {
        findMe();
    });
}

function init() {
    mymap = L.map('mapmap');
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png').addTo(mymap);
    mymap.locate({ setView: true, zoom: 10 });
}


function findMe() {
    mymap.locate({ setView: false });
    mymap.on("locationfound", function (e) {
        myposition = e.latlng;
    });
    console.log(myposition);
    mymap.panTo(myposition);
}