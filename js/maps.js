
(function () {
  'use strict';

  const JP26_MAPS = [
  {
    "elementId": "jp26-map-asakusa",
    "title": "Asakusa → Oshiage",
    "stops": [
      {
        "name": "ONE@Tokyo",
        "coords": [
          35.7102,
          139.81303
        ],
        "icon": "🏨",
        "note": "Base del Crew"
      },
      {
        "name": "Kaminarimon",
        "coords": [
          35.7111,
          139.79637
        ],
        "icon": "🏮",
        "note": "Entrada icónica"
      },
      {
        "name": "Nakamise",
        "coords": [
          35.71218,
          139.79664
        ],
        "icon": "🛍",
        "note": "Snacks y souvenirs"
      },
      {
        "name": "Sensō-ji",
        "coords": [
          35.71477,
          139.79665
        ],
        "icon": "⛩",
        "note": "Templo principal"
      },
      {
        "name": "Sumida Park",
        "coords": [
          35.71336,
          139.8036
        ],
        "icon": "📸",
        "note": "Vista del río"
      },
      {
        "name": "Tokyo Skytree",
        "coords": [
          35.71006,
          139.8107
        ],
        "icon": "🗼",
        "note": "Solamachi y cierre"
      }
    ]
  },
  {
    "elementId": "jp26-map-akihabara",
    "title": "Akihabara",
    "stops": [
      {
        "name": "Akihabara Station",
        "coords": [
          35.69836,
          139.77313
        ],
        "icon": "🚆",
        "note": "Inicio"
      },
      {
        "name": "Yodobashi Akiba",
        "coords": [
          35.69878,
          139.77433
        ],
        "icon": "🛍",
        "note": "Electrónica"
      },
      {
        "name": "Radio Kaikan",
        "coords": [
          35.69889,
          139.7716
        ],
        "icon": "🎮",
        "note": "Figuras y coleccionables"
      },
      {
        "name": "GiGO Akihabara",
        "coords": [
          35.69957,
          139.77107
        ],
        "icon": "🕹",
        "note": "Arcade"
      },
      {
        "name": "Mandarake Complex",
        "coords": [
          35.70215,
          139.77072
        ],
        "icon": "📦",
        "note": "Segunda mano"
      },
      {
        "name": "Kanda Myojin",
        "coords": [
          35.702,
          139.7679
        ],
        "icon": "⛩",
        "note": "Cierre tranquilo"
      }
    ]
  },
  {
    "elementId": "jp26-map-shibuya",
    "title": "Shibuya",
    "stops": [
      {
        "name": "Shibuya Station",
        "coords": [
          35.65803,
          139.70164
        ],
        "icon": "🚆",
        "note": "Inicio"
      },
      {
        "name": "Hachikō",
        "coords": [
          35.65906,
          139.70055
        ],
        "icon": "🐕",
        "note": "Punto de encuentro"
      },
      {
        "name": "Shibuya Crossing",
        "coords": [
          35.65949,
          139.70055
        ],
        "icon": "📸",
        "note": "Foto icónica"
      },
      {
        "name": "Shibuya PARCO",
        "coords": [
          35.66204,
          139.69877
        ],
        "icon": "🎮",
        "note": "Nintendo y Pokémon"
      },
      {
        "name": "Center-gai",
        "coords": [
          35.66047,
          139.69865
        ],
        "icon": "🌃",
        "note": "Comida y ambiente"
      },
      {
        "name": "Shibuya Sky",
        "coords": [
          35.65847,
          139.70216
        ],
        "icon": "🌇",
        "note": "Atardecer"
      }
    ]
  },
  {
    "elementId": "jp26-map-harajuku",
    "title": "Harajuku + Omotesando",
    "stops": [
      {
        "name": "Harajuku Station",
        "coords": [
          35.67023,
          139.7027
        ],
        "icon": "🚆",
        "note": "Inicio"
      },
      {
        "name": "Meiji Jingu",
        "coords": [
          35.6764,
          139.69933
        ],
        "icon": "⛩",
        "note": "Santuario"
      },
      {
        "name": "Takeshita Street",
        "coords": [
          35.67156,
          139.7046
        ],
        "icon": "🍭",
        "note": "Moda y snacks"
      },
      {
        "name": "Cat Street",
        "coords": [
          35.66563,
          139.70675
        ],
        "icon": "👟",
        "note": "Streetwear"
      },
      {
        "name": "Omotesando",
        "coords": [
          35.6652,
          139.7125
        ],
        "icon": "🏙",
        "note": "Arquitectura"
      },
      {
        "name": "Tokyu Plaza Omotesando",
        "coords": [
          35.66904,
          139.70691
        ],
        "icon": "📸",
        "note": "Foto final"
      }
    ]
  },
  {
    "elementId": "jp26-map-odaiba",
    "title": "Odaiba + Toyosu",
    "stops": [
      {
        "name": "teamLab Planets",
        "coords": [
          35.64912,
          139.78978
        ],
        "icon": "🌈",
        "note": "Experiencia inmersiva"
      },
      {
        "name": "Toyosu Market",
        "coords": [
          35.64557,
          139.78093
        ],
        "icon": "🍣",
        "note": "Mercado"
      },
      {
        "name": "Odaiba Seaside Park",
        "coords": [
          35.62978,
          139.77544
        ],
        "icon": "📸",
        "note": "Bahía"
      },
      {
        "name": "DiverCity Tokyo Plaza",
        "coords": [
          35.62514,
          139.77562
        ],
        "icon": "🛍",
        "note": "Shopping"
      },
      {
        "name": "Unicorn Gundam",
        "coords": [
          35.62518,
          139.77577
        ],
        "icon": "🤖",
        "note": "Foto"
      },
      {
        "name": "Rainbow Bridge View",
        "coords": [
          35.6292,
          139.7744
        ],
        "icon": "🌉",
        "note": "Noche"
      }
    ]
  },
  {
    "elementId": "jp26-map-ginza",
    "title": "Ginza + Marunouchi",
    "stops": [
      {
        "name": "Ginza Station",
        "coords": [
          35.67199,
          139.76397
        ],
        "icon": "🚆",
        "note": "Inicio"
      },
      {
        "name": "Ginza Six",
        "coords": [
          35.66974,
          139.76402
        ],
        "icon": "🛍",
        "note": "Flagships"
      },
      {
        "name": "Seiko House Ginza",
        "coords": [
          35.67198,
          139.76402
        ],
        "icon": "⌚",
        "note": "Relojes"
      },
      {
        "name": "MUJI Ginza",
        "coords": [
          35.67406,
          139.76601
        ],
        "icon": "🧺",
        "note": "Diseño japonés"
      },
      {
        "name": "Tokyo International Forum",
        "coords": [
          35.67695,
          139.76347
        ],
        "icon": "📸",
        "note": "Arquitectura"
      },
      {
        "name": "Tokyo Station",
        "coords": [
          35.68124,
          139.76712
        ],
        "icon": "🚉",
        "note": "Cierre"
      }
    ]
  },
  {
    "elementId": "jp26-map-mitaka",
    "title": "Mitaka + Kichijoji",
    "stops": [
      {
        "name": "Mitaka Station",
        "coords": [
          35.70269,
          139.5609
        ],
        "icon": "🚆",
        "note": "Inicio"
      },
      {
        "name": "Ghibli Museum",
        "coords": [
          35.69623,
          139.57043
        ],
        "icon": "🎬",
        "note": "Reserva principal"
      },
      {
        "name": "Inokashira Park",
        "coords": [
          35.7001,
          139.5742
        ],
        "icon": "🌳",
        "note": "Paseo"
      },
      {
        "name": "Inokashira Benzaiten",
        "coords": [
          35.69885,
          139.57594
        ],
        "icon": "⛩",
        "note": "Templo"
      },
      {
        "name": "Kichijoji Sunroad",
        "coords": [
          35.70422,
          139.57906
        ],
        "icon": "🛍",
        "note": "Shopping"
      },
      {
        "name": "Kichijoji Station",
        "coords": [
          35.70315,
          139.57979
        ],
        "icon": "🚆",
        "note": "Final"
      }
    ]
  },
  {
    "elementId": "jp26-map-namba",
    "title": "Namba + Dotonbori",
    "stops": [
      {
        "name": "APA Hotel Osaka Namba",
        "coords": [
          34.66688,
          135.4984
        ],
        "icon": "🏨",
        "note": "Base"
      },
      {
        "name": "Namba Yasaka Shrine",
        "coords": [
          34.66158,
          135.49664
        ],
        "icon": "⛩",
        "note": "Cabeza de león"
      },
      {
        "name": "Kuromon Market",
        "coords": [
          34.66541,
          135.50605
        ],
        "icon": "🍣",
        "note": "Comida"
      },
      {
        "name": "Dotonbori Glico Sign",
        "coords": [
          34.66872,
          135.50131
        ],
        "icon": "📸",
        "note": "Foto obligatoria"
      },
      {
        "name": "Hozenji Yokocho",
        "coords": [
          34.66759,
          135.50309
        ],
        "icon": "🏮",
        "note": "Callejón"
      },
      {
        "name": "Shinsaibashi",
        "coords": [
          34.67378,
          135.50104
        ],
        "icon": "🛍",
        "note": "Shopping"
      }
    ]
  },
  {
    "elementId": "jp26-map-umeda",
    "title": "Umeda",
    "stops": [
      {
        "name": "Osaka Station",
        "coords": [
          34.70249,
          135.49595
        ],
        "icon": "🚆",
        "note": "Inicio"
      },
      {
        "name": "Nintendo OSAKA",
        "coords": [
          34.70272,
          135.49539
        ],
        "icon": "🎮",
        "note": "Prioridad"
      },
      {
        "name": "Pokémon Center Osaka",
        "coords": [
          34.70273,
          135.49545
        ],
        "icon": "⚡",
        "note": "Shopping"
      },
      {
        "name": "Yodobashi Umeda",
        "coords": [
          34.70403,
          135.4963
        ],
        "icon": "📱",
        "note": "Electrónica"
      },
      {
        "name": "Grand Front Osaka",
        "coords": [
          34.70495,
          135.4941
        ],
        "icon": "🛍",
        "note": "Centro comercial"
      },
      {
        "name": "Umeda Sky Building",
        "coords": [
          34.70529,
          135.49025
        ],
        "icon": "🌇",
        "note": "Atardecer"
      }
    ]
  },
  {
    "elementId": "jp26-map-osaka-bay",
    "title": "Osaka Bay + Tempozan",
    "stops": [
      {
        "name": "Osakako Station",
        "coords": [
          34.65462,
          135.43452
        ],
        "icon": "🚆",
        "note": "Inicio"
      },
      {
        "name": "Kaiyukan",
        "coords": [
          34.65451,
          135.42896
        ],
        "icon": "🐠",
        "note": "Acuario"
      },
      {
        "name": "Tempozan Marketplace",
        "coords": [
          34.65518,
          135.43024
        ],
        "icon": "🍜",
        "note": "Comida"
      },
      {
        "name": "Tempozan Ferris Wheel",
        "coords": [
          34.65628,
          135.43089
        ],
        "icon": "🎡",
        "note": "Vista"
      },
      {
        "name": "Tempozan Park",
        "coords": [
          34.65757,
          135.43203
        ],
        "icon": "🌳",
        "note": "Paseo"
      },
      {
        "name": "Osaka Bay View",
        "coords": [
          34.6541,
          135.4269
        ],
        "icon": "📸",
        "note": "Cierre"
      }
    ]
  },
  {
    "elementId": "jp26-map-shinsekai",
    "title": "Shinsekai + Tennoji",
    "stops": [
      {
        "name": "Dobutsuen-mae Station",
        "coords": [
          34.64873,
          135.50476
        ],
        "icon": "🚆",
        "note": "Inicio"
      },
      {
        "name": "Jan-Jan Yokocho",
        "coords": [
          34.65014,
          135.50514
        ],
        "icon": "🍢",
        "note": "Comida"
      },
      {
        "name": "Tsutenkaku",
        "coords": [
          34.6525,
          135.50631
        ],
        "icon": "🗼",
        "note": "Icono"
      },
      {
        "name": "Shinsekai Market",
        "coords": [
          34.65287,
          135.5061
        ],
        "icon": "📸",
        "note": "Calles retro"
      },
      {
        "name": "Tennoji Park",
        "coords": [
          34.64743,
          135.51142
        ],
        "icon": "🌳",
        "note": "Pausa"
      },
      {
        "name": "Abeno Harukas",
        "coords": [
          34.64666,
          135.51343
        ],
        "icon": "🌇",
        "note": "Mirador"
      }
    ]
  },
  {
    "elementId": "jp26-map-osaka-castle",
    "title": "Castillo de Osaka",
    "stops": [
      {
        "name": "Morinomiya Station",
        "coords": [
          34.68188,
          135.53318
        ],
        "icon": "🚆",
        "note": "Inicio"
      },
      {
        "name": "Osaka Castle Park",
        "coords": [
          34.68435,
          135.5262
        ],
        "icon": "🌳",
        "note": "Jardines"
      },
      {
        "name": "Osaka Castle",
        "coords": [
          34.68731,
          135.52585
        ],
        "icon": "🏯",
        "note": "Castillo"
      },
      {
        "name": "Miraiza Osaka-jo",
        "coords": [
          34.68691,
          135.52515
        ],
        "icon": "☕",
        "note": "Descanso"
      },
      {
        "name": "Nishinomaru Garden",
        "coords": [
          34.68703,
          135.52093
        ],
        "icon": "📸",
        "note": "Fotografía"
      },
      {
        "name": "Osakajokoen Station",
        "coords": [
          34.68881,
          135.53469
        ],
        "icon": "🚆",
        "note": "Final"
      }
    ]
  },
  {
    "elementId": "jp26-map-fushimi-inari",
    "title": "Fushimi Inari",
    "stops": [
      {
        "name": "Inari Station",
        "coords": [
          34.96679,
          135.77075
        ],
        "icon": "🚆",
        "note": "Inicio"
      },
      {
        "name": "Romon Gate",
        "coords": [
          34.96706,
          135.77267
        ],
        "icon": "⛩",
        "note": "Entrada"
      },
      {
        "name": "Main Shrine",
        "coords": [
          34.96714,
          135.77285
        ],
        "icon": "🦊",
        "note": "Santuario"
      },
      {
        "name": "Senbon Torii",
        "coords": [
          34.96772,
          135.77377
        ],
        "icon": "📸",
        "note": "Torii"
      },
      {
        "name": "Mitsutsuji",
        "coords": [
          34.97131,
          135.77917
        ],
        "icon": "🥾",
        "note": "Sendero"
      },
      {
        "name": "Yotsutsuji Viewpoint",
        "coords": [
          34.97408,
          135.78034
        ],
        "icon": "🌄",
        "note": "Mirador"
      }
    ]
  },
  {
    "elementId": "jp26-map-higashiyama",
    "title": "Higashiyama + Kiyomizu-dera",
    "stops": [
      {
        "name": "Kiyomizu-dera",
        "coords": [
          34.99486,
          135.78505
        ],
        "icon": "🏯",
        "note": "Inicio temprano"
      },
      {
        "name": "Sannenzaka",
        "coords": [
          34.99757,
          135.78075
        ],
        "icon": "🏮",
        "note": "Calle histórica"
      },
      {
        "name": "Ninenzaka",
        "coords": [
          34.99878,
          135.7801
        ],
        "icon": "📸",
        "note": "Fotografía"
      },
      {
        "name": "Yasaka Pagoda",
        "coords": [
          34.99866,
          135.77925
        ],
        "icon": "🗼",
        "note": "Pagoda"
      },
      {
        "name": "Kodai-ji",
        "coords": [
          35.00078,
          135.78135
        ],
        "icon": "⛩",
        "note": "Templo"
      },
      {
        "name": "Yasaka Shrine",
        "coords": [
          35.00366,
          135.77857
        ],
        "icon": "🏮",
        "note": "Final"
      }
    ]
  },
  {
    "elementId": "jp26-map-gion",
    "title": "Gion + Pontocho",
    "stops": [
      {
        "name": "Yasaka Shrine",
        "coords": [
          35.00366,
          135.77857
        ],
        "icon": "⛩",
        "note": "Inicio"
      },
      {
        "name": "Hanamikoji Street",
        "coords": [
          35.00222,
          135.7752
        ],
        "icon": "🏮",
        "note": "Gion"
      },
      {
        "name": "Shirakawa Lane",
        "coords": [
          35.00547,
          135.7756
        ],
        "icon": "📸",
        "note": "Canal"
      },
      {
        "name": "Gion-Shijo Station",
        "coords": [
          35.00374,
          135.77282
        ],
        "icon": "🚆",
        "note": "Conexión"
      },
      {
        "name": "Pontocho Alley",
        "coords": [
          35.00517,
          135.7702
        ],
        "icon": "🍜",
        "note": "Cena"
      },
      {
        "name": "Kamo River",
        "coords": [
          35.00456,
          135.76935
        ],
        "icon": "🌙",
        "note": "Cierre"
      }
    ]
  },
  {
    "elementId": "jp26-map-arashiyama",
    "title": "Arashiyama",
    "stops": [
      {
        "name": "Saga-Arashiyama Station",
        "coords": [
          35.01865,
          135.68104
        ],
        "icon": "🚆",
        "note": "Inicio"
      },
      {
        "name": "Bamboo Grove",
        "coords": [
          35.01705,
          135.67123
        ],
        "icon": "🎋",
        "note": "Temprano"
      },
      {
        "name": "Tenryu-ji",
        "coords": [
          35.01573,
          135.67363
        ],
        "icon": "🏯",
        "note": "Templo"
      },
      {
        "name": "Togetsukyo Bridge",
        "coords": [
          35.01362,
          135.67775
        ],
        "icon": "🌉",
        "note": "Río"
      },
      {
        "name": "Arashiyama Park",
        "coords": [
          35.0119,
          135.6743
        ],
        "icon": "🌳",
        "note": "Paseo"
      },
      {
        "name": "Monkey Park Entrance",
        "coords": [
          35.01243,
          135.67624
        ],
        "icon": "🐒",
        "note": "Opcional"
      }
    ]
  },
  {
    "elementId": "jp26-map-nishiki",
    "title": "Nishiki Market + Centro",
    "stops": [
      {
        "name": "Nishiki Market West",
        "coords": [
          35.00502,
          135.76482
        ],
        "icon": "🍡",
        "note": "Inicio"
      },
      {
        "name": "Nishiki Tenmangu",
        "coords": [
          35.00491,
          135.76782
        ],
        "icon": "⛩",
        "note": "Santuario"
      },
      {
        "name": "Teramachi Street",
        "coords": [
          35.006,
          135.7675
        ],
        "icon": "🛍",
        "note": "Shopping"
      },
      {
        "name": "Shinkyogoku",
        "coords": [
          35.0061,
          135.7684
        ],
        "icon": "🛍",
        "note": "Arcade"
      },
      {
        "name": "Kyoto BAL",
        "coords": [
          35.00822,
          135.76989
        ],
        "icon": "🏬",
        "note": "Diseño"
      },
      {
        "name": "Kamo River Sanjo",
        "coords": [
          35.0092,
          135.7719
        ],
        "icon": "🌙",
        "note": "Cierre"
      }
    ]
  }
];

  function createMap(config) {
    const element = document.getElementById(config.elementId);
    if (!element || typeof L === 'undefined' || element.dataset.ready === '1') return null;

    element.dataset.ready = '1';

    const map = L.map(config.elementId, {
      scrollWheelZoom: false,
      zoomControl: true
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const coordinates = [];

    config.stops.forEach(function (stop, index) {
      coordinates.push(stop.coords);
      const query = encodeURIComponent(stop.name + ' Japan');

      L.marker(stop.coords)
        .addTo(map)
        .bindPopup(
          '<div class="jp26-map-popup">' +
          '<h4>' + (index + 1) + '. ' + stop.icon + ' ' + stop.name + '</h4>' +
          '<p>' + stop.note + '</p>' +
          '<a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' +
          query + '">Abrir en Google Maps</a>' +
          '</div>'
        );
    });

    const route = L.polyline(coordinates, {
      color: '#ff3b4d',
      weight: 5,
      opacity: 0.9,
      dashArray: '10 8',
      lineJoin: 'round'
    }).addTo(map);

    function fit() {
      window.setTimeout(function () {
        map.invalidateSize();
        map.fitBounds(route.getBounds(), {padding:[35,35]});
      }, 180);
    }

    fit();
    return {map, fit};
  }

  function initializeMaps() {
    const initialized = JP26_MAPS.map(createMap).filter(Boolean);

    function refreshVisibleMaps() {
      initialized.forEach(function (entry) { entry.fit(); });
    }

    window.addEventListener('hashchange', refreshVisibleMaps);
    window.addEventListener('resize', refreshVisibleMaps);
    window.setTimeout(refreshVisibleMaps, 700);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMaps);
  } else {
    initializeMaps();
  }
})();
