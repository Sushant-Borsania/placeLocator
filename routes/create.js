const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    if (req.session.user_id2 !== undefined) {
      let templateVars = { user_id: req.session["user_id2"] };
      res.render("create", templateVars);
    } else {
      res.redirect(`/`);
    }
  });
  return router;
};
