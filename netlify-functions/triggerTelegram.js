const fetch = require("node-fetch"); // Netlify supports this

exports.handler = async function(event, context) {
  try {
    const { message } = JSON.parse(event.body);

    // GH_TOKEN from Netlify environment variables
    const token = process.env.GH_TOKEN;
    if (!token) {
      return { statusCode: 500, body: "GH_TOKEN not set in environment variables" };
    }

    const response = await fetch("https://api.github.com/repos/Sharif31-cloud/buddy-website/dispatches", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event_type: "send_telegram_message",
        client_payload: { message }
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return { statusCode: response.status, body: `GitHub API Error: ${text}` };
    }

    return { statusCode: 200, body: "GitHub workflow triggered successfully" };
  } catch (err) {
    return { statusCode: 500, body: `Server Error: ${err.message}` };
  }
};