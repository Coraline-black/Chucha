// === ЭЛЕМЕНТЫ ===
const card = document.getElementById("card");
const micBtn = document.getElementById("micBtn");
const eyes = document.querySelectorAll(".eye");
const face = document.getElementById("face");
const leftArm = document.querySelector(".arm.left");
const rightArm = document.querySelector(".arm.right");

// === МОРГАНИЕ ГЛАЗ ===
setInterval(() => {
  eyes.forEach(e => e.style.height = "6px");
  setTimeout(() => {
    eyes.forEach(e => e.style.height = "44px");
  }, 180);
}, 2500);

// === ЖЕСТ РУКАМИ ===
function gesture() {
  rightArm.style.transform = "rotate(25deg)";
  leftArm.style.transform = "rotate(-15deg)";
  setTimeout(() => {
    rightArm.style.transform = "rotate(0deg)";
    leftArm.style.transform = "rotate(0deg)";
  }, 500);
}

// === КИВОК / ОТРИЦАНИЕ ГОЛОВОЙ ===
function nodHead(isYes) {
  if (isYes) {
    // кивок
    face.style.transform = "rotate(8deg)";
    setTimeout(() => face.style.transform = "rotate(-8deg)", 200);
    setTimeout(() => face.style.transform = "rotate(0deg)", 400);
  } else {
    // отрицание
    face.style.transform = "rotate(15deg)";
    setTimeout(() => face.style.transform = "rotate(-15deg)", 200);
    setTimeout(() => face.style.transform = "rotate(0deg)", 400);
  }
}

// === ПОКАЗ НА КАРТОНКЕ ===
function respond(text) {
  card.textContent = text;
  gesture();
}

// === НУЖНО ЛИ ОТВЕЧАТЬ ===
function shouldRespond(text) {
  const triggers = [
    "сколько", "реши", "пример", "посчитай",
    "+", "-", "*", "/"
  ];
  return triggers.some(word => text.includes(word));
}

// === ПРОСТОЕ ОБЩЕНИЕ (КАК ДРУГ) ===
function friendlyTalk(text) {
  if (text.includes("привет")) return "Привет 🙂 Я рад тебя видеть";
  if (text.includes("как дела")) return "У меня всё хорошо 💗 А у тебя?";
  if (text.includes("ты кто")) return "Я твой робот-друг 🤖";
  if (text.includes("ты милый")) return "Спасибо… мне приятно 💞";
  if (text.includes("пока")) return "Пока! Я буду здесь 🌟";
  return null;
}

// === РЕШЕНИЕ ПРИМЕРОВ ===
function solveMath(text) {
  const match = text.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
  if (!match) return null;

  const a = Number(match[1]);
  const op = match[2];
  const b = Number(match[3]);

  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b !== 0 ? a / b : "∞";
  }
  return null;
}

// === ГОЛОС ===
micBtn.onclick = () => {
  if (!("webkitSpeechRecognition" in window)) {
    respond("Голос не поддерживается 😢");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "ru-RU";
  recognition.start();

  card.textContent = "🎧 Я слушаю…";

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();

    // 1️⃣ Пример
    if (shouldRespond(text)) {
      nodHead(true);
      const result = solveMath(text);
      if (result !== null) {
        setTimeout(() => respond(`Ответ: ${result}`), 500);
        return;
      }
    }

    // 2️⃣ Общение
    const friendAnswer = friendlyTalk(text);
    if (friendAnswer) {
      nodHead(true);
      setTimeout(() => respond(friendAnswer), 500);
      return;
    }

    // 3️⃣ Ничего не делаем
    nodHead(false);
    card.textContent = "💭 Я пока просто слушаю";
  };
};
