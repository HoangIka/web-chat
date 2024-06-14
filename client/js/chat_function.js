const socket = io('https://nhantintructuyen.onrender.com:10001');

socket.on('connection',()=>{
    console.log('connected!');
});
