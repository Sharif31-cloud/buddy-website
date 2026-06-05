export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://sharif31-cloud.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { key, userId } = req.body || {};

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        return res.status(500).json({
          error: "Missing env vars",
          botToken: !!botToken,
          chatId: !!chatId
        });
      }

      const message = `🎁 KEY: ${key} | USER: ${userId}`;

      const tgRes = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message
          })
        }
      );

      const data = await tgRes.json();

      return res.status(200).json({
        success: true,
        telegramResponse: data
      });

    } catch (err) {
      return res.status(500).json({
        error: err.message
      });
    }
  }

  return res.status(200).json({ status: "API working" });
}