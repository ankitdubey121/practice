const express = require('express');
const app = express();
const path = require('path')
const http = require('http').Server(app);

const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname+"/public")));

const connectedClients = {}

app.get('/receiver', (req, res)=>{
	res.sendFile(__dirname+'/public/receiver.html');
});

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})


io.on('connection', (socket)=>{
    // if(socketList.length < 2){
        socket.on('message',(socket)=>{
            console.log(`Message: ${socket.message}`);
        })
        
        // socket.on('join-room', (data) => {
        //     socket.join(data.roomName);
        //     console.log(`${data.socketID} joined room ${data.roomName}`);
        //     socketList.push(data.socketID)
        //     console.log(socketList)
        //     io.to(data.roomName).emit('say-hello')
        // });

        socket.on('create-room', (data) =>{
            console.log(`Room created Room ID : ${data.roomCode}`)
            socket.join(data.roomCode);
            console.log(`${data.senderSocketID} has joined the room`);
        })
        
        socket.on('join-room', (data) => {
                socket.join(data.roomCode)
                console.log(`${data.receiverID} joined the room`);
        })

        // socket.on('sender-ready', (data)=>{
        //     console.log(data.data)
        //     if(socketList.includes(data.socketId)){
        //         socketList.pop(data.socketId)
        //     }
        //     console.log(socketList)
        //     io.to(socketList[0]).emit('init', {data: "Initiate the process"});
        // })
    
        socket.on('disconnect', ()=>{
            console.log(socket.id + " Disconnected..")
            delete connectedClients[socket.id]
        })
    // }
    
    
})

http.listen(3000,()=>{
    console.log('Server is running on port 3000');
});