const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    res.send("This is the page where we create new maps");
  });
  return router;
};
