const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let bans = [];
let locks = false;
let announces = [];
let globalChats = [];
let chatSpyEnabled = false;
let trolls = {}; // { userId: {freeze: true, blind: true, spin: true, ...} }

function ensurePlayer(userId) {
  if (!trolls[userId]) trolls[userId] = {};
  return trolls[userId];
}

// --- Ban system ---
app.get("/bans", (req, res) => res.json(bans));
app.post("/ban", (req, res) => {
  const { userId } = req.body;
  if (!bans.includes(userId)) bans.push(userId);
  res.json({ success: true });
});
app.post("/unban", (req, res) => {
  const { userId } = req.body;
  bans = bans.filter(id => id !== userId);
  res.json({ success: true });
});

// --- Lock system ---
app.get("/lock", (req, res) => res.json({ locked: locks }));
app.post("/lock", (req, res) => { locks = true; res.json({ success: true }); });
app.post("/unlock", (req, res) => { locks = false; res.json({ success: true }); });

// --- Announce system ---
app.get("/announces", (req, res) => res.json(announces));
app.post("/announce", (req, res) => {
  const { message } = req.body;
  announces.push(message);
  res.json({ success: true });
});

// --- Global chat ---
app.get("/globalchats", (req, res) => res.json(globalChats));
app.post("/globalchat", (req, res) => {
  const { message } = req.body;
  globalChats.push(message);
  res.json({ success: true });
});

// --- ChatSpy ---
app.get("/chatspy", (req, res) => res.json({ enabled: chatSpyEnabled }));
app.post("/chatspyon", (req, res) => { chatSpyEnabled = true; res.json({ success: true }); });
app.post("/chatspyoff", (req, res) => { chatSpyEnabled = false; res.json({ success: true }); });

// --- Troll commands ---
app.get("/trolls", (req, res) => res.json(trolls));
app.post("/troll", (req, res) => {
  const { userId, effect, state } = req.body;
  const player = ensurePlayer(userId);
  player[effect] = state;
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
