const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Store banned users in memory
let bannedUsers = [];

// ✅ Ban a user
app.post("/ban", (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: "UserId required" });
  }
  if (!bannedUsers.includes(userId)) {
    bannedUsers.push(userId);
  }
  console.log(`Banned user: ${userId}`);
  res.json({ success: true });
});

// ✅ Unban a user
app.post("/unban", (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: "UserId required" });
  }
  bannedUsers = bannedUsers.filter((id) => id !== userId);
  console.log(`Unbanned user: ${userId}`);
  res.json({ success: true });
});

// ✅ Get all banned users (used by Roblox Studio)
app.get("/bans", (req, res) => {
  res.json(bannedUsers);
});

// Default root route
app.get("/", (req, res) => {
  res.send("✅ Roblox Ban Server is running");
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
