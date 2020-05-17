const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session)
const sessionPool = require('pg').Pool
const uuid = require('uuid/v1');
const cors = require('cors');
require('dotenv').config()

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

/**
 * -------------- GENERAL SETUP ----------------
 */
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

/**
 * -------------- DATABASE ----------------
 */
const { Client } = require('pg')
const DBInfo = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
};

function writeToDB(user) {
  const client = new Client(DBInfo);
  client.connect()
  const query = "INSERT INTO public.users(uuid, username, password, salt) VALUES ($1, $2, $3, $4);"
  const values = [ uuid(), user.username, user.hash, user.salt ]
  client.query(query, values, (err, res) => {
    client.end();
  });
}

async function findUser(user) {
  const query = "SELECT uuid, password, salt FROM public.users WHERE username=$1";
  const value = [ user.username ];
  
  const client = new Client(DBInfo);
  client.connect();
  const res = await client.query(query, value);
  client.end();

  if (res.rowCount === 0) {
    return false;
  }

  user.id = res.rows[0].uuid;
  user.hash = res.rows[0].password;
  user.salt = res.rows[0].salt;
  
  return user;
}

async function findUserByUUID(id, func) {
  const query = "SELECT username, password, salt FROM public.users WHERE uuid=$1";
  const value = [ id ];
  
  const client = new Client(DBInfo);
  client.connect();
  const res = await client.query(query, value);
  client.end();

  if (res.rowCount === 0) {
    return func(1, null);
  }
  row = res.rows[0];
  const user = {
    id: id,
    username: row.username,
    password: row.password,
    salt: row.salt
  };
  
  return func(null, user);
}

/**
 * -------------- SESSION SETUP ----------------
 */
const sessionDBaccess = new sessionPool(DBInfo);
const sessionConfig = {
  store: new pgSession({
    pool: sessionDBaccess,
    tableName: 'session'
  }),
  name: '_teutonia-portal-login-cookie',
  secret: "my secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    aameSite: true,
    secure: false // ENABLE ONLY ON HTTPS
  }
}
app.use(session(sessionConfig));

//Passport part
function validPassword(password, hash, salt) {
  console.log("here");
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: salt,
    hash: genHash
  };
}

passport.use(new LocalStrategy(
  function(username, password, cb) {
    console.log(username, password, cb);
    findUser({ username: username })
      .then((user) => {
        if (!user) {
          return cb(null, false)
        }

        // Function defined at bottom of app.js
        const isValid = validPassword(password, user.hash, user.salt);

        if (isValid) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      })
      .catch((err) => {
        cb(err);
      });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  findUserByUUID(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

app.get('/', (req, res, next) => {
  res.send('<h1>Home</h1>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
app.get('/login', (req, res, next) => {   
  const form = ("<h1>Login Page</h1><form method='POST' action='/login'>Enter Username:<br><input type='text' name='username'>\<br>Enter Password:<br><input type='password' name='password'><br><br><input type='submit' value='Submit'></form>");
  res.send(form);
});

// Since we are using the passport.authenticate() method, we should be redirected no matter what 
app.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }), (err, req, res, next) => {
  console.log("post hrer");
  if (err) next(err);
});

// When you visit http://localhost:30success00/register, you will see "Register Page"
app.get('/register', (req, res, next) => {
  const form = "<h1>Register Page</h1><form method='post' action='register'>Enter Username:<br><input type='text' name='username'><br>Enter Password:<br><input type='password' name='password'><br><br><input type='submit' value='Submit'></form>";
  res.send(form);
});

app.post('/register', (req, res, next) => {
  const saltHash = genPassword(req.body.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;
  const newUser = {
    username: req.body.username,
    hash: hash,
    salt: salt
  };
  writeToDB(newUser);
  res.redirect('/login');
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
app.get('/protected-route', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).send('<h1>You are authenticated</h1>');
  } else {
    res.status(401).send('<h1>You are not authenticated</h1>');
  }
});

app.get('/is-logged-in', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).send();
  } else {
    res.status(401).send();
  }
});

// Visiting this route logs the user out
app.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

app.get('/login-success', (req, res, next) => {
  console.log(req.body.username);
  res.status(200).send('You successfully logged in.');
});

app.get('/login-failure', (req, res, next) => {
  console.log(req.body.username);
  res.status(401).send('You entered the wrong password.');
});

app.listen(1831);
