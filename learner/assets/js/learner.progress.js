// learner/assets/js/learner.progress.js
// 4.3 Progress tracking (heatmap, streak, trend) + 4.3b Mood check-in (cảm nhận) - demo

function renderProgress(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const data = loadLearnerData();
  const logs = data.practiceLogs || [];
  const moodLogs = data.moodLogs || [];

  const MOODS = [
    { v: 1, emoji: "😣", label: "Rất khó" },
    { v: 2, emoji: "😕", label: "Khó" },
    { v: 3, emoji: "😐", label: "Bình thường" },
    { v: 4, emoji: "🙂", label: "Ổn" },
    { v: 5, emoji: "😁", label: "Rất tốt" },
  ];

  const upsertMood = ({ date, mood, note }) => {
    const d2 = loadLearnerData();
    d2.moodLogs = Array.isArray(d2.moodLogs) ? d2.moodLogs : [];

    const idx = d2.moodLogs.findIndex((x) => x.date === date);
    const cleanNote = (note || "").trim().slice(0, 280);

    if (idx >= 0) d2.moodLogs[idx] = { ...d2.moodLogs[idx], date, mood, note: cleanNote };
    else d2.moodLogs.push({ date, mood, note: cleanNote });

    saveLearnerData(d2);
    return d2;
  };

  const moodFor = (date) => {
    const d2 = loadLearnerData();
    const arr = Array.isArray(d2.moodLogs) ? d2.moodLogs : [];
    return arr.find((x) => x.date === date) || null;
  };

  // Build last 28 days heatmap
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    const mins = logs
      .filter((x) => x.date === iso)
      .reduce((s, x) => s + (x.minutes || 0), 0);
    days.push({ iso, mins });
  }

  const getStreak = () => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      const mins = logs
        .filter((x) => x.date === iso)
        .reduce((s, x) => s + (x.minutes || 0), 0);
      if (mins > 0) streak++;
      else break;
    }
    return streak;
  };

  const streak = getStreak();
  const totalMin = logs.reduce((s, x) => s + (x.minutes || 0), 0);
  const getToday = () => (typeof todayISO === "function" ? todayISO() : (typeof todayStr === "function" ? todayStr() : (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  })()));

  const today = getToday();
  const todayMood = moodFor(today);

  el.innerHTML = `
    <div class="card" style="padding:16px">
      <h3 style="margin:0 0 12px">Tiến độ &amp; Cảm nhận</h3>

      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <div style="border:1px solid #e5e7eb;border-radius:14px;padding:12px;background:#fff;min-width:220px">
          <div style="color:#6b7280;font-weight:800">Streak</div>
          <div style="font-size:28px;font-weight:1000">${streak} days</div>
        </div>

        <div style="border:1px solid #e5e7eb;border-radius:14px;padding:12px;background:#fff;min-width:220px">
          <div style="color:#6b7280;font-weight:800">Tổng thời gian</div>
          <div style="font-size:28px;font-weight:1000">${totalMin} min</div>
        </div>

        <div style="border:1px solid #e5e7eb;border-radius:14px;padding:12px;background:#fff;min-width:260px">
          <div style="color:#6b7280;font-weight:800">Trend (7 ngày gần nhất)</div>
          <div id="trend" style="font-size:14px;font-weight:900;margin-top:6px"></div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:12px;align-items:start;margin-top:12px">
        <div id="mood" style="border:1px solid #e5e7eb;border-radius:14px;padding:12px;background:#fff">
          <b>Heatmap (28 ngày gần nhất)</b>
          <div id="heatmap" style="margin-top:10px;display:grid;grid-template-columns:repeat(14, 18px);gap:6px"></div>
          <div style="margin-top:10px;color:#6b7280;font-weight:800;font-size:13px">Đậm hơn = luyện tập nhiều phút hơn (demo).</div>
        </div>

        <div style="border:1px solid #e5e7eb;border-radius:14px;padding:12px;background:#fff">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
            <b>Cảm nhận hôm nay</b>
            <div style="color:#6b7280;font-weight:800;font-size:13px">${today}</div>
          </div>

          <div id="moodButtons" style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"></div>
          <textarea id="moodNote" rows="3" placeholder="Ghi chú nhanh (tuỳ chọn)…" style="margin-top:10px;width:100%;resize:vertical;border:1px solid #e5e7eb;border-radius:12px;padding:10px;font-weight:700"></textarea>

          <div style="margin-top:10px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
            <button class="btn" id="btnSaveMood">Lưu cảm nhận</button>
            <div id="moodSaved" style="color:#16a34a;font-weight:900"></div>
          </div>

          <div style="margin-top:12px;border-top:1px dashed #e5e7eb;padding-top:12px">
            <b>Trend cảm nhận (14 ngày)</b>
            <div id="moodTrend" style="margin-top:10px;display:flex;gap:6px;align-items:flex-end;min-height:54px"></div>
            <div style="margin-top:8px;color:#6b7280;font-weight:800;font-size:13px">Mỗi cột = 1 ngày; cao hơn = cảm nhận tốt hơn.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Heatmap coloring
  const maxMin = Math.max(...days.map((d) => d.mins), 1);
  const hm = el.querySelector("#heatmap");
  days.forEach((d) => {
    const intensity = d.mins / maxMin; // 0..1
    const cell = document.createElement("div");
    cell.title = `${d.iso}: ${d.mins} min`;
    cell.style.width = "18px";
    cell.style.height = "18px";
    cell.style.borderRadius = "6px";
    cell.style.border = "1px solid #e5e7eb";
    cell.style.background = `rgba(59,130,246,${0.15 + intensity * 0.75})`; // blue-ish
    hm.appendChild(cell);
  });

  // Trend (practice minutes)
  const last7 = days.slice(-7).map((d) => d.mins);
  el.querySelector("#trend").textContent = last7.map((m, i) => `D${i + 1}:${m}m`).join(" • ");

  // Mood check-in
  let selectedMood = (todayMood && todayMood.mood) || 0;
  const moodButtonsEl = el.querySelector("#moodButtons");
  const noteEl = el.querySelector("#moodNote");
  const savedEl = el.querySelector("#moodSaved");

  if (todayMood && todayMood.note) noteEl.value = todayMood.note;

  const renderMoodButtons = () => {
    moodButtonsEl.innerHTML = "";
    MOODS.forEach((m) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.style.border = "1px solid #e5e7eb";
      btn.style.borderRadius = "12px";
      btn.style.padding = "8px 10px";
      btn.style.background = selectedMood === m.v ? "#111827" : "#fff";
      btn.style.color = selectedMood === m.v ? "#fff" : "#111827";
      btn.style.fontWeight = "1000";
      btn.style.cursor = "pointer";
      btn.title = m.label;
      btn.textContent = `${m.emoji} ${m.v}`;
      btn.onclick = () => {
        selectedMood = m.v;
        savedEl.textContent = "";
        renderMoodButtons();
      };
      moodButtonsEl.appendChild(btn);
    });
  };
  renderMoodButtons();

  el.querySelector("#btnSaveMood").onclick = () => {
    if (!selectedMood) {
      alert("Chọn mức cảm nhận trước khi lưu nhé 😊");
      return;
    }
    upsertMood({ date: today, mood: selectedMood, note: noteEl.value });
    savedEl.textContent = "Đã lưu ✅";
    renderMoodTrend();
  };

  function renderMoodTrend() {
    const d2 = loadLearnerData();
    const arr = Array.isArray(d2.moodLogs) ? d2.moodLogs : [];

    const trendEl = el.querySelector("#moodTrend");
    trendEl.innerHTML = "";

    // last 14 days
    const days14 = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      const m = arr.find((x) => x.date === iso);
      days14.push({ iso, mood: m ? Number(m.mood || 0) : 0, note: m ? m.note || "" : "" });
    }

    days14.forEach((d) => {
      const bar = document.createElement("div");
      bar.style.width = "18px";
      bar.style.borderRadius = "8px";
      bar.style.border = "1px solid #e5e7eb";
      bar.style.height = d.mood ? `${12 + d.mood * 8}px` : "12px";
      bar.style.background = d.mood ? "rgba(16,185,129,0.75)" : "rgba(229,231,235,1)"; // green-ish
      const moodMeta = d.mood ? MOODS.find((x) => x.v === d.mood) : null;
      bar.title = d.mood
        ? `${d.iso}: ${moodMeta ? moodMeta.emoji + " " + moodMeta.label : d.mood}${d.note ? " — " + d.note : ""}`
        : `${d.iso}: chưa ghi cảm nhận`;
      trendEl.appendChild(bar);
    });
  }

  renderMoodTrend();
}
