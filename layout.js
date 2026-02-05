// learner/assets/js/layout.js
// Lightweight SPA loader: loads sidebar + module HTML into #content

const PAGE_INITS = {
  "modules/dashboard/index.html": initDashboard,
  "modules/practice/index.html": initDashboard, // re-use button hook
  "modules/service-packages/index.html": initDashboard,
  "modules/ocr-exam/index.html": initDashboard,
  "modules/study.report/index.html": initStudyReport,
};

async function loadSidebar() {
  const sidebarEl = document.getElementById("sidebar");
  if (!sidebarEl) return;

  const res = await fetch("partials/sidebar.html");
  sidebarEl.innerHTML = await res.text();

  // wire menu clicks
  sidebarEl.querySelectorAll("[data-page]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const page = a.getAttribute("data-page");
      const title = a.getAttribute("data-title") || "";
      loadPage(page, title, a);
    });
  });
}

async function loadPage(pagePath, title, clickedLink) {
  const contentEl = document.getElementById("content");
  const titleEl = document.getElementById("page-title");
  if (!contentEl) return;

  try {
    const res = await fetch(pagePath);
    if (!res.ok) throw new Error(`Failed to load ${pagePath}`);
    const html = await res.text();
    contentEl.innerHTML = html;

    if (titleEl && title) titleEl.textContent = title;

    // active state
    if (clickedLink) {
      document.querySelectorAll(".sidebar li").forEach((li) => li.classList.remove("active"));
      const li = clickedLink.closest("li");
      if (li) li.classList.add("active");
    }

    // run page init
    const initFn = PAGE_INITS[pagePath];
    if (typeof initFn === "function") initFn(contentEl);

  } catch (err) {
    contentEl.innerHTML = `<div style="padding:16px"><b>Không load được trang.</b><br>${err.message}</div>`;
    console.error(err);
  }
}

function initDashboard(scopeEl) {
  // Sample behavior: buttons show a placeholder alert
  scopeEl.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Feature đang được phát triển 🚀");
    });
  });
}

function initStudyReport(scopeEl) {
  // Chart.js demo (only if canvas exists)
  const canvas = scopeEl.querySelector("#chart");
  if (!canvas || typeof Chart === "undefined") return;

  // Avoid duplicate charts when navigating
  if (canvas._chartInstance) {
    try { canvas._chartInstance.destroy(); } catch {}
  }

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        data: [2, 3, 2.5, 3, 4, 5, 6],
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { display: false }, x: { grid: { display: false } } }
    }
  });

  canvas._chartInstance = chart;
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadSidebar();
  // default route
  loadPage("modules/dashboard/index.html", "Dashboard", document.querySelector('[data-page="modules/dashboard/index.html"]'));
});
