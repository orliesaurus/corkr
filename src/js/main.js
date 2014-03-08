$( document ).ready( function() {

  $( '.info-btn' ).click( function() {
    $( '.app-header' ).toggleClass( 'active' );
  });

  var map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    zoom: 7,
    minZoom: 5,
    maxZoom: 7
  }).setView([51.505, -0.09], 13);

  L.tileLayer('https://{s}.tiles.mapbox.com/v3/m6-d6.hfccch9n/{z}/{x}/{y}.png', {}).addTo(map);

});

