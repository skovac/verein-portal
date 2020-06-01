const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session)
const sessionPool = require('pg').Pool
const uuid = require('uuid/v1');
const cors = require('cors');
const fs = require('fs')
require('dotenv').config()

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

/**
 * -------------- GENERAL SETUP ----------------
 */
var app = express();
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

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
  console.log(user)
  const client = new Client(DBInfo);
  client.connect()
  const query = "INSERT INTO public.users(uuid, username, password, salt, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5, $6, $7);"
  const values = [ uuid(), user.username, user.hash, user.salt, user.firstName, user.lastName, user.role ]
  client.query(query, values, (err, res) => {
    console.log(err);
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

async function getProfilePicFile(id) {
  const query = "SELECT profile_pic FROM public.users WHERE uuid=$1";
  const value = [ id ];

  const client = new Client(DBInfo);
  client.connect();
  const res = await client.query(query, value);
  client.end();

  if (res.rowCount === 0) {
    return "";
  } else {
    return res.rows[0].profile_pic;
  }
}

async function getUserInfo(id) {
  const query = "SELECT username, first_name, last_name, tel, role, city, state, country, timezone from public.users WHERE uuid=$1";
  const value = [ id ];

  const client = new Client(DBInfo);
  client.connect();
  const res = await client.query(query, value);
  client.end();

  if (res.rowCount === 0) {
    return "";
  } else {
    const rows = res.rows[0];
    const userInfo = {
      email: rows.username,
      firstName: rows.first_name,
      lastName: rows.last_name,
      tel: rows.tel,
      role: rows.role,
      city: rows.city,
      state: rows.state,
      country: rows.country,
      timezone: rows.timezone,
    }
    return userInfo;
  }
}

function updateUser(user, id) {
  const query = "UPDATE users set username=$1, first_name=$2, last_name=$3, tel=$4, role=$5, city=$6, state=$7, country=$8, timezone=$9 where uuid=$10";
  const value = [ user.email, user.firstName, user.lastName, user.tel, user.role, user.city, user.state, user.country, user.timezone, id ];

  const client = new Client(DBInfo);
  client.connect();
  client.query(query, value).then(() => client.end());
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

function validPassword(password, hash, salt) {
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

app.get('/login', (req, res, next) => {   
  const form = ("<h1>Login Page</h1><form method='POST' action='/login'>Enter Username:<br><input type='text' name='username'>\<br>Enter Password:<br><input type='password' name='password'><br><br><input type='submit' value='Submit'></form>");
  res.send(form);
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }), (err, req, res, next) => {
  if (err) next(err);
});

app.get('/login-success', (req, res, next) => {
  res.status(200).send('You successfully logged in.');
});

app.get('/login-failure', (req, res, next) => {
  res.status(401).send('You entered the wrong password.');
});

app.get('/is-logged-in', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).send();
  } else {
    res.status(401).send();
  }
});

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
    salt: salt,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: req.body.role
  };
  writeToDB(newUser);
  res.redirect('/login');
});

app.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

app.get('/own-profile-pic', async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).sendFile(__dirname + "/public/avatars/" + req.user.id + ".jpg");
  } else {
    res.status(401).send();
  }
});

app.get('/own-info', async (req, res, next) => {
  if (req.isAuthenticated()) {
    const userInfo = await getUserInfo(req.user.id);
    res.status(200).json(userInfo);
  } else {
    res.status(401).send();
  }
});

app.post('/update-profile', (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.body);
    updateUser(req.body, req.user.id);
    res.status(200).send();
  } else {
    res.status(200).send();
  }
});

app.post('/upload-profile-pic', (req, res, next) => {
  if (req.isAuthenticated()) {
    const file = req.files.file;
    file.mv(__dirname + "/public/avatars/" + req.user.id + ".jpg");
  }
}); 

app.post('/delete-profile-pic', (req, res, next) => {
  if (req.isAuthenticated()) {
    fs.unlinkSync(__dirname + "/public/avatars/" + req.user.id + ".jpg");
    res.status(200).send();
  } else {
    res.status(401).send();
  }
});

app.get('/pdf', (req, res, next) => {
  res.status(200).sendFile(__dirname + "/public/tz/535.pdf");
});

app.listen(1831);
