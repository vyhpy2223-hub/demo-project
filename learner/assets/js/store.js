// learner/assets/js/store.js
const LS_KEY = "AES_LEARNER_DATA_v1";

function loadLearnerData() {
  const empty = {
    selectedTopicId: "t1",
    selectedScriptId: "s1",
    practiceLogs: [],      // {date:'YYYY-MM-DD', minutes:number, score:number}
    moodLogs: [],          // {date:'YYYY-MM-DD', mood:1..5, note?:string}
    weeklyReports: [],     // {week:'YYYY-WW', minutes:number, scoreAvg:number}
    monthlyReports: [],    // {month:'YYYY-MM', minutes:number, scoreAvg:number}
    challenges: { points: 120, badges: ["Starter"], rank: 12 }
  };
  try {
    return { ...empty, ...(JSON.parse(localStorage.getItem(LS_KEY)) || {}) };
  } catch {
    return empty;
  }
}

function saveLearnerData(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
