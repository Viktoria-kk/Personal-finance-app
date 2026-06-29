document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('signup-form');
  var errorEl = document.getElementById('signup-error');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorEl.textContent = '';

    var name = form.querySelector('[name="name"]').value;
    var email = form.querySelector('[name="email"]').value;
    var password = form.querySelector('[name="password"]').value;

    apiPost('/auth/signup', { name: name, email: email, password: password }).then(function (data) {
      if (data._status >= 400) {
        errorEl.textContent = data.message;
      } else {
        window.location.href = 'overview.html';
      }
    });
  });
});
