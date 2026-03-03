// sendKey.js
const fetch = require('node-fetch'); // If using Node.js <18, install via `npm install node-fetch`

/**
 * Send a share key notification to Telegram using secrets from GitHub Actions
 * @param {string} key - The generated share key
 * @param {string|number} userId - The user ID
 */
function sendKeyToTelegram(key, userId) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

    if (!BOT_TOKEN || !CHANNEL_ID) {
        console.error("Error: Telegram bot token or channel ID not set!");
        return;
    }

    const message = `🎉 New Share Key Generated!
Key: ${key}
User ID: ${userId}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHANNEL_ID}&text=${encodeURIComponent(message)}`;

    fetch(url)
        .then(res => console.log("Telegram notified", res.status))
        .catch(err => console.error("Telegram error:", err));
}

// Example usage
const exampleKey = "ABC123XYZ";
const exampleUserId = 98765;
sendKeyToTelegram(exampleKey, exampleUserId);
