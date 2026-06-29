document.addEventListener('DOMContentLoaded', function () {
  var themeMap = { green: '--green', cyan: '--cyan', yellow: '--yellow', navy: '--navy', red: '--red', purple: '--purple', turquoise: '--turquoise', brown: '--brown', magenta: '--magenta', blue: '--blue', army: '--army', gold: '--gold', orange: '--orange' };
  var summaryEl = document.getElementById('bg-summary');
  var cardsEl = document.getElementById('bg-cards');
  var donutValueEl = document.getElementById('bg-donut-value');
  var donutLimitEl = document.getElementById('bg-donut-limit');

  function load() {
    apiGet('/budgets').then(function (data) {
      if (!data) return;

      var totalSpent = 0;
      var totalMax = 0;

      var summaryHtml = '';
      var cardsHtml = '';

      data.forEach(function (b) {
        var color = themeMap[b.theme] || '--green';
        totalSpent += b.spent;
        totalMax += b.maximum;
        var pct = Math.min(b.spent / b.maximum * 100, 100);

        summaryHtml += '<div class="summary-row"><div class="summary-row__left"><span class="bar-tag" style="background:var(' + color + ')"></span><span class="summary-row__name">' + b.category + '</span></div><div><span class="summary-row__spent">' + fmt(b.spent) + '</span><span class="summary-row__of">of ' + fmt(b.maximum) + '</span></div></div>';

        var latestHtml = '';
        b.latestSpending.forEach(function (t) {
          var d = new Date(t.date);
          var dateStr = d.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getFullYear();
          latestHtml += '<div class="latest-row"><span class="avatar" style="background:var(' + (t.color || color) + ')">' + (t.avatar || '') + '</span><div class="latest-row__name">' + t.name + '</div><div class="tx-row__right"><div class="latest-row__amt">-' + fmt(Math.abs(t.amount)) + '</div><div class="latest-row__date">' + dateStr + '</div></div></div>';
        });

        cardsHtml += '<section class="card">' +
          '<div class="budget-card__head"><div class="budget-card__title"><span class="dot" style="background:var(' + color + ')"></span><h3>' + b.category + '</h3></div>' +
          '<div class="menu-wrap"><button class="kebab" data-menu>···</button><div class="menu"><button data-open="modal-edit-budget" data-budget-id="' + b._id + '" data-budget-cat="' + b.category + '" data-budget-max="' + b.maximum + '" data-budget-theme="' + b.theme + '">Edit Budget</button><button class="danger" data-open="modal-delete-budget" data-name="' + b.category + '" data-budget-id="' + b._id + '">Delete Budget</button></div></div></div>' +
          '<div class="muted">Maximum of ' + fmt(b.maximum) + '</div>' +
          '<div class="progress"><div class="progress__fill" style="width:' + pct + '%;background:var(' + color + ')"></div></div>' +
          '<div class="spent-row"><div class="spent-cell" style="border-color:var(' + color + ')"><div class="spent-cell__label">Spent</div><div class="spent-cell__val">' + fmt(b.spent) + '</div></div><div class="spent-cell"><div class="spent-cell__label">Remaining</div><div class="spent-cell__val">' + fmt(b.remaining) + '</div></div></div>' +
          '<div class="latest"><div class="latest__head"><span class="latest__title">Latest Spending</span></div>' + latestHtml + '</div></section>';
      });

      donutValueEl.textContent = fmt(totalSpent);
      donutLimitEl.textContent = 'of ' + fmt(totalMax) + ' limit';
      summaryEl.innerHTML = summaryHtml;
      cardsEl.innerHTML = cardsHtml;
    });
  }

  load();

  // Add Budget
  document.getElementById('btn-add-budget').addEventListener('click', function () {
    var modal = document.getElementById('modal-add-budget');
    var cat = modal.querySelector('[name="category"]').value;
    var max = parseFloat(modal.querySelector('[name="maximum"]').value);
    var theme = modal.querySelector('[name="theme"]').value.toLowerCase().replace(' ', '');
    if (!max) return;
    apiPost('/budgets', { category: cat, maximum: max, theme: theme }).then(function () { load(); });
  });

  // Delete Budget
  document.addEventListener('click', function (e) {
    var delBtn = e.target.closest('#btn-delete-budget');
    if (delBtn) {
      var id = document.getElementById('modal-delete-budget').dataset.budgetId;
      if (id) apiDelete('/budgets/' + id).then(function () { load(); });
    }

    var openDel = e.target.closest('[data-open="modal-delete-budget"]');
    if (openDel && openDel.dataset.budgetId) {
      document.getElementById('modal-delete-budget').dataset.budgetId = openDel.dataset.budgetId;
    }
  });

  document.querySelectorAll('[data-logout]').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); logout(); });
  });
});
