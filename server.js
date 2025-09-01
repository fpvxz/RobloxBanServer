const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let bans = [];
let freezes = [];
let announcements = [];
let locked = false;
let shutdown = false;
let kicks = [];

// ---------------------- BAN ----------------------
app.get("/bans", (req, res) => res.json(bans));
app.post("/ban", (req, res) => {
  const { userId } = req.body;
  if (!bans.includes(userId)) bans.push(userId);
  res.sendStatus(200);
});
app.post("/unban", (req, res) => {
  const { userId } = req.body;
  bans = bans.filter(id => id !== userId);
  res.sendStatus(200);
});

// ---------------------- KICK ----------------------
app.get("/kicks", (req, res) => {
  res.json(kicks);
  kicks = []; // clear after sending so each kick is one-time
});
app.post("/kick", (req, res) => {
  const { userId } = req.body;
  kicks.push(userId);
  res.sendStatus(200);
});

// ---------------------- FREEZE ----------------------
app.get("/freezes", (req, res) => res.json(freezes));
app.post("/freeze", (req, res) => {
  const { userId } = req.body;
  if (!freezes.includes(userId)) freezes.push(userId);
  res.sendStatus(200);
});
app.post("/unfreeze", (req, res) => {
  const { userId } = req.body;
  freezes = freezes.filter(id => id !== userId);
  res.sendStatus(200);
});

// ---------------------- ANNOUNCE ----------------------
app.get("/announcements", (req, res) => {
  res.json(announcements);
  announcements = []; // clear after delivery
});
app.post("/announce", (req, res) => {
  const { message } = req.body;
  announcements.push(message);
  res.sendStatus(200);
});

// ---------------------- LOCK ----------------------
app.get("/lock", (req, res) => res.json({ locked }));
app.post("/lock", (req, res) => { locked = true; res.sendStatus(200); });
app.post("/unlock", (req, res) => { locked = false; res.sendStatus(200); });

// ---------------------- SHUTDOWN ----------------------
app.get("/shutdown", (req, res) => res.json({ shutdown }));
app.post("/shutdown", (req, res) => { shutdown = true; res.sendStatus(200); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
