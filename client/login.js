async function errormsg(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    const response = await fetch('/login',{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        method: "POST",
        body: "username="+username+ "&" + "password=" + password
    });
    let data = await response.json();
    if(data.ok == 1){
        location.href = "./index.html?login=true";
    }
    else if(data.ok == 2) {
        alert("Incorect password!");
    }
    else if(data.ok == 3) {
        alert("Please sign up first");
    }
    console.log(data);
    // let res = JSON.parse(response.body);
    // console.log(response);
}

// document.getElementById('login-button').addEventListener("click", errormsg);

