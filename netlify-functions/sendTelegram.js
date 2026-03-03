exports.handler = async (event) => {
  const { message } = JSON.parse(event.body);

  await fetch("https://api.github.com/repos/Sharif31-cloud/buddy-website/dispatches", {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `token ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      event_type: "send_telegram_message",
      client_payload: { message }
    })
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};