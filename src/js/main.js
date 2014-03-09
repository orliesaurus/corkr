$( document ).ready( function() {

  $( '.info-btn' ).click( function() {
    $( '.app-header' ).toggleClass( 'active' );
  });  

  // just so I can trigger bottom panel
  $( '.header-logo' ).click( function() {
    $( '.item-info' ).toggleClass( 'active' );
  });

  var map = L.map('map', {
    zoomControl: false,
    minZoom: 5,
    attributionControl: false
  }).setView([51.505, -0.09], 5);

  L.tileLayer('https://{s}.tiles.mapbox.com/v3/m6-d6.hfccch9n/{z}/{x}/{y}.png', {}).addTo(map);

  var markerGreen = L.divIcon({
    className: 'marker-green', 
    iconSize: '60px'
  });

  var markerOrange = L.divIcon({
    className: 'marker-orange', 
    iconSize: '60px'
  });

  var markerRed = L.divIcon({
    className: 'marker-red',
    iconSize: '60px'
  });
  // you can set .my-div-icon styles in CSS

  L.marker([52, -1], {icon: markerGreen}).addTo(map);

  L.marker([53, -1], {icon: markerOrange}).addTo(map);

  L.marker([54, -1], {icon: markerRed}).addTo(map);
  $.getJSON( "js/pretty.json", function( data ) {

    for(var i=0; i<data.length; i++)
    {
      //latlong = [data[i].latlong].pop();
      ll = data[i].latlong;
      latlong = ll.split(',');
      console.log(latlong);
      name = data[i].name;
      score = data[i].score;
      url = data[i].url;
      if (score <= 0)
      {
        thisMarker = markerGreen;
      } else if (score < 6)
      {
        thisMarker = markerOrange;
      } else{
        thisMarker = markerRed;
      }
      L.marker(latlong, {riseOnHover:'true',title:name,icon: thisMarker, score:score, url:url}).on('click',wantInfo).addTo(map);

    }
  });

  function wantInfo(e) {
    dataSource = e.target.options
    name = dataSource.title;
    url = dataSource.url;
    score = dataSource.score;

    alert(name + " (" + url + ") => " + score);
  }
});

