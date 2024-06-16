const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const database = require('./database.js');

const app = express();
const server1 = require('http').createServer(app);

const io = require('socket.io')(server1,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});

const PORT = process.env.PORT || 4000;

app.use(express.static('client'));
app.use(bodyParser.json());
const db = new database();

const userdata = {};

userdata.username='a';
userdata.password='a';
userdata.friend=[];

userdata.friend.push('b');

db.addUser(userdata.username,userdata);

const userdata2 = {};

userdata2.username='b';
userdata2.password='b';
userdata2.friend=[];

userdata2.friend.push('a');

db.addUser(userdata2.username,userdata2);

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
    userdata.friend = []
    db.addUser(username,userdata);
    console.log('An new user register successfully!');

    res.json({success:true});
});

app.get('/chat',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','chat.html'));
});

app.post('/chat',(req,res)=>{

    const data = Object.create(req.body)
    if(data.type==='add-friend'){
    const addFriend = db.getUser(data.me);
    addFriend.friend.push(data.friend);
    
    const addFriend2 = db.getUser(data.friend);
    addFriend2.friend.push(data.me);
    
    io.emit(`${data.friend}`,'new-friend',{username: data.me})
    res.json({message:'',username: data.friend})
    }else
    if(data.type==='find-name'){
        if(db.hasUser(data.data)){
          
          const userdata = db.getUser(data.data);
          
          res.json({condition:true,username: userdata.username});
        }else{
          res.json({condition:false});
        }
    }
});

server1.listen(PORT,()=>console.log(`server on! port:${PORT}`));

io.on('connection',socket=>{
    console.log('client connected!');
    io.emit('update','reconnect')
    
    socket.on('verifing',(self_name,is_logging)=>{
      console.log('an user is verifing...')
      let data = JSON.parse(atob(is_logging)).password;
      
      if(!db.hasUser(self_name)){
        io.emit('verified-'+self_name,false)
        console.log('failed verify user!')
        return;
      }else{ 
        if(!(db.getUser(self_name).password===data)){
          io.emit('verified-'+self_name,false)
          console.log('failed verify user!')
          return;
        }
        console.log('successfully verified user!')
        return;
      }
    })
    
    socket.on('get-friendList',(self_name)=>{
      
      const friend = {};
      friend.friendList = [];
      if(db.getUser(self_name)===undefined) return;
      friend.friendSize = (db.getUser(self_name).friend!==undefined)?db.getUser(self_name).friend.length:"";
      
      for(let i=0;i<friend.friendSize;i++){ 
          const friendo = db.getUser(self_name).friend[i];
          friend.friendList.push(friendo);
      }
      io.emit(`getted-friendList-${self_name}`,friend)
    })
    
    socket.on('send-chat',(username,chat_id,message,timeStamp)=>{
        let data_c;
        
      console.log(`${db.hasChat(username+"-"+chat_id)} ${db.hasChat(chat_id+"-"+username)}`)
      if(db.hasChat(username+"-"+chat_id)) data_c = db.getChat(username+"-"+chat_id)
      else if(db.hasChat(chat_id+"-"+username)) data_c = db.getChat(chat_id+"-"+username)
        
        const chat = {username: username,message: message,time_stamp: timeStamp}
        
        const obj = {}
        
        if(db.hasChat(username+"-"+chat_id)) obj.chat_id = `${username}-${chat_id}`
        else if(db.hasChat(chat_id+"-"+username)) obj.chat_id = `${chat_id}-${username}` 
        
        obj.username = username
        obj.message = message
        obj.time_stamp = timeStamp
        
        io.emit(`${chat_id}`,'new-message',obj)
        
        let chatD = data_c.chat;
        chatD.push(chat);

        //console.log(JSON.stringify(db.getChat(chat_id+"-"+username)));

        if(db.hasChat(`${chat_id}-${username}`))
          
          db.addChat(chat_id+"-"+username,data_c);
        else if(db.hasChat(`${username}-${chat_id}`))
          
          db.addChat(username+"-"+chat_id,data_c);
    })

    socket.on('get-data-chat',(self_name,chat_id)=>{
        if(db.hasChat(self_name+"-"+chat_id)){
          
          io.emit(`fetch-chat-${self_name}`,db.getChat(self_name+"-"+chat_id));
        }else if(db.hasChat(chat_id+"-"+self_name)){
          
          io.emit(`fetch-chat-${self_name}`,db.getChat(chat_id+"-"+self_name));
        }else{
          
          const chatData = {};

          chatData.chat = [];

          db.addChat(self_name+"-"+chat_id,chatData);
          io.emit(`fetch-chat-${self_name}`,db.getChat(self_name+"-"+chat_id));
        }
    });
});
