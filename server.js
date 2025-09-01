let bannedUsers = [];

app.post("/ban", (req, res) => {
  const { userId } = req.body;
  if (!bannedUsers.includes(userId)) {
    bannedUsers.push(userId);
  }
  console.log(`Banned user: ${userId}`);
  res.json({ success: true });
});

app.post("/unban", (req, res) => {
  const { userId } = req.body;
  bannedUsers = bannedUsers.filter(id => id !== userId);
  console.log(`Unbanned user: ${userId}`);
  res.json({ success: true });
});

app.get("/bans", (req, res) => {
  res.json(bannedUsers);
});
