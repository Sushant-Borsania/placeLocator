const express = require("express");
const router = express.Router();

module.exports = db => {
  router
    .route("/")
    .get((req, res) => {
      res.render("register");
    })
    .post((req, res) => {
      const name = req.body.name;
      const userName = req.body.username;
      const password = req.body.password;
      if (!name || !userName || !password) {
        res.send("username and password and name can not be empty");
      } else {
        db.query(`SELECT * FROM users;`).then(data => {
          const users = data.rows;
          console.log(users);
          users.forEach(user => {
            // console.log(user);
            if (user.username === userName) {
              res.send("username already taken!");
            }
          });
          //insert into database;
          db.query(
            `INSERT INTO users
                          (name,username,password)
                          VALUES
                          ('${name}', '${userName}', '${password}');`
          ).then(data => {
            req.session.user_id2 = userName;
            res.redirect("/");
          });
        });
      }
    });
  return router;
};
