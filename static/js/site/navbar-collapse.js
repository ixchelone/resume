/* Mobile navbar behavior */
(function () {
  'use strict';

  var menu = document.getElementById('navbarSupportedContent');
  var toggler = document.querySelector('#sideNav .navbar-toggler');
  var mobileQuery = window.matchMedia('(max-width: 991.98px)');

  if (!menu || !toggler) {
    return;
  }

  function closeMenu() {
    if (window.jQuery) {
      window.jQuery(menu).collapse('hide');
    }

    menu.classList.remove('show');
    menu.classList.remove('collapsing');
    toggler.setAttribute('aria-expanded', 'false');
  }

  function handleOutsidePointer(event) {
    if (!mobileQuery.matches || !menu.classList.contains('show')) {
      return;
    }

    var target = event.target;
    if (!(target instanceof Element)) {
      target = target.parentElement;
    }

    if (!target) {
      return;
    }

    if (toggler.contains(target) || menu.contains(target)) {
      return;
    }

    closeMenu();
  }

  document.addEventListener('pointerdown', handleOutsidePointer, true);
  document.addEventListener('click', handleOutsidePointer, true);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('show')) {
      closeMenu();
      toggler.focus();
    }
  });

  document.addEventListener('click', function (event) {
    if (event.target instanceof Element &&
        event.target.closest('#navbarSupportedContent .nav-link')) {
      closeMenu();
    }
  });
})();
