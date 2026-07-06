var API = '/api';

function authHeaders(headers) {
  var token = localStorage.getItem('accessToken');
  var result = headers || {};
  if (token) {
    result.Authorization = 'Bearer ' + token;
  }
  return result;
}

function apiRequest(url, options) {
  options = options || {};
  options.headers = authHeaders(options.headers);

  return fetch(API + url, options).then(function (res) {
    return res.text().then(function (text) {
      var data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { message: "The server returned an invalid response" };
      }

      if (res.status === 401) {
        localStorage.removeItem('accessToken');
        if (!url.includes('/auth/login')) {
          window.location.href = 'login.html';
        }
      }

      if (!res.ok) {
        var error = new Error(data.message || "Request failed");
        error.status = res.status;
        error.data = data;
        throw error;
      }

      return data;
    });
  });
}

function apiGet(url) {
  return apiRequest(url);
}

function apiPost(url, data) {
  return apiRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

function apiPut(url, data) {
  return apiRequest(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

function apiDelete(url) {
  return apiRequest(url, {
    method: 'DELETE'
  });
}

function errorMessage(error) {
  if (error && error.data && error.data.errors && error.data.errors.length) {
    return error.data.errors.map(function (item) {
      return item.message;
    }).join(', ');
  }
  return error && error.message ? error.message : 'Something went wrong';
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function avatarContent(imageUrl, initials) {
  var url = String(imageUrl || '');
  if (/^https:\/\//i.test(url)) {
    return '<img src="' + escapeAttr(url) + '" alt="" loading="lazy">';
  }
  return escapeHtml(initials || '');
}

function safeTheme(value, fallback) {
  var allowed = [
    '--green', '--cyan', '--yellow', '--navy', '--red', '--purple',
    '--turquoise', '--brown', '--magenta', '--blue', '--army', '--gold',
    '--orange'
  ];
  return allowed.indexOf(value) >= 0 ? value : (fallback || '--green');
}

window.addEventListener('unhandledrejection', function (event) {
  if (event.reason && event.reason.status === 401) return;
  event.preventDefault();
  window.alert(errorMessage(event.reason));
});

function logout() {
  apiPost('/auth/logout', {}).catch(function () {
    // The local token must still be removed if it is already expired.
  }).finally(function () {
    localStorage.removeItem('accessToken');
    window.location.href = 'login.html';
  });
}

function fmt(n) {
  var value = Number(n);
  if (!Number.isFinite(value)) value = 0;
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
