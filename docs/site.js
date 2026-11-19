/* Progressive enhancements; links, screenshots and documentation work without JS. */
(() => {
  const dialog = document.querySelector('.lightbox');
  const image = dialog?.querySelector('.lightbox-content img');
  const caption = dialog?.querySelector('#lightbox-caption');
  const originalLink = dialog?.querySelector('.lightbox-original');
  const closeButton = dialog?.querySelector('.lightbox-close');
  if (!dialog || !image || !caption || !originalLink || !closeButton ||
      typeof dialog.showModal !== 'function') return;

  let opener = null;
  let previousOverflow = '';

  document.querySelectorAll('[data-preview]').forEach((link) => {
    link.addEventListener('click', (event) => {
      // Preserve browser shortcuts for opening the actual image in another tab.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      image.src = link.dataset.preview;
      image.alt = link.querySelector('img')?.alt || link.dataset.caption || '应用截图';
      caption.textContent = link.dataset.caption || '应用截图';
      originalLink.href = link.href;
      previousOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
    // Drop the full-resolution preview after closing; the page's image remains cached.
    image.removeAttribute('src');
  });
})();

(() => {
  const menu = document.querySelector('.mobile-menu');
  if (!menu) return;
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => { menu.open = false; });
  });
  document.addEventListener('pointerdown', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menu.open) return;
    menu.open = false;
    menu.querySelector('summary').focus();
  });
})();

(() => {
  // Respect reduced-motion: stop the autoplaying demo and let the viewer start it.
  const video = document.querySelector('.hud-video');
  const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (!video || !query) return;
  const apply = () => {
    if (query.matches) { video.pause(); video.controls = true; }
    else { video.controls = false; video.play().catch(() => {}); }
  };
  query.addEventListener?.('change', apply);
  apply();
})();
