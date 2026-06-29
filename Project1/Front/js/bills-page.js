document.addEventListener('DOMContentLoaded', function () {
  var state = { sort: 'latest', search: '' };
  var billsBody = document.getElementById('bills-body');

  var paidCheck = '<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--green)"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var dueIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--red)"><circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16v.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

  function load() {
    var q = '?sort=' + state.sort;
    if (state.search) q += '&search=' + encodeURIComponent(state.search);

    apiGet('/bills' + q).then(function (bills) {
      if (!bills) return;
      var html = '';
      bills.forEach(function (b) {
        var statusClass = b.status === 'paid' ? ' bill-due--paid' : (b.status === 'dueSoon' ? ' bill-due--soon' : '');
        var icon = b.status === 'paid' ? paidCheck : (b.status === 'dueSoon' ? dueIcon : '');
        var amtClass = b.status === 'dueSoon' ? ' bill-amt--soon' : '';

        html += '<div class="bill-row">' +
          '<div class="bill-row__who"><span class="avatar" style="background:var(' + (b.color || '--green') + ')">' + (b.avatar || '') + '</span><span class="name">' + b.name + '</span></div>' +
          '<div class="bill-due' + statusClass + '"><span>Monthly - ' + ordinal(b.dueDay) + '</span>' + icon + '</div>' +
          '<div class="bill-amt' + amtClass + '">' + fmt(b.amount) + '</div></div>';
      });
      billsBody.innerHTML = html;
    });

    apiGet('/bills/summary').then(function (data) {
      if (!data) return;
      document.getElementById('bills-total').textContent = fmt(data.totalBills);
      document.getElementById('bills-paid-count').textContent = data.paid.count + ' (' + fmt(data.paid.total) + ')';
      document.getElementById('bills-upcoming-count').textContent = data.upcoming.count + ' (' + fmt(data.upcoming.total) + ')';
      document.getElementById('bills-due-count').textContent = data.dueSoon.count + ' (' + fmt(data.dueSoon.total) + ')';
    });
  }

  function ordinal(n) {
    var s = ['th','st','nd','rd'];
    var v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  load();

  document.getElementById('bills-sort').addEventListener('change', function () {
    state.sort = this.value.toLowerCase().replace(/ /g, '-');
    load();
  });

  var searchTimer;
  document.getElementById('bills-search').addEventListener('input', function () {
    clearTimeout(searchTimer);
    var val = this.value;
    searchTimer = setTimeout(function () {
      state.search = val;
      load();
    }, 300);
  });

  document.querySelectorAll('[data-logout]').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); logout(); });
  });
});
