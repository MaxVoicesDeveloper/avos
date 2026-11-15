(() => {
  'use strict';
  const config = window.AVOS_PACK || {};
  const toast = document.getElementById('toast');
  let toastTimer;

  function notify(message) {
    if (!toast) return;
    toast.querySelector('span').textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }

  for (const element of document.querySelectorAll('[data-config]')) {
    const value = config[element.dataset.config];
    if (typeof value === 'string') element.value = value;
  }

  for (const link of document.querySelectorAll('[data-download]')) {
    if (config.downloadUrl) link.href = config.downloadUrl;
    if (config.downloadName) link.download = config.downloadName;
  }

  async function copyText(input) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(input.value);
        return true;
      } catch (_) { /* Use visible-field fallback when clipboard permission is unavailable. */ }
    }
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.focus({ preventScroll: true });
    input.select();
    input.setSelectionRange(0, input.value.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { /* Keep text selected for manual copying. */ }
    if (copied && typeof start === 'number') input.setSelectionRange(start, end);
    return copied;
  }

  for (const button of document.querySelectorAll('[data-copy]')) {
    let resetTimer;
    button.addEventListener('click', async () => {
      const input = document.getElementById(button.dataset.copy);
      if (!input) return;
      const copied = await copyText(input);
      if (!copied) {
        notify('Текст выделен — нажми Ctrl+C или ⌘C');
        return;
      }
      const use = button.querySelector('use');
      const label = button.querySelector('span');
      use.setAttribute('href', '#i-check');
      label.textContent = 'Готово!';
      button.classList.add('is-copied');
      notify(input.id === 'network-id' ? 'Network ID скопирован' : 'Адрес сервера скопирован');
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        use.setAttribute('href', '#i-copy');
        label.textContent = 'Копировать';
        button.classList.remove('is-copied');
      }, 2200);
    });
  }
})();
