//This is prototype quality

const express = require('express');
const expressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pgp = require('pg-promise')();
const app = express();


require('dotenv').config();

const db = pgp({
    connectionString: process.env.DATABASE_URL
    //ssl:{rejectUnauthorized:false}
});

const session = {
    secret: process.env.SECRET || 'SECRET',
    resave: false,
    saveUninitialized: false
};

const strategy = new LocalStrategy(async (uname, password, done) => {
    let user = await getUserIfExists(uname);
    if(!user) {
        return done(null, false, {'message': 'Bad Username'});
    }
    if(!(validatePassword(user, password))) {
        await new Promise((r) => setTimeout(r, 1000));
        return done(null, false, {'message': 'Wrong Password'});
    }
    return done(null, uname);
});

//Returns a user if one exists, or null if not
async function getUserIfExists(username){
    return await
    db.oneOrNone("SELECT * FROM users WHERE uname=$1;", username);
}

//takes a user object and validates that pwd is the password.
function validatePassword(user, pwd) {
    return mc.check(pwd, user.salt, user.password);
}


app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.static('client'));

//use minicrypt to encrypt stored password 
const minicrypt = require('./miniCrypt');
const mc = new minicrypt();


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

app.post('/login',
         passport.authenticate('local'),
         (req,res) => {
             res.sendStatus(200);
         });

//once log out, redirect to the homepage
app.post('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
});

//store user and the hashed password and salt in postgres db
async function register(uname, password){
    let [salt, hashed] = mc.hash(password);
    return await db.none(
        'INSERT INTO users(uname,password,salt) VALUES ($1,$2,$3);',
        [uname, hashed, salt]);
}

app.post('/signup', async (req, res) => {
    if(!req.body.username || !req.body.password) {
        res.sendStatus(400);
    } else if(!req.isAuthenticated()) {
        try {
            let uname = req.body.username;
            let pass = req.body.password;
            register(uname, pass);
        } catch(e) {
            res.sendStatus(400);
            return;
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
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

//if the key is a string, it's a username. If it's not, it's a landmark id.
async function getReviews(key) {
    const byuser = typeof key === 'string';
    const reviews =  await db.manyOrNone(
        'SELECT reviews.*, landmarks.lname '
            +'FROM reviews INNER JOIN landmarks '
            + 'ON (reviews.landmark=landmarks.id) '
            + (byuser?'WHERE reviews.creator=$1'
               :'WHERE reviews.landmark=$1'), [key]);
    return reviews;
}

/*turns a landmark from the database into geojson format.
 * return object, not JSON*/
async function landmarkJSON(landmark) {
    const reviews = await getReviews(parseInt(landmark.id));
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [landmark.lat, landmark.long]
        },
        properties: {
            name: landmark.lname,
            id: landmark.id,
            creator: landmark.creator,
            description: landmark.description,
            reviews: reviews
        }
    };
}

app.get('/landmark/:id', async (req, res) => {
    try {
        let landmark = await db.one('SELECT * FROM landmarks WHERE id=$1',
                                    [parseInt(req.params.id)]);
        res.json(await landmarkJSON(landmark));
    } catch (e) {
        res.sendStatus(404);
    }
});
app.patch('/landmark/:id', async (req,res) => {
    if(!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
    }
    if(!req.body
       || (!req.body.properties.name && !req.body.properties.description)) {
        res.sendStatus(400);
        return;
    }
    try {
        await db.none('UPDATE landmarks SET '
                      + (req.body.properties.name? 'lname=${name} ':'')
                      + (req.body.properties.name
                         && req.body.properties.description?',':'')
                      + (req.body.properties.description?
                         'description=${desc} ':'')
                      + 'WHERE id=${id} AND CREATOR=${creator}', {
                          id: parseInt(req.params.id),
                          creator: req.user,
                          name: req.body.properties.name,
                          desc: req.body.properties.description
                      });
    } catch(e) {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
});

app.delete('/landmark/:id', async (req,res) => {
    if(!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
    } try {
        await db.none('DELETE FROM landmarks '
                      + 'WHERE id=${id} AND creator=${creator}', {
                          id: parseInt(req.params.id),
                          creator: req.user
                      });
    } catch(e) {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
});
app.post('/landmark/:id/add_review', async (req,res) => {
    if(!req.isAuthenticated()) {
        res.sendStatus(401);
    } else {
        try {
            await db.none('INSERT INTO reviews(creator,landmark,stars,body) '
                          + 'VALUES(${creator}, ${landmark}, '
                          + '${stars}, ${body})', {
                              creator: req.user,
                              landmark: parseInt(req.params.id),
                              stars: req.body.stars,
                              body: req.body.body
                          });
        } catch (e) {
            res.sendStatus(400);
            return;
        }
        res.sendStatus(200);
    }
});

app.get('/review/:id', async (req,res) => {res.sendStatus(500);});

app.patch('/review/:id', async (req, res) => {
    if(!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
    }
    if(!req.body.body && !req.body.stars) {
        res.sendStatus(400);
        return;
    } try {
        await db.none('UPDATE reviews SET '
                      + (req.body.stars? 'stars=${stars} ':'')
                      + (req.body.stars&&req.body.body?',':'')
                      + (req.body.body? 'body=${body} ':'')
                      + 'WHERE id=${id} AND CREATOR=${creator}', {
                          id: req.params.id,
                          creator: req.user,
                          stars: req.body.stars,
                          body: req.body.body
                      });
    } catch(e) {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
});

app.delete('/review/:id', async (req,res) => {
    if(!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
    }
    try {
        await db.none('DELETE FROM reviews '
                      + 'WHERE id=${id} AND creator=${creator}', {
                          id: parseInt(req.params.id),
                          creator: req.user
                      });
    } catch(e) {
        res.sendStatus(400);
    }
    res.sendStatus(200);
});

app.get('/user/:id', async (req,res) => {
    try {
        await db.one('SELECT * FROM users WHERE uname=${id}', req.params);
    } catch(e) {
        res.sendStatus(404);
        return;
    }
    res.json({
        id: req.params.id,
        reviews: await getReviews(req.params.id),
        landmarks: await Promise.all(
            (await db.manyOrNone('SELECT * FROM landmarks WHERE creator=${id}',
                                 req.params))
                .map((lmk) => landmarkJSON(lmk))
        )
    });
});

app.get('/self', (req,res) =>
    req.isAuthenticated()?
        res.redirect(`/user/${req.user}`)
        : res.sendStatus(401));

app.get('/landmarks_in', async (req, res) => {
    //this is really bad in terms of numbers of queries. Should be fixed if this
    //is beyond a prototype. Which can probably be done with sufficient joins,
    //natch.
    const lat1 = parseFloat(req.query.lat1);
    const long1 = parseFloat(req.query.long1);
    const lat2 = parseFloat(req.query.lat2);
    const long2 = parseFloat(req.query.long2);
    if(isNaN(lat1) || isNaN(long1) || isNaN(lat2) || isNaN(long2)){
        res.sendStatus(400);
        return;
    }
    let lmks = await db.manyOrNone('SELECT * FROM landmarks '
                                   + 'WHERE lat >= ${lat1} '
                                   + 'AND lat <= ${lat2} '
                                   + 'AND long >= ${long1} '
                                   + 'AND long <= ${long2}', {
                                       lat1: Math.min(lat1, lat2),
                                       lat2: Math.max(lat1, lat2),
                                       long1: Math.min(long1, long2),
                                       long2: Math.max(long1, long2)
                                   });
    res.json(await Promise.all(lmks.map((lmk) => landmarkJSON(lmk))));
});

//even for me this is gross
app.get('/logged_in', (req,res) => {
    res.json({result: req.isAuthenticated()});
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
