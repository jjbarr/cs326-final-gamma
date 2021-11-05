const express = require('express')
const app = express();

app.use(express.static('client'));
app.use(express.urlencoded({extended:true}));

//home page: once open localhost:3000
app.get('/', (req, res) => {
    res.redirect('index.html');
})

app.get('/login', (req, res) => {
    res.redirect('login.html');
});
//when click on log in, will send a meessage
app.post('/login', (req, res) => {
    res.json({"text":"you have logged in!"});
})

app.post('/logout', (req, res) => {});

app.get('/signup', (req, res) => {
    res.redirect('signup.html');
});
app.post('/signup', (req, res) => {
    res.json({"text":"you have signed up!"});
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
//     res.sendFile('crud.html');
// });

// app.get('/crud/data', (req, res)=>{
//     res.json({'request': 'get'});
// });

// app.post('/crud/data', (req, res)=>{
//     res.json({'request': 'post'});
// });

//port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening on port 3000...'));