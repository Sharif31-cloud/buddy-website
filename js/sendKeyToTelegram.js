// sendKey.js
const fetch = require('node-fetch'); // Node.js <18

const key = process.env.SHARE_KEY;
const userId = process.env.USER_ID;

if (!key || !userId) {
    console.error("Error: SHARE_KEY or USER_ID not set!");
    process.exit(1);
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

if (!BOT_TOKEN || !CHANNEL_ID) {
    console.error("Error: Telegram bot token or channel ID not set!");
    process.exit(1);
}

const message = `🎉 New Share Key Generated!
Key: ${key}
User ID: ${userId}`;

const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHANNEL_ID}&text=${encodeURIComponent(message)}`;

fetch(url)
    .then(res => console.log("Telegram notified", res.status))
    .catch(err => console.error("Telegram error:", err));
