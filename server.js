const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// store commands from discord
let commandQueue = [];

// Roblox fetches pending commands
app.get("/commands", (req, res) => {
  res.json(commandQueue);
  commandQueue = []; // clear after sending
});

// Discord bot posts commands
app.post("/command", (req, res) => {
  const { command, args } = req.body;
  if (!command) return res.status(400).json({ error: "Command required" });

  commandQueue.push({ command, args });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
