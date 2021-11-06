window.addEventListener('DOMContentLoaded', ()=>{   
    document.getElementById('return-btn').addEventListener('click', returnHome);
});

function returnHome(){
    location.href = "./index.html?login=true";
}

function update(){
    
}