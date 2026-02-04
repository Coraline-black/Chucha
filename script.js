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
    face.style.transform = "rotate(8deg)";
    setTimeout(() => face.style.transform = "rotate(-8deg)", 200);
    setTimeout(() => face.style.transform = "rotate(0deg)", 400);
  } else {
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

// === ПРОВЕРКА, НУЖНО ЛИ ОТВЕЧАТЬ ===
function shouldRespond(text) {
  const triggers = ["покажи", "сколько", "вычисли", "пример", "реши"];
  return triggers.some(word => text.includes(word));
}

// === ОТВЕТ ИИ ===
async function askAI(message) {
  const apiKey = "ТВОЙ_API_KEY_ЗДЕСЬ"; // вставь свой ключ
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Ты дружелюбный робот-друг. Отвечай только через табличку и жесты, не говори вслух." },
          { role: "user", content: message }
        ]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (e) {
    console.error(e);
    return "Ошибка связи с ИИ 💥";
  }
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

  respond("🎧 Я слушаю…");

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript.toLowerCase();

    if (!shouldRespond(text)) {
      nodHead(false); // качаем головой отрицательно
      card.textContent = "💭 Я пока молчу…";
      return;
    }

    nodHead(true); // киваем головой
    respond("Думаю… 💭");

    const answer = await askAI(text);
    setTimeout(() => respond(answer), 600);
  };
};
