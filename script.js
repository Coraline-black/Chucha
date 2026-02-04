const card = document.getElementById("card");
const micBtn = document.getElementById("micBtn");
const eyes = document.querySelectorAll(".eye");
const leftArm = document.querySelector(".arm.left");
const rightArm = document.querySelector(".arm.right");
const face = document.getElementById("face");

// Моргание глаз
setInterval(() => {
  eyes.forEach(e => e.style.height = "6px");
  setTimeout(() => {
    eyes.forEach(e => e.style.height = "42px");
  }, 180);
}, 2500);

// Жесты рук и головы
function gesture(yes = true) {
  // Руки
  rightArm.style.transform = "rotate(25deg)";
  leftArm.style.transform = "rotate(-15deg)";
  
  // Голова
  face.style.transform = yes ? "rotate(5deg)" : "rotate(-5deg)";
  
  setTimeout(() => {
    rightArm.style.transform = "rotate(0deg)";
    leftArm.style.transform = "rotate(0deg)";
    face.style.transform = "rotate(0deg)";
  }, 500);
}

// Функция отправки текста в Worker
async function askAI(text) {
  try {
    const response = await fetch("https://still-leaf-6d93.damp-glade-283e.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await response.json();
    return data.answer;
  } catch (err) {
    return "Ошибка связи с ИИ 💥";
  }
}

// Основная функция ответа
async function respond(text) {
  // Отправка в AI
  const answer = await askAI(text);
  
  // Показываем на табличке
  card.textContent = answer;

  // Жесты: киваем, если положительно, качаем, если отрицательно
  const lower = answer.toLowerCase();
  if (lower.includes("да") || lower.includes("конечно") || lower.includes("хорошо")) {
    gesture(true);
  } else {
    gesture(false);
  }
}

// Голосовое управление
micBtn.onclick = () => {
  if (!("webkitSpeechRecognition" in window)) {
    respond("Голос не поддерживается 😢");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "ru-RU";
  recognition.start();

  card.textContent = "Я слушаю тебя… 🎧";

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    respond(text);
  };
};
