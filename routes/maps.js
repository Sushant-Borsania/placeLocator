const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    let params = req.map_config;
    res.render("maps");
  });
  return router;
};
