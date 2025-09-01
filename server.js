// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== In-memory state =====
let bans = [];                             // [userId]
let locked = false;                        // bool
let shutdown = false;                      // bool

let announces = [];                        // [message]  (one-shot; cleared on GET)
let globalChats = [];                      // [message]  (one-shot; cleared on GET)
let kicks = [];                            // [{userId, reason}] (one-shot; cleared on GET)

let trolls = {};                           // { userId: { freeze, blind, spin, float, fling, loopkill, explodeOnce, smiteOnce, fire, jail } }

let chatSpyEnabled = false;                // bool
let chatSpyLogs = [];                      // [{userId, username, message}] (one-shot; cleared by bot GET)

let servers = new Map();                   // jobId -> { players:[{userId, username}], lastSeen:ts }
const SERVER_TTL_MS = 2 * 60 * 1000;       // keep heartbeat for 2 minutes

function ensurePlayer(userId) {
  const key = String(userId);
  if (!trolls[key]) trolls[key] = {};
  return trolls[key];
}

function pruneServers() {
  const now = Date.now();
  for (const [jobId, info] of servers.entries()) {
    if (now - info.lastSeen > SERVER_TTL_MS) servers.delete(jobId);
  }
}

// ===== Health
app.get("/health", (_, res) => res.json({ ok: true }));

// ===== Bans
app.get("/bans", (_, res) => res.json(bans));
app.post("/ban", (req, res) => {
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: "userId required" });
  if (!bans.includes(String(userId))) bans.push(String(userId));
  res.json({ success: true });
});
app.post("/unban", (req, res) => {
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: "userId required" });
  bans = bans.filter(id => id !== String(userId));
  res.json({ success: true });
});

// ===== Lock / Unlock
app.get("/lock", (_, res) => res.json({ locked }));
app.post("/lock", (_, res) => { locked = true; res.json({ success: true }); });
app.post("/unlock", (_, res) => { locked = false; res.json({ success: true }); });

// ===== Shutdown
app.get("/shutdown", (_, res) => res.json({ shutdown }));
app.post("/shutdown/on", (_, res) => { shutdown = true; res.json({ success: true }); });
app.post("/shutdown/off", (_, res) => { shutdown = false; res.json({ success: true }); });

// ===== Announce / GlobalChat
app.get("/announces", (_, res) => { const out = announces; announces = []; res.json(out); });
app.post("/announce", (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "message required" });
  announces.push(String(message));
  res.json({ success: true });
});

app.get("/globalchats", (_, res) => { const out = globalChats; globalChats = []; res.json(out); });
app.post("/globalchat", (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "message required" });
  globalChats.push(String(message));
  res.json({ success: true });
});

// ===== Kick (GUI then disconnect in Roblox)
app.get("/kicks", (_, res) => { const out = kicks; kicks = []; res.json(out); });
app.post("/kick", (req, res) => {
  const { userId, reason } = req.body || {};
  if (!userId) return res.status(400).json({ error: "userId required" });
  kicks.push({ userId: String(userId), reason: String(reason || "Removed by moderator") });
  res.json({ success: true });
});

// ===== Troll flags (toggle per user)
app.get("/trolls", (_, res) => res.json(trolls));
app.post("/troll", (req, res) => {
  const { userId, effect, state } = req.body || {};
  if (!userId || !effect || typeof state !== "boolean")
    return res.status(400).json({ error: "userId, effect, state required" });
  const p = ensurePlayer(userId);
  p[effect] = state;
  res.json({ success: true });
});

// ===== ChatSpy
app.get("/chatspy", (_, res) => res.json({ enabled: chatSpyEnabled }));
app.post("/chatspyon", (_, res) => { chatSpyEnabled = true; res.json({ success: true }); });
app.post("/chatspyoff", (_, res) => { chatSpyEnabled = false; res.json({ success: true }); });

// Roblox posts chats here
app.post("/chatspylog", (req, res) => {
  const { userId, username, message } = req.body || {};
  if (!chatSpyEnabled) return res.json({ success: true }); // ignore if off
  if (!message) return res.status(400).json({ error: "message required" });
  chatSpyLogs.push({ userId: String(userId || ""), username: String(username || ""), message: String(message) });
  res.json({ success: true });
});

// Bot polls here
app.get("/chatspylogs", (_, res) => {
  const out = chatSpyLogs;
  chatSpyLogs = [];
  res.json(out);
});

// ===== Server heartbeat & list
app.post("/heartbeat", (req, res) => {
  const { jobId, players } = req.body || {};
  if (!jobId) return res.status(400).json({ error: "jobId required" });
  servers.set(String(jobId), { players: Array.isArray(players) ? players : [], lastSeen: Date.now() });
  pruneServers();
  res.json({ success: true });
});

app.get("/servers", (_, res) => {
  pruneServers();
  const list = [];
  for (const [jobId, info] of servers.entries()) {
    list.push({
      jobId,
      playerCount: (info.players || []).length,
      players: (info.players || []).map(p => String(p.userId || "")),
    });
  }
  res.json(list);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
