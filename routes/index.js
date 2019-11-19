const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM maps`;
    db.query(query).then(data => {
      let latlng = [];
      const maps = data.rows;
      for (let map of maps) {
        latlng.push(Object.values(map.map_latlong));
      }
      // console.log(latlng);
      res.render("index", { latlngData: latlng });
    });
  });
  return router;
};
