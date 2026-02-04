// Получаем элементы
const face = document.getElementById("face");
const card = document.getElementById("card");
const rightArm = document.querySelector('.arm.right');
const leftArm = document.querySelector('.arm.left');

// Моргаем глазами каждые 2 секунды
setInterval(() => {
  document.querySelectorAll('.eye').forEach(eye => {
    eye.style.height = Math.random() > 0.5 ? '35px' : '5px';
  });
}, 2000);

// Функция показа текста на картонке с эмоцией
function showCard(text, emotion="happy") {
  card.textContent = text;

  // Устанавливаем эмоцию лица
  face.className = emotion;

  // Руки машут
  rightArm.style.transform = 'rotate(20deg)';
  leftArm.style.transform = 'rotate(-15deg)';
  setTimeout(() => {
    rightArm.style.transform = 'rotate(0deg)';
    leftArm.style.transform = 'rotate(0deg)';
  }, 500);
}

// Кнопка случайных фраз
document.getElementById("speakBtn").addEventListener("click", () => {
  const phrases = [
    {text:"Привет! 😊", emotion:"happy"},
    {text:"Как дела? 🤗", emotion:"happy"},
    {text:"Мне грустно 😢", emotion:"sad"},
    {text:"Ух ты! 😲", emotion:"surprised"},
    {text:"Я очень рад тебя видеть! 😍", emotion:"happy"}
  ];
  const random = phrases[Math.floor(Math.random()*phrases.length)];
  showCard(random.text, random.emotion);
});
