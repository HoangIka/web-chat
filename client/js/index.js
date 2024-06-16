const log = document.querySelector('.login-btn');

const reg = document.querySelector('.register-btn');

const username_input = document.querySelector('.login-username');
const password_input = document.querySelector('.login-password');

const hint = document.querySelectorAll('.hint-word');

function setHint(index,text){
    let i = 0;

    hint.forEach(e=>{
        if(i===index){
            e.textContent=text;
        }
        ++i;
    });
}

function update(e){
    e.preventDefault();

    hint.forEach(e=>{
        e.textContent='';
    });

    if(username_input.value=="") {
        log.setAttribute('disabled','true');
    }else{
        log.removeAttribute('disabled');
    }
}
password_input.addEventListener('change',update);
window.addEventListener('click',update);
username_input.addEventListener('change',update);

window.addEventListener('DOMContentLoaded',()=>{
    if(window.sessionStorage.getItem('username')!==''){
        username_input.value=window.sessionStorage.getItem('username');
        sessionStorage.removeItem('username');
        log.removeAttribute('disabled');
    }
});

reg.onclick=function(e){
    e.preventDefault();

    window.location.replace("/register");
};

log.onclick = async function(e){
    e.preventDefault();

    const dataUser = {
        username: username_input.value,
        password: password_input.value
    };
    const res = await fetch('/',
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(dataUser)
        }
    );
    const data = await res.json();

    if(data.fail1){
        setHint(0,data.fail1);

    }else if(data.fail2){
        setHint(1,data.fail2);

    }else if(data.login!==null||data.login!==undefined){
        localStorage.setItem('logged',data.login);
        sessionStorage.setItem('logging',data.login);
        window.location.assign('/chat');
    }
};