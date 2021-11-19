const express = require('express');
const expressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pgp = require('pg-promise')();
const app = express();

const db = pgp({
    connectionString: process.env.DATABASE_URL,
    ssl:{rejectUnauthorized:false}
});

const session = {
    secret: process.env.SECRET || 'SECRET',
    resave: false,
    saveUninitialized: false
};

const strategy = new LocalStrategy(async (uname, password, done) => {
    let user = await db.oneOrNone('SELECT * FROM users WHERE uname=${uname}',
                                  {uname:uname});
    //todo don't just use plaintext.
    if(!user) {
        return done(null, false, {'message': 'Bad Username'});
    }
    if(user.password !== password) {
        await new Promise((r) => setTimeout(r, 1000));
        return done(null, false, {'message': 'Wrong Password'});
    }
    return done(null, uname);
});

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({'extended':true}));
app.use(express.static('client'));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((uid, done) => {
    done(null, uid);
});

//home page: once open localhost:3000
app.get('/', (req, res) => {
    res.redirect('index.html');
});

//redirect to login page
app.get('/login', (req, res) => {
    if(req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.redirect('login.html');
    }
});

/* Check if user already signed up. If not, ask user to sign up.
 * If user already has an account, check if the password matches that in the file.
 */
app.post('/login',
         passport.authenticate('local', {
             'successRedirect': '/',
             'failureRedirect': '/login'
         }));

//once log out, redirect to the homepage
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

//redirect to the signup page
app.get('/signup', (req, res) => {
    if(req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.redirect('signup.html');
    }
});

//user put in username and passwords to sign up, and save user info in a JSON file
app.post('/signup', async (req, res) => {
    if(!req.isAuthenticated()) {
        try {
            await db.none(
                'INSERT INTO users(uname, password) VALUES(${username},${password})',
                req.body);
        } catch(e) {
            //I have no clue how to handle this right now. I'll figure it out
            //another time.
        }
        res.redirect('/login');
    } else {
        res.redirect('/');
    }
});

app.post('/create_landmark', async (req, res) => {
    if(!req.isAuthenticated()) {
        res.sendStatus(401);
    } else {
        let pt = req.body;
        if(pt.type !== 'Feature' || pt.geometry.type !== 'Point'
           || pt.geometry.coordinates.length !== 2
           || !pt.geometry.coordinates.reduce(
               (b, n) => b && typeof(n) === 'number',
               true)
           || !pt.properties.name || !pt.properties.description) {
            res.sendStatus(400);
        } else {
            try {
                await db.none(
                    'INSERT INTO landmarks(lat,long,lname,description,creator) '
                        + 'VALUES(${lat},${long},${lname},${description},${creator})', {
                            lat: pt.geometry.coordinates[0],
                            long: pt.geometry.coordinates[1],
                            lname: pt.properties.name,
                            description: pt.properties.description,
                            creator: req.user
                    });
            } catch(e) {
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        }
    }
});
app.get('/landmark/:id', async (req, res) => {
    try {
        let landmark = await db.one('SELECT * FROM landmarks WHERE id=${id}',
                                    {id: parseInt(req.params.id)});
        let reviews = await db.manyOrNone(
            'SELECT * FROM reviews WHERE landmark=${id}',
            {id: parseInt(req.params.id)});
        res.json({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [landmark.lat, landmark.long]
            },
            properties: {
                name: landmark.name,
                id: landmark.id,
                creator: landmark.creator,
                reviews: reviews
            }
        });
    } catch (e) {
        res.sendStatus(404);
    }
});
app.patch('/landmark/:id', (req,res) => {res.sendStatus(500);});
app.delete('/landmark/:id', (req,res) => {res.sendStatus(500);});
app.post('/landmark/:id/add_review', (req,res) => {});
app.patch('/review/:id', (req, res) => {});
app.get('/user/:id', (req,res) => {});
app.get('/landmarks_in', (req, res) => {});

//redirect to review page and show all the reviews
app.get('/review/:id', (req,res) => {

});

//even for me this is gross
app.get('/logged_in', (req,res) => {
    res.json({result: req.isAuthenticated()});
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
