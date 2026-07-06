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
  var currentUser = null;

  function userInitials(user) {
    return (
      user.avatar ||
      String(user.name || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(function (part) {
          return part.charAt(0).toUpperCase();
        })
        .join("") ||
      "?"
    );
  }

  function renderProfile(user) {
    currentUser = user;
    var initials =
      userInitials(user);
    var profileAvatar = document.getElementById("overview-profile-avatar");
    var topImage = document.getElementById("overview-profile-image");
    var topInitials = document.getElementById("overview-profile-initials");
    var modalImage = document.getElementById("profile-modal-image");
    var modalInitials = document.getElementById("profile-modal-initials");
    var hasImage = Boolean(user.imageUrl);

    topImage.hidden = !hasImage;
    modalImage.hidden = !hasImage;
    topInitials.hidden = hasImage;
    modalInitials.hidden = hasImage;
    if (hasImage) {
      topImage.src = user.imageUrl;
      modalImage.src = user.imageUrl;
    } else {
      topImage.removeAttribute("src");
      modalImage.removeAttribute("src");
    }
    topInitials.textContent = initials;
    modalInitials.textContent = initials;

    profileAvatar.title = user.name || "Current user";
    profileAvatar.setAttribute(
      "aria-label",
      user.name ? "Current user: " + user.name : "Current user",
    );
    document.getElementById("profile-modal-name").textContent =
      user.name || "Current user";
    document.getElementById("profile-modal-email").textContent =
      user.email || "";
    document.getElementById("btn-delete-profile-image").hidden = !hasImage;
    document.getElementById("btn-upload-profile-image").textContent = hasImage
      ? "Replace Picture"
      : "Upload Picture";
  }

  apiGet("/auth/current-user").then(renderProfile);

  document
    .getElementById("profile-image-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      var input = document.getElementById("profile-image-input");
      var errorElement = document.getElementById("profile-image-error");
      var button = document.getElementById("btn-upload-profile-image");
      var file = input.files[0];
      errorElement.textContent = "";

      if (!file) {
        errorElement.textContent = "Choose an image first.";
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        errorElement.textContent = "Image must not exceed 2 MB.";
        return;
      }

      var formData = new FormData();
      formData.append("image", file);
      button.disabled = true;
      button.textContent = currentUser && currentUser.imageUrl
        ? "Replacing..."
        : "Uploading...";

      apiRequest("/auth/profile-image", {
        method: "PUT",
        body: formData,
      })
        .then(function (data) {
          input.value = "";
          renderProfile(data.user);
        })
        .catch(function (error) {
          errorElement.textContent = errorMessage(error);
        })
        .finally(function () {
          button.disabled = false;
          button.textContent = currentUser && currentUser.imageUrl
            ? "Replace Picture"
            : "Upload Picture";
        });
    });

  document
    .getElementById("btn-delete-profile-image")
    .addEventListener("click", function () {
      var button = this;
      var errorElement = document.getElementById("profile-image-error");
      errorElement.textContent = "";
      button.disabled = true;
      button.textContent = "Deleting...";

      apiDelete("/auth/profile-image")
        .then(function (data) {
          renderProfile(data.user);
        })
        .catch(function (error) {
          errorElement.textContent = errorMessage(error);
        })
        .finally(function () {
          button.disabled = false;
          button.textContent = "Delete Picture";
        });
    });

  apiGet("/overview").then(function (data) {
    if (!data) return;

    document.getElementById("ov-balance").textContent = fmt(data.balance);
    document.getElementById("ov-income").textContent = fmt(data.income);
    document.getElementById("ov-expenses").textContent = fmt(data.expenses);

    // Pots
    document.getElementById("ov-pots-total").textContent = fmt(
      data.pots.totalSaved,
    );
    var potsHtml = "";
    data.pots.items.slice(0, 4).forEach(function (p) {
      potsHtml +=
        '<div class="pots-mini__item" style="border-color:var(' +
        (themeMap[p.theme] || "--green") +
        ')"><div class="pots-mini__name">' +
        escapeHtml(p.name) +
        '</div><div class="pots-mini__amt">' +
        fmt(p.saved) +
        "</div></div>";
    });
    document.getElementById("ov-pots-list").innerHTML = potsHtml;

    // Transactions
    var txHtml = "";
    data.latestTransactions.forEach(function (t) {
      var pos = t.amount > 0 ? " tx-amt--pos" : "";
      var sign = t.amount > 0 ? "+" : "";
      var d = new Date(t.date);
      var dateStr =
        d.getDate() +
        " " +
        [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][d.getMonth()] +
        " " +
        d.getFullYear();
      txHtml +=
        '<div class="tx-row"><span class="avatar" style="background:var(' +
        safeTheme(t.color || "--green") +
        ')">' +
        avatarContent(t.imageUrl, t.avatar) +
        '</span><div class="tx-row__name">' +
        escapeHtml(t.name) +
        '</div><div class="tx-row__right"><div class="tx-amt' +
        pos +
        '">' +
        sign +
        fmt(Math.abs(t.amount)) +
        '</div><div class="tx-date">' +
        dateStr +
        "</div></div></div>";
    });
    document.getElementById("ov-transactions").innerHTML = txHtml;

    // Budgets
    var totalSpent = 0;
    var totalMax = 0;
    var legendHtml = "";
    data.budgets.forEach(function (b) {
      totalSpent += b.spent;
      totalMax += b.maximum;
      legendHtml +=
        '<div class="legend-item" style="border-color:var(' +
        (themeMap[b.theme] || "--green") +
        ')"><div class="legend-item__name">' +
        escapeHtml(b.category) +
        '</div><div class="legend-item__val">' +
        fmt(b.maximum) +
        "</div></div>";
    });
    document.getElementById("ov-budget-spent").textContent = fmt(totalSpent);
    document.getElementById("ov-budget-limit").textContent =
      "of " + fmt(totalMax) + " limit";
    document.getElementById("ov-budget-legend").innerHTML = legendHtml;

    // Bills
    document.getElementById("ov-bills-paid").textContent = fmt(data.bills.paid);
    document.getElementById("ov-bills-upcoming").textContent = fmt(
      data.bills.upcoming,
    );
    document.getElementById("ov-bills-due").textContent = fmt(
      data.bills.dueSoon,
    );
  });

  // Logout
  document.querySelectorAll("[data-logout]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  });
});
