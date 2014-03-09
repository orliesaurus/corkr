window.setGauge = function (score) {
  Gauge.Collection.get('gauge').setValue(parseInt(score));
}

$( document ).ready( function() {

  // show app info
  $( '.info-btn' ).click( function() {
    $( '.app-header' ).toggleClass( 'active' );
  });  

  $( 'body' ).click(function() {
    if ( $( '.item-info' ).hasClass( 'active' ) ){
      $( '.item-info' ).removeClass( 'active' );
      window.setGauge(0);
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

  // Rewire the map

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
        
        if (ll !== null) {
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
          L.marker(latlong, {riseOnHover:'true',title:name,icon: thisMarker, score:score, cData:color, url:url}).on('click',wantInfo).addTo(map);

        }

      }

    });
  }

  function wantInfo(e) {
    dataSource = e.target.options;
    name = dataSource.title;
    url = dataSource.url;
    score = dataSource.score;
    cData = dataSource.cData;

    $( '.item-info' ).removeClass( 'green orange red');

    $( '.item-info' ).addClass( cData );
    $( '.item-info' ).find( '.url' ).children().html( url.slice(0,-5) );
    $( '.item-info' ).find( '.description' ).html(name);

    window.setGauge(score);

    if (! $( '.item-info' ).hasClass( 'active' ) ){
      $( '.item-info' ).toggleClass( 'active' );
    }
    else  {
      $( '.item-info' ).removeClass( 'active' );

      $(".item-info").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
        $( '.item-info' ).addClass( 'active' );
      });
    }
  }

  // change button states
  $( '.domain-btns button' ).click(function(event) {
    $( '.domain-btns button' ).removeClass( 'active' );
    $( this ).addClass( 'active' );

    attrs = this.attributes[0].nodeValue.split(' ');

    if ( attrs[0] === 'nhs' ) {
      fileName = "js/nhs.json";
    } else {
      fileName = "js/pretty.json";
    }

    loadJSONData(fileName);

  });


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

