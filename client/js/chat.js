import { add_panel_str, friend_str, chat_nav_str, other_message_str, self_message_str } from "../js/component.js";

const socket = io('https://nhantintructuyen.onrender.com:10001');

socket.on('connect',()=>{
    console.log('connected!');
});

const dot1 = document.querySelector('.dot1');
const dot2 = document.querySelector('.dot2');
const dot3 = document.querySelector('.dot3');

const self_name = JSON.parse(atob(sessionStorage.getItem('logging'))).username

const left_sidebar = document.querySelector('.left-sidebar');

const list_box_str = `<div class="list-add-box">
              <button add-friend class="list-add-btn">Thêm Bạn Bè</button>
              <!--<button add-group class="list-add-btn">Thêm Nhóm</button>
              <button new-group class="list-add-btn">Tạo Nhóm</button>-->
            </div>`;

const list_add_panel = document.querySelector('.list-add-panel');
var is_clicked = false;

document.querySelector('.list-add').onclick = function(e) {
  e.preventDefault();
  if(is_clicked) return;
  const list_box = new DOMParser().parseFromString(list_box_str, 'text/html').body.firstChild;

  list_box.querySelector('button[add-friend]').onclick=function(e){
    e.preventDefault();

    const add_panel_node = new DOMParser().parseFromString(add_panel_str,'text/html').body.firstChild;

  add_panel_node.querySelector('div[title]').textContent="Thêm Bạn Bè.";

    add_panel_node.querySelector('.find-btn').onclick=async function(e){
      e.preventDefault();

      const data = add_panel_node.querySelector('.find-search').value;

      if(data==='') return;
      else{
        const res = await fetch('/chat',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify({type: 'find-name', data: data})

          });

        const data1 = await res.json();

        if(data1.condition===false){

          const no_result = document.createElement('div');
          alert('Không tìm thấy kết quả!');
        }else{
          const l = document.querySelectorAll('.friend-profile')
          l.forEach(e=>{e.remove()})
          const friend_node = new DOMParser().parseFromString(friend_str,'text/html').body.firstChild;
          friend_node.querySelector('.friend-name').textContent = data1.username;
          friend_node.setAttribute('data-friend',data1.username);

          add_panel_node.querySelector('section[add-chat-list]').appendChild(friend_node);

          add_panel_node.querySelector('section[add-chat-list]').onclick = async function(e){
            e.preventDefault();

            const data = {type: 'add-friend',me: JSON.parse(atob(sessionStorage.getItem('logging'))).username, friend:friend_node.getAttribute('data-friend')}

            const res = await fetch('/chat',{
              method:'POST',
              headers:{
                'Content-Type':'application/json'
              },
              body: JSON.stringify(data)
            }
            ); 
            const result = await res.json()
            
            
            const chat_nav_node = new DOMParser().parseFromString(chat_nav_str,'text/html').body.firstChild;
            chat_nav_node.setAttribute('data-chat-id',result.username);
            chat_nav_node.querySelector('.chat-name').textContent=result.username;
        
            chat_nav_node.onclick=async function(e){
              const type_message = document.querySelectorAll('.type-message')
              
              type_message.forEach(e=>{
                e.remove()
              })
              chat_id = chat_nav_node.getAttribute('data-chat-id')
              socket.emit('get-data-chat',self_name,result.username);
              
              const input = document.querySelector('.message-input').removeAttribute('disabled');
              
            }
            const list = document.querySelector('.list-chat');
            list.appendChild(chat_nav_node);
            
            add_panel_node.remove()
          }
        }
      }
    }

    add_panel_node.querySelector('.close-add-panel').onclick=(e)=>{
      e.preventDefault();
      add_panel_node.remove();
    };


    document.querySelector('body').appendChild(add_panel_node);
  };

  list_add_panel.appendChild(list_box);
  is_clicked = true;

  list_box.onclick = function(e) {
    e.stopPropagation();
  };
};

window.onclick = function(e) {
  if(is_clicked && e.target !== list_add_panel && !list_add_panel.contains(e.target)) {
    const list_box = list_add_panel.querySelector('.list-add-box');
    if(list_box) {
      list_box.remove();
      is_clicked = false;
    }
  }
};

const bg = document.querySelector('.bg');
// const add_panel = document.querySelector('.add-panel');

const room_settings = document.querySelector('.room-settings').onclick=function(e){
  e.preventDefault();
  left_sidebar.style.setProperty('transition','width .5s');
  left_sidebar.style.setProperty('width','80vw');
  setTimeout(e=>left_sidebar.style.removeProperty('transition'),500);
};
var is_close_sidebar = false;
const close_sidebar = document.querySelector('.close-sidebar').onclick=function(){
  left_sidebar.style.setProperty('transition','width .5s');
  left_sidebar.style.setProperty('width','.1px');
  setTimeout(e=>left_sidebar.style.removeProperty('transition'),500);
}

var is_list = false;
const more_setting = document.querySelectorAll('.more-setting');

// const list_setting = document.querySelector('.list-setting').onclick=(e)=>{
//   e.preventDefault();
  
//   if(!is_list){
//     more_setting.forEach((e)=>{
//       e.style.setProperty('display','block');
//     });
//     is_list = true;
//   }else{
//     more_setting.forEach((e)=>{
//       e.style.setProperty('display','none');
//     });
//     is_list = false;
//   }
// };

function sleep(time){
  return new Promise(res=>setInterval(res,time));
}

var chat_id;
var current_chat;

const send = document.querySelector('.send-btn')
const input = document.querySelector('.message-input')

send.onclick=async function(e){
  e.preventDefault();
  
  console.log(chat_id)

  const self_message_node = new DOMParser().parseFromString(self_message_str,'text/html').body.firstChild

  
  const list = document.querySelector('.chat-section');
  send.setAttribute('disabled','true')
  const date = new Date();
  
  self_message_node.querySelector('.profile-name').textContent=JSON.parse(atob(sessionStorage.getItem('logging'))).username;
  self_message_node.querySelector('.message').textContent=input.value
  
  const hours = ((date.getHours()<10)?"0"+date.getHours():date.getHours())
  const minutes = ((date.getMinutes()<10)?"0"+date.getMinutes():date.getMinutes())
  
  const timeStamp = hours+":"+minutes
  
  socket.emit('send-chat',JSON.parse(atob(sessionStorage.getItem('logging'))).username,chat_id,input.value,timeStamp);
  self_message_node.querySelector('.is-sented').textContent=timeStamp
  
  input.value=""
  list.appendChild(self_message_node)
  list.scrollTo(0,list.scrollHeight)
}

input.addEventListener('change',()=>{
  if(input.value===""){
    send.setAttribute('disabled','true')
  }else{
    send.removeAttribute('disabled')
  }
});

socket.on(`fetch-chat-${self_name}`,(data)=>{
  const chat = Object.create(data)

  console.log(JSON.stringify(chat))
  
  
  
  const chatLength = chat.chat
  for(let i=0;i<chatLength.length;++i){
    const other_message_node = new DOMParser().parseFromString(other_message_str, 'text/html').body.firstChild

    const self_message_node = new DOMParser().parseFromString(self_message_str,'text/html').body.firstChild
    const list = document.querySelector('.chat-section');

    if(chatLength[i].username==JSON.parse(atob(sessionStorage.getItem('logging'))).username){
      self_message_node.querySelector('.profile-name').textContent=JSON.parse(atob(sessionStorage.getItem('logging'))).username;
      self_message_node.querySelector('.message').textContent=chatLength[i].message
      self_message_node.querySelector('.is-sented').textContent=chatLength[i].time_stamp
      
      list.appendChild(self_message_node)
    }else{
      other_message_node.querySelector('.profile-name').textContent=chatLength[i].username;
      other_message_node.querySelector('.message').textContent=chatLength[i].message
      other_message_node.querySelector('.is-sented').textContent=chatLength[i].time_stamp
      
      list.appendChild(other_message_node)
      list.scrollTo(0,list.scrollHeight)
    }
  }
})

socket.on(`${self_name}`,(type,obj)=>{
  if(type==='new-message'){
    
    console.log((obj.chat_id===(self_name+"-"+chat_id))||(obj.chat_id===(chat_id+"-"+self_name)))
    if((obj.chat_id===(self_name+"-"+chat_id))||
       (obj.chat_id===(chat_id+"-"+self_name))){
    const other_message_node = new DOMParser().parseFromString(other_message_str, 'text/html').body.firstChild
      other_message_node.querySelector('.profile-name').textContent=obj.username;
      other_message_node.querySelector('.message').textContent=obj.message
      other_message_node.querySelector('.is-sented').textContent=obj.time_stamp
      const list = document.querySelector('.chat-section')
      list.appendChild(other_message_node)
      list.scrollTo(0,list.scrollHeight)
    }
  }else if(type==='new-friend'){
    const chat_nav_node = new DOMParser().parseFromString(chat_nav_str,'text/html').body.firstChild;
    chat_nav_node.setAttribute('data-chat-id',obj.username);
    chat_nav_node.querySelector('.chat-name').textContent=obj.username;

    chat_nav_node.onclick=async function(e){
      const type_message = document.querySelectorAll('.type-message')
      
      type_message.forEach(e=>{
        e.remove()
      })
      chat_id = chat_nav_node.getAttribute('data-chat-id')
      socket.emit('get-data-chat',self_name,obj.username);
      
      const input = document.querySelector('.message-input').removeAttribute('disabled');
      
      const room_name = document.querySelector('div[data-room-name]')
      room_name.textContent=obj.username
      
      left_sidebar.style.setProperty('transition','width .5s');
      left_sidebar.style.setProperty('width','.1px');
      setTimeout(e=>left_sidebar.style.removeProperty('transition'),500);
    }
    const list = document.querySelector('.list-chat');
    list.appendChild(chat_nav_node);
    list.scrollTo(0,list.scrollHeight)
  }
})

socket.on(`getted-friendList-${self_name}`,json=>{
    for(let i=0;i<json.friendSize;++i){

    const chat_nav_node = new DOMParser().parseFromString(chat_nav_str,'text/html').body.firstChild;
    chat_nav_node.setAttribute('data-chat-id',json.friendList[i]);
    chat_nav_node.querySelector('.chat-name').textContent=json.friendList[i];

    chat_nav_node.onclick=async function(e){
      const type_message = document.querySelectorAll('.type-message')
      
      type_message.forEach(e=>{
        e.remove()
      })
      chat_id = chat_nav_node.getAttribute('data-chat-id')
      socket.emit('get-data-chat',self_name,chat_id);
      
      const input = document.querySelector('.message-input').removeAttribute('disabled');
      
      const room_name = document.querySelector('div[data-room-name]')
      room_name.textContent=chat_id
      
      left_sidebar.style.setProperty('transition','width .5s');
      left_sidebar.style.setProperty('width','.1px');
      setTimeout(e=>left_sidebar.style.removeProperty('transition'),500);
    }
    const list = document.querySelector('.list-chat');
    list.appendChild(chat_nav_node);
    list.scrollTo(0,list.scrollHeight)
  }
});

socket.on('verified-'+self_name,bool=>{
  if(!bool){
    window.location.assign('/');
  }
})
socket.on('update',(e)=>{
  const is_logging = sessionStorage.getItem('logging');
  socket.emit('verifing',self_name,is_logging)
})

async function main(){

  const is_logging = sessionStorage.getItem('logging');
  
  if(is_logging===null) 
    window.location.assign('/');

  if(self_name!==null||self_name!==undefined||self_name!=="") socket.emit('get-friendList',self_name);
  // while(1){
  //   clearInterval();
  //   dot1.removeAttribute('style');
  //   await sleep(1000);
  //   dot1.style.setProperty('animation','dot-moving .8s');
  //   dot2.removeAttribute('style');
  //   await sleep(250);
  //   dot2.style.setProperty('animation','dot-moving .8s');
  //   dot3.removeAttribute('style');
  //   await sleep(250);
  //   dot3.style.setProperty('animation','dot-moving .8s');
  // }
}
main();
