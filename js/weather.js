
(function () {
  'use strict';

  const FALLBACK_LOCATIONS = {
    tokyo:{name:'Tokio',latitude:35.6762,longitude:139.6503,timezone:'Asia/Tokyo',locale:'ja-JP'},
    osaka:{name:'Osaka',latitude:34.6937,longitude:135.5023,timezone:'Asia/Tokyo',locale:'ja-JP'},
    kyoto:{name:'Kioto',latitude:35.0116,longitude:135.7681,timezone:'Asia/Tokyo',locale:'ja-JP'},
    slc:{name:'Salt Lake City',latitude:40.7608,longitude:-111.8910,timezone:'America/Denver',locale:'en-US'}
  };

  const weatherDescriptions = {
    0:['☀️','Despejado'],
    1:['🌤️','Mayormente despejado'],
    2:['⛅','Parcialmente nublado'],
    3:['☁️','Nublado'],
    45:['🌫️','Niebla'],
    48:['🌫️','Niebla con escarcha'],
    51:['🌦️','Llovizna ligera'],
    53:['🌦️','Llovizna'],
    55:['🌧️','Llovizna intensa'],
    56:['🌧️','Llovizna helada'],
    57:['🌧️','Llovizna helada intensa'],
    61:['🌦️','Lluvia ligera'],
    63:['🌧️','Lluvia'],
    65:['🌧️','Lluvia intensa'],
    66:['🌧️','Lluvia helada'],
    67:['🌧️','Lluvia helada intensa'],
    71:['🌨️','Nieve ligera'],
    73:['🌨️','Nieve'],
    75:['❄️','Nieve intensa'],
    77:['❄️','Granos de nieve'],
    80:['🌦️','Chubascos ligeros'],
    81:['🌧️','Chubascos'],
    82:['⛈️','Chubascos intensos'],
    85:['🌨️','Chubascos de nieve'],
    86:['❄️','Nieve intensa'],
    95:['⛈️','Tormenta'],
    96:['⛈️','Tormenta con granizo'],
    99:['⛈️','Tormenta fuerte con granizo']
  };

  let locations = FALLBACK_LOCATIONS;
  let selectedLocation = 'tokyo';
  const weatherCache = new Map();

  function node(id) {
    return document.getElementById(id);
  }

  async function loadLocations() {
    try {
      const response = await fetch('data/locations.json', {cache:'no-store'});
      if (!response.ok) throw new Error('locations');
      locations = await response.json();
    } catch (error) {
      locations = FALLBACK_LOCATIONS;
    }
  }

  function formatTime(timezone, includeSeconds) {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: includeSeconds ? '2-digit' : undefined,
      hour12: true
    }).format(new Date());
  }

  function formatDate(timezone) {
    return new Intl.DateTimeFormat('es-MX', {
      timeZone: timezone,
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(new Date());
  }

  function updateClocks() {
    const tokyo = formatTime('Asia/Tokyo', false);
    const slc = formatTime('America/Denver', false);

    if (node('jp26-time-tokyo')) node('jp26-time-tokyo').textContent = tokyo;
    if (node('jp26-time-slc')) node('jp26-time-slc').textContent = slc;

    const location = locations[selectedLocation] || locations.tokyo;
    if (node('jp26-weather-local-time')) {
      node('jp26-weather-local-time').textContent = formatTime(location.timezone, true);
    }
    if (node('jp26-weather-local-date')) {
      node('jp26-weather-local-date').textContent = formatDate(location.timezone);
    }

    const tokyoSummary = weatherCache.get('tokyo');
    const slcSummary = weatherCache.get('slc');
    if (node('jp26-weather-summary-tokyo')) {
      node('jp26-weather-summary-tokyo').textContent =
        (tokyoSummary ? Math.round(tokyoSummary.temperature_2m) + '° · ' : '') + tokyo;
    }
    if (node('jp26-weather-summary-slc')) {
      node('jp26-weather-summary-slc').textContent =
        (slcSummary ? Math.round(slcSummary.temperature_2m) + '° · ' : '') + slc;
    }

    updateTimeDifference();
  }

  function getOffsetMinutes(timezone) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year:'numeric',month:'2-digit',day:'2-digit',
      hour:'2-digit',minute:'2-digit',second:'2-digit',
      hourCycle:'h23'
    }).formatToParts(new Date());

    const values = {};
    parts.forEach(part => {
      if (part.type !== 'literal') values[part.type] = part.value;
    });

    const asUTC = Date.UTC(
      Number(values.year), Number(values.month) - 1, Number(values.day),
      Number(values.hour), Number(values.minute), Number(values.second)
    );
    return Math.round((asUTC - Date.now()) / 60000);
  }

  function updateTimeDifference() {
    const difference = Math.round(
      (getOffsetMinutes('Asia/Tokyo') - getOffsetMinutes('America/Denver')) / 60
    );
    if (node('jp26-time-difference')) {
      node('jp26-time-difference').textContent =
        'Tokio +' + difference + ' h';
    }
  }

  function apiUrl(location) {
    const params = new URLSearchParams({
      latitude: location.latitude,
      longitude: location.longitude,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'is_day'
      ].join(','),
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      precipitation_unit: 'mm',
      timezone: location.timezone
    });

    return 'https://api.open-meteo.com/v1/forecast?' + params.toString();
  }

  async function fetchWeather(key, force) {
    if (!force && weatherCache.has(key)) return weatherCache.get(key);

    const location = locations[key];
    const response = await fetch(apiUrl(location), {cache:'no-store'});
    if (!response.ok) throw new Error('weather ' + key);

    const data = await response.json();
    const current = data.current;
    weatherCache.set(key, current);
    localStorage.setItem('jp26:weather:' + key, JSON.stringify({
      current: current,
      savedAt: Date.now()
    }));
    return current;
  }

  function loadStoredWeather(key) {
    try {
      const stored = JSON.parse(localStorage.getItem('jp26:weather:' + key));
      if (stored && stored.current) {
        weatherCache.set(key, stored.current);
        return stored.current;
      }
    } catch (error) {}
    return null;
  }

  function weatherInfo(code, isDay) {
    const info = weatherDescriptions[code] || ['🌡️','Condiciones variables'];
    if (code === 0 && !isDay) return ['🌙','Despejado'];
    if (code === 1 && !isDay) return ['🌙','Mayormente despejado'];
    return info;
  }

  function adviceFor(current) {
    const code = Number(current.weather_code);
    const temperature = Number(current.temperature_2m);
    const wind = Number(current.wind_speed_10m);
    const rain = Number(current.precipitation);

    if ([95,96,99].includes(code)) {
      return ['⛈️','Plan bajo techo','Evita miradores abiertos y revisa alertas antes de moverte.'];
    }
    if (rain > 0 || (code >= 51 && code <= 82)) {
      return ['🌂','Lleva paraguas','Prioriza teamLab, Akihabara, Kaiyukan, Umeda o zonas comerciales cubiertas.'];
    }
    if (wind >= 30) {
      return ['💨','Día con viento','Lleva una capa ligera y revisa el estado de miradores como Shibuya Sky.'];
    }
    if (temperature >= 28) {
      return ['💧','Día caluroso','Agua, bloqueador y descansos frecuentes. Evita caminar demasiado al mediodía.'];
    }
    if (temperature <= 10) {
      return ['🧥','Lleva chamarra','Las noches y los miradores pueden sentirse más fríos de lo que marca la temperatura.'];
    }
    return ['📸','Buen día para explorar','Condiciones cómodas para caminar, tomar fotografías y mantener el itinerario.'];
  }

  function renderWeather(key, current) {
    selectedLocation = key;
    const location = locations[key];
    const info = weatherInfo(Number(current.weather_code), Number(current.is_day) === 1);
    const advice = adviceFor(current);

    node('jp26-weather-city').textContent = location.name;
    node('jp26-weather-icon').textContent = info[0];
    node('jp26-weather-temp').textContent = Math.round(current.temperature_2m) + '°';
    node('jp26-weather-description').textContent = info[1];
    node('jp26-weather-apparent').textContent = Math.round(current.apparent_temperature) + '°';
    node('jp26-weather-rain').textContent = Number(current.precipitation).toFixed(1) + ' mm';
    node('jp26-weather-humidity').textContent = Math.round(current.relative_humidity_2m) + '%';
    node('jp26-weather-wind').textContent = Math.round(current.wind_speed_10m) + ' km/h';
    node('jp26-weather-advice-icon').textContent = advice[0];
    node('jp26-weather-advice-title').textContent = advice[1];
    node('jp26-weather-advice-text').textContent = advice[2];
    node('jp26-weather-updated').textContent = formatTime(location.timezone, false);
    node('jp26-weather-notice').hidden = true;

    updateClocks();
  }

  function setLoading(active) {
    const board = document.querySelector('.jp26-weather-board');
    if (board) board.classList.toggle('jp26-weather-loading', active);
  }

  async function selectLocation(key, force) {
    selectedLocation = key;
    document.querySelectorAll('[data-weather-location]').forEach(button => {
      button.classList.toggle('active', button.dataset.weatherLocation === key);
    });

    setLoading(true);
    try {
      const current = await fetchWeather(key, force);
      renderWeather(key, current);
    } catch (error) {
      const stored = loadStoredWeather(key);
      if (stored) renderWeather(key, stored);
      node('jp26-weather-notice').hidden = false;
    } finally {
      setLoading(false);
    }
  }

  async function preloadSummaries() {
    for (const key of ['tokyo','slc']) {
      try {
        await fetchWeather(key, false);
      } catch (error) {
        loadStoredWeather(key);
      }
    }
    updateClocks();
  }

  function updateNetworkState() {
    const state = node('jp26-network-state');
    if (!state) return;
    const online = navigator.onLine;
    state.textContent = online ? '● Online' : '● Offline';
    state.style.color = online ? 'var(--green)' : 'var(--gold)';
  }

  async function initialize() {
    await loadLocations();

    document.querySelectorAll('[data-weather-location]').forEach(button => {
      button.addEventListener('click', function () {
        selectLocation(button.dataset.weatherLocation, false);
      });
    });

    updateNetworkState();
    updateClocks();
    await Promise.all([preloadSummaries(), selectLocation('tokyo', false)]);

    window.setInterval(updateClocks, 1000);
    window.setInterval(function () {
      selectLocation(selectedLocation, true);
      preloadSummaries();
    }, 15 * 60 * 1000);

    window.addEventListener('online', function () {
      updateNetworkState();
      selectLocation(selectedLocation, true);
    });
    window.addEventListener('offline', updateNetworkState);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
