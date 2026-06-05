export default function handler(req, res) {

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

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    return res.status(200).json({
      success: true
    });
  }

  return res.status(200).json({
    status: "API working"
  });
}