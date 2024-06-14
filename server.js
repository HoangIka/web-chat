const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const database = require('./database.js');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors:{
        origin:"https://nhantintructuyen.onrender.com:10000",
        methods:["GET","POST"]
    }
});

app.use(express.static('client'));
app.use(bodyParser.json());
const db = new database();

const userdata = {};

    userdata.username='a';
    userdata.password='a';
    db.addUser(userdata.username,userdata);

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','index.html'));
});

app.post('/',(req,res)=>{

    const {username, password} = req.body;
    
    // console.log(`${username}`);
    console.log(`login: ${username}=${JSON.stringify(db.getUser(username))}`);

    console.log(db.hasUser(username));
    if(!db.hasUser(username)){
       res.json({fail1:'Tên Tài Khoản không Tồn Tại!'});
    }else{
        if(db.getUser(username).password==password){

            res.json({fail1: false,login: btoa(JSON.stringify({username: username,password: password}))});
        }else{
            console.log('loggin fail!');
            res.json({fail2:'Sai Mật Khẩu.'});
        }
    }
});

app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','account.html'));
});


app.post('/register',(req,res)=>{
    const {username,password} = req.body;
    
    if(db.hasUser(username)) {
        res.json({fail1:'exist'});
        return;
    }
    
    const userdata = {};

    userdata.username=username;
    userdata.password=password;
    db.addUser(username,userdata);
    console.log('An new user register successfully!');

    res.json({success:true});
});

app.get('/chat',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','chat.html'));
});

app.post('/chat',(req,res)=>{
    const {type, data} = req.body;

    if(type==='find-name'){
        if(db.hasUser(data)){

            const userdata = db.getUser(data);

            res.json({condition:true,username: userdata.username});
        }else{
            res.json({condition:false});
        }
    }
});

app.listen(10000,()=>console.log('server on!'));
io.listen(10001);
io.on('connection',socket=>{
    console.log('client connected!');
});
