(function () {
  'use strict';

  var root = document.documentElement;
  var buttons = document.querySelectorAll('[data-theme-choice]');

  if (!buttons.length) {
    return;
  }

  function applyTheme(theme, savePreference) {
    var selectedTheme = theme === 'dark' ? 'dark' : 'light';

    root.setAttribute('data-theme', selectedTheme);

    buttons.forEach(function (button) {
      var isActive = button.getAttribute('data-theme-choice') === selectedTheme;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (savePreference) {
      try {
        localStorage.setItem('theme', selectedTheme);
      } catch (error) {
        // The selected theme still works for this page when storage is unavailable.
      }
    }
  }

  // Reflect the theme initialized in the document head.
  applyTheme(root.getAttribute('data-theme'), false);

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyTheme(button.getAttribute('data-theme-choice'), true);
    });
  });
})();
