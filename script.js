/* ====== Элементы робота ====== */
const card = document.getElementById("card");
const leftArm = document.querySelector(".arm.left");
const rightArm = document.querySelector(".arm.right");
const eyes = document.querySelectorAll(".eye");
const face = document.getElementById("face");
const scene = document.getElementById("scene");

/* ====== Память робота ====== */
let memory = JSON.parse(localStorage.getItem("robotMemory") || "[]");

/* ====== Настройка распознавания речи ====== */
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const rec = new SpeechRecognition();
rec.lang = "ru-RU";

/* ====== Кнопка микрофона ====== */
document.getElementById("listen").onclick = () => {
  thinkAnimation();
  rec.start();
};

/* ====== Обработка распознанной речи ====== */
rec.onresult = async e => {
  const text = e.results[0][0].transcript.toLowerCase();
  console.log("Услышал:", text);

  // Если есть сервер ИИ, можно использовать:
  // const answer = await askAI(text);
  // memorize(text, answer, "happy");

  // Для локальных ответов пока используем мозг
  brain(text);
};

/* ====== Показ картонок ====== */
function showCard(text, time = 3000) {
  card.innerText = text;
  card.style.display = "block";
  card.style.opacity = 1;
  raiseHands();
  setTimeout(() => {
    card.style.opacity = 0;
    setTimeout(() => card.style.display = "none", 500);
    resetPose();
  }, time);
}

/* ====== Поднимаем руки ====== */
function raiseHands() {
  leftArm.style.transform = "rotate(-60deg)";
  rightArm.style.transform = "rotate(60deg)";
  leftArm.classList.add("raise");
  rightArm.classList.add("raise");
}

/* ====== Опускаем руки ====== */
function resetPose() {
  leftArm.style.transform = "rotate(0deg)";
  rightArm.style.transform = "rotate(0deg)";
  leftArm.classList.remove("raise");
  rightArm.classList.remove("raise");
}

/* ====== Анимация глаз «думает» ====== */
function thinkAnimation() {
  eyes.forEach(e => e.style.transform = "scale(0.6)");
  setTimeout(() => eyes.forEach(e => e.style.transform = "scale(1)"), 800);
}

/* ====== Смена лица робота ====== */
function changeFace(emotion) {
  const faces = {
    happy: "https://i.pinimg.com/originals/4c/10/2e/4c102e2fdd68d3f2ad515a7ef44a9c8b.png",
    sad: "https://i.pinimg.com/originals/35/33/13/35331317b10e6a8fa44c6f8655b36b18.png",
    surprised: "https://i.pinimg.com/originals/25/4b/ab/254bab80e51f6f450d7c6d3f5f95c456.png"
  };
  face.src = faces[emotion] || faces.happy;
}

/* ====== Показ сцен ====== */
function showScene(name, time = 3000) {
  const scenes = {
    rain: "https://i.pinimg.com/originals/15/67/9e/15679e6f50c8b6c1f607fe7c8f7f6a1b.png",
    sun: "https://i.pinimg.com/originals/27/11/3a/27113a8e74f2e6b8d9bcd25f68e2d8c0.png"
  };
  scene.src = scenes[name] || "";
  if (!scene.src) return;
  scene.style.display = "block";
  scene.style.opacity = 1;
  setTimeout(() => {
    scene.style.opacity = 0;
    setTimeout(() => scene.style.display = "none", 500);
  }, time);
}

/* ====== Локальный мозг робота ====== */
function brain(text) {
  // Проверка памяти
  for (let i = 0; i < memory.length; i++) {
    if (text.includes(memory[i].question)) {
      if(memory[i].scene) showScene(memory[i].scene);
      if(memory[i].emotion) changeFace(memory[i].emotion);
      return showCard(memory[i].answer);
    }
  }

  let emotion = "happy";

  // Простая математика
  if (text.match(/\d+/g)) {
    let nums = text.match(/\d+/g).map(Number);
    if (text.includes("плюс")) return memorize(text, nums[0]+nums[1], emotion);
    if (text.includes("минус")) return memorize(text, nums[0]-nums[1], emotion);
    if (text.includes("умнож")) return memorize(text, nums[0]*nums[1], emotion);
    if (text.includes("дел")) return memorize(text, nums[0]/nums[1], emotion);
  }

  // Время
  if (text.includes("время")) return memorize(text, new Date().toLocaleTimeString().slice(0,5), emotion);

  // Эмоции и простые слова
  if (text.includes("привет")) { emotion="happy"; return memorize(text,"👋",emotion); }
  if (text.includes("люб")) { emotion="happy"; return memorize(text,"💖",emotion); }
  if (text.includes("груст")) { emotion="sad"; return memorize(text,"😔",emotion); }
  if (text.includes("счаст")) { emotion="happy"; return memorize(text,"😊",emotion); }

  // Сцены
  if (text.includes("дождь")) { showScene("rain"); emotion="surprised"; return memorize(text,"☔",emotion); }
  if (text.includes("солнце")) { showScene("sun"); emotion="happy"; return memorize(text,"☀️",emotion); }

  // Не понял
  emotion="surprised";
  memorize(text,"❓",emotion);
}

/* ====== Память робота ====== */
function memorize(question, answer, emotion) {
  memory.push({question, answer, emotion});
  localStorage.setItem("robotMemory", JSON.stringify(memory));
  changeFace(emotion);
  return showCard(answer);
}

/* ====== Пример функции запроса к ИИ (опционально) ======
async function askAI(question) {
  try {
    const res = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({question})
    });
    const data = await res.json();
    return data.answer;
  } catch {
    return "Ошибка подключения к ИИ";
  }
}
*/
