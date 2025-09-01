const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Fake ban list in memory (replace with database if needed)
let bannedUsers = new Set();

// Ban endpoint
app.post("/ban", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  bannedUsers.add(userId);
  console.log(`✅ User banned: ${userId}`);
  res.status(200).json({ success: true, userId });
});

// Unban endpoint
app.post("/unban", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  bannedUsers.delete(userId);
  console.log(`✅ User unbanned: ${userId}`);
  res.status(200).json({ success: true, userId });
});

// Check if user is banned (for Roblox side)
app.get("/isBanned/:userId", (req, res) => {
  const userId = req.params.userId;
  const isBanned = bannedUsers.has(userId);
  res.json({ userId, banned: isBanned });
});

app.listen(PORT, () => {
  console.log(`🌐 Ban server running on port ${PORT}`);
});
