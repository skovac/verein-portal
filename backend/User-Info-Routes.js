const fs = require('fs');
const dbCom = require('./DB-Com');

module.exports = (app) => {
  app.get('/own-profile-pic', async (req, res, next) => {
    if (req.isAuthenticated()) {
      const path = __dirname + "/public/avatars/" + req.user.id + ".jpg";
      if (fs.existsSync(path)) {
        res.status(200).sendFile(path);
      } else {
        res.status(204).send();
      }
    } else {
      res.status(401).send();
    }
  });

  app.get('/own-info', async (req, res, next) => {
    if (req.isAuthenticated()) {
      const userInfo = await dbCom.getUserInfo(req.user.id);
      res.status(200).json(userInfo);
    } else {
      res.status(401).send();
    }
  });

  app.post('/update-profile', (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log(req.body);
      dbCom.updateUser(req.body, req.user.id);
      res.status(200).send();
    } else {
      res.status(200).send();
    }
  });

  app.post('/upload-profile-pic', (req, res, next) => {
    if (req.isAuthenticated()) {
      const file = req.files.file;
      file.mv(__dirname + "/public/avatars/" + req.user.id + ".jpg");
      res.status(200).send()
    } else {
      res.status(401).send()
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
};
