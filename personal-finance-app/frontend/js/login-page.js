document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('login-form');
  var errorEl = document.getElementById('login-error');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorEl.textContent = '';

    var email = form.querySelector('[name="email"]').value;
    var password = form.querySelector('[name="password"]').value;

    apiPost('/auth/login', { email: email, password: password })
      .then(function (data) {
        localStorage.setItem('accessToken', data.accessToken);
        window.location.href = 'overview.html';
      })
      .catch(function (error) {
        errorEl.textContent = errorMessage(error);
      });
  });
});
