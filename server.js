const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use Render's assigned port OR fallback to 3000 locally
const PORT = process.env.PORT || 3000;

// --- In-memory ban list ---
let bannedUsers = new Set();

// --- Shutdown flag ---
let shutdownFlag = false;

// Root route (for testing)
app.get("/", (req, res) => {
  res.send("✅ Roblox ban/shutdown server is running!");
});

// --- Shutdown endpoints ---
app.get("/shutdown", (req, res) => {
  shutdownFlag = true;
  console.log("⚠️ Shutdown requested!");
  res.send("Shutdown signal sent!");
});

app.get("/shutdownstatus", (req, res) => {
  res.json({ shutdown: shutdownFlag });
});

// --- Ban endpoints ---
app.post("/ban/:userid", (req, res) => {
  const userId = req.params.userid;
  bannedUsers.add(userId);
  console.log(`🚫 User ${userId} banned`);
  res.send(`User ${userId} has been banned.`);
});

app.post("/unban/:userid", (req, res) => {
  const userId = req.params.userid;
  bannedUsers.delete(userId);
  console.log(`✅ User ${userId} unbanned`);
  res.send(`User ${userId} has been unbanned.`);
});

app.get("/banstatus/:userid", (req, res) => {
  const userId = req.params.userid;
  res.json({ banned: bannedUsers.has(userId) });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
