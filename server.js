const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// =======================
// Ban system
// =======================
let bannedUsers = [];

app.post("/ban", (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: "UserId required" });
  }
  if (!bannedUsers.includes(userId)) {
    bannedUsers.push(userId);
  }
  console.log(`🚫 Banned user: ${userId}`);
  res.json({ success: true });
});

app.post("/unban", (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: "UserId required" });
  }
  bannedUsers = bannedUsers.filter((id) => id !== userId);
  console.log(`✅ Unbanned user: ${userId}`);
  res.json({ success: true });
});

app.get("/bans", (req, res) => {
  res.json(bannedUsers);
});

// =======================
// Shutdown system
// =======================
let shutdownActive = false;

app.post("/shutdown", (req, res) => {
  shutdownActive = true;
  console.log("🚨 Shutdown enabled");
  res.json({ success: true });
});

app.post("/unshutdown", (req, res) => {
  shutdownActive = false;
  console.log("✅ Shutdown disabled");
  res.json({ success: true });
});

app.get("/shutdown", (req, res) => {
  res.json({ shutdown: shutdownActive });
});

// Root route
app.get("/", (req, res) => {
  res.send("✅ Roblox Admin Server is running");
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
