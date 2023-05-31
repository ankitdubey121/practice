const express = require("express");
const multer = require("multer");
const app = express();
const fs = require('fs')
const path = require("path");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const upload = multer({dest: 'uploads/'})
roomCode = "";

app.use(express.static(path.join(__dirname + "/public")));

app.get("/receiver", (req, res) => {
  res.sendFile(__dirname + "/public/receiver.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post('/upload', upload.single('file'), (req, res)=>{
    const filePath = req.file.path;

  // Read the file data
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    // Emit the file data to the receiver-side
    io.emit('file-transfer', fileData);

    res.sendStatus(200);
  });
})

io.on("connection", (socket) => {
  socket.on("create-room", (data) => {
    console.log(`Room created Room ID : ${data.senderID}`);
    // created and joined the same room
    socket.join(data.senderID);
    roomCode = data.senderID;
    io.to(socket.id).emit('room-created', roomCode);
});

  socket.on("join-room", (data) => {
    // Joined the room created by the senderID
    if (data.senderID == roomCode) {
      const numSocketsInRoom = io.sockets.adapter.rooms.get(data.senderID).size;
      if (numSocketsInRoom >= 2) {
        // Reject the third socket from joining the room
        io.to(socket.id).emit('not-allowed')
      } else {
        socket.in(data.senderID).emit("init", data.receiverID);
        socket.join(data.senderID);
        console.log(`${data.receiverID} joined the room`);
        const socketsInRoom = io.sockets.adapter.rooms.get(data.senderID);

        // Get the socket IDs of all sockets in the room
        const socketIDs = [];
        socketsInRoom.forEach((socket, socketID) => {
          socketIDs.push(socketID);
        });
        console.log(`Socket IDs in room ${data.senderID}:`, socketIDs);
      }
    } else {
      console.log("Room code not matched");
      io.to(socket.id).emit("wrong-code");
    }
  });

  socket.on("file-upload", (data) => {
    console.log(data);
    socket.in(roomCode).emit("file-receive", data.file);
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " Disconnected..");
    // socket.leave()
  });
});

http.listen(3000, () => {
  console.log("Server is running on port 3000");
});
