const socket = io('http://localhost:3000')

function generateUUID() {
var code = '';
for (var i = 0; i < 3; i++) {
    var segment = Math.floor(Math.random() * 256).toString(16);
    if (segment.length < 2) {
    segment = '0' + segment; // Pad with leading zero if necessary
    }
    code += segment + '-';
}
return code.slice(0, -1); // Remove the trailing dash
}  
  
const roomCode = generateUUID();
console.log(roomCode);
const senderSocketID = generateUUID()
console.log(senderSocketID)
socket.emit('create-room', {roomCode, senderSocketID});