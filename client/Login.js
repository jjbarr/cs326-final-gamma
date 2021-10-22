window.addEventListener('DOMContentLoaded', ()=>{   
    document.getElementById('login-button').addEventListener('click', click);
});

function click(){
    const url = "./index.html?login=" + "true"
    location.href = url;
}