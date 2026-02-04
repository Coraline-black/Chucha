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
    face.style.transform = "rotate(15deg)";
    setTimeout(() => face.style.transform = "rotate(-15deg)", 300);
    setTimeout(() => face.style.transform = "rotate(0deg)", 600);
  } else {
    face.style.transform = "rotate(20deg)";
    setTimeout(() => face.style.transform = "rotate(-20deg)", 300);
    setTimeout(() => face.style.transform = "rotate(0deg)", 600);
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

// === НАСТОЯЩИЙ ИИ ===
async function askAI(message) {
  const apiKey = "ТВОЙ_API_KEY_ЗДЕСЬ"; // вставь свой ключ OpenAI
  try {
    // Сразу показываем "думаю" на табличке
    respond("💭 Думаю…");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Ты дружелюбный робот-друг. Отвечай через табличку и жесты. Никогда не говори вслух." },
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

    // Если не нужно отвечать
    if (!shouldRespond(text)) {
      nodHead(false); // качает головой отрицательно
      card.textContent = "💭 Я пока молчу…";
      return;
    }

    nodHead(true); // кивает
    respond("💭 Думаю…");

    // Получаем ответ от ИИ
    const answer = await askAI(text);

    // Показываем на табличке
    setTimeout(() => respond(answer), 400);
  };
};
