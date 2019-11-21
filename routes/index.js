const express = require("express");
const router = express.Router();

module.exports = db => {
  router
    .route("/")
    .get((req, res) => {
      let query = `SELECT * FROM maps`;
      let query2 = `SELECT maps.id, maps.name, maps.category, maps.map_latlong, flags.latlong FROM maps JOIN flags ON maps.id = flags.map_id;`;
      db.query(query2).then(data => {
        let flagData = {};
        data.rows.forEach(el => {
          if (flagData[el.id]) {
            flagData[el.id].push(Object.values(el.latlong));
          } else {
            flagData[el.id] = [Object.values(el.latlong)];
          }
        });
        let flags = Object.values(flagData);
        db.query(query).then(data => {
          let latlng = [];
          let name = [];
          let category = [];
          let id = [];
          const maps = data.rows;
          for (let map of maps) {
            latlng.push(Object.values(map.map_latlong));
            name.push(map.name);
            category.push(map.category);
            id.push(map.id);
          }
          res.render("index", {
            latlngData: JSON.stringify(latlng),
            name: name,
            category: category,
            flags: JSON.stringify(flags),
            id: id,
            user_id: req.session["user_id2"]
          });
        });
      });
    })
    .post((req, res) => {
      let searchParam = req.body.search;
      let queryParams = [];
      let queryParams2 = [];
      // console.log(searchParam); //returns search result

      let queryString = "SELECT * FROM maps";
      let queryString2 = `SELECT maps.id, maps.name, maps.category, maps.map_latlong, flags.latlong FROM maps JOIN flags ON maps.id = flags.map_id`;

      if (searchParam) {
        queryParams.push(`%${searchParam}%`);
        queryString += ` WHERE maps.name LIKE $${queryParams.length}`;
      }

      if (searchParam) {
        queryParams2.push(`%${searchParam}%`);
        queryString2 += ` WHERE maps.name LIKE $${queryParams2.length}`;
      }

      db.query(queryString2, queryParams2).then(data => {
        let flagData = {};
        data.rows.forEach(el => {
          if (flagData[el.id]) {
            flagData[el.id].push(Object.values(el.latlong));
          } else {
            flagData[el.id] = [Object.values(el.latlong)];
          }
        });
        let flags = Object.values(flagData);
        db.query(queryString, queryParams).then(data => {
          let latlng = [];
          let name = [];
          let category = [];
          let id = [];
          const maps = data.rows;
          for (let map of maps) {
            latlng.push(Object.values(map.map_latlong));
            name.push(map.name);
            category.push(map.category);
            id.push(map.id);
          }
          res.render("index", {
            latlngData: JSON.stringify(latlng),
            name: name,
            category: category,
            flags: JSON.stringify(flags),
            id: id,
            user_id: req.session["user_id2"]
          });
        });
      });
    });
  return router;
};
