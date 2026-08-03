(function () {
  function initAsakusaRouteMap() {
    var element = document.getElementById('jp26-asakusa-map');
    if (!element || typeof L === 'undefined' || element.dataset.ready === '1') return;

    element.dataset.ready = '1';

    var stops = [
      {name:'ONE@Tokyo', coords:[35.71020,139.81303], icon:'🏨', note:'Base del Crew en Oshiage.'},
      {name:'Kaminarimon', coords:[35.71110,139.79637], icon:'🏮', note:'Entrada icónica de Asakusa.'},
      {name:'Nakamise Shopping Street', coords:[35.71218,139.79664], icon:'🛍', note:'Snacks y souvenirs tradicionales.'},
      {name:'Sensō-ji', coords:[35.71477,139.79665], icon:'⛩', note:'Templo principal y pagoda.'},
      {name:'Sumida Park', coords:[35.71336,139.80360], icon:'📸', note:'Vista del río y Tokyo Skytree.'},
      {name:'Tokyo Skytree', coords:[35.71006,139.81070], icon:'🗼', note:'Solamachi y cierre de la ruta.'}
    ];

    var map = L.map('jp26-asakusa-map', {
      scrollWheelZoom: false,
      zoomControl: true
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var coordinates = [];

    stops.forEach(function (stop, index) {
      coordinates.push(stop.coords);

      L.marker(stop.coords)
        .addTo(map)
        .bindPopup(
          '<div class="jp26-map-popup">' +
          '<h4>' + (index + 1) + '. ' + stop.icon + ' ' + stop.name + '</h4>' +
          '<p>' + stop.note + '</p>' +
          '<a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' +
          encodeURIComponent(stop.name + ' Tokyo') + '">Abrir en Google Maps</a>' +
          '</div>'
        );
    });

    var route = L.polyline(coordinates, {
      color: '#ff3b4d',
      weight: 5,
      opacity: 0.9,
      dashArray: '10 8',
      lineJoin: 'round'
    }).addTo(map);

    map.fitBounds(route.getBounds(), {padding:[35,35]});

    function refreshMap() {
      window.setTimeout(function () {
        map.invalidateSize();
        map.fitBounds(route.getBounds(), {padding:[35,35]});
      }, 250);
    }

    window.addEventListener('hashchange', refreshMap);
    window.addEventListener('resize', refreshMap);
    window.setTimeout(refreshMap, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAsakusaRouteMap);
  } else {
    initAsakusaRouteMap();
  }
})();
