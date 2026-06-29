(function () {
  'use strict';

  function fmt(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /* ---------- Modals ---------- */
  function openModal(id, trigger) {
    var m = document.getElementById(id);
    if (!m) return;
    if (id === 'modal-add-money' || id === 'modal-withdraw') setupMoney(m, trigger);
    if (id === 'modal-delete-budget' || id === 'modal-delete-pot') {
      var t = m.querySelector('[data-del-title]');
      if (t && trigger && trigger.dataset.name) t.textContent = 'Delete ‘' + trigger.dataset.name + '’?';
    }
    m.classList.add('is-open');
  }

  function closeModal(m) { m.classList.remove('is-open'); }

  function setupMoney(m, trigger) {
    var mode = m.dataset.mode;
    var saved = trigger ? parseFloat(trigger.dataset.saved) || 0 : 0;
    var target = trigger ? parseFloat(trigger.dataset.target) || 1 : 1;
    var name = trigger ? (trigger.dataset.name || '') : '';
    var color = 'var(' + (mode === 'add' ? (trigger && trigger.dataset.color ? trigger.dataset.color : '--green') : '--red') + ')';
    m._money = { saved: saved, target: target, color: color };
    m.querySelector('[data-money-title]').textContent =
      (mode === 'add' ? 'Add to ‘' : 'Withdraw from ‘') + name + '’';
    m.querySelector('[data-money-target]').textContent = 'Target of $' + target.toLocaleString();
    m.querySelector('[data-money-input]').value = '';
    updateMoney(m);
  }

  function updateMoney(m) {
    if (!m._money) return;
    var mode = m.dataset.mode;
    var amt = parseFloat(m.querySelector('[data-money-input]').value) || 0;
    var next = mode === 'add' ? m._money.saved + amt : Math.max(m._money.saved - amt, 0);
    var pct = Math.min(next / m._money.target * 100, 100);
    m.querySelector('[data-money-new]').textContent = fmt(next);
    var bar = m.querySelector('[data-money-bar]');
    bar.style.width = pct + '%';
    bar.style.background = m._money.color;
    var pctEl = m.querySelector('[data-money-pct]');
    pctEl.textContent = pct.toFixed(2) + '%';
    pctEl.style.color = m._money.color;
  }

  /* ---------- Sidebar minimize ---------- */
  var sidebar = document.querySelector('.sidebar');
  if (sidebar && localStorage.getItem('sidebar-minimized') === 'true') {
    sidebar.classList.add('is-minimized');
  }

  /* ---------- Kebab menus ---------- */
  function closeMenus() {
    document.querySelectorAll('.menu.is-open').forEach(function (el) { el.classList.remove('is-open'); });
  }

  /* ---------- Event delegation ---------- */
  document.addEventListener('click', function (e) {
    var open = e.target.closest('[data-open]');
    if (open) { openModal(open.dataset.open, open); closeMenus(); return; }

    var close = e.target.closest('[data-close]');
    if (close) { closeModal(close.closest('.modal-overlay')); return; }

    if (e.target.classList.contains('modal-overlay')) { closeModal(e.target); return; }

    var pw = e.target.closest('[data-pw]');
    if (pw) {
      var input = pw.parentNode.querySelector('input');
      input.type = input.type === 'password' ? 'text' : 'password';
      return;
    }

    var minimize = e.target.closest('.minimize-btn');
    if (minimize) {
      var sb = document.querySelector('.sidebar');
      if (sb) {
        sb.classList.toggle('is-minimized');
        localStorage.setItem('sidebar-minimized', sb.classList.contains('is-minimized'));
      }
      return;
    }

    var kebab = e.target.closest('[data-menu]');
    if (kebab) {
      var menu = kebab.parentNode.querySelector('.menu');
      var wasOpen = menu.classList.contains('is-open');
      closeMenus();
      if (!wasOpen) menu.classList.add('is-open');
      return;
    }

    closeMenus();
  });

  document.addEventListener('input', function (e) {
    if (e.target.matches('[data-money-input]')) {
      updateMoney(e.target.closest('.modal-overlay'));
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.is-open').forEach(closeModal);
      closeMenus();
    }
  });
})();
