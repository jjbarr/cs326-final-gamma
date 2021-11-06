const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static('client'));
app.use(express.urlencoded({extended:true}));

let userJSONfile = 'userInfo.json';

//home page: once open localhost:3000
app.get('/', (req, res) => {
    res.redirect('index.html');
})

app.get('/login', (req, res) => {
    res.redirect('login.html');
});

app.post('/login', (req, res) => {
    let userFile = JSON.parse(fs.readFileSync(userJSONfile));
    let body = req.body;
    let currUsername = body['username'];
    let currPassword = body["password"];
    for(let i = 0 ; i < userFile.length; i++){
        if(currUsername == userFile[i]['username']){
            if(currPassword == userFile[i]['password']){
                res.json({"ok": 1});
                return;
            }
            else{
                res.json({"ok": 2});
                return;
            }
        }
        else{
            res.json({"ok": 3});
        }
    }
});

app.post('/logout', (req, res) => {
    res.redirect('/');
});

app.get('/signup', (req, res) => {
    res.redirect('signup.html');
});

app.post('/signup', (req, res) => {
    let body = req.body;
    let username = body['username'];
    let email = body["email"];
    let password = body["password"];
 
    let users = [];
    if (fs.existsSync(userJSONfile)) {
        let someStr = fs.readFileSync(userJSONfile);
        users = JSON.parse(someStr);
    }
    let user = {};
    user['username'] = username;
    user['email'] = email;
    user['password'] = password;
    users.push(user);
    fs.writeFileSync(userJSONfile, JSON.stringify(users));
    res.redirect('/login');
});

app.post('/create_landmark', (req, res) => {});
app.get('/landmark/:id', (req, res) => {});
app.patch('/landmark/:id', (req,res) => {});
app.delete('/landmark/:id', (req,res) => {});
app.post('/landmark/:id/add_review', (req,res) => {});
app.get('/review/:id', (req,res) => {});
app.patch('/review/:id', (req, res) => {});
app.delete('/review/:id', (req,res) => {});
app.get('/user/:id', (req,res) => {});
app.get('/landmarks_in', (req, res) => {});


// app.get('/crud', (req, res)=>{
//     res.redirect('crud.html');
// });

// app.get('/crud/data', (req, res)=>{
    
// });

// app.post('/crud/data', (req, res)=>{
//     res.json({'request': 'post'});
// });

//port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening on port 3000...'));