function sendKeyToTelegram(key, userId) {
  const message = `🎉 New Share Key Generated!\nKey: ${key}\nUser ID: ${userId}`;

  fetch("/netlify-functions/triggerTelegram.js", { // or your backend endpoint
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to trigger workflow");
    console.log("Telegram workflow triggered successfully ✅");
  })
  .catch(err => console.error("Telegram error ❌", err));
}