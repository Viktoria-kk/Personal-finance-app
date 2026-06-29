var API = '/api';

function apiGet(url) {
  return fetch(API + url, {
    credentials: 'include'
  }).then(function (res) {
    if (res.status === 401) {
      window.location.href = 'login.html';
      return;
    }
    return res.json();
  });
}

function apiPost(url, data) {
  return fetch(API + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(function (res) {
    if (res.status === 401) {
      window.location.href = 'login.html';
      return;
    }
    return res.json().then(function (json) {
      json._status = res.status;
      return json;
    });
  });
}

function apiPut(url, data) {
  return fetch(API + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(function (res) {
    return res.json();
  });
}

function apiDelete(url) {
  return fetch(API + url, {
    method: 'DELETE',
    credentials: 'include'
  }).then(function (res) {
    return res.json();
  });
}

function logout() {
  apiPost('/auth/logout', {}).then(function () {
    window.location.href = 'login.html';
  });
}

function fmt(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
