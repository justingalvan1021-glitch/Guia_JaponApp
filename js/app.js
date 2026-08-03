document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('input[data-save]').forEach(function (box) {
    const key = 'jp26:' + box.dataset.save;
    box.checked = localStorage.getItem(key) === '1';
    box.addEventListener('change', function () {
      localStorage.setItem(key, box.checked ? '1' : '0');
    });
  });
});
