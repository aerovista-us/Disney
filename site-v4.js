(() => {
  if (document.documentElement.dataset.jordanV5Loader === '1') return;
  document.documentElement.dataset.jordanV5Loader = '1';

  if (!document.querySelector('link[href^="site-v5.css"]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'site-v5.css?v=20260910-2';
    document.head.appendChild(css);
  }

  if (!document.querySelector('script[src^="site-v5.js"]')) {
    const script = document.createElement('script');
    script.src = 'site-v5.js?v=20260910-2';
    script.defer = true;
    document.head.appendChild(script);
  }
})();
