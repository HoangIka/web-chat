import { add_panel_str, friend_str } from "../js/component.js";

const dot1 = document.querySelector('.dot1');
const dot2 = document.querySelector('.dot2');
const dot3 = document.querySelector('.dot3');

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

        if(data1.condition==false){

          const no_result = document.createElement('div');
          alert('Không tìm thấy kết quả!');
        }else{

          const friend_node = new DOMParser().parseFromString(friend_str,'text/html').body.firstChild;
          friend_node.querySelector('.friend-name').textContent = data1.username;
          friend_node.setAttribute('data-friend',data1.username);

          add_panel_node.querySelector('section[add-chat-list]').appendChild(friend_node);

          add_panel_node.querySelector('section[add-chat-list]').onclick = async function(e){
            e.preventDefault();

            const res = await fetch('/chat',{
              method:'POST',
              headers:{
                'Content-Type':'application/json'
              },
              body: JSON.stringify({me: sessionStorage.getItem('username'), friend: add_panel_node.getAttribute('data-friend')})
            }); 
            
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

async function main(){
  while(1){
    clearInterval();
    dot1.removeAttribute('style');
    await sleep(1000);
    dot1.style.setProperty('animation','dot-moving .8s');
    dot2.removeAttribute('style');
    await sleep(250);
    dot2.style.setProperty('animation','dot-moving .8s');
    dot3.removeAttribute('style');
    await sleep(250);
    dot3.style.setProperty('animation','dot-moving .8s');
  }
}
main();