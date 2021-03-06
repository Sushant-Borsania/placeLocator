const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = db => {
  router
    .route("/")
    .get((req, res) => {
      if (req.session.user_id2 === undefined) {
        let templateVars = { user_id: req.session["user_id2"] };
        res.render("register", templateVars);
      } else {
        res.redirect(`/`);
      }
    })
    .post((req, res) => {
      const name = req.body.name;
      const userName = req.body.username;
      const password = bcrypt.hashSync(req.body.password, 10);
      let queryParams = [];

      if (!name || !userName || !password) {
        res.send(
          `Username and password cannot be empty! <a href=/register>Click here to try again</a>. `
        );
      } else {
        db.query(`SELECT * FROM users;`).then(data => {
          const users = data.rows;
          users.forEach(user => {
            if (user.username === userName) {
              res.send(
                `Username Already Taken! <a href=/register>Click here to try again</a>. `
              );
            }
          });
          //insert into database;
          db.query(
            `INSERT INTO users
                          (name,username,password)
                          VALUES
                          ($1, $2, $3);`,
            [name, userName, password]
          ).then(data => {
            req.session.user_id2 = userName;
            res.redirect("/");
          });
        });
      }
    });
  return router;
};
