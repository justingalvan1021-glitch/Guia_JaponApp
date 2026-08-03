
(function () {
  'use strict';

  const STORE_KEY = 'jp26:fx:jpy-usd';
  const FALLBACK_RATE = 0.0068;
  let jpyToUsd = FALLBACK_RATE;
  let rateDate = null;

  function formatUSD(value) {
    return new Intl.NumberFormat('en-US', {
      style:'currency',
      currency:'USD',
      minimumFractionDigits:value < 10 ? 2 : 0,
      maximumFractionDigits:2
    }).format(value);
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

  function createConversionLabel(amounts) {
    if (amounts.length === 1) return '≈ ' + convertYen(amounts[0]);
    return '≈ ' + amounts.map(convertYen).join('–');
  }

  function applyConversions(root) {
    const scope = root || document;
    const candidates = scope.querySelectorAll(
      '.budget-row b, .mission-hub-tags span, .mission-tags span, ' +
      '.v4-next-metrics b, [data-yen], .ios-budget-yen, #ios-total-budget-yen'
    );

    candidates.forEach(element => {
      if (element.dataset.currencyDone === '1') return;
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
      date:rateDate,
      savedAt:Date.now()
    }));
  }

  function loadStoredRate() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORE_KEY));
      if (stored && Number(stored.rate) > 0) {
        jpyToUsd = Number(stored.rate);
        rateDate = stored.date || null;
        return true;
      }
    } catch (error) {}
    return false;
  }

  async function fetchRate() {
    const response = await fetch(
      'https://api.frankfurter.dev/v2/rates?base=JPY&quotes=USD',
      {cache:'no-store'}
    );
    if (!response.ok) throw new Error('FX request failed');

    const data = await response.json();
    const item = Array.isArray(data) ? data.find(rate => rate.quote === 'USD') : null;
    if (!item || !Number(item.rate)) throw new Error('Invalid FX response');

    jpyToUsd = Number(item.rate);
    rateDate = item.date || null;
    saveRate();
  }

  async function initializeCurrency() {
    loadStoredRate();

    try {
      await fetchRate();
    } catch (error) {
      console.warn('JP26 currency fallback:', error);
    }

    applyConversions();

    window.JP26Currency = {
      yenToUsd: amount => amount * jpyToUsd,
      formatUSD,
      convertYen,
      applyConversions,
      getRate: () => jpyToUsd,
      getDate: () => rateDate
    };

    document.dispatchEvent(new CustomEvent('jp26:currency-ready', {
      detail:{rate:jpyToUsd,date:rateDate}
    }));

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) applyConversions(node);
        });
      });
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCurrency);
  } else {
    initializeCurrency();
  }
})();
