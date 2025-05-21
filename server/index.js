const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// 🔹 נתיב הקובץ שבו נשמרים המשתמשים
const usersFile = path.join(__dirname, "data", "users.json");

// יצירת התיקייה אם אינה קיימת
if (!fs.existsSync(path.dirname(usersFile))) {
  fs.mkdirSync(path.dirname(usersFile), { recursive: true });
}

// ✅ Signup
app.post("/api/signup", (req, res) => {
  const { username, password, instrument } = req.body;
  if (!username || !password || !instrument) {
    return res.status(400).json({ message: "Missing fields" });
  }

  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
  }

  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password, instrument });

  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save user" });
  }
});

// ✅ Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({ message: "Login successful", instrument: user.instrument });
});

// ✅ SOCKET.IO
io.on("connection", (socket) => {
  console.log("🟢 New client connected");

  socket.on("send-song", (song) => {
    console.log("🎵 Song sent:", song.title);
    io.emit("receive-song", song); // שולח לכל הלקוחות
  });

  socket.on("quit-session", () => {
    console.log("🚪 Quit session");
    io.emit("quit-session");
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

// ✅ Start server
server.listen(3001, () => {
  console.log("🚀 Server is running on http://localhost:3001");
});
