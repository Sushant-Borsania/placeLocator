const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    if (req.session.user_id2 !== undefined) {
      let query = `SELECT * FROM maps`;
      let query2 = `SELECT maps.id, maps.name, maps.category, maps.map_latlong, flags.latlong FROM maps JOIN flags ON maps.id = flags.map_id;`;
      let query5 = `SELECT distinct(maps.id) FROM maps JOIN contributors ON contributors.map_id = maps.id JOIN users on contributors.user_id = users.id WHERE contributors.user_id = (SELECT users.id FROM users WHERE users.username = '${req.session.user_id2}');`;
      db.query(query5).then(d5 => {
        let contId = [];
        d5.rows.forEach(el => {
          contId.push(el.id);
        });
        db.query(query2).then(data => {
          let flagData = {};
          data.rows.forEach(el => {
            for (let cont of contId) {
              if (cont === el.id) {
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
              for (let cont of contId) {
                if (cont === map.id) {
                  latlng.push(Object.values(map.map_latlong));
                  name.push(map.name);
                  category.push(map.category);
                  id.push(map.id);
                }
              }
            }
            res.render("userContMap", {
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
