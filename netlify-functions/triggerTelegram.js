// triggerTelegram.js
export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://api.github.com/repos/Sharif31-cloud/buddy-website/dispatches",
      {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `token ${process.env.GITHUB}`,  // store PAT in GitHub secret or environment
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          event_type: "send_telegram_message",
          client_payload: { message }
        })
      }
    );

    if (!response.ok) throw new Error("Failed to trigger GitHub workflow");

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}