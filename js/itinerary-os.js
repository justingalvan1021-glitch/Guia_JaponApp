
(function () {
  'use strict';

  let days = [];
  let selectedIndex = 0;

  function el(id) { return document.getElementById(id); }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
    }[char]));
  }

  function yen(value) {
    return new Intl.NumberFormat('ja-JP', {
      style:'currency',currency:'JPY',maximumFractionDigits:0
    }).format(value);
  }

  function usdLabel(value) {
    if (!window.JP26Currency) return '';
    return `<span class="jp26-usd">≈ ${window.JP26Currency.convertYen(value)} USD\n≈ ${window.JP26Currency.convertYenToMxn(value)}</span>`;
  }

  function timeLabel(value) {
    return window.JP26FormatTime ? window.JP26FormatTime(value) : value;
  }

  function dateHeading(day) {
    const parts = day.date.split(' ');
    const months = {OCT:'October'};
    const weekdays = {Lunes:'Monday',Martes:'Tuesday',Miércoles:'Wednesday',Jueves:'Thursday',Viernes:'Friday',Sábado:'Saturday',Domingo:'Sunday'};
    return {date:(months[parts[1]] || parts[1]) + ' ' + Number(parts[0]),weekday:weekdays[day.weekday] || day.weekday};
  }

  function renderDateStrip() {
    el('ios-date-strip').innerHTML = days.map((day,index) => `
      <button class="ios-date-btn ${index === selectedIndex ? 'active' : ''}"
        type="button" data-day-index="${index}">
        <small>DAY ${String(day.day).padStart(2,'0')}</small>
        <b>${escapeHTML(day.date.split(' ')[0])}</b>
        <span>${escapeHTML(day.city)}</span>
      </button>
    `).join('');

    document.querySelectorAll('[data-day-index]').forEach(button => {
      button.addEventListener('click', () => {
        selectedIndex = Number(button.dataset.dayIndex);
        renderAll();
        document.querySelector('.ios-day-view').scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
  }

  function scheduleHTML(schedule) {
    return schedule.map(item => `
      <div class="ios-schedule-row">
        <time>${escapeHTML(timeLabel(item[0]))}</time>
        <span>${escapeHTML(item[2])}</span>
        <b>${escapeHTML(item[1])}</b>
      </div>
    `).join('');
  }

  function chips(items) {
    return `<div class="ios-chip-list">${items.map(item => `<span>${escapeHTML(item)}</span>`).join('')}</div>`;
  }

  function transport(items) {
    return `<div class="ios-transport">${items.map((item,index) =>
      `${index ? '<i>→</i>' : ''}<span>${escapeHTML(item)}</span>`
    ).join('')}</div>`;
  }

  function renderDay() {
    const day = days[selectedIndex];
    const completedKey = 'jp26:itinerary-complete:' + day.id;
    const completed = localStorage.getItem(completedKey) === '1';
    const heading = dateHeading(day);

    el('ios-day-view').innerHTML = `
      <article class="ios-day-hero" style="--day-image:url('${day.image}')">
        <div class="ios-day-hero-content">
          <div class="ios-date-heading"><h2>${escapeHTML(heading.date)}</h2><strong>${escapeHTML(heading.weekday)}</strong></div>
          <span class="ios-day-label">Day ${day.day} · ${escapeHTML(day.status)}</span>
          <h3 class="ios-day-title">${escapeHTML(day.title)}</h3>
          <p>${escapeHTML(day.subtitle)}</p>
          <div class="ios-day-actions">
            <a class="btn" href="${day.href}">Abrir guía relacionada</a>
            <button class="btn secondary" type="button" id="ios-next-day">Siguiente día →</button>
          </div>
        </div>
      </article>

      <div class="ios-status-grid">
        <article class="ios-status-card"><small>Horario</small><b>${escapeHTML(timeLabel(day.start))}–${escapeHTML(timeLabel(day.end))}</b></article>
        <article class="ios-status-card"><small>Distancia</small><b>${escapeHTML(day.distance)}</b></article>
        <article class="ios-status-card"><small>Pasos</small><b>${escapeHTML(day.steps)}</b></article>
        <article class="ios-status-card ios-budget-yen" data-yen="${day.budgetYen}"><small>Presupuesto</small><b>${yen(day.budgetYen)}${usdLabel(day.budgetYen)}</b></article>
        <article class="ios-status-card"><small>Clima</small><b>${escapeHTML(day.weatherCity.toUpperCase())}</b></article>
      </div>

      <div class="ios-content-grid">
        <article class="ios-panel">
          <h3>🕒 Timeline del día</h3>
          <div class="ios-schedule">${scheduleHTML(day.schedule)}</div>
        </article>

        <div class="grid">
          <article class="ios-panel">
            <h3>🎯 Prioridades</h3>
            ${chips(day.priorities)}
          </article>
          <article class="ios-panel">
            <h3>🚆 Transporte</h3>
            ${transport(day.transport)}
          </article>
          <article class="ios-panel">
            <h3>🍜 Comida</h3>
            ${chips(day.food)}
          </article>
          <article class="ios-panel">
            <h3>💬 Crew Note</h3>
            <div class="ios-note">${escapeHTML(day.notes)}</div>
            <label class="ios-progress-toggle">
              <input id="ios-day-complete" type="checkbox" ${completed ? 'checked' : ''}>
              Día completado
            </label>
          </article>
        </div>
      </div>
    `;

    el('ios-next-day').addEventListener('click', () => {
      selectedIndex = (selectedIndex + 1) % days.length;
      renderAll();
      document.querySelector('.ios-control-panel').scrollIntoView({behavior:'smooth'});
    });

    el('ios-day-complete').addEventListener('change', event => {
      localStorage.setItem(completedKey, event.target.checked ? '1' : '0');
      renderSummary();
      updateMainProgress();
    });

    if (window.JP26Currency) window.JP26Currency.applyConversions(el('ios-day-view'));
  }

  function renderSummary() {
    el('ios-summary-grid').innerHTML = days.map((day,index) => {
      const completed = localStorage.getItem('jp26:itinerary-complete:' + day.id) === '1';
      return `
        <button class="ios-summary-card" type="button" data-summary-index="${index}">
          <small>DAY ${String(day.day).padStart(2,'0')} · ${escapeHTML(day.city)}</small>
          <h4>${completed ? '✅ ' : ''}${escapeHTML(day.title)}</h4>
          <p>${escapeHTML(day.subtitle)}</p>
          <footer>
            <span>${yen(day.budgetYen)} ${usdLabel(day.budgetYen)}</span>
            <span>${escapeHTML(timeLabel(day.start))}</span>
          </footer>
        </button>
      `;
    }).join('');

    document.querySelectorAll('[data-summary-index]').forEach(button => {
      button.addEventListener('click', () => {
        selectedIndex = Number(button.dataset.summaryIndex);
        renderAll();
        document.querySelector('.ios-control-panel').scrollIntoView({behavior:'smooth'});
      });
    });

    if (window.JP26Currency) window.JP26Currency.applyConversions(el('ios-summary-grid'));
  }

  function updateTotals() {
    const total = days.reduce((sum,day) => sum + Number(day.budgetYen || 0),0);
    el('ios-total-budget-yen').innerHTML = yen(total) + usdLabel(total);
    el('ios-total-budget-yen').dataset.yen = total;
  }

  function updateMainProgress() {
    const completed = days.filter(day =>
      localStorage.getItem('jp26:itinerary-complete:' + day.id) === '1'
    ).length;
    localStorage.setItem('jp26:completedDays', String(completed));
  }

  function renderAll() {
    renderDateStrip();
    renderDay();
    renderSummary();
    updateTotals();
    updateMainProgress();
  }

  async function initialize() {
    try {
      const response = await fetch('data/itinerary-os.json', {cache:'no-store'});
      if (!response.ok) throw new Error('Itinerary data unavailable');
      days = await response.json();
    } catch (error) {
      el('ios-day-view').innerHTML =
        '<div class="ios-loading">Abre JP26 usando Live Server o GitHub Pages para cargar el itinerario.</div>';
      return;
    }

    renderAll();

    document.addEventListener('jp26:currency-ready', () => {
      renderAll();
    }, {once:true});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
