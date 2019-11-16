const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    let params = req.user_config;
    res.send(
      `This is the page where we see all the FAVORITE maps of user ${params.user_id}`
    );
  });
  return router;
};
