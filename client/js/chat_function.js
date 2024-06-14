const socket = io('localhost:10001');

socket.on('connection',()=>{
    console.log('connected!');
});