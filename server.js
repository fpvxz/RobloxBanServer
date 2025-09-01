const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

const BAN_FILE = "bans.json";

// load existing bans from file
let bannedUsers = new Set();
if (fs.existsSync(BAN_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(BAN_FILE, "utf8"));
    bannedUsers = new Set(data);
  } catch (err) {
    console.error("Failed to load bans:", err);
  }
}

// helper to save bans
function saveBans() {
  fs.writeFileSync(BAN_FILE, JSON.stringify([...bannedUsers], null, 2));
}

// shutdown endpoint
app.get("/shutdown", (req, res) => {
  console.log("Shutdown requested!");
  res.send("Shutdown signal sent!");
});

// ban endpoint
app.get("/ban/:userid", (req, res) => {
  const userId = req.params.userid;
  bannedUsers.add(userId);
  saveBans();
  console.log(`User ${userId} banned.`);
  res.send(`User ${userId} banned.`);
});

// unban endpoint
app.get("/unban/:userid", (req, res) => {
  const userId = req.params.userid;
  bannedUsers.delete(userId);
  saveBans();
  console.log(`User ${userId} unbanned.`);
  res.send(`User ${userId} unbanned.`);
});

// endpoint Roblox calls to check bans
app.get("/isBanned/:userid", (req, res) => {
  const userId = req.params.userid;
  if (bannedUsers.has(userId)) {
    res.send("true");
  } else {
    res.send("false");
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
