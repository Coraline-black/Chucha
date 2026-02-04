const face = document.getElementById("face");
const card = document.getElementById("card");
const rightArm = document.querySelector('.arm.right');
const leftArm = document.querySelector('.arm.left');
const eyes = document.querySelectorAll('.eye');
const input = document.getElementById("questionInput");
const askBtn = document.getElementById("askBtn");

// Одновременное моргание глаз
setInterval(() => {
  eyes.forEach(e => e.style.height = '5px');
  setTimeout(() => eyes.forEach(e => e.style.height = '35px'), 200);
}, 2000);

// Словарь вопросов и ответов
const answers = {
  "привет": {text: "Привет! 😊", emotion: "happy"},
  "как дела": {text: "У меня всё отлично! 🤗", emotion: "happy"},
  "ты умеешь считать": {text: "Конечно! 2+2=4 😎", emotion: "happy"},
  "как погода": {text: "Я не знаю, но надеюсь, что солнечно! ☀️", emotion: "happy"},
  "ты грустный": {text: "Немного 😢", emotion: "sad"},
  "что ты умеешь": {text: "Я могу отвечать на простые вопросы! 😄", emotion: "happy"},
  "какой твой любимый цвет": {text: "Мой любимый цвет — розовый! 💖", emotion: "happy"},
};

// Функция показа текста и движения рук
function showCard(text, emotion="happy") {
  card.textContent = text;
  face.className = emotion;

  rightArm.style.transform = 'rotate(20deg)';
  leftArm.style.transform = 'rotate(-15deg)';
  setTimeout(() => {
    rightArm.style.transform = 'rotate(0deg)';
    leftArm.style.transform = 'rotate(0deg)';
  }, 500);
}

// Обработка нажатия кнопки
askBtn.addEventListener("click", () => {
  const question = input.value.toLowerCase();
  if(answers[question]){
    showCard(answers[question].text, answers[question].emotion);
  } else {
    showCard("Извини, я не знаю ответа 😅", "surprised");
  }
  input.value = "";
});
