(function () {
  'use strict';

  function setButtonState(button, text, className, resetText) {
    button.textContent = text;
    button.classList.remove('is-success', 'is-error');
    if (className) button.classList.add(className);
    window.setTimeout(function () {
      button.textContent = resetText;
      button.classList.remove('is-success', 'is-error');
    }, 1400);
  }

  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.className = 'jp26-copy-helper';
    area.value = text;
    area.setAttribute('readonly', '');
    document.body.appendChild(area);

    area.focus();
    area.select();
    area.setSelectionRange(0, area.value.length);

    var copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(area);
    return copied;
  }

  async function copyPhrase(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        return fallbackCopy(text);
      }
    }
    return fallbackCopy(text);
  }

  function getJapaneseVoice() {
    var voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    return voices.find(function (voice) {
      return /^ja[-_]/i.test(voice.lang);
    }) || voices.find(function (voice) {
      return /japan/i.test(voice.name);
    }) || null;
  }

  function speakJapanese(text, button) {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setButtonState(button, 'No disponible', 'is-error', '🔊 Escuchar');
      return;
    }

    var synth = window.speechSynthesis;
    synth.cancel();
    synth.resume();

    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.72;
    utterance.pitch = 1;
    utterance.volume = 1;

    var voice = getJapaneseVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = function () {
      button.textContent = '🔊 Reproduciendo';
      button.classList.add('is-success');
    };
    utterance.onend = function () {
      button.textContent = '🔊 Escuchar';
      button.classList.remove('is-success', 'is-error');
    };
    utterance.onerror = function () {
      setButtonState(button, 'Voz no disponible', 'is-error', '🔊 Escuchar');
    };

    // iOS/Safari sometimes needs a tiny delay after cancel/resume.
    window.setTimeout(function () {
      synth.speak(utterance);
      // Workaround for engines that pause immediately after starting.
      window.setTimeout(function () {
        if (synth.paused) synth.resume();
      }, 180);
    }, 60);
  }

  function initializePhraseButtons() {
    function keyFor(card) {
      return 'jp26:phrase:' + card.dataset.phraseKey;
    }

    function updateFavorites() {
      var list = document.querySelector('.phrase-favorites-list');
      var empty = document.querySelector('.phrase-favorites-empty');
      if (!list || !empty) return;

      list.innerHTML = '';
      var favorites = Array.prototype.slice.call(
        document.querySelectorAll('.phrase-card')
      ).filter(function (card) {
        return localStorage.getItem(keyFor(card)) === '1';
      });

      empty.style.display = favorites.length ? 'none' : 'block';

      favorites.forEach(function (card) {
        var row = document.createElement('div');
        row.className = 'phrase-favorite-row';

        var strong = document.createElement('strong');
        strong.textContent = card.dataset.phraseEs;

        var span = document.createElement('span');
        span.textContent =
          card.dataset.phraseJp + ' · ' + card.dataset.phraseRomaji;

        row.appendChild(strong);
        row.appendChild(span);
        list.appendChild(row);
      });
    }

    document.querySelectorAll('.phrase-card').forEach(function (card) {
      var copyButton = card.querySelector('.phrase-copy');
      var speakButton = card.querySelector('.phrase-speak');
      var favoriteButton = card.querySelector('.phrase-fav');
      var storageKey = keyFor(card);

      if (localStorage.getItem(storageKey) === '1') {
        favoriteButton.classList.add('active');
        favoriteButton.textContent = '★ Favorita';
      }

      copyButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var text =
          card.dataset.phraseJp + '\n' +
          card.dataset.phraseRomaji + '\n' +
          card.dataset.phraseEs;

        copyPhrase(text).then(function (copied) {
          if (copied) {
            setButtonState(copyButton, '✓ Copiado', 'is-success', '📋 Copiar');
          } else {
            // Last-resort: select visible Japanese text so the user can copy manually.
            var range = document.createRange();
            range.selectNodeContents(card.querySelector('.phrase-jp'));
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            setButtonState(copyButton, 'Texto seleccionado', 'is-error', '📋 Copiar');
          }
        });
      });

      speakButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        speakJapanese(card.dataset.phraseJp, speakButton);
      });

      favoriteButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var active = localStorage.getItem(storageKey) === '1';
        localStorage.setItem(storageKey, active ? '0' : '1');
        favoriteButton.classList.toggle('active', !active);
        favoriteButton.textContent = active ? '☆ Favorita' : '★ Favorita';
        updateFavorites();
      });
    });

    // Safari may load voices after DOMContentLoaded.
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function () {
        window.speechSynthesis.getVoices();
      };
    }

    updateFavorites();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePhraseButtons);
  } else {
    initializePhraseButtons();
  }
})();
