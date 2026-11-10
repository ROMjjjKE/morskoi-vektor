/* ООО «Морской вектор» — скрипты сайта */
(function () {
  'use strict';

  /* ---------- Sticky header ---------- */
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Мобильное меню ---------- */
  var burger = document.querySelector('[data-burger]');
  var mnav = document.querySelector('[data-mobile-nav]');
  if (burger && mnav) {
    var closeBtn = mnav.querySelector('[data-close-nav]');
    var open = function () {
      mnav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      burger.setAttribute('aria-expanded', 'true');
    };
    var close = function () {
      mnav.classList.remove('is-open');
      document.body.style.overflow = '';
      burger.setAttribute('aria-expanded', 'false');
    };
    burger.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    mnav.addEventListener('click', function (e) {
      if (e.target === mnav) close();
    });
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------- Аккордеоны ---------- */
  document.querySelectorAll('[data-acc]').forEach(function (acc) {
    var head = acc.querySelector('.acc__head');
    if (!head) return;
    head.addEventListener('click', function () {
      var group = acc.getAttribute('data-acc-group');
      if (group) {
        document.querySelectorAll('[data-acc-group="' + group + '"]').forEach(function (other) {
          if (other !== acc) other.classList.remove('is-open');
        });
      }
      var isOpen = acc.classList.toggle('is-open');
      head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ---------- Фильтр вакансий ---------- */
  var filterWrap = document.querySelector('[data-filters]');
  if (filterWrap) {
    var allAccs = document.querySelectorAll('[data-vacancy]');
    filterWrap.querySelectorAll('.filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterWrap.querySelectorAll('.filter').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var key = btn.getAttribute('data-filter');
        var shown = 0;
        allAccs.forEach(function (item) {
          var match = key === 'all' || item.getAttribute('data-dept') === key;
          item.style.display = match ? '' : 'none';
          if (!match) item.classList.remove('is-open');
          if (match) shown++;
        });
        var empty = document.querySelector('[data-vacancy-empty]');
        if (empty) empty.style.display = shown ? 'none' : 'block';
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealItems = document.querySelectorAll('.reveal');
  if (revealItems.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Кнопка «вверх» ---------- */
  var toTop = document.querySelector('[data-to-top]');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('is-visible', window.scrollY > 520);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Модальное окно отклика на вакансию ---------- */
  var modal = document.querySelector('[data-modal="response"]');
  if (modal) {
    var modalVac = modal.querySelector('[data-modal-vacancy]');
    var lastFocus = null;

    var openModal = function (title) {
      lastFocus = document.activeElement;
      if (modalVac) modalVac.textContent = title || 'Открытая вакансия';
      var sel = modal.querySelector('#resp_position');
      if (sel && title) {
        var matched = false;
        Array.prototype.forEach.call(sel.options, function (o) {
          if (o.value === title.trim()) { o.selected = true; matched = true; }
        });
        if (!matched) sel.value = 'Другое';
      }
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      var first = modal.querySelector('input, select, textarea');
      if (first) setTimeout(function () { first.focus(); }, 120);
    };

    var closeModal = function () {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    document.querySelectorAll('[data-open-response]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(btn.getAttribute('data-vacancy-title'));
      });
    });

    modal.querySelectorAll('[data-close-modal]').forEach(function (b) {
      b.addEventListener('click', closeModal);
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    var responseForm = modal.querySelector('form');
    if (responseForm) {
      responseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = responseForm.querySelector('.form__ok');
        if (ok) ok.classList.add('is-visible');
        responseForm.querySelectorAll('input, textarea, select, button').forEach(function (f) { f.disabled = true; });
      });
    }
  }

  /* ---------- Формы на страницах ---------- */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.form__ok');
      if (ok) {
        ok.classList.add('is-visible');
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.querySelectorAll('input, textarea, select, button').forEach(function (f) { f.disabled = true; });
    });
  });

  /* ---------- Год в футере ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Подсветка активного пункта меню ---------- */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    if (href && href === path && href !== '') {
      var li = a.closest('.nav__item');
      if (li) li.classList.add('is-active');
    }
  });
})();
