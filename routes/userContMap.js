const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    let params = req.user_config;
    // db.query(query).then(data => {
    //   let latlng = [];
    //   let name = [];
    //   let category = [];
    //   const maps = data.rows;
    //   for (let map of maps) {
    //     latlng.push(Object.values(map.map_latlong));
    //     name.push(map.name);
    //     category.push(map.category);
    //   }
    //   res.render("index", { latlngData: JSON.stringify(latlng), name: name, category: category });
    // });
    res.render("userContMap");
  });
  return router;
};
