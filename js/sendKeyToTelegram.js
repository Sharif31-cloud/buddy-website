// sendKeyToTelegram.js
async function sendKeyToTelegram(key, userId) {
  const message = `🎉 New Share Key Generated!\nKey: ${key}\nUser ID: ${userId}`;

  try {
    // Step 1: Get the current trigger.json info to get the SHA
    const getResp = await fetch("https://api.github.com/repos/Sharif31-cloud/buddy-website/contents/trigger.json");
    const getData = await getResp.json();
    const sha = getData.sha; // required to update the file

    // Step 2: Update trigger.json with the new message
    const bodyData = {
      message: "Updating trigger for Telegram",
      content: btoa(JSON.stringify({ message })), // encode as base64
      sha: sha
    };

    const putResp = await fetch("https://api.github.com/repos/Sharif31-cloud/buddy-website/contents/trigger.json", {
      method: "PUT",
      headers: {
        "Authorization": `token ${GH_TOKEN}`, // GH_TOKEN should be an env variable in your build/server
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    });

    const result = await putResp.json();
    console.log("GitHub trigger updated ✅", result);

  } catch (err) {
    console.error("GitHub API / Telegram workflow error ❌", err);
  }
}