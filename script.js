// === script.js ===

// Моргаем глазами
setInterval(() => {
  document.querySelectorAll('.eye').forEach(eye => {
    eye.style.height = Math.random() > 0.5 ? '30px' : '5px';
  });
}, 2000);

// Функция показа текста на картонке
function showCard(text) {
  const card = document.getElementById("card");
  card.textContent = text;

  // Рука машет
  const arm = document.querySelector('.arm.right');
  arm.style.transform = 'rotate(20deg)';
  setTimeout(() => arm.style.transform = 'rotate(0deg)', 500);
}

// Пример реакции на кнопку
document.getElementById("speakBtn").addEventListener("click", () => {
  const phrases = [
    "Привет! 😊",
    "Как дела? 🤗",
    "Я люблю помогать! 💖",
    "Сейчас покажу что-то интересное!"
  ];
  const random = phrases[Math.floor(Math.random() * phrases.length)];
  showCard(random);
});
