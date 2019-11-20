const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    let params = req.map_config;
    let query2 = `select maps.*, flags.id as flag_id, flags.latlong, flags.address, flags.map_id, flags.title, flags.description, flags.image, flags.user_id as flag_user_id from maps LEFT join flags on maps.id = flags.map_id where maps.id = ${Number(
      params.map_id
    )};`;
    db.query(query2).then(data => {
      // console.log("IDD",data.rows[0]);
      if (data.rows[0] === undefined) {
        res.redirect(`/`);
      }
      let latLong = Object.values(data.rows[0].map_latlong);
      //flag stuff started here
      let flagCords = [];
      data.rows.forEach(el => {
        if (el.latlong !== null) {
          flagCords.push(Object.values(el.latlong));
        }
      });

      //Adding %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
            owner: mapOwner,
            mapDetails: latLong,
            flagCords: JSON.stringify(flagCords)
          };
          res.render("maps", templateVars);
        });
      } else {
        let templateVars = {
          user_id: req.session["user_id2"],
          mapDetails: latLong,
          flagCords: JSON.stringify(flagCords)
        };
        res.render("maps", templateVars);
      }

      //Closed%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    });
  });
  return router;
};
