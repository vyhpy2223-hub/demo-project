const recordBtn = document.getElementById('recordBtn');
const conversation = document.getElementById('conversation');
const scoreEl = document.getElementById('score');
const suggestionEl = document.getElementById('suggestion');

let isRecording = false;

recordBtn.addEventListener('click', () => {
    isRecording = !isRecording;
    recordBtn.classList.toggle('recording');

    if (isRecording) {
        recordBtn.innerHTML = '<i class="fas fa-stop"></i> Đang nghe...';
    } else {
        recordBtn.innerHTML = '<i class="fas fa-microphone"></i> Nhấn để nói';
        simulateUserSpeech();
    }
});

function simulateUserSpeech() {
    const userText = "I'd like to order the grilled salmon, please.";

    addBubble(userText, 'user');

    setTimeout(() => {
        aiRespond(userText);
    }, 800);
}

function aiRespond(userText) {
    const aiText = `Great! Câu của bạn rất tự nhiên 👍  
Hãy chú ý phát âm từ "salmon" là /ˈsæmən/.`;

    addBubble(aiText, 'ai');

    // Fake pronunciation score
    const score = Math.floor(85 + Math.random() * 10);
    scoreEl.innerText = `Độ chính xác: ${score}%`;
    suggestionEl.innerText =
        'Gợi ý: Đừng đọc chữ "l" trong "salmon".';
}

function addBubble(text, type) {
    const div = document.createElement('div');
    div.className = `bubble ${type}`;
    div.innerText = text;
    conversation.appendChild(div);
    conversation.scrollTop = conversation.scrollHeight;
}

