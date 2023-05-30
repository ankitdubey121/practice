const express = require("express");
const app = express();
const path = require("path");
const http = require("http").Server(app);
const io = require("socket.io")(http);

let socketsJoinedRoom = [];

app.use(express.static(path.join(__dirname + "/public")));

app.get("/receiver", (req, res) => {
  res.sendFile(__dirname + "/public/receiver.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("create-room", (data) => {
    console.log(`Room created Room ID : ${data.senderID}`);
    // created and joined the same room
    socket.join(data.senderID);
    socketsJoinedRoom.push(data.senderID);
  });

  socket.on("join-room", (data) => {
    // Joined the room created by the senderID
    socket.join(data.senderID);
    console.log(`${data.receiverID} joined the room`);
    socketsJoinedRoom.push(data.receiverID);
    console.log(socketsJoinedRoom);
    socket.in(data.senderID).emit("init", data.receiverID);
    const numSocketsInRoom = io.sockets.adapter.rooms.get(data.senderID).size;
    console.log(
      `Number of sockets in room ${data.senderID}: ${numSocketsInRoom}`
    );
    const socketsInRoom = io.sockets.adapter.rooms.get(data.senderID);

    // Get the socket IDs of all sockets in the room
    const socketIDs = [];
    socketsInRoom.forEach((socket, socketID) => {
      socketIDs.push(socketID);
    });

    console.log(`Socket IDs in room ${data.senderID}:`, socketIDs);
  });

  socket.on("file-upload", (data) => {
    console.log(data);
    io.to(data.receiverID).emit("file-receive", data.file);
  });

  socket.on("send-file", (data) => {
    io.emit("receive-file", data);
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " Disconnected..");
    socketsJoinedRoom.length = 0;
    // socket.leave()
  });
});

http.listen(3000, () => {
  console.log("Server is running on port 3000");
});
