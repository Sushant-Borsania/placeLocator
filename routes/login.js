const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    if (req.session === undefined) {
      res.render("login");
    } else {
      res.redirect(`/`);
    }
  });
};

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
        for (let user of users) {
          if (user.username === req.body.usernameID) {
            if (user.password === req.body.passwordID) {
              //store cookie and redirect
              res.redirect(`/`);
            } else {
              res.send("Password is incorrect");
            }
          }
          //res.send("Username does not exist!"); //does not work
        }
      });
    });
  return router;
};
