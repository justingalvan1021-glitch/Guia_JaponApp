
(function () {
  'use strict';

  const FALLBACK_ITINERARY = [
    {day:1,date:'15 OCT',city:'Transit',title:'SLC → Seoul',icon:'✈️',href:'#itinerario'},
    {day:2,date:'16 OCT',city:'Tokyo',title:'Arrival + Oshiage',icon:'🗼',href:'#itinerario'},
    {day:3,date:'17 OCT',city:'Tokyo',title:'Asakusa + Akihabara',icon:'🏮',href:'#asakusa-premium',active:true},
    {day:4,date:'18 OCT',city:'Tokyo',title:'DisneySea',icon:'🌊',href:'#misiones'},
    {day:5,date:'19 OCT',city:'Tokyo',title:'Ghibli + teamLab',icon:'🌈',href:'#misiones'},
    {day:6,date:'20 OCT',city:'Osaka',title:'Transfer + Dotonbori',icon:'🌃',href:'#namba-premium'},
    {day:7,date:'21 OCT',city:'Osaka',title:'Universal Birthday',icon:'🎢',href:'#misiones'},
    {day:8,date:'22 OCT',city:'Osaka',title:'Kaiyukan + Umeda',icon:'🐠',href:'#osakabay-premium'},
    {day:9,date:'23 OCT',city:'Kyoto',title:'Higashiyama + Gion',icon:'🏯',href:'#higashiyama-premium'},
    {day:10,date:'24 OCT',city:'Kyoto',title:'Arashiyama',icon:'🎋',href:'#arashiyama-premium'},
    {day:11,date:'25 OCT',city:'Flexible',title:'Nara / Nintendo',icon:'🦌',href:'#itinerario'},
    {day:12,date:'26 OCT',city:'Tokyo',title:'Operation Midnight',icon:'🚗',href:'#misiones'},
    {day:13,date:'27 OCT',city:'Transit',title:'Haneda → SLC',icon:'✈️',href:'#itinerario'}
  ];

  async function getItinerary() {
    try {
      const response = await fetch('data/itinerary.json', {cache:'no-store'});
      if (!response.ok) throw new Error('Could not load itinerary');
      return await response.json();
    } catch (error) {
      console.warn('JP26 itinerary fallback:', error);
      return FALLBACK_ITINERARY;
    }
  }

  function renderTimeline(days) {
    const container = document.getElementById('v4-timeline');
    if (!container) return;
    container.innerHTML = days.map(day => `
      <a class="v4-day-card ${day.active ? 'active' : ''}" href="${day.href}">
        <div><small>DAY ${String(day.day).padStart(2,'0')} · ${day.date}</small><h4>${day.title}</h4><p>${day.city}</p></div>
        <span>${day.icon}</span>
      </a>
    `).join('');
  }

  function updateCountdown() {
    const target = new Date('2026-10-15T00:00:00-06:00');
    const now = new Date();
    const days = Math.max(0, Math.ceil((target - now) / 86400000));
    const node = document.getElementById('v4-countdown');
    if (node) node.textContent = days;
  }

  function updateTokyoTime() {
    const node = document.getElementById('v4-tokyo-time');
    if (!node) return;
    const value = new Intl.DateTimeFormat('es-MX', {
      timeZone:'Asia/Tokyo',
      hour:'2-digit',
      minute:'2-digit',
      hour12:false
    }).format(new Date());
    node.textContent = 'Tokyo ' + value;
  }

  function updateProgress() {
    const completed = Number(localStorage.getItem('jp26:completedDays') || 0);
    const safe = Math.min(13, Math.max(0, completed));
    const label = document.getElementById('v4-progress-days');
    const fill = document.getElementById('v4-progress-fill');
    if (label) label.textContent = safe;
    if (fill) fill.style.width = ((safe / 13) * 100) + '%';
  }

  async function initializeDashboard() {
    renderTimeline(await getItinerary());
    updateCountdown();
    updateTokyoTime();
    updateProgress();
    window.setInterval(updateTokyoTime, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
  } else {
    initializeDashboard();
  }
})();
