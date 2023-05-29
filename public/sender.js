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

const senderSocket = generateUUID()
console.log(senderSocket)
socket.emit('create-room', {senderSocket});

socket.on('init', () => {
    // sendFile()
    console.log("Inside init event")
});

const send = () =>{
    const message = document.getElementById('message').value;
    socket.emit('message',{message});
};

// document.getElementById('file').addEventListener('change', function(e){
    // const file = e.target.files[0];
    // const fileName = file.name;
    // const fileSize = file.size;
    // const fileType = file.type;
    // const fileURL = URL.createObjectURL(file);
    // const blob = new Blob([file], {type: fileType});
    // const formData = new FormData();
    // formData.append('file', blob, fileName);
    // formData.append('name', fileName);
    // formData.append('size', fileSize);
    // formData.append('type', fileType);
    // formData.append('url', fileURL);
    // console.log(formData)
    // // Created a new FileReader object
    // let reader = new FileReader();
    // reader.onload = function(e){
    //     // e.target.result is the raw data
    //     const data = e.target.result;
    //     console.log(data)
    // }
// })

const sendFile = () =>{
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    if (file) {
        console.log(file);
        // socket.emit('send-file', {file});
    }
    else{
        alert('Please select a file');
    }

}