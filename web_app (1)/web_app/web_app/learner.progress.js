// assets/js/learner.progress.js
function calcStreak(logs) {
  const set = new Set(logs.map(x=>x.date));
  let streak = 0;
  let d = new Date();
  while (true) {
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    const key = `${d.getFullYear()}-${mm}-${dd}`;
    if (!set.has(key)) break;
    streak++;
    d.setDate(d.getDate()-1);
  }
  return streak;
}

function lastNDays(n=35){
  const arr=[];
  const d=new Date();
  for(let i=0;i<n;i++){
    const x=new Date(d);
    x.setDate(d.getDate()-i);
    const mm=String(x.getMonth()+1).padStart(2,"0");
    const dd=String(x.getDate()).padStart(2,"0");
    arr.push(`${x.getFullYear()}-${mm}-${dd}`);
  }
  return arr.reverse();
}

function renderProgress(containerId="learnerProgress") {
  const el = document.getElementById(containerId);
  if (!el) return;

  const data = loadLearnerData();
  const logs = data.practiceLogs;

  const streak = calcStreak(logs);
  const totalMin = logs.reduce((s,x)=>s+(x.minutes||0),0);

  // heatmap đơn giản 5 tuần x 7 ngày
  const days = lastNDays(35);
  const map = new Map();
  logs.forEach(x=> map.set(x.date, (map.get(x.date)||0) + (x.minutes||0)));

  const cells = days.map(d=>{
    const v = map.get(d) || 0;
    const alpha = Math.min(0.85, 0.08 + v/40);
    return `<div title="${d}: ${v} phút"
      style="width:14px;height:14px;border-radius:4px;border:1px solid rgba(229,231,235,.9);
      background:rgba(79,110,247,${alpha});"></div>`;
  }).join("");

  // trend 7 ngày gần nhất (chỉ demo text)
  const last7 = lastNDays(7).map(d=>map.get(d)||0);
  const avg7 = Math.round(last7.reduce((a,b)=>a+b,0)/7);

  el.innerHTML = `
    <div class="card">
      <h2>4.3 Tiến độ (Heatmap • Streak • Trend)</h2>
      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px">
        <div class="tile" style="min-height:auto;flex:1">
          <div style="color:#6b7280;font-weight:900">Streak</div>
          <div style="font-size:28px;font-weight:1000">${streak} 🔥</div>
        </div>
        <div class="tile" style="min-height:auto;flex:1">
          <div style="color:#6b7280;font-weight:900">Total Minutes</div>
          <div style="font-size:28px;font-weight:1000">${totalMin}</div>
        </div>
        <div class="tile" style="min-height:auto;flex:1">
          <div style="color:#6b7280;font-weight:900">Avg (7 days)</div>
          <div style="font-size:28px;font-weight:1000">${avg7} min/day</div>
        </div>
      </div>

      <div class="tile" style="min-height:auto;margin-top:14px">
        <div style="font-weight:1000;margin-bottom:10px">Heatmap (35 ngày)</div>
        <div style="display:grid;grid-template-columns:repeat(7,14px);gap:6px;max-width:max-content">
          ${cells}
        </div>
      </div>
    </div>
  `;
}
