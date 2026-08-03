(function () {
  'use strict';

  const root = document.getElementById('cityApp');
  const cityKey = document.body.dataset.city;
  const placeKey = document.body.dataset.place;
  const base = '../../';

  function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[character]));
  }

  function mapsUrl(name) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' Japan');
  }

  function appleUrl(name) {
    return 'https://maps.apple.com/?q=' + encodeURIComponent(name + ' Japan');
  }

  function shellHeader(city, current) {
    return `<header class="city-appbar"><a class="city-brand" href="${base}index.html#inicio"><i></i><span><b>JP26</b><small>Japan Adventure OS</small></span></a><nav><a href="${base}index.html#itinerario">Itinerary</a><a href="${base}index.html#information-weather">Information</a></nav></header>
      <nav class="city-breadcrumbs" aria-label="Breadcrumb"><a href="${base}index.html#inicio">Home</a><i>›</i><a href="index.html">${escapeHTML(city.name)}</a>${current ? `<i>›</i><span>${escapeHTML(current)}</span>` : ''}</nav>`;
  }

  function sectionHeader(kicker, title, description) {
    return `<header class="city-section-head"><small>${escapeHTML(kicker)}</small><h2>${escapeHTML(title)}</h2>${description ? `<p>${escapeHTML(description)}</p>` : ''}</header>`;
  }

  function overview(city) {
    document.title = `JP26 · ${city.name} Overview`;
    root.innerHTML = shellHeader(city) + `
      <main class="city-overview">
        <section class="city-overview-hero"><div><span>${escapeHTML(city.eyebrow)}</span><h1>${escapeHTML(city.name)}<br><em>Overview</em></h1><p>${escapeHTML(city.description)}</p></div></section>
        <section class="city-overview-content">${sectionHeader('EXPLORE BY AREA','Choose your next place','Cada guía conserva el mismo sistema visual y una ruta clara.')}
          <div class="city-place-grid">${city.places.map(place => `<article class="city-place-card" style="--place-image:url('${place.image}')"><div class="city-place-image"><span>${place.icon}</span></div><div class="city-place-content"><small>${escapeHTML(place.time)}</small><h2>${escapeHTML(place.name)}</h2><p>${escapeHTML(place.description)}</p><a href="${place.id}.html">Explore <span>→</span></a></div></article>`).join('')}</div>
        </section>
      </main>${footer()}`;
  }

  function mapCard(place, detail) {
    const map = detail.mapId ? `<div class="city-leaflet-map" id="${detail.mapId}"></div>` : `<div class="city-map-placeholder"><span>🗺</span><b>Map structure ready</b><small>Route map will use the existing activity guide.</small></div>`;
    return `<article class="city-map-card">${map}<aside><small>MAP & ROUTE</small><h3>${escapeHTML(place.name)}</h3><p>Hotel, stations, food and route access in one place.</p><div class="city-map-actions"><a target="_blank" rel="noopener" href="${mapsUrl(place.name)}">Google Maps</a><a target="_blank" rel="noopener" href="${appleUrl(place.name)}">Apple Maps</a><span aria-disabled="true">NAVITIME · Ready</span></div></aside></article>`;
  }

  function photoCard(place, detail) {
    const photo = detail.photo;
    return `<article class="city-photo-card"><div class="city-reference-image" style="--reference-image:url('${place.image}')"><span>REFERENCE PLACEHOLDER</span></div><div><small>PHOTO SPOT</small><h3>${escapeHTML(photo[0])}</h3><dl><div><dt>How to recreate</dt><dd>${escapeHTML(photo[1])}</dd></div><div><dt>Best time</dt><dd>${escapeHTML(photo[2])}</dd></div><div><dt>Tip</dt><dd>${escapeHTML(detail.tips[0])}</dd></div></dl><a target="_blank" rel="noopener" href="${mapsUrl(photo[0])}">Google Maps →</a></div></article>`;
  }

  function foodCard(detail) {
    const food = detail.food;
    return `<article class="city-food-card"><div class="city-food-image"><span>🍜</span><small>FOOD IMAGE PLACEHOLDER</small></div><div><small>${escapeHTML(food[1])}</small><h3>${escapeHTML(food[0])}</h3><div class="city-food-meta"><span>${escapeHTML(food[2])}</span><span>${escapeHTML(food[3])}</span><span>★ ${escapeHTML(food[4])}</span></div><a target="_blank" rel="noopener" href="${mapsUrl(food[0])}">Google Maps →</a></div></article>`;
  }

  function quickActions(place) {
    const actions = [['📍','Open Route','#map'],['🍜','Best Food','#food'],['📸','Photo Spot','#photos'],['🚆','Transportation','#map'],['🗣','Useful Japanese','#japanese'],['💴','Budget','#budget']];
    return `<div class="city-quick-actions">${actions.map(action => `<a href="${action[2]}"><span>${action[0]}</span><b>${action[1]}</b></a>`).join('')}</div>`;
  }

  function detailPage(city, place, detail) {
    document.title = `JP26 · ${place.name}`;
    root.innerHTML = shellHeader(city, place.name) + `<main class="city-detail">
      <section class="city-detail-hero" style="--hero-image:url('${place.image}')"><div><span>${place.icon} ${escapeHTML(city.name)}</span><h1>${escapeHTML(place.name)}</h1><p>${escapeHTML(place.description)}</p><small>${escapeHTML(place.time)} recommended</small></div></section>
      <div class="city-detail-content">
        <section id="map">${sectionHeader('MAP & ROUTE','Navigate the area','An integrated route using the maps already available in JP26.')}${mapCard(place,detail)}</section>
        <section id="photos">${sectionHeader('PHOTO SPOTS','Recreate the moment','Reference imagery is clearly marked for replacement in a later sprint.')}${photoCard(place,detail)}</section>
        <section id="food">${sectionHeader('FOOD RECOMMENDATIONS','Eat nearby','Existing recommendations transformed into practical cards.')}<div class="city-food-grid">${foodCard(detail)}</div></section>
        <section id="budget">${sectionHeader('BUDGET','Plan the spend')}<article class="city-info-card city-budget-card"><span>💴</span><div><small>AREA ESTIMATE</small><strong>${escapeHTML(detail.budget)}</strong><p>Food, local transport and activities already considered by the existing guide.</p></div></article></section>
        <section id="japanese">${sectionHeader('USEFUL JAPANESE','Speak with confidence')}<div class="city-language-grid">${detail.japanese.map(item => {const parts=item.split(' — ');return `<article class="city-info-card"><span>🗣</span><div><strong>${escapeHTML(parts[0])}</strong><p>${escapeHTML(parts[1] || '')}</p></div></article>`;}).join('')}</div></section>
        <section id="tips">${sectionHeader('TIPS','Move smarter')}<div class="city-tip-grid">${detail.tips.map(tip => `<article class="city-info-card"><span>✓</span><div><p>${escapeHTML(tip)}</p></div></article>`).join('')}</div></section>
        <section id="quick-actions">${sectionHeader('QUICK ACTIONS','Everything one tap away')}${quickActions(place)}</section>
      </div></main>${footer()}`;
    if (detail.mapId) {
      const mapsScript = document.createElement('script');
      mapsScript.src = base + 'js/maps.js';
      document.body.appendChild(mapsScript);
    }
  }

  function footer() { return '<footer class="city-footer">JP26 v4.6 · Travel Companion · October 2026</footer>'; }

  async function init() {
    try {
      const response = await fetch(base + 'data/cities.json', {cache:'no-store'});
      if (!response.ok) throw new Error('City data unavailable');
      const data = await response.json();
      const city = data[cityKey];
      if (!city) throw new Error('Unknown city');
      if (!placeKey) return overview(city);
      const place = city.places.find(item => item.id === placeKey);
      const detail = data.details[placeKey];
      if (!place || !detail) throw new Error('Unknown place');
      detailPage(city, place, detail);
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), 400);
    } catch (error) {
      root.innerHTML = `<main class="city-error"><h1>City guide unavailable</h1><p>Open JP26 through GitHub Pages or a local server.</p><a href="${base}index.html#inicio">Back to JP26</a></main>`;
    }
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
