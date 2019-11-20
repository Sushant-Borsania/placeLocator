const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    if (req.session.user_id2 !== undefined) {
      let query = `SELECT maps.id
      FROM maps
        JOIN users ON maps.owner_id = users.id
      WHERE maps.owner_id = (SELECT users.id
      FROM users
      WHERE users.username = '${req.session.user_id2}');
      `;
      db.query(query).then(data => {
        let params = req.map_config;
        const maps = data.rows;
        let mapOwner = false;
        for (let map of maps) {
          if (Number(map.id) === Number(params.map_id)) {
            mapOwner = true;
          }
        }
        let templateVars = {
          user_id: req.session["user_id2"],
          owner: mapOwner
        };
        res.render("maps", templateVars);
      });
    } else {
      let templateVars = { user_id: req.session["user_id2"] };
      res.render("maps", templateVars);
    }
  });
  return router;
};
