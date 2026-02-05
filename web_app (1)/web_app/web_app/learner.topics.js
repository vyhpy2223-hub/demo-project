// learner/assets/js/learner.topics.js
// 4.1 Chọn chủ đề & kịch bản hội thoại

const TOPICS = [
  {
    id: "t1",
    title: "Ordering Coffee",
    level: "A1-A2",
    scripts: [
      { id: "s1", name: "At the counter", lines: ["Hi, can I get a latte?", "Sure. Anything else?", "No, that's all."] },
      { id: "s2", name: "Custom order", lines: ["Can I have it less sweet?", "Of course.", "Thanks!"] },
    ],
  },
  {
    id: "t2",
    title: "Job Interview",
    level: "B1-B2",
    scripts: [
      { id: "s3", name: "Tell me about yourself", lines: ["Tell me about yourself.", "I’m a ...", "Why do you want this role?"] },
      { id: "s4", name: "Strengths & Weaknesses", lines: ["What are your strengths?", "My strengths are...", "What about weaknesses?"] },
    ],
  },
];

function renderTopics(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  // store.js phải có loadLearnerData/saveLearnerData
  const data = typeof loadLearnerData === "function" ? loadLearnerData() : {
    selectedTopicId: "t1",
    selectedScriptId: "s1"
  };

  const selectedTopic = TOPICS.find(t => t.id === data.selectedTopicId) || TOPICS[0];

  el.innerHTML = `
    <div class="card" style="padding:16px">
      <h3 style="margin:0 0 12px">4.1 Chọn chủ đề & kịch bản hội thoại</h3>

      <div style="display:grid;gap:12px">
        ${TOPICS.map(t => `
          <div style="padding:12px;border-radius:14px;border:1px solid #e5e7eb;background:#fff">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
              <div>
                <div style="font-weight:900">${t.title}</div>
                <div style="color:#6b7280;font-weight:800;font-size:13px">
                  Level ${t.level} • ${t.scripts.length} scripts
                </div>
              </div>
              <button class="btn" data-topic="${t.id}">
                ${t.id === selectedTopic.id ? "Đã chọn" : "Chọn"}
              </button>
            </div>

            <div style="margin-top:10px;display:grid;gap:8px">
              ${t.scripts.map(s => `
                <div style="padding:10px;border:1px solid #e5e7eb;border-radius:12px;
                            display:flex;justify-content:space-between;align-items:center;gap:10px">
                  <div><b>${s.name}</b> <span style="color:#6b7280;font-weight:800">(${s.id})</span></div>
                  <button class="btn" data-script="${t.id}:${s.id}">
                    ${(data.selectedTopicId === t.id && data.selectedScriptId === s.id) ? "Đang dùng" : "Dùng"}
                  </button>
                </div>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  // chọn topic
  el.querySelectorAll("[data-topic]").forEach(btn => {
    btn.onclick = () => {
      const tId = btn.getAttribute("data-topic");
      const topic = TOPICS.find(x => x.id === tId) || TOPICS[0];

      const d2 = loadLearnerData();
      d2.selectedTopicId = topic.id;
      d2.selectedScriptId = topic.scripts[0].id;
      saveLearnerData(d2);

      renderTopics(containerId);
    };
  });

  // chọn script
  el.querySelectorAll("[data-script]").forEach(btn => {
    btn.onclick = () => {
      const [tId, sId] = btn.getAttribute("data-script").split(":");

      const d2 = loadLearnerData();
      d2.selectedTopicId = tId;
      d2.selectedScriptId = sId;
      saveLearnerData(d2);

      renderTopics(containerId);
    };
  });
}
