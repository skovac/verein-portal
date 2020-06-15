const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const dbCom = require('./DB-Com');
const passport = require('passport');

/**
 * -------------- GENERAL SETUP ----------------
 */
var app = express();
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({credentials: true, origin: 'http://192.168.0.103:3000'}));

/**
 * -------------- SESSION SETUP ----------------
 */
app.use(session(dbCom.sessionConfig));
require('./Passport-Session')(app, passport);

/**
 * -------------- ROUTES ----------------
 */
require('./Login-Register-Routes')(app, passport);
require('./User-Info-Routes')(app);
require('./Media-Routes')(app);

app.listen(1831);
