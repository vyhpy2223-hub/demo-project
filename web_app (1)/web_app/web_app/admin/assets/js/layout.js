// load sidebar
fetch("partials/sidebar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("sidebar").innerHTML = html;
    bindMenu();
  });

// load page content
function loadPage(path, title) {
  fetch(path)
    .then(res => res.text())
    .then(html => {
      document.getElementById("content").innerHTML = html;
      document.getElementById("page-title").innerText = title;
    });
}

// menu click
function bindMenu() {
  document.querySelectorAll("[data-page]").forEach(link => {
    link.onclick = e => {
      e.preventDefault();

      loadPage(
        link.dataset.page,
        link.dataset.title
      );

      document.querySelectorAll(".menu li")
        .forEach(li => li.classList.remove("active"));
      link.parentElement.classList.add("active");
    };
  });

  // default page
  loadPage("modules/dashboard/index.html", "Dashboard");
}
