// Mentor/Teacher layout loader (matches web_app pattern: sidebar + module HTML injected into #content)

async function fetchText(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return await res.text();
}

function setMiniTitle(title, sub) {
  const miniTitle = document.getElementById("miniTitle");
  const miniSub = document.getElementById("miniSub");
  if (miniTitle) miniTitle.textContent = title || "";
  if (miniSub) miniSub.textContent = sub || "";
}

function setActiveNav(targetBtn) {
  document.querySelectorAll(".navBtn").forEach((btn) => btn.classList.remove("active"));
  if (targetBtn) targetBtn.classList.add("active");
}

async function loadPage(pagePath, title, sub, activeBtn) {
  const content = document.getElementById("content");
  if (!content) return;

  try {
    const html = await fetchText(pagePath);
    // Wrap so CSS .page/.page.active animations work as in the template
    content.innerHTML = `<section class="page active">${html}</section>`;
    setMiniTitle(title, sub);
    setActiveNav(activeBtn);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error(err);
    content.innerHTML = `<section class="page active"><div class="card"><div class="cardHead">
      <h3>Không tải được trang</h3><span class="pill red">Error</span></div>
      <div class="cardBody"><p style="margin:0">Không thể tải: <code>${pagePath}</code></p></div></div></section>`;
  }
}

async function loadSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  try {
    const html = await fetchText("partials/sidebar.html");
    sidebar.innerHTML = html;

    // Nav clicks
    const nav = document.getElementById("nav");
    if (nav) {
      nav.addEventListener("click", (e) => {
        const btn = e.target.closest(".navBtn");
        if (!btn) return;
        const pagePath = btn.dataset.page;
        const title = btn.dataset.title || btn.querySelector(".navTitle")?.textContent || "Page";
        const sub = btn.dataset.sub || btn.querySelector(".navHint")?.textContent || "";
        loadPage(pagePath, title, sub, btn);
      });
    }

    // Load default (the one marked active)
    const defaultBtn = sidebar.querySelector(".navBtn.active") || sidebar.querySelector(".navBtn");
    if (defaultBtn) {
      loadPage(
        defaultBtn.dataset.page,
        defaultBtn.dataset.title || defaultBtn.querySelector(".navTitle")?.textContent,
        defaultBtn.dataset.sub || defaultBtn.querySelector(".navHint")?.textContent,
        defaultBtn
      );
    }
  } catch (err) {
    console.error(err);
    sidebar.innerHTML = `<div style="padding:16px">Không tải được sidebar.</div>`;
  }
}

// Support in-page navigation: any element with [data-nav] = dashboard/manage-lessons/assignments/student-reports
document.addEventListener("click", (e) => {
  const go = e.target.closest("[data-nav]");
  if (!go) return;

  const key = go.dataset.nav;
  const btn = document.querySelector(`.navBtn[data-page="modules/${key}/index.html"]`);
  if (btn) {
    const pagePath = btn.dataset.page;
    const title = btn.dataset.title || btn.querySelector(".navTitle")?.textContent || "Page";
    const sub = btn.dataset.sub || btn.querySelector(".navHint")?.textContent || "";
    loadPage(pagePath, title, sub, btn);
  }
});

// Tabs: set active styling only (UI demo)
document.addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  const group = tab.dataset.tab;
  if (!group) return;
  document.querySelectorAll(`.tab[data-tab="${group}"]`).forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
});

loadSidebar();
