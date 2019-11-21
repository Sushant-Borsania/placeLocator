const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    if (req.session.user_id2 !== undefined) {
      let query = `SELECT * FROM maps`;
      let query2 = `SELECT maps.id, maps.name, maps.category, maps.map_latlong, flags.latlong FROM maps JOIN flags ON maps.id = flags.map_id;`;
      let query3 = `SELECT maps.id
    FROM maps JOIN favorite_maps ON maps.id = favorite_maps.map_id JOIN users ON users.id = favorite_maps.user_id WHERE favorite_maps.user_id = (SELECT users.id FROM users WHERE users.username = '${req.session.user_id2}');`;
      db.query(query3).then(d3 => {
        let favId = [];
        d3.rows.forEach(el => {
          favId.push(el.id);
        });
        db.query(query2).then(data => {
          let flagData = {};
          data.rows.forEach(el => {
            for (let fav of favId) {
              if (fav === el.id) {
                if (flagData[el.id]) {
                  flagData[el.id].push(Object.values(el.latlong));
                } else {
                  flagData[el.id] = [Object.values(el.latlong)];
                }
              }
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
              for (let fav of favId) {
                if (fav === map.id) {
                  latlng.push(Object.values(map.map_latlong));
                  name.push(map.name);
                  category.push(map.category);
                  id.push(map.id);
                }
              }
            }
            res.render("userFavMap", {
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
    } else {
      res.redirect(`/`);
    }
  });
  return router;
};
