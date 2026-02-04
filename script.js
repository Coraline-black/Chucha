const card = document.getElementById("card");
const micBtn = document.getElementById("micBtn");
const eyes = document.querySelectorAll(".eye");
const face = document.getElementById("face");
const leftArm = document.querySelector(".arm.left");
const rightArm = document.querySelector(".arm.right");

// Моргание глаз
setInterval(() => {
  eyes.forEach(e => e.style.height = "6px");
  setTimeout(() => eyes.forEach(e => e.style.height = "42px"), 180);
}, 2500);

// Жесты рук и головы
function gesture(yes = true) {
  rightArm.style.transform = "rotate(25deg)";
  leftArm.style.transform = "rotate(-15deg)";
  face.style.transform = yes ? "rotate(5deg)" : "rotate(-5deg)";
  setTimeout(() => {
    rightArm.style.transform = "rotate(0deg)";
    leftArm.style.transform = "rotate(0deg)";
    face.style.transform = "rotate(0deg)";
  }, 500);
}

// Звонок на твой Worker
async function askAI(text) {
  try {
    const response = await fetch("https://still-leaf-6d93.damp-glade-283e.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await response.json();
    return data.answer;
  } catch {
    return "Ошибка связи с ИИ 💥";
  }
}

// Показываем ответ
async function respond(text) {
  const answer = await askAI(text);
  card.textContent = answer;
  const low = answer.toLowerCase();
  gesture(low.includes("да") || low.includes("хорошо"));
}

// Голос
micBtn.onclick = () => {
  if (!("webkitSpeechRecognition" in window)) {
    card.textContent = "Голос не поддерживается 😢";
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "ru-RU";
  recognition.start();
  card.textContent = "🎧 Я слушаю…";
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    respond(text);
  };
};
