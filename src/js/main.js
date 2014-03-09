$( document ).ready( function() {

  $( 'body' ).click(function() {
    if ( $( '.item-info' ).hasClass( 'active' ) ){
      $( '.item-info' ).removeClass( 'active' );
    }
  });

  var map; // = undefined;

  var markerGreen = L.icon({
    iconUrl: 'img/marker-green-x2.png',
    iconSize: [ 10, 10 ]
  });

  var markerOrange = L.icon({
    iconUrl: 'img/marker-orange-x2.png',
    iconSize: [ 10, 10 ]
  });

  var markerRed = L.icon({
    iconUrl: 'img/marker-red-x2.png',
    iconSize: [ 10, 10 ]
  });

  loadJSONData("js/pretty.json");

  function loadJSONData( fileName ) {

    if (map !== undefined) {
      map.remove();
    }

    map = L.map('map', {
      zoomControl: false,
      minZoom: 5,
      attributionControl: false
    }).setView([54.5, -3], 6);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/m6-d6.hfccch9n/{z}/{x}/{y}.png', {}).addTo(map);

    $.getJSON( fileName, function( data ) {

      for(var i=0; i<data.length; i++)
      {
        //latlong = [data[i].latlong].pop();
        ll = data[i].latlong;
        
        if (ll != null) {
          latlong = ll.split(',');
          //console.log(latlong);
          name = data[i].name;
          score = data[i].score;
          url = data[i].url;

          if (score === 0)
          {
            thisMarker = markerGreen;
            color = 'green';
          } else if (score < 6)
          {
            thisMarker = markerOrange;
            color = 'orange';
          } else{
            thisMarker = markerRed;
            color = 'red';
          }
          L.marker(latlong, {riseOnHover:'true',title:name,icon: thisMarker, score:color, url:url}).on('click',wantInfo).addTo(map);

        }
      }

    });
  }

  function wantInfo(e) {
    dataSource = e.target.options;
    name = dataSource.title;
    url = dataSource.url;
    score = dataSource.score;

    $( '.item-info' ).removeClass( 'green orange red');

    $( '.item-info' ).addClass( score );
    $( '.item-info' ).find( '.url' ).children().html( url.slice(0,-5) );
    $( '.item-info' ).find( '.description' ).html(name);

    if (! $( '.item-info' ).hasClass( 'active' ) ){
      $( '.item-info' ).toggleClass( 'active' );
    }

  }

//  $( '.info-btn' ).click( function() {
//    loadJSONData("js/nhs.json");
//  });


  var Gauge = new Gauge({ renderTo: 'gauge' });
  // now handle initial gauge draw with onready event
  gauge.onready = function() {
      // and do update of gauge value each second with the random value
      setInterval( function() {
          gauge.setValue( Math.random() * 100);
      }, 1000);
  };
  // draw the gauge
  gauge.draw();

});

