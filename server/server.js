const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static('client'));
app.use(express.urlencoded({extended:true}));

let userJSONfile = 'userInfo.json';
let reviewJSONfile = 'userReviews.json';

//home page: once open localhost:3000
app.get('/', (req, res) => {
    res.redirect('index.html');
})

//redirect to login page
app.get('/login', (req, res) => {
    res.redirect('login.html');
});

/* Check if user already signed up. If not, ask user to sign up.
 * If user already has an account, check if the password matches that in the file.
 */
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

//once log out, redirect to the homepage
app.post('/logout', (req, res) => {
    res.redirect('/');
});

//redirect to the signup page
app.get('/signup', (req, res) => {
    res.redirect('signup.html');
});

//user put in username and passwords to sign up, and save user info in a JSON file
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
app.patch('/review/:id', (req, res) => {});
app.get('/user/:id', (req,res) => {});
app.get('/landmarks_in', (req, res) => {});

//redirect to review page and show all the reviews

app.get('/review/:id', (req,res) => {
    res.redirect('/user-interface.html');
    // let reviews =[];
    // if (fs.existsSync(reviewJSONfile)) {
    //     reviews = JSON.parse(fs.readFileSync(reviewJSONfile));
    // }
    // console.log(reviews);
    // for(let i = 0 ; i < reviews.length; i++){
    //     reviews['name']
    // }
});



//save all reviews to a JSON file
app.post('/review/:id', (req,res) => {
    let body = req.body;
    let landmark = body['name'];
    let review = body["review"];
    let rating = body["rating"];
 
    let userReviews = [];
    if (fs.existsSync(reviewJSONfile)) {
        let someStr = fs.readFileSync(reviewJSONfile);
        userReviews = JSON.parse(someStr);
    }
    let userReview = {};
    userReview['name'] = landmark;
    userReview['review'] = review;
    userReview['rating'] = rating;
    userReviews.push(userReview);
    fs.writeFileSync(reviewJSONfile, JSON.stringify(userReviews));
    res.redirect('/user-interface.html');
    res.end();
    
    // let reviews =[];
    // if (fs.existsSync(reviewJSONfile)) {
    //     reviews = JSON.parse(fs.readFileSync(reviewJSONfile));
    // }
    // console.log(reviews);


    // for(let i = 0; i < reviews.length; i ++){
    //     const div = document.createElement('div');
    //     div.classList.add('grid-item');
    //     div.innerText = review;
    //     element.appendChild('div');
    // }

    // for(let i = 0 ; i < reviews.length; i++){
    //     reviews['name'];
    // }
});

//delete a review from the JSON file

app.delete('/review/:id', (req,res) => {
});



//port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening on port 3000...'));