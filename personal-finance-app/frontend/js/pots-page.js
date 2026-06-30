document.addEventListener("DOMContentLoaded", function () {
  var themeMap = {
    green: "--green",
    cyan: "--cyan",
    yellow: "--yellow",
    navy: "--navy",
    red: "--red",
    purple: "--purple",
    turquoise: "--turquoise",
    brown: "--brown",
    magenta: "--magenta",
    blue: "--blue",
    army: "--army",
    gold: "--gold",
    orange: "--orange",
  };
  var gridEl = document.getElementById("pots-grid");

  function escapeAttr(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function themeValue(label) {
    var normalized = String(label || "")
      .toLowerCase()
      .replace(/\s+/g, "");
    return normalized === "armygreen" ? "army" : normalized;
  }

  function themeLabel(value) {
    var map = {
      green: "Green",
      cyan: "Cyan",
      yellow: "Yellow",
      navy: "Navy",
      red: "Red",
      purple: "Purple",
      turquoise: "Turquoise",
      brown: "Brown",
      magenta: "Magenta",
      blue: "Blue",
      army: "Army Green",
      armygreen: "Army Green",
      gold: "Gold",
      orange: "Orange",
    };
    return (
      map[
        String(value || "")
          .toLowerCase()
          .replace(/\s+/g, "")
      ] || "Green"
    );
  }

  function load() {
    apiGet("/pots").then(function (data) {
      if (!data) return;
      var html = "";
      data.forEach(function (p) {
        var color = themeMap[p.theme] || "--green";
        var pct = p.target > 0 ? ((p.saved / p.target) * 100).toFixed(1) : 0;

        html +=
          '<section class="card">' +
          '<div class="pot-head"><div class="budget-card__title"><span class="dot" style="background:var(' +
          color +
          ')"></span><h3>' +
          p.name +
          "</h3></div>" +
          '<div class="menu-wrap"><button class="kebab" data-menu>···</button><div class="menu"><button data-open="modal-edit-pot" data-pot-id="' +
          p._id +
          '" data-pot-name="' +
          escapeAttr(p.name) +
          '" data-pot-target="' +
          p.target +
          '" data-pot-theme="' +
          escapeAttr(p.theme) +
          '">Edit Pot</button><button class="danger" data-open="modal-delete-pot" data-name="' +
          escapeAttr(p.name) +
          '" data-pot-id="' +
          p._id +
          '">Delete Pot</button></div></div></div>' +
          '<div class="pot-saved"><span class="pot-saved__label">Total Saved</span><span class="pot-saved__value">' +
          fmt(p.saved) +
          "</span></div>" +
          '<div class="pot-bar"><div class="pot-bar__fill" style="width:' +
          pct +
          "%;background:var(" +
          color +
          ')"></div></div>' +
          '<div class="pot-meta"><span class="pot-meta__pct">' +
          pct +
          '%</span><span class="pot-meta__target">Target of ' +
          fmt(p.target) +
          "</span></div>" +
          '<div class="pot-actions"><button class="btn btn--soft" data-open="modal-add-money" data-name="' +
          escapeAttr(p.name) +
          '" data-saved="' +
          p.saved +
          '" data-target="' +
          p.target +
          '" data-color="' +
          color +
          '" data-pot-id="' +
          p._id +
          '">+ Add Money</button><button class="btn btn--soft" data-open="modal-withdraw" data-name="' +
          escapeAttr(p.name) +
          '" data-saved="' +
          p.saved +
          '" data-target="' +
          p.target +
          '" data-pot-id="' +
          p._id +
          '">Withdraw</button></div>' +
          "</section>";
      });
      gridEl.innerHTML = html;
    });
  }

  load();

  document.getElementById("btn-add-pot").addEventListener("click", function () {
    var modal = document.getElementById("modal-add-pot");
    var name = modal.querySelector('[name="pot-name"]').value;
    var target = parseFloat(modal.querySelector('[name="pot-target"]').value);
    var theme = themeValue(modal.querySelector('[name="pot-theme"]').value);
    if (!name || !target) return;
    apiPost("/pots", { name: name, target: target, theme: theme }).then(
      function () {
        load();
      },
    );
  });

  document.addEventListener("click", function (e) {
    var openEdit = e.target.closest('[data-open="modal-edit-pot"]');
    if (openEdit && openEdit.dataset.potId) {
      var modal = document.getElementById("modal-edit-pot");
      modal.dataset.potId = openEdit.dataset.potId;
      modal.querySelector('[name="pot-name"]').value =
        openEdit.dataset.potName || "";
      modal.querySelector('[name="pot-target"]').value =
        openEdit.dataset.potTarget || "";
      modal.querySelector('[name="pot-theme"]').value = themeLabel(
        openEdit.dataset.potTheme || "green",
      );
    }

    var editBtn = e.target.closest("#btn-edit-pot");
    if (editBtn) {
      var editModal = document.getElementById("modal-edit-pot");
      var id = editModal.dataset.potId;
      var name = editModal.querySelector('[name="pot-name"]').value;
      var target = parseFloat(
        editModal.querySelector('[name="pot-target"]').value,
      );
      var theme = themeValue(
        editModal.querySelector('[name="pot-theme"]').value,
      );
      if (id && name && target && theme) {
        apiPut("/pots/" + id, {
          name: name,
          target: target,
          theme: theme,
        }).then(function () {
          load();
        });
      }
    }

    var delBtn = e.target.closest("#btn-delete-pot");
    if (delBtn) {
      var deleteId = document.getElementById("modal-delete-pot").dataset.potId;
      if (deleteId)
        apiDelete("/pots/" + deleteId).then(function () {
          load();
        });
    }

    var openDel = e.target.closest('[data-open="modal-delete-pot"]');
    if (openDel && openDel.dataset.potId) {
      document.getElementById("modal-delete-pot").dataset.potId =
        openDel.dataset.potId;
    }

    var addBtn = e.target.closest("#btn-confirm-add");
    if (addBtn) {
      var addModal = document.getElementById("modal-add-money");
      var addId = addModal.dataset.potId;
      var amount = parseFloat(
        addModal.querySelector("[data-money-input]").value,
      );
      if (addId && amount > 0) {
        apiPost("/pots/" + addId + "/add", { amount: amount }).then(
          function () {
            load();
          },
        );
      }
    }

    var wdBtn = e.target.closest("#btn-confirm-withdraw");
    if (wdBtn) {
      var wdModal = document.getElementById("modal-withdraw");
      var wdId = wdModal.dataset.potId;
      var wdAmount = parseFloat(
        wdModal.querySelector("[data-money-input]").value,
      );
      if (wdId && wdAmount > 0) {
        apiPost("/pots/" + wdId + "/withdraw", { amount: wdAmount }).then(
          function () {
            load();
          },
        );
      }
    }

    var openAdd = e.target.closest('[data-open="modal-add-money"]');
    if (openAdd && openAdd.dataset.potId) {
      document.getElementById("modal-add-money").dataset.potId =
        openAdd.dataset.potId;
    }
    var openWd = e.target.closest('[data-open="modal-withdraw"]');
    if (openWd && openWd.dataset.potId) {
      document.getElementById("modal-withdraw").dataset.potId =
        openWd.dataset.potId;
    }
  });

  document.querySelectorAll("[data-logout]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  });
});
