// assets/js/store.js
const LS_KEY = "AES_LEARNER_DATA_v1";

function loadLearnerData() {
  const empty = {
    selectedTopicId: null,
    practiceLogs: [],   // {date:'YYYY-MM-DD', minutes:10, score:70, mode:'ai|peer'}
    reports: { weeklySentAt: null, monthlySentAt: null },
    challenges: {
      joined: [],       // challengeId[]
      points: 0,
      badges: []        // strings
    }
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

function todayStr() {
  const d = new Date();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// helper: cộng log luyện tập ngày hôm nay
function addPracticeLog({ minutes=10, score=70, mode="ai" }) {
  const data = loadLearnerData();
  data.practiceLogs.push({ date: todayStr(), minutes, score, mode });
  // điểm thưởng đơn giản
  data.challenges.points += Math.max(1, Math.floor(minutes/5));
  saveLearnerData(data);
  return data;
}

