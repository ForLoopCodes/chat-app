const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const users = new Map();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (data) => {
    const { userName, userPass, text } = data;
    if (!users.has(userName)) {
      users.set(userName, userPass);
      socket.emit("message", {
        userName: "Server",
        text: "Registration successful! Send the message again.",
      });
    } else {
      if (users.get(userName) === userPass) {
        io.emit("message", { userName, text });
        console.log(`${userName}: ${text}`);
      } else {
        socket.emit("message", {
          userName: "Server",
          text: "Invalid credentials!",
        });
      }
    }
  });
});

server.listen(6969, () => {
  console.log("Server running on port 6969");
});
