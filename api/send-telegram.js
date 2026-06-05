export default async function handler(req, res) {
  // =========================
  // CORS HEADERS
  // =========================
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://sharif31-cloud.github.io"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // =========================
  // MAIN POST LOGIC
  // =========================
  if (req.method === "POST") {
    try {
      const { key, userId } = req.body || {};

      if (!key) {
        return res.status(400).json({
          success: false,
          error: "Missing key"
        });
      }

      const message =
        `🎁 Buddy Reward Key\n\n` +
        `🔑 Key: ${key}\n` +
        `👤 User: ${userId || "unknown"}`;

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        return res.status(500).json({
          success: false,
          error: "Missing Telegram env variables"
        });
      }

      // Send to Telegram
      const telegramRes = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message
          })
        }
      );

      const telegramData = await telegramRes.json();

      return res.status(200).json({
        success: true,
        telegram: telegramData
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

  // =========================
  // DEFAULT RESPONSE
  // =========================
  return res.status(200).json({
    status: "API working"
  });
}