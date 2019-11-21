const express = require("express");
const router = express.Router();

module.exports = db => {
  router
    .route("/")
    .get((req, res) => {
      if (req.session.user_id2 !== undefined) {
        let templateVars = { user_id: req.session["user_id2"] };
        res.render("create", templateVars);
      } else {
        res.redirect(`/`);
      }
    })
    .post((req, res) => {
      let mapName = req.body.name;
      let mapCat = req.body.category;
      let mapCoordsRaw = req.body.coordinates;
      let mapCoords = mapCoordsRaw.substring(6);
      db.query(
        `      INSERT INTO maps
        (user_id,name,category,owner_id,map_latlong)
      VALUES
        ((SELECT users.id FROM users WHERE users.username = '${req.session.user_id2}'), '${mapName}', '${mapCat}', (SELECT users.id FROM users WHERE users.username = '${req.session.user_id2}'), '${mapCoords}') RETURNING id;`
      ).then(data => {
        res.redirect(`/maps/${data.rows[0].id}`);
      });
    });
  return router;
};
