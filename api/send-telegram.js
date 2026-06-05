export default function handler(req, res) {
  return res.status(200).json({
    version: "test123"
  });
}