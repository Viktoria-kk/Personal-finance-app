document.addEventListener('DOMContentLoaded', function () {
  var themeMap = { green: '--green', cyan: '--cyan', yellow: '--yellow', navy: '--navy', red: '--red', purple: '--purple' };
  var gridEl = document.getElementById('pots-grid');

  function load() {
    apiGet('/pots').then(function (data) {
      if (!data) return;
      var html = '';
      data.forEach(function (p) {
        var color = themeMap[p.theme] || '--green';
        var pct = p.target > 0 ? (p.saved / p.target * 100).toFixed(1) : 0;

        html += '<section class="card">' +
          '<div class="pot-head"><div class="budget-card__title"><span class="dot" style="background:var(' + color + ')"></span><h3>' + p.name + '</h3></div>' +
          '<div class="menu-wrap"><button class="kebab" data-menu>···</button><div class="menu"><button data-open="modal-edit-pot" data-pot-id="' + p._id + '" data-pot-name="' + p.name + '" data-pot-target="' + p.target + '" data-pot-theme="' + p.theme + '">Edit Pot</button><button class="danger" data-open="modal-delete-pot" data-name="' + p.name + '" data-pot-id="' + p._id + '">Delete Pot</button></div></div></div>' +
          '<div class="pot-saved"><span class="pot-saved__label">Total Saved</span><span class="pot-saved__value">' + fmt(p.saved) + '</span></div>' +
          '<div class="pot-bar"><div class="pot-bar__fill" style="width:' + pct + '%;background:var(' + color + ')"></div></div>' +
          '<div class="pot-meta"><span class="pot-meta__pct">' + pct + '%</span><span class="pot-meta__target">Target of ' + fmt(p.target) + '</span></div>' +
          '<div class="pot-actions"><button class="btn btn--soft" data-open="modal-add-money" data-name="' + p.name + '" data-saved="' + p.saved + '" data-target="' + p.target + '" data-color="' + color + '" data-pot-id="' + p._id + '">+ Add Money</button><button class="btn btn--soft" data-open="modal-withdraw" data-name="' + p.name + '" data-saved="' + p.saved + '" data-target="' + p.target + '" data-pot-id="' + p._id + '">Withdraw</button></div>' +
          '</section>';
      });
      gridEl.innerHTML = html;
    });
  }

  load();

  // Add Pot
  document.getElementById('btn-add-pot').addEventListener('click', function () {
    var modal = document.getElementById('modal-add-pot');
    var name = modal.querySelector('[name="pot-name"]').value;
    var target = parseFloat(modal.querySelector('[name="pot-target"]').value);
    var theme = modal.querySelector('[name="pot-theme"]').value.toLowerCase();
    if (!name || !target) return;
    apiPost('/pots', { name: name, target: target, theme: theme }).then(function () { load(); });
  });

  // Delete Pot
  document.addEventListener('click', function (e) {
    var delBtn = e.target.closest('#btn-delete-pot');
    if (delBtn) {
      var id = document.getElementById('modal-delete-pot').dataset.potId;
      if (id) apiDelete('/pots/' + id).then(function () { load(); });
    }

    var openDel = e.target.closest('[data-open="modal-delete-pot"]');
    if (openDel && openDel.dataset.potId) {
      document.getElementById('modal-delete-pot').dataset.potId = openDel.dataset.potId;
    }

    // Add Money confirm
    var addBtn = e.target.closest('#btn-confirm-add');
    if (addBtn) {
      var modal = document.getElementById('modal-add-money');
      var id = modal.dataset.potId;
      var amount = parseFloat(modal.querySelector('[data-money-input]').value);
      if (id && amount > 0) {
        apiPost('/pots/' + id + '/add', { amount: amount }).then(function () { load(); });
      }
    }

    // Withdraw confirm
    var wdBtn = e.target.closest('#btn-confirm-withdraw');
    if (wdBtn) {
      var modal = document.getElementById('modal-withdraw');
      var id = modal.dataset.potId;
      var amount = parseFloat(modal.querySelector('[data-money-input]').value);
      if (id && amount > 0) {
        apiPost('/pots/' + id + '/withdraw', { amount: amount }).then(function () { load(); });
      }
    }

    // Store pot ID when opening add-money/withdraw modals
    var openAdd = e.target.closest('[data-open="modal-add-money"]');
    if (openAdd && openAdd.dataset.potId) {
      document.getElementById('modal-add-money').dataset.potId = openAdd.dataset.potId;
    }
    var openWd = e.target.closest('[data-open="modal-withdraw"]');
    if (openWd && openWd.dataset.potId) {
      document.getElementById('modal-withdraw').dataset.potId = openWd.dataset.potId;
    }
  });

  document.querySelectorAll('[data-logout]').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); logout(); });
  });
});
