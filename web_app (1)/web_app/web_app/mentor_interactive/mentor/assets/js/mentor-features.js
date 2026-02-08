// mentor-features.js
// Adds real interactions for Mentor modules WITHOUT changing the UI structure.
// Features: Create/Edit/Delete, search, tab filtering, view details, simple kebab menus.
// Data is stored in localStorage so it works with Live Server (no backend needed).

(() => {
  const DB_KEYS = {
    lessons: "aes_mentor_lessons",
    assignments: "aes_mentor_assignments",
    reports: "aes_mentor_reports",
  };

  const nowLabel = () => "Just now";

  const read = (k) => {
    try { return JSON.parse(localStorage.getItem(k) || "[]"); }
    catch { return []; }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  function seed() {
    if (!localStorage.getItem(DB_KEYS.lessons)) {
      write(DB_KEYS.lessons, [
        { id:"L1", title:"Basic English Grammar", students:25, last:"Today", status:"Published" },
        { id:"L2", title:"Travel Conversations", students:20, last:"2 days ago", status:"Published" },
        { id:"L3", title:"Email Writing Practice", students:22, last:"3 days ago", status:"Published" },
        { id:"L4", title:"Presentation Practice", students:18, last:"1 week ago", status:"Scheduled" },
        { id:"L5", title:"Week 2 Grammar Quiz", students:0, last:"Draft", status:"Draft" },
      ]);
    }
    if (!localStorage.getItem(DB_KEYS.assignments)) {
      write(DB_KEYS.assignments, [
        { id:"A1", title:"Week 2 Grammar Quiz", due:"04/29/2025", submissions:"12 students", status:"Published" },
        { id:"A2", title:"Travel Topic Speaking", due:"04/25/2025", submissions:"10 students", status:"Published" },
        { id:"A3", title:"Email Writing Test", due:"05/02/2025", submissions:"8 students", status:"Scheduled" },
        { id:"A4", title:"Basic English Grammar Quiz", due:"04/17/2025", submissions:"8 students", status:"Scheduled" },
        { id:"A5", title:"Paragraph Writing Assignment", due:"04/10/2025", submissions:"Draft", status:"Draft" },
      ]);
    }
    if (!localStorage.getItem(DB_KEYS.reports)) {
      write(DB_KEYS.reports, [
        { id:"R1", student:"Anna Nguyen", lesson:"Basic English Grammar", feedback:"Good job improving your verb tenses!", grade:85, tag:"grammar" },
        { id:"R2", student:"Anna Nguyen", lesson:"Travel Topic Speaking", feedback:"Excellent! Very clear pronunciation!", grade:92, tag:"speaking" },
        { id:"R3", student:"Anna Nguyen", lesson:"Email Writing Test", feedback:"Review your sentence structure.", grade:70, tag:"writing" },
        { id:"R4", student:"Alec Smith", lesson:"Travel Conversations", feedback:"Work on your pronunciation!", grade:88, tag:"speaking" },
        { id:"R5", student:"Alec Smith", lesson:"Travel Conversations", feedback:"Good first attempt! Focus on your organization.", grade:75, tag:"writing" },
        { id:"R6", student:"Alec Smith", lesson:"Email Writing Test", feedback:"…", grade:null, tag:"writing" },
      ]);
    }
  }

  // ---------- Minimal modal (overlay) ----------
  function ensureModal() {
    if (document.getElementById("mfModal")) return;

    const wrap = document.createElement("div");
    wrap.id = "mfModal";
    wrap.innerHTML = `
      <div class="mfBackdrop"></div>
      <div class="mfCard">
        <div class="mfHead">
          <h3 id="mfTitle">Title</h3>
          <button id="mfClose" class="mfX" aria-label="Close">✕</button>
        </div>
        <div id="mfBody" class="mfBody"></div>
        <div class="mfFoot">
          <button id="mfCancel" class="btn btnGhost" type="button">Cancel</button>
          <button id="mfOk" class="btn" type="button">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    const css = document.createElement("style");
    css.textContent = `
      #mfModal{position:fixed; inset:0; display:none; z-index:9999;}
      #mfModal.open{display:block;}
      #mfModal .mfBackdrop{position:absolute; inset:0; background:rgba(0,0,0,.28);}
      #mfModal .mfCard{
        position:relative; width:min(560px,92vw);
        margin:10vh auto 0;
        background:rgba(255,255,255,.92);
        border:1px solid rgba(18,34,72,.12);
        border-radius:16px;
        box-shadow:0 30px 90px rgba(0,0,0,.2);
        padding:14px;
      }
      #mfModal .mfHead{display:flex; align-items:center; justify-content:space-between; gap:10px; padding:6px 6px 10px;}
      #mfModal .mfX{border:0; background:transparent; font-size:18px; cursor:pointer;}
      #mfModal .mfBody{padding:6px; color:rgba(27,37,64,.85);}
      #mfModal .mfFoot{display:flex; justify-content:flex-end; gap:10px; padding:10px 6px 6px;}
      #mfModal label{font-weight:800; font-size:13px; color:rgba(27,37,64,.7); display:block; margin:10px 0 6px;}
      #mfModal input, #mfModal select, #mfModal textarea{
        width:100%; padding:10px 12px; border-radius:12px;
        border:1px solid rgba(18,34,72,.12);
        background:rgba(244,246,255,.85);
        outline:none;
      }
      #mfModal textarea{min-height:92px; resize:vertical;}
      #mfModal .mfGrid{display:grid; grid-template-columns:1fr 1fr; gap:10px;}
      /* tiny kebab menu */
      .mfMenu{position:absolute; background:rgba(255,255,255,.95); border:1px solid rgba(18,34,72,.12);
        border-radius:12px; box-shadow:0 20px 50px rgba(0,0,0,.12); padding:6px; min-width:160px; z-index:9998;}
      .mfMenu button{width:100%; border:0; background:transparent; text-align:left; padding:10px 10px; border-radius:10px; cursor:pointer; font-weight:750;}
      .mfMenu button:hover{background:rgba(47,120,255,.10);}
    `;
    document.head.appendChild(css);

    const close = () => wrap.classList.remove("open");
    wrap.querySelector(".mfBackdrop").addEventListener("click", close);
    wrap.querySelector("#mfClose").addEventListener("click", close);
    wrap.querySelector("#mfCancel").addEventListener("click", close);
  }

  function openModal({ title, bodyHTML, okText = "Save", onOk }) {
    ensureModal();
    const wrap = document.getElementById("mfModal");
    wrap.querySelector("#mfTitle").textContent = title;
    wrap.querySelector("#mfBody").innerHTML = bodyHTML;
    const ok = wrap.querySelector("#mfOk");
    ok.textContent = okText;
    ok.onclick = () => { onOk?.(wrap); wrap.classList.remove("open"); };
    wrap.classList.add("open");
  }

  // ---------- Shared helpers ----------
  function getActiveTab(root, tabGroup, fallback="all") {
    return root.querySelector(`.tab.active[data-tab="${tabGroup}"]`)?.dataset.value || fallback;
  }

  function getSearchQuery(root) {
    const inp = root.querySelector(".searchBox input");
    return (inp?.value || "").trim().toLowerCase();
  }

  function bindSearch(root, fn) {
    const inp = root.querySelector(".searchBox input");
    if (!inp) return;
    inp.addEventListener("input", fn);
  }

  function statusToPillClass(status) {
    const s = (status || "").toLowerCase();
    if (s === "published" || s === "active") return "published";
    if (s === "draft" || s === "drafts") return "draft";
    if (s === "scheduled") return "scheduled";
    return "archived";
  }

  // ---------- Manage Lessons ----------
  function initManageLessons() {
    const root = document.getElementById("content");
    const tbody = root?.querySelector("tbody");
    if (!tbody) return;

    const createBtn = root.querySelector("button.btn");
    const tabGroup = "lessons";

    const render = () => {
      const tab = getActiveTab(root, tabGroup, "all");
      const q = getSearchQuery(root);

      let data = read(DB_KEYS.lessons);

      if (tab === "active") data = data.filter(x => x.status === "Published");
      if (tab === "drafts") data = data.filter(x => x.status === "Draft");
      if (tab === "archived") data = data.filter(x => x.status === "Archived");

      if (q) data = data.filter(x => (x.title || "").toLowerCase().includes(q));

      tbody.innerHTML = data.map(x => `
        <tr data-id="${x.id}">
          <td><span class="check on">✓</span></td>
          <td>${escapeHtml(x.title)}</td>
          <td>${escapeHtml(String(x.students ?? ""))}</td>
          <td>${escapeHtml(x.last || "")}</td>
          <td><span class="pill ${statusToPillClass(x.status)}">${escapeHtml(x.status)}</span></td>
          <td>
            <div class="rowActions">
              <button class="editBtn">✎ Edit</button>
              <button class="dangerBtn" title="Delete">🗑</button>
            </div>
          </td>
        </tr>
      `).join("");

      // wire row actions
      tbody.querySelectorAll("tr").forEach(tr => {
        const id = tr.dataset.id;
        tr.querySelector(".editBtn")?.addEventListener("click", () => editLesson(id));
        tr.querySelector(".dangerBtn")?.addEventListener("click", () => delLesson(id));
      });
    };

    const editLesson = (id) => {
      const all = read(DB_KEYS.lessons);
      const item = all.find(x => x.id === id);
      if (!item) return;

      openModal({
        title: "Edit Lesson",
        bodyHTML: `
          <label>Lesson Title</label>
          <input id="mTitle" value="${escapeAttr(item.title)}" />
          <div class="mfGrid">
            <div>
              <label>Students</label>
              <input id="mStudents" type="number" value="${Number(item.students || 0)}" />
            </div>
            <div>
              <label>Status</label>
              <select id="mStatus">
                <option ${item.status==="Published"?"selected":""}>Published</option>
                <option ${item.status==="Scheduled"?"selected":""}>Scheduled</option>
                <option ${item.status==="Draft"?"selected":""}>Draft</option>
                <option ${item.status==="Archived"?"selected":""}>Archived</option>
              </select>
            </div>
          </div>
        `,
        onOk: (wrap) => {
          const title = wrap.querySelector("#mTitle").value.trim();
          if (!title) return alert("Title is required");
          item.title = title;
          item.students = Number(wrap.querySelector("#mStudents").value || 0);
          item.status = wrap.querySelector("#mStatus").value;
          item.last = nowLabel();
          write(DB_KEYS.lessons, all.map(x => x.id === id ? item : x));
          render();
        }
      });
    };

    const delLesson = (id) => {
      if (!confirm("Delete this lesson?")) return;
      write(DB_KEYS.lessons, read(DB_KEYS.lessons).filter(x => x.id !== id));
      render();
    };

    const newLesson = () => {
      openModal({
        title: "Create New Lesson",
        bodyHTML: `
          <label>Lesson Title</label>
          <input id="mTitle" placeholder="Enter lesson title" />
          <div class="mfGrid">
            <div>
              <label>Students</label>
              <input id="mStudents" type="number" value="0" />
            </div>
            <div>
              <label>Status</label>
              <select id="mStatus">
                <option>Published</option>
                <option>Scheduled</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </div>
          </div>
        `,
        onOk: (wrap) => {
          const title = wrap.querySelector("#mTitle").value.trim();
          if (!title) return alert("Title is required");
          const lesson = {
            id: "L" + Math.random().toString(16).slice(2,6).toUpperCase(),
            title,
            students: Number(wrap.querySelector("#mStudents").value || 0),
            last: nowLabel(),
            status: wrap.querySelector("#mStatus").value
          };
          const all = read(DB_KEYS.lessons);
          all.unshift(lesson);
          write(DB_KEYS.lessons, all);
          render();
        }
      });
    };

    createBtn?.addEventListener("click", () => newLesson());
    bindSearch(root, render);
    // tabs are already toggled active by layout.js; we only re-render.
    root.querySelectorAll(`.tab[data-tab="${tabGroup}"]`).forEach(t => t.addEventListener("click", render));

    render();
  }

  // ---------- Assignments ----------
  function initAssignments() {
    const root = document.getElementById("content");
    const tbody = root?.querySelector("tbody");
    if (!tbody) return;

    const tabGroup = "assign";
    const createBtn = root.querySelector("button.btn");

    const render = () => {
      const tab = getActiveTab(root, tabGroup, "all");
      const q = getSearchQuery(root);

      let data = read(DB_KEYS.assignments);

      if (tab === "active") data = data.filter(x => x.status === "Published");
      if (tab === "drafts") data = data.filter(x => x.status === "Draft");
      if (tab === "archived") data = data.filter(x => x.status === "Archived");

      if (q) data = data.filter(x => (x.title || "").toLowerCase().includes(q));

      tbody.innerHTML = data.map(x => `
        <tr data-id="${x.id}">
          <td><span class="check on">✓</span></td>
          <td>${escapeHtml(x.title)}</td>
          <td>${escapeHtml(x.due)}</td>
          <td>${escapeHtml(x.submissions)}</td>
          <td><span class="pill ${statusToPillClass(x.status)}">${escapeHtml(x.status)}</span></td>
          <td>
            <div class="rowActions">
              <button class="editBtn">✎ Edit</button>
              <button class="kebab">•••</button>
              <button class="dangerBtn" title="Delete">🗑</button>
            </div>
          </td>
        </tr>
      `).join("");

      tbody.querySelectorAll("tr").forEach(tr => {
        const id = tr.dataset.id;
        tr.querySelector(".editBtn")?.addEventListener("click", () => editAssign(id));
        tr.querySelector(".dangerBtn")?.addEventListener("click", () => delAssign(id));
        tr.querySelector(".kebab")?.addEventListener("click", (e) => openKebabMenu(e.currentTarget, id));
      });
    };

    const openKebabMenu = (btn, id) => {
      closeAnyMenu();
      const menu = document.createElement("div");
      menu.className = "mfMenu";
      menu.innerHTML = `
        <button type="button" data-act="view">View details</button>
        <button type="button" data-act="duplicate">Duplicate</button>
      `;
      document.body.appendChild(menu);

      const rect = btn.getBoundingClientRect();
      menu.style.left = Math.max(8, rect.left - 120) + "px";
      menu.style.top = (rect.bottom + 8) + "px";

      menu.addEventListener("click", (e) => {
        const b = e.target.closest("button[data-act]");
        if (!b) return;
        const act = b.dataset.act;
        if (act === "view") viewAssign(id);
        if (act === "duplicate") duplicateAssign(id);
        closeAnyMenu();
      });

      window.__mfMenu = menu;
      setTimeout(() => document.addEventListener("click", closeAnyMenu, { once:true }), 0);
    };

    const closeAnyMenu = () => {
      if (window.__mfMenu) {
        window.__mfMenu.remove();
        window.__mfMenu = null;
      }
    };

    const viewAssign = (id) => {
      const item = read(DB_KEYS.assignments).find(x => x.id === id);
      if (!item) return;
      openModal({
        title: "Assignment Details",
        okText: "Close",
        bodyHTML: `
          <p style="margin:0 0 8px"><b>${escapeHtml(item.title)}</b></p>
          <p style="margin:0 0 6px">Due: <b>${escapeHtml(item.due)}</b></p>
          <p style="margin:0 0 6px">Status: <b>${escapeHtml(item.status)}</b></p>
          <p style="margin:0">Submissions: <b>${escapeHtml(item.submissions)}</b></p>
        `,
        onOk: () => {}
      });
    };

    const duplicateAssign = (id) => {
      const all = read(DB_KEYS.assignments);
      const item = all.find(x => x.id === id);
      if (!item) return;
      const copy = { ...item, id: "A" + Math.random().toString(16).slice(2,6).toUpperCase(), title: item.title + " (Copy)" };
      all.unshift(copy);
      write(DB_KEYS.assignments, all);
      render();
    };

    const editAssign = (id) => {
      const all = read(DB_KEYS.assignments);
      const item = all.find(x => x.id === id);
      if (!item) return;

      openModal({
        title: "Edit Assignment",
        bodyHTML: `
          <label>Title</label>
          <input id="aTitle" value="${escapeAttr(item.title)}" />
          <div class="mfGrid">
            <div>
              <label>Due Date</label>
              <input id="aDue" value="${escapeAttr(item.due)}" />
            </div>
            <div>
              <label>Status</label>
              <select id="aStatus">
                <option ${item.status==="Published"?"selected":""}>Published</option>
                <option ${item.status==="Scheduled"?"selected":""}>Scheduled</option>
                <option ${item.status==="Draft"?"selected":""}>Draft</option>
                <option ${item.status==="Archived"?"selected":""}>Archived</option>
              </select>
            </div>
          </div>
          <label>Submissions</label>
          <input id="aSubs" value="${escapeAttr(item.submissions)}" />
        `,
        onOk: (wrap) => {
          const title = wrap.querySelector("#aTitle").value.trim();
          if (!title) return alert("Title is required");
          item.title = title;
          item.due = wrap.querySelector("#aDue").value.trim() || item.due;
          item.status = wrap.querySelector("#aStatus").value;
          item.submissions = wrap.querySelector("#aSubs").value.trim() || item.submissions;
          write(DB_KEYS.assignments, all.map(x => x.id === id ? item : x));
          render();
        }
      });
    };

    const delAssign = (id) => {
      if (!confirm("Delete this assignment?")) return;
      write(DB_KEYS.assignments, read(DB_KEYS.assignments).filter(x => x.id !== id));
      render();
    };

    const newAssign = () => {
      openModal({
        title: "Create New Assignment",
        bodyHTML: `
          <label>Title</label>
          <input id="aTitle" placeholder="Enter assignment title" />
          <div class="mfGrid">
            <div>
              <label>Due Date</label>
              <input id="aDue" placeholder="MM/DD/YYYY" />
            </div>
            <div>
              <label>Status</label>
              <select id="aStatus">
                <option>Published</option>
                <option>Scheduled</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </div>
          </div>
          <label>Submissions</label>
          <input id="aSubs" value="0 students" />
        `,
        onOk: (wrap) => {
          const title = wrap.querySelector("#aTitle").value.trim();
          if (!title) return alert("Title is required");
          const a = {
            id: "A" + Math.random().toString(16).slice(2,6).toUpperCase(),
            title,
            due: wrap.querySelector("#aDue").value.trim() || "—",
            submissions: wrap.querySelector("#aSubs").value.trim() || "0 students",
            status: wrap.querySelector("#aStatus").value
          };
          const all = read(DB_KEYS.assignments);
          all.unshift(a);
          write(DB_KEYS.assignments, all);
          render();
        }
      });
    };

    createBtn?.addEventListener("click", () => newAssign());
    bindSearch(root, render);
    root.querySelectorAll(`.tab[data-tab="${tabGroup}"]`).forEach(t => t.addEventListener("click", render));

    render();
  }

  // ---------- Student Reports ----------
  function initReports() {
    const root = document.getElementById("content");
    const tbody = root?.querySelector("tbody");
    if (!tbody) return;

    const tabGroup = "reports";

    const gradeClass = (g) => {
      if (g == null) return "";
      if (g >= 85) return "good";
      if (g >= 70) return "warn";
      return "bad";
    };

    const render = () => {
      const tab = getActiveTab(root, tabGroup, "all");
      const q = getSearchQuery(root);

      let data = read(DB_KEYS.reports);

      if (tab !== "all") data = data.filter(x => x.tag === tab);
      if (q) data = data.filter(x =>
        (x.student||"").toLowerCase().includes(q) ||
        (x.lesson||"").toLowerCase().includes(q) ||
        (x.feedback||"").toLowerCase().includes(q)
      );

      tbody.innerHTML = data.map(x => `
        <tr data-id="${x.id}">
          <td><span class="check on">✓</span></td>
          <td>${escapeHtml(x.student)}</td>
          <td>${escapeHtml(x.lesson)}</td>
          <td class="muted">${escapeHtml(x.feedback)}</td>
          <td><span class="grade ${gradeClass(x.grade)}">${x.grade == null ? "—" : escapeHtml(String(x.grade)) + "%"}</span></td>
          <td><button class="viewBtn">View Report</button></td>
        </tr>
      `).join("");

      tbody.querySelectorAll("tr").forEach(tr => {
        const id = tr.dataset.id;
        tr.querySelector(".viewBtn")?.addEventListener("click", () => viewReport(id));
      });

      const footer = root.querySelector(".tableFooter div");
      if (footer) footer.textContent = `Showing 1 to ${data.length} of ${data.length} reports`;
    };

    const viewReport = (id) => {
      const all = read(DB_KEYS.reports);
      const item = all.find(x => x.id === id);
      if (!item) return;

      openModal({
        title: `Report: ${item.student}`,
        bodyHTML: `
          <p style="margin:0 0 6px">Lesson: <b>${escapeHtml(item.lesson)}</b></p>
          <p style="margin:0 0 10px">Grade: <b>${item.grade == null ? "—" : escapeHtml(String(item.grade)) + "%"}</b></p>
          <label>Feedback</label>
          <textarea id="rFb">${escapeHtml(item.feedback)}</textarea>
        `,
        onOk: (wrap) => {
          item.feedback = wrap.querySelector("#rFb").value.trim();
          write(DB_KEYS.reports, all.map(x => x.id === id ? item : x));
          render();
        }
      });
    };

    bindSearch(root, render);
    root.querySelectorAll(`.tab[data-tab="${tabGroup}"]`).forEach(t => t.addEventListener("click", render));

    render();
  }

  // ---------- Dashboard small interactions ----------
  function initDashboard() {
    const root = document.getElementById("content");
    if (!root) return;

    // Manage account button
    root.querySelector(".manageLink")?.addEventListener("click", () => {
      openModal({
        title: "Manage My Account",
        okText: "Close",
        bodyHTML: `
          <p style="margin:0 0 8px"><b>Demo</b>: This screen will connect to backend later.</p>
          <p style="margin:0">For now, you can edit lessons/assignments/reports from the sidebar.</p>
        `,
        onOk: () => {}
      });
    });

    // Chip view buttons -> navigate to assignments then show view modal when loaded
    root.querySelectorAll("button.chip").forEach(btn => {
      btn.addEventListener("click", () => {
        // Navigate to assignments page
        const navBtn = document.querySelector('.navBtn[data-page="modules/assignments/index.html"]');
        navBtn?.click();
      });
    });

    // Create buttons: navigate to appropriate module
    root.querySelectorAll("button.btn").forEach(btn => {
      const t = (btn.textContent || "").toLowerCase();
      if (t.includes("create new lesson")) {
        btn.addEventListener("click", () => {
          const navBtn = document.querySelector('.navBtn[data-page="modules/manage-lessons/index.html"]');
          navBtn?.click();
          // after navigation, user can click create again; keep simple to avoid timing issues
        });
      }
      if (t.includes("create new assignment")) {
        btn.addEventListener("click", () => {
          const navBtn = document.querySelector('.navBtn[data-page="modules/assignments/index.html"]');
          navBtn?.click();
        });
      }
    });

    // Simple kebab: show a tiny menu
    root.querySelectorAll("button.kebab").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const rect = btn.getBoundingClientRect();
        const menu = document.createElement("div");
        menu.className = "mfMenu";
        menu.innerHTML = `
          <button type="button" data-act="openReports">Open Reports</button>
          <button type="button" data-act="openLessons">Open Lessons</button>
        `;
        document.body.appendChild(menu);
        menu.style.left = Math.max(8, rect.left - 120) + "px";
        menu.style.top = (rect.bottom + 8) + "px";

        const close = () => { menu.remove(); document.removeEventListener("click", close); };
        document.addEventListener("click", close);

        menu.addEventListener("click", (ev) => {
          const act = ev.target.closest("button")?.dataset.act;
          if (act === "openReports") document.querySelector('.navBtn[data-page="modules/student-reports/index.html"]')?.click();
          if (act === "openLessons") document.querySelector('.navBtn[data-page="modules/manage-lessons/index.html"]')?.click();
          close();
        });
      });
    });
  }

  // ---------- Escape helpers ----------
  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replaceAll("\n", " ");
  }

  // Hook called from layout.js after module HTML is injected
  window.initMentorModule = (pagePath) => {
    seed();

    if (pagePath.includes("modules/manage-lessons")) initManageLessons();
    else if (pagePath.includes("modules/assignments")) initAssignments();
    else if (pagePath.includes("modules/student-reports")) initReports();
    else if (pagePath.includes("modules/dashboard")) initDashboard();
  };
})();
