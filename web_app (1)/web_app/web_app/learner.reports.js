// assets/js/learner.reports.js
function renderReports(containerId="learnerReports") {
  const el = document.getElementById(containerId);
  if (!el) return;

  const data = loadLearnerData();
  const logs = data.practiceLogs;

  function summary(days){
    const now = new Date();
    const from = new Date();
    from.setDate(now.getDate()-days+1);
    const fromStr = from.toISOString().slice(0,10);

    const slice = logs.filter(x=>x.date >= fromStr);
    const total = slice.reduce((s,x)=>s+(x.minutes||0),0);
    const avgScore = slice.length ? Math.round(slice.reduce((s,x)=>s+(x.score||0),0)/slice.length) : 0;
    return { count:slice.length, total, avgScore, fromStr };
  }

  const w = summary(7);
  const m = summary(30);

  el.innerHTML = `
    <div class="card">
      <h2>4.4 Báo cáo tuần / tháng</h2>

      <div style="display:grid;gap:12px;margin-top:10px">
        <div class="tile" style="min-height:auto">
          <div style="font-weight:1000">Weekly Report (7 ngày từ ${w.fromStr})</div>
          <div style="color:#6b7280;font-weight:850;margin-top:6px">
            Sessions: <b>${w.count}</b> • Total minutes: <b>${w.total}</b> • Avg score: <b>${w.avgScore}</b>
          </div>
          <button class="btn" id="btnWeekly" style="margin-top:10px">Đánh dấu “Đã nhận báo cáo tuần”</button>
        </div>

        <div class="tile" style="min-height:auto">
          <div style="font-weight:1000">Monthly Report (30 ngày)</div>
          <div style="color:#6b7280;font-weight:850;margin-top:6px">
            Sessions: <b>${m.count}</b> • Total minutes: <b>${m.total}</b> • Avg score: <b>${m.avgScore}</b>
          </div>
          <button class="btn" id="btnMonthly" style="margin-top:10px">Đánh dấu “Đã nhận báo cáo tháng”</button>
        </div>
      </div>

      <div id="reportMsg" style="margin-top:10px;color:#0f766e;font-weight:900"></div>
    </div>
  `;

  el.querySelector("#btnWeekly").onclick = ()=>{
    const d2 = loadLearnerData();
    d2.reports.weeklySentAt = new Date().toISOString();
    saveLearnerData(d2);
    el.querySelector("#reportMsg").textContent = "✅ Đã đánh dấu nhận báo cáo tuần.";
  };
  el.querySelector("#btnMonthly").onclick = ()=>{
    const d2 = loadLearnerData();
    d2.reports.monthlySentAt = new Date().toISOString();
    saveLearnerData(d2);
    el.querySelector("#reportMsg").textContent = "✅ Đã đánh dấu nhận báo cáo tháng.";
  };
}
