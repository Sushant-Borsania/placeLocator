const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = db => {
  router
    .route("/")
    .get((req, res) => {
      if (req.session.user_id2 === undefined) {
        let templateVars = { user_id: req.session["user_id2"] };
        res.render("login", templateVars);
      } else {
        res.redirect(`/`);
      }
    })
    .post((req, res) => {
      db.query(`SELECT * FROM users;`).then(data => {
        const users = data.rows;
        let userExists = false;
        for (let user of users) {
          if (user.username === req.body.usernameID) {
            userExists = true;
            if (bcrypt.compareSync(req.body.passwordID, user.password)) {
              req.session.user_id2 = user.username;
              res.redirect(`/`);
            } else {
              res.send(
                `Password is incorrect. <a href=/login>Click here to try again</a>. `
              );
            }
          }
        }
        if (userExists === false) {
          res.send(
            `Username does not exist. <a href=/login>Click here to try again</a>. Or, <a href=/register>click here to register.</a> `
          );
        }
      });
    });
  return router;
};
