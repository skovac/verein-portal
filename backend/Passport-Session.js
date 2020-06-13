const LocalStrategy = require('passport-local').Strategy;
const dbCom = require('./DB-Com');
const cryptoUtils = require('./Crypto-Utils');

module.exports = (app, passport) => {
  passport.use(new LocalStrategy(
    function(username, password, cb) {
      dbCom.findUser({ username: username })
        .then((user) => {
          if (!user) {
            return cb(null, false)
          }

          // Function defined at bottom of app.js
          const isValid = cryptoUtils.validPassword(password, user.hash, user.salt);

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
    dbCom.findUserByUUID(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

  app.use(passport.initialize());
  app.use(passport.session());
};
