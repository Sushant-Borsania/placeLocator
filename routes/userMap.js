const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    if (req.session.user_id2 !== undefined) {
      let params = req.user_config;
      // res.send(
      //   `This is the page where we see all the maps of user ${params.user_id}`
      // );
      let templateVars = { user_id: req.session["user_id2"] };
      res.render("userMap", templateVars);
    } else {
      res.redirect(`/`);
    }
  });
  return router;
};
