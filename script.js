const card = document.getElementById("card");
const micBtn = document.getElementById("micBtn");
const eyes = document.querySelectorAll(".eye");
const leftArm = document.querySelector(".arm.left");
const rightArm = document.querySelector(".arm.right");

/* Моргание ОБОИХ глаз */
setInterval(() => {
  eyes.forEach(e => e.style.height = "6px");
  setTimeout(() => {
    eyes.forEach(e => e.style.height = "42px");
  }, 180);
}, 2500);

/* Ответы */
const answers = {
  "привет": "Привет! Я рад тебя слышать 😊",
  "как дела": "У меня всё отлично 💙",
  "что ты умеешь": "Я слушаю тебя и отвечаю жестами ✨",
  "сколько тебе лет": "Я ещё очень молодой робот 🤖",
  "ты милый": "Спасибо! Мне приятно 🥹",
  "пока": "Пока! Возвращайся 💫"
};

function respond(text) {
  card.textContent = text;

  rightArm.style.transform = "rotate(25deg)";
  leftArm.style.transform = "rotate(-15deg)";
  setTimeout(() => {
    rightArm.style.transform = "rotate(0deg)";
    leftArm.style.transform = "rotate(0deg)";
  }, 500);
}

/* 🎤 Голос */
micBtn.onclick = () => {
  if (!("webkitSpeechRecognition" in window)) {
    respond("Голос не поддерживается 😢");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "ru-RU";
  recognition.start();

  respond("Я слушаю тебя… 🎧");

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    respond(answers[text] || "Я пока не знаю, но учусь 💭");
  };
};
