const micBtn = document.getElementById("micBtn");
const sendBtn = document.getElementById("sendBtn");
const resetBtn = document.getElementById("resetBtn");
const input = document.getElementById("textInput");
const chatBox = document.getElementById("chatBox");
const topicSelect = document.getElementById("topic");

// ===== Load history =====
let history = JSON.parse(localStorage.getItem("AI_CHAT")) || [];
history.forEach(m => addMessage(m.sender, m.text));

// ===== Speech Recognition =====
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";

// ===== Mic button =====
micBtn.onclick = () => {
  recognition.start();
  micBtn.innerText = "🎧 Listening...";
};

recognition.onresult = (e) => {
  const text = e.results[0][0].transcript;
  processUser(text);
  micBtn.innerText = "🎤 Speak";
};

recognition.onerror = () => {
  alert("Mic error!");
  micBtn.innerText = "🎤 Speak";
};

// ===== Send text =====
sendBtn.onclick = () => {
  const text = input.value.trim();
  if (!text) return;
  processUser(text);
  input.value = "";
};

// ===== Reset =====
resetBtn.onclick = () => {
  chatBox.innerHTML = "";
  history = [];
  localStorage.removeItem("AI_CHAT");
};

// ===== Process user =====
function processUser(text) {
  addMessage("You", text);
  const score = scorePronunciation(text);
  addMessage("System", `Pronunciation score: ${score}%`);

  const reply = aiReply(text, topicSelect.value);
  setTimeout(() => {
    addMessage("AI", reply);
    speak(reply);
  }, 600);

  saveHistory("You", text);
  saveHistory("AI", reply);
}

// ===== Display =====
function addMessage(sender, text) {
  const div = document.createElement("div");
  div.innerHTML = `<b>${sender}:</b> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ===== Save =====
function saveHistory(sender, text) {
  history.push({ sender, text });
  localStorage.setItem("AI_CHAT", JSON.stringify(history));
}

// ===== Fake pronunciation score =====
function scorePronunciation(text) {
  return Math.min(100, 60 + text.length * 2);
}

// ===== AI logic =====
function aiReply(text, topic) {
  text = text.toLowerCase();

  if (topic === "restaurant") {
    if (text.includes("order")) return "What would you like to order?";
    if (text.includes("chicken")) return "Great choice! Anything to drink?";
    return "You can say: I would like to order chicken.";
  }

  if (topic === "travel") {
    if (text.includes("hotel")) return "How many nights will you stay?";
    return "Say: I need a hotel room.";
  }

  if (topic === "job") {
    if (text.includes("experience")) return "Tell me more about your experience.";
    return "Please introduce yourself.";
  }

  return "Good, please continue.";
}

// ===== Text to Speech =====
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}
