const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// In-memory storage
let bannedUsers = [];
let frozenUsers = [];
let mutedUsers = [];
let shutdownFlag = false;
let lockFlag = false;
let announceMessage = "";
let globalChatMessage = "";

// ===== BAN ROUTES =====
app.get("/bans", (req, res) => res.json(bannedUsers));
app.post("/ban", (req, res) => {
  const { userId } = req.body;
  if (userId && !bannedUsers.includes(userId)) bannedUsers.push(userId);
  res.json({ success: true, bannedUsers });
});
app.post("/unban", (req, res) => {
  const { userId } = req.body;
  bannedUsers = bannedUsers.filter((id) => id !== userId);
  res.json({ success: true, bannedUsers });
});

// ===== FREEZE ROUTES =====
app.get("/frozen", (req, res) => res.json(frozenUsers));
app.post("/freeze", (req, res) => {
  const { userId } = req.body;
  if (userId && !frozenUsers.includes(userId)) frozenUsers.push(userId);
  res.json({ success: true, frozenUsers });
});
app.post("/unfreeze", (req, res) => {
  const { userId } = req.body;
  frozenUsers = frozenUsers.filter((id) => id !== userId);
  res.json({ success: true, frozenUsers });
});

// ===== MUTE ROUTES =====
app.get("/muted", (req, res) => res.json(mutedUsers));
app.post("/mute", (req, res) => {
  const { userId } = req.body;
  if (userId && !mutedUsers.includes(userId)) mutedUsers.push(userId);
  res.json({ success: true, mutedUsers });
});
app.post("/unmute", (req, res) => {
  const { userId } = req.body;
  mutedUsers = mutedUsers.filter((id) => id !== userId);
  res.json({ success: true, mutedUsers });
});

// ===== SHUTDOWN =====
app.get("/shutdown", (req, res) => res.json({ shutdown: shutdownFlag }));
app.post("/shutdown", (req, res) => {
  shutdownFlag = true;
  res.json({ success: true });
});
app.post("/cancel-shutdown", (req, res) => {
  shutdownFlag = false;
  res.json({ success: true });
});

// ===== LOCK =====
app.get("/lock", (req, res) => res.json({ locked: lockFlag }));
app.post("/lock", (req, res) => {
  lockFlag = true;
  res.json({ success: true });
});
app.post("/unlock", (req, res) => {
  lockFlag = false;
  res.json({ success: true });
});

// ===== ANNOUNCE =====
app.get("/announce", (req, res) => res.json({ message: announceMessage }));
app.post("/announce", (req, res) => {
  const { message } = req.body;
  announceMessage = message || "";
  res.json({ success: true, announceMessage });
});

// ===== GLOBAL CHAT =====
app.get("/globalchat", (req, res) => res.json({ message: globalChatMessage }));
app.post("/globalchat", (req, res) => {
  const { message } = req.body;
  globalChatMessage = message || "";
  res.json({ success: true, globalChatMessage });
});

// ===== START =====
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
