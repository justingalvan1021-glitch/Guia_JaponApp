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
});

window.JP26FormatTime = function (value) {
  const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value;
  const hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return displayHour + ':' + minute + ' ' + suffix;
};
