
(function () {
  'use strict';

  const STORE_KEY = 'jp26:fx:jpy';
  const FALLBACK_RATE = 0.0068;
  const FALLBACK_MXN_RATE = 0.12;
  let jpyToUsd = FALLBACK_RATE;
  let jpyToMxn = FALLBACK_MXN_RATE;
  let rateDate = null;

  function formatUSD(value) {
    return new Intl.NumberFormat('en-US', {
      style:'currency',
      currency:'USD',
      minimumFractionDigits:value < 10 ? 2 : 0,
      maximumFractionDigits:2
    }).format(value);
  }

  function formatMXN(value) {
    return new Intl.NumberFormat('es-MX', {style:'currency',currency:'MXN',maximumFractionDigits:2}).format(value).replace('$', 'MX$');
  }

  function parseYen(text) {
    if (!text || !text.includes('¥')) return null;
    const matches = [...text.matchAll(/¥\s*([\d,]+)/g)];
    if (!matches.length) return null;
    return matches.map(match => Number(match[1].replace(/,/g,'')));
  }

  function convertYen(amount) {
    return formatUSD(amount * jpyToUsd);
  }

  function convertYenToMxn(amount) {
    return formatMXN(amount * jpyToMxn);
  }

  function createConversionLabel(amounts) {
    const usd = amounts.map(convertYen).join('–');
    const mxn = amounts.map(convertYenToMxn).join('–');
    return '≈ ' + usd + ' USD\n≈ ' + mxn;
  }

  function applyConversions(root) {
    const scope = root || document;
    const candidates = scope.querySelectorAll(
      '.budget-row b, .mission-hub-tags span, .mission-tags span, ' +
      '.v4-next-metrics b, [data-yen], .ios-budget-yen, #ios-total-budget-yen'
    );

    candidates.forEach(element => {
      if (element.dataset.currencyDone === '1') return;
      if (element.querySelector('.jp26-usd')) {
        element.dataset.currencyDone = '1';
        return;
      }
      const amounts = element.dataset.yen
        ? [Number(element.dataset.yen)]
        : parseYen(element.textContent);

      if (!amounts || amounts.some(Number.isNaN)) return;

      const label = document.createElement('span');
      label.className = 'jp26-usd';
      label.textContent = createConversionLabel(amounts);
      element.appendChild(label);
      element.dataset.currencyDone = '1';
    });
  }

  function saveRate() {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      rate:jpyToUsd,
      mxnRate:jpyToMxn,
      date:rateDate,
      savedAt:Date.now()
    }));
  }

  function loadStoredRate() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORE_KEY));
      if (stored && Number(stored.rate) > 0) {
        jpyToUsd = Number(stored.rate);
        if (Number(stored.mxnRate) > 0) jpyToMxn = Number(stored.mxnRate);
        rateDate = stored.date || null;
        return true;
      }
    } catch (error) {}
    return false;
  }

  async function fetchRate() {
    const response = await fetch(
      'https://api.frankfurter.dev/v2/rates?base=JPY&quotes=USD,MXN',
      {cache:'no-store'}
    );
    if (!response.ok) throw new Error('FX request failed');

    const data = await response.json();
    const item = Array.isArray(data) ? data.find(rate => rate.quote === 'USD') : null;
    const mxnItem = Array.isArray(data) ? data.find(rate => rate.quote === 'MXN') : null;
    if (!item || !Number(item.rate)) throw new Error('Invalid FX response');

    jpyToUsd = Number(item.rate);
    if (mxnItem && Number(mxnItem.rate)) jpyToMxn = Number(mxnItem.rate);
    rateDate = item.date || null;
    saveRate();
  }

  async function initializeCurrency() {
    loadStoredRate();
    window.JP26Currency = {
      yenToUsd: amount => amount * jpyToUsd,
      formatUSD,
      formatMXN,
      convertYen,
      convertYenToMxn,
      applyConversions,
      getRate: () => jpyToUsd,
      getMxnRate: () => jpyToMxn,
      getDate: () => rateDate
    };

    const input = document.getElementById('jp26-currency-input');
    const updateConverter = function () {
      if (!input) return;
      const amount = Math.max(0, Number(input.value) || 0);
      document.getElementById('jp26-currency-usd').textContent = convertYen(amount);
      document.getElementById('jp26-currency-mxn').textContent = convertYenToMxn(amount);
      document.getElementById('jp26-currency-rate-note').textContent =
        'Tasas de referencia' + (rateDate ? ' · ' + rateDate : ' · modo offline');
    };
    if (input) input.addEventListener('input', updateConverter);
    applyConversions();
    updateConverter();

    document.dispatchEvent(new CustomEvent('jp26:currency-ready', {
      detail:{rate:jpyToUsd,mxnRate:jpyToMxn,date:rateDate}
    }));

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) applyConversions(node);
        });
      });
    });
    observer.observe(document.body,{childList:true,subtree:true});

    try {
      await fetchRate();
      updateConverter();
    } catch (error) {
      console.warn('JP26 currency fallback:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCurrency);
  } else {
    initializeCurrency();
  }
})();
