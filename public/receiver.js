const socket = io('http://localhost:3000')

const roomCode = document.getElementById('roomCode').value
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

const receiverID = generateUUID();

const joinBtn = document.getElementById('joinBtn')


joinBtn.addEventListener('click', ()=>{
    socket.emit('join-room', {roomCode, receiverID});
})