const express = require("express");
const router = express.Router();

module.exports = db => {
  router
    .route("/")
    .get((req, res) => {
      if (req.session === undefined) {
        res.render("login");
      } else {
        res.redirect(`/`);
      }
    })
    .post((req, res) => {
      // console.log("username", req.body.usernameID);
      // console.log("password", req.body.passwordID);
      db.query(`SELECT * FROM users;`).then(data => {
        const users = data.rows;
        let userExists = false;

        for (let user of users) {
          if (user.username === req.body.usernameID) {
            userExists = true;
            if (user.password === req.body.passwordID) {
              //store cookie (look at GET request above)
              //need to encrypt passwords!!!
              res.redirect(`/`);
            } else {
              res.send("Password is incorrect");
            }
          }
        }
        if (userExists === false) {
          res.send("Username does not exist!");
        }
      });
    });
  return router;
};
