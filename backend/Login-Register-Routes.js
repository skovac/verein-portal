const cryptoUtils = require('./Crypto-Utils');
const dbCom = require('./DB-Com');

module.exports = (app, passport) => {
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
    const saltHash = cryptoUtils.genPassword(req.body.password);
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
    dbCom.writeToDB(newUser);
    res.redirect('/login');
  });

  app.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login');
  });
};

