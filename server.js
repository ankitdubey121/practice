const express = require('express');
const app = express();
const path = require('path')
const http = require('http').Server(app);

const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname+"/public")));

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
            io.emit('message',socket.message);
        })
        
        // socket.on('join-room', (data) => {
        //     socket.join(data.roomName);
        //     console.log(`${data.socketID} joined room ${data.roomName}`);
        //     socketList.push(data.socketID)
        //     console.log(socketList)
        //     io.to(data.roomName).emit('say-hello')
        // });

        socket.on('create-room', (data) =>{
            console.log(`Room created Room ID : ${data.senderSocket}`)
            // created and joined the same room
            socket.join(data.senderSocket);
        })
        
        socket.on('join-room', (data) => {
            // Joined the room created by the senderSocket
                socket.join(data.senderSocket)
                console.log(`${data.receiverID} joined the room`);
                // emitting an event to senderSocket
                io.to(data.senderSocket).emit("init");
        })

        // socket.on('sender-ready', (data)=>{
        //     console.log(data.data)
        //     if(socketList.includes(data.socketId)){
        //         socketList.pop(data.socketId)
        //     }
        //     console.log(socketList)
        //     io.to(socketList[0]).emit('init', {data: "Initiate the process"});
        // })

        socket.on('send-file',(data)=>{
            io.emit('receive-file',data);
        });
    
        socket.on('disconnect', ()=>{
            console.log(socket.id + " Disconnected..")
            socket.leave()
        })
    // }
    
    
})

http.listen(3000,()=>{
    console.log('Server is running on port 3000');
});