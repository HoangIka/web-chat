const log = document.querySelector('.login');
const reg = document.querySelector('.register-btn');

const name_input = document.querySelector('.name-input');
const password_input = document.querySelectorAll('.password-input');

const hint = document.querySelectorAll('.hint-word');
const show_pass = document.querySelector('.show-password');

name_input.addEventListener('change',()=>{

    hint.forEach(e=>{
        e.textContent="";
    });

    if(name_input.value==""){
        reg.setAttribute('disabled','true');
    }else{
        reg.removeAttribute('disabled');
    }
});

var is_show = false;
show_pass.onclick=function(e){
    e.preventDefault();

    if(!is_show){
        show_pass.textContent='Ẩn';

        password_input.forEach(element => {
            element.setAttribute('type','text');
        });
        is_show = true;
    }else{
        show_pass.textContent='Hiện';

        password_input.forEach(element => {
            element.setAttribute('type','password');
        });

        is_show = false;
    }
}


function setHint(index,text){
    let i=0;
    hint.forEach(e=>{
        if(i===index)
            e.textContent=text;
        i++;
    });
}

var count = 0;
reg.onclick=async function(e){
    e.preventDefault();

    password_input.forEach(e=>{
        if(e.value==""){
            setHint(1,'Mật Khẩu không Được Để Trống!');
        }
    });

    if(reg.hasAttribute('disabled')) return;

    hint.forEach(e=>{
        e.textContent="";
    });

    const username = {};

    username.username = name_input.value;
    let password = [];

    password_input.forEach(e=>{
        password.push(e.value);
    });

    if(password[1]==password[0]){
        username.password = password[0];
    }else{
        hint.forEach(e=>{
            if(count==2){
                e.textContent="Mật Khẩu không Trùng Khớp!";
            }
            count++;
        });
        count=0;
        return;
    }

    const res = await fetch('/register',
        {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(username)
        }
    );

    const data = await res.json();
    if(data.fail1!==undefined){
        if(data.fail1=='exist'){
            count=0;
            hint.forEach(e=>{
                if(count===0){
                    e.textContent='Tài Khoản Đã Tồn Tại';
                    count++;
                    return;
                }
            });
        }
    }else if(data.success!==undefined){
        if(data.success==true)
            alert('Đăng Ký Thành Công!');
        window.sessionStorage.setItem('username',name_input.value);
        window.location.assign('/');
    }
}
log.onclick=function(e){
    e.preventDefault();

    window.location.replace('/');
}
window.addEventListener('change',()=>{
    setHint(0,'');
    setHint(1,'');
    setHint(2,'');
});
window.addEventListener('click',()=>{
    setHint(0,'');
    setHint(1,'');
    setHint(2,'');
});