// === Элементы ===
const card = document.getElementById("card");
const micBtn = document.getElementById("micBtn");
const eyes = document.querySelectorAll(".eye");
const face = document.getElementById("face");
const leftArm = document.querySelector(".arm.left");
const rightArm = document.querySelector(".arm.right");

// === Моргание глаз ===
setInterval(() => {
  eyes.forEach(e => e.style.height = "6px");
  setTimeout(() => eyes.forEach(e => e.style.height = "44px"), 180);
}, 2500);

// === Жесты рук ===
function gesture() {
  rightArm.style.transform = "rotate(25deg)";
  leftArm.style.transform = "rotate(-15deg)";
  setTimeout(() => {
    rightArm.style.transform = "rotate(0deg)";
    leftArm.style.transform = "rotate(0deg)";
  }, 500);
}

// === Кивок / отрицание головой ===
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

// === Табличка + жесты ===
function respond(text) {
  card.textContent = text;
  gesture();
}

// === Проверка, нужно ли отвечать ===
function shouldRespond(text) {
  const triggers = ["покажи", "сколько", "вычисли", "пример", "реши"];
  return triggers.some(word => text.includes(word));
}

// === Настоящий ИИ через OpenAI ===
async function askAI(message) {
  const apiKey = "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";
  try {
    // Сразу показываем "думаю"
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
          { role: "system", content: "Ты дружелюбный робот-друг. Отвечай через табличку и жесты, не говори вслух." },
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

// === Голос ===
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
      nodHead(false);
      card.textContent = "💭 Я пока молчу…";
      return;
    }

    nodHead(true); // кивает
    respond("💭 Думаю…");

    // Получаем ответ от ИИ
    const answer = await askAI(text);
    setTimeout(() => respond(answer), 400);
  };
};
