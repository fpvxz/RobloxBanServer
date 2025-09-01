const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Store data in memory (you could use a DB instead)
let bannedUsers = [];
let frozenUsers = [];
let shutdownFlag = false;

// ================= BAN ROUTES =================
app.get("/bans", (req, res) => {
  res.json(bannedUsers);
});

app.post("/ban", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "UserId required" });
  if (!bannedUsers.includes(userId)) bannedUsers.push(userId);
  res.json({ success: true, bannedUsers });
});

app.post("/unban", (req, res) => {
  const { userId } = req.body;
  bannedUsers = bannedUsers.filter((id) => id !== userId);
  res.json({ success: true, bannedUsers });
});

// ================= FREEZE ROUTES =================
app.get("/frozen", (req, res) => {
  res.json(frozenUsers);
});

app.post("/freeze", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "UserId required" });
  if (!frozenUsers.includes(userId)) frozenUsers.push(userId);
  res.json({ success: true, frozenUsers });
});

app.post("/unfreeze", (req, res) => {
  const { userId } = req.body;
  frozenUsers = frozenUsers.filter((id) => id !== userId);
  res.json({ success: true, frozenUsers });
});

// ================= SHUTDOWN ROUTE =================
app.get("/shutdown", (req, res) => {
  res.json({ shutdown: shutdownFlag });
});

app.post("/shutdown", (req, res) => {
  shutdownFlag = true;
  res.json({ success: true });
});

app.post("/cancel-shutdown", (req, res) => {
  shutdownFlag = false;
  res.json({ success: true });
});

// ================= START =================
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
