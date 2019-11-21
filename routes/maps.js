const express = require("express");
const router = express.Router();

module.exports = db => {
  router
    .route("/")
    .get((req, res) => {
      let params = req.map_config;
      let query2 = `select maps.*, flags.id as flag_id, flags.latlong, flags.address, flags.map_id, flags.title, flags.description, flags.image, flags.user_id as flag_user_id from maps LEFT join flags on maps.id = flags.map_id where maps.id = ${Number(
        params.map_id
      )};`;
      let qMyFav = `SELECT maps.id
      FROM maps JOIN favorite_maps ON maps.id = favorite_maps.map_id JOIN users ON users.id = favorite_maps.user_id WHERE favorite_maps.user_id = (SELECT users.id FROM users WHERE users.username = '${req.session.user_id2}');`;
      let qMyMap = `SELECT maps.id FROM maps JOIN users ON users.id = maps.owner_id WHERE maps.owner_id = (SELECT users.id
        FROM users WHERE users.username = '${req.session.user_id2}');`;
      db.query(qMyFav).then(d3 => {
        let favBoo = false;
        d3.rows.forEach(el => {
          if (el.id === Number(params.map_id)) {
            favBoo = true;
          }
        });
        db.query(qMyMap).then(d4 => {
          let ownedBoo = false;
          d4.rows.forEach(el => {
            if (el.id === Number(params.map_id)) {
              ownedBoo = true;
            }
          });
          db.query(query2).then(data => {
            // console.log("IDD",data.rows[0]);
            if (data.rows[0] === undefined) {
              res.redirect(`/`);
            }
            let latLong = Object.values(data.rows[0].map_latlong);
            let name = data.rows[0].name;
            let category = data.rows[0].category;

            //containers for flag details
            let flagCords = [];
            let flagName = [];
            let flagDescription = [];
            let flagImageUrl = [];
            //Looping to store flag data in an array
            data.rows.forEach(el => {
              if (el.latlong !== null) {
                flagCords.push(Object.values(el.latlong));
                flagName.push(el.title);
                flagDescription.push(el.description);
                flagImageUrl.push(el.image);
              }
            });
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
                  flagCords: JSON.stringify(flagCords),
                  name: name,
                  category: category,
                  flagName: JSON.stringify(flagName),
                  flagDescription: JSON.stringify(flagDescription),
                  flagImageUrl: JSON.stringify(flagImageUrl),
                  routing: Number(params.map_id),
                  favorite: favBoo,
                  owned: ownedBoo
                };
                res.render("maps", templateVars);
              });
            } else {
              let templateVars = {
                user_id: req.session["user_id2"],
                mapDetails: latLong,
                flagCords: JSON.stringify(flagCords),
                name: name,
                category: category,
                flagName: JSON.stringify(flagName),
                flagDescription: JSON.stringify(flagDescription),
                flagImageUrl: JSON.stringify(flagImageUrl),
                routing: Number(params.map_id),
                favorite: favBoo,
                owned: ownedBoo
              };
              res.render("maps", templateVars);
            }
          });
        });
      });
    })
    .post((req, res) => {
      console.log(req.body.addMap); //Returns TRUE if addMap is clicked
      console.log(req.body.favMap); //Returns TRUE if favMap is clicked
      res.redirect("back");
    });
  return router;
};
