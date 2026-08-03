document.addEventListener('DOMContentLoaded', function () {
  const weather = document.getElementById('jp26-live-weather');
  const weatherTarget = document.getElementById('information-weather');
  if (weather && weatherTarget) weatherTarget.after(weather);

  document.querySelectorAll('.sidebar a').forEach(function (link) {
    link.addEventListener('click', function () {
      const menu = document.getElementById('menu');
      if (menu) menu.checked = false;
    });
  });

  document.querySelectorAll('input[data-save]').forEach(function (box) {
    const key = 'jp26:' + box.dataset.save;
    box.checked = localStorage.getItem(key) === '1';
    box.addEventListener('change', function () {
      localStorage.setItem(key, box.checked ? '1' : '0');
    });
  });

  initializeBreadcrumbs();
});

function initializeBreadcrumbs() {
  const labels = {
    inicio:'Home', itinerario:'Itinerary', misiones:'Activities', information:'Information',
    'information-weather':'Weather', 'information-currency':'Currency', 'information-time':'Time Zones',
    tokio:'Tokyo', osaka:'Osaka', kioto:'Kyoto', survival:'Survival Guide',
    'survival-transporte':'Transportation', 'survival-dinero':'Money', 'survival-comida':'Food',
    'survival-internet':'Internet', 'survival-emergencias':'Emergency',
    'survival-etiquette':'Etiquette', 'survival-hotels':'Hotels', 'survival-frases':'Japanese',
    apps:'Apps', crew:'The Crew', 'asakusa-premium':'Asakusa', 'akihabara-premium':'Akihabara',
    'shibuya-premium':'Shibuya', 'harajuku-premium':'Harajuku', 'odaiba-premium':'Odaiba',
    'ginza-premium':'Ginza', 'mitaka-premium':'Mitaka', 'namba-premium':'Namba',
    'umeda-premium':'Umeda', 'osakabay-premium':'Osaka Bay', 'shinsekai-premium':'Shinsekai',
    'osakacastle-premium':'Osaka Castle', 'fushimi-premium':'Fushimi Inari',
    'higashiyama-premium':'Higashiyama', 'gion-premium':'Gion',
    'arashiyama-premium':'Arashiyama', 'nishiki-premium':'Nishiki'
  };
  const activityLabels = {disneysea:'DisneySea',universal:'Universal Studios Japan',ghibli:'Ghibli Museum',teamlab:'teamLab Planets',kaiyukan:'Kaiyukan','shibuya-sky':'Shibuya Sky','jdm-night':'JDM Night'};

  function parentFor(id) {
    if (id.startsWith('information-')) return ['information'];
    if (id.startsWith('survival-') && id !== 'survival-frases') return ['survival'];
    if (id === 'survival-frases') return [];
    if (id.startsWith('phrase-')) return ['survival-frases'];
    if (id.startsWith('tokio-')) return ['tokio'];
    if (id.startsWith('osaka-')) return ['osaka'];
    if (id.startsWith('kioto-')) return ['kioto'];
    if (['asakusa-premium','akihabara-premium','shibuya-premium','harajuku-premium','odaiba-premium','ginza-premium','mitaka-premium'].includes(id)) return ['tokio'];
    if (['namba-premium','umeda-premium','osakabay-premium','shinsekai-premium','osakacastle-premium'].includes(id)) return ['osaka'];
    if (['fushimi-premium','higashiyama-premium','gion-premium','arashiyama-premium','nishiki-premium'].includes(id)) return ['kioto'];
    return [];
  }

  function render() {
    document.querySelectorAll('.jp26-breadcrumbs').forEach(function (node) { node.remove(); });
    const activityId = document.body.dataset.activity;
    const id = activityId ? 'misiones' : (location.hash.slice(1) || 'inicio');
    document.body.classList.toggle('jp26-japanese-route', id === 'survival-frases' || id.startsWith('phrase-'));
    document.querySelectorAll('.sidebar a[aria-current]').forEach(function (link) { link.removeAttribute('aria-current'); });
    const navId = id.startsWith('phrase-') ? 'survival-frases' : id;
    const activeLink = Array.from(document.querySelectorAll('.sidebar a[href^="#"]')).find(function (link) {
      return link.getAttribute('href') === '#' + navId;
    });
    if (activeLink) {
      activeLink.setAttribute('aria-current', 'page');
      const group = activeLink.closest('details');
      if (group) group.open = true;
    }
    const target = activityId ? document.querySelector('.mission-page') || document.body : document.getElementById(id);
    const appSection = target && (target.classList.contains('app-section') ? target : target.closest('.app-section'));
    if (!appSection && !activityId) return;
    const trail = activityId
      ? [{id:'inicio',label:'Home'},{id:'misiones',label:'Activities'},{label:activityLabels[activityId] || activityId.replace(/-/g,' ')}]
      : [{id:'inicio',label:'Home'}].concat(parentFor(id).map(function (parent) { return {id:parent,label:labels[parent]}; }), id === 'inicio' ? [] : [{label:labels[id] || id.replace(/-/g,' ')}]);
    const nav = document.createElement('nav');
    nav.className = 'jp26-breadcrumbs';
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.innerHTML = trail.map(function (item, index) {
      const href = activityId ? '../index.html#' + item.id : '#' + item.id;
      const content = item.id && index < trail.length - 1 ? '<a href="' + href + '">' + item.label + '</a>' : '<span>' + item.label + '</span>';
      return (index ? '<i aria-hidden="true">›</i>' : '') + content;
    }).join('');
    (appSection || document.body).prepend(nav);
  }

  render();
  window.addEventListener('hashchange', render);
}

window.JP26FormatTime = function (value) {
  const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value;
  const hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return displayHour + ':' + minute + ' ' + suffix;
};
