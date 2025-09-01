const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let bannedUsers = [];
let kickedUsers = [];
let shutdownFlag = false;

// Ban
app.post("/ban", (req, res) => {
  const { userId } = req.body;
  if (userId && !bannedUsers.includes(userId)) bannedUsers.push(userId);
  console.log("🚫 Banned:", userId);
  res.json({ success: true, bannedUsers });
});

// Unban
app.post("/unban", (req, res) => {
  const { userId } = req.body;
  bannedUsers = bannedUsers.filter((id) => id !== userId);
  console.log("✅ Unbanned:", userId);
  res.json({ success: true, bannedUsers });
});

// Kick
app.post("/kick", (req, res) => {
  const { userId } = req.body;
  if (userId) kickedUsers.push(userId);
  console.log("👢 Kick requested:", userId);
  res.json({ success: true, kickedUsers });
});

// Shutdown
app.post("/shutdown", (req, res) => {
  shutdownFlag = true;
  console.log("🚨 Shutdown triggered!");
  res.json({ success: true, shutdown: true });
});

// Cancel shutdown
app.post("/cancel-shutdown", (req, res) => {
  shutdownFlag = false;
  console.log("🟢 Shutdown cancelled!");
  res.json({ success: true, shutdown: false });
});

// Roblox fetch endpoints
app.get("/bans", (req, res) => res.json(bannedUsers));
app.get("/kicks", (req, res) => {
  const copy = [...kickedUsers];
  kickedUsers = []; // clear after fetch
  res.json(copy);
});
app.get("/shutdown", (req, res) => res.json({ shutdown: shutdownFlag }));

// Root
app.get("/", (req, res) => res.send("✅ Roblox Admin API running"));

app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
