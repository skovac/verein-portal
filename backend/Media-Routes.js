const fs = require('fs');

module.exports = app => {
  app.get('/protocol-nbs', (req, res, next) => {
    if (req.isAuthenticated()) {
      var protocolNbs = new Array();
      fs.readdir(__dirname + "/public/protocols/", (err, files) => {
        files.map(file => {
          protocolNbs.push(file.slice(0, file.indexOf('.')));
        });
        res.status(200).json(protocolNbs);
      });
    } else {
      res.status(401).send();
    }
  });

  app.get('/protocol', (req, res, next) => {
    if (req.isAuthenticated()) {
      const path = __dirname + "/public/protocols/" + req.query.protocolNb + ".pdf";
      if (fs.existsSync(path)) {
        res.status(200).sendFile(path);
      } else {
        res.status(204).send();
      }
    } else {
      res.status(401).send()
    }
  });

  app.get('/tz-nbs', (req, res, next) => {
    if (req.isAuthenticated()) {
      var tzNbs = new Array();
      fs.readdir(__dirname + "/public/tz", (err, files) => {
        files.map(file => {
          tzNbs.push(file.slice(0, file.indexOf('.')));
        });
        res.status(200).json(tzNbs);
      });
    } else {
      res.status(401).send();
    }
  });

  app.get('/tz', (req, res, next) => {
    if (req.isAuthenticated()) {
      const path = __dirname + "/public/tz/" + req.query.tzNb + ".pdf";
      if (fs.existsSync(path)) {
        res.status(200).sendFile(path);
      } else {
        res.status(204).send();
      }
    } else {
      res.status(401).send()
    }
  });
};
