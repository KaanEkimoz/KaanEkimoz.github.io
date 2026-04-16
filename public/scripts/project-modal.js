// Project modal — is:inline so it runs before Astro ClientRouter.
// All element lookups are fresh (no cached refs) because ViewTransitions
// replaces the DOM on navigation, detaching old elements.
(function() {
  if (window.__projectModalInit) return; // guard against double-init
  window.__projectModalInit = true;

  var originalUrl = '';
  var isOpen = false;

  // Fresh DOM lookups — always get current elements after ViewTransitions swaps
  function $(id) { return document.getElementById(id); }

  function openModal() {
    var modal = $('project-modal');
    var closeBtn = $('project-modal-close');
    if (!modal) return;
    originalUrl = location.href;
    modal.classList.remove('hidden');
    void modal.offsetHeight;
    modal.classList.add('is-open');
    document.documentElement.classList.add('modal-open');
    isOpen = true;
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(updateUrl) {
    if (!isOpen) return;
    if (updateUrl === undefined) updateUrl = true;
    var modal = $('project-modal');
    var contentEl = $('project-modal-content');
    if (modal) modal.classList.remove('is-open');
    document.documentElement.classList.remove('modal-open');
    isOpen = false;

    if (updateUrl && originalUrl) {
      history.pushState(null, '', originalUrl);
    }

    setTimeout(function() {
      var m = $('project-modal');
      var c = $('project-modal-content');
      if (m) m.classList.add('hidden');
      if (c) c.innerHTML =
        '<div class="flex flex-col items-center justify-center py-20 gap-4">' +
        '<div class="w-8 h-8 border-2 border-accent-1 border-t-transparent rounded-full animate-spin"></div>' +
        '<span class="font-mono text-xs uppercase tracking-widest text-text-300">Loading...</span>' +
        '</div>';
    }, 300);
  }

  function initYouTubeEmbeds(container) {
    container.querySelectorAll('.lite-yt').forEach(function(yt) {
      var btn = yt.querySelector('button');
      if (!btn) return;
      btn.addEventListener('click', function() {
        var vid = yt.getAttribute('data-id');
        var ttl = yt.getAttribute('data-title') || 'YouTube video';
        if (!vid) return;
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(vid) + '?autoplay=1&rel=0';
        iframe.title = ttl;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
        yt.replaceChildren(iframe);
      }, { once: true });
    });
  }

  function loadProject(href) {
    openModal();
    history.pushState({ projectModal: true }, '', href);

    fetch(href)
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function(html) {
        var contentEl = $('project-modal-content');
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var article = doc.getElementById('project-detail');
        if (article && contentEl) {
          contentEl.innerHTML = article.innerHTML;
          initYouTubeEmbeds(contentEl);
        } else {
          closeModal();
          location.href = href;
        }
      })
      .catch(function() {
        closeModal();
        location.href = href;
      });
  }

  // Capture phase click — fires BEFORE Astro ClientRouter
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el !== document) {
      if (el.tagName === 'A' && el.hasAttribute('data-project-modal')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        loadProject(el.href);
        return;
      }
      // Close buttons (top-right X or FAB)
      if (el.id === 'project-modal-close' || el.id === 'project-modal-fab') {
        closeModal();
        return;
      }
      // Wrapper click (outside panel)
      if (el.id === 'project-modal-wrapper') {
        closeModal();
        return;
      }
      el = el.parentElement;
    }
  }, true);

  // Stop panel clicks from reaching wrapper handler
  document.addEventListener('click', function(e) {
    var panel = $('project-modal-panel');
    if (panel && isOpen && panel.contains(e.target) && e.target.id !== 'project-modal-close') {
      e.stopPropagation();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) closeModal();
  });

  window.addEventListener('popstate', function() {
    if (isOpen) closeModal(false);
  });
})();
