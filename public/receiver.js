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

socket.on('message',(data)=>{
    const text = document.getElementById('sent-text');
    text.innerHTML = data;
    console.log(data);
});

socket.on('receive-file',(data)=>{
    console.log('***RECEIVED FILE*** :'+data);
    downloadFile(data);
});


function downloadFile(fileObj) {
    const file = fileObj; // Your file object

  const downloadLink = document.getElementById('downloadLink');
  const url = window.URL.createObjectURL(file);

  downloadLink.href = url;
  downloadLink.download = file.name;

  downloadLink.click();

  window.URL.revokeObjectURL(url);
  }