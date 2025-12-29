const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const roomNameEl = document.getElementById("roomName");

roomNameEl.textContent = ROOM_NAME;

function addMessage(sender, text, cls) {
  const div = document.createElement("div");
  div.className = "msg " + cls;
  div.innerHTML = `<b>${sender}:</b> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function askAI(prompt) {
  addMessage("Bot", "Sedang mengetik...", "bot");

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": location.href,
        "X-Title": "Room Chat AI"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: "Kamu adalah bot chat di room publik." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await res.json();
    chatBox.lastChild.remove();

    const reply = data.choices?.[0]?.message?.content || "Tidak ada jawaban.";
    addMessage("Bot", reply, "bot");

  } catch (err) {
    chatBox.lastChild.remove();
    addMessage("Bot", "Error koneksi ke AI.", "bot");
    console.error(err);
  }
}

chatForm.addEventListener("submit", e => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const message = document.getElementById("message").value.trim();
  if (!username || !message) return;

  addMessage(username, message, "user");
  document.getElementById("message").value = "";

  if (message.toLowerCase().includes("@bot")) {
    askAI(message);
  }
});
