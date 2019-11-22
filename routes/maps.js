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
      let params = req.map_config;
      let mapID = params.map_id;
      let mapAdd = req.body.addMap;
      let mapFav = req.body.favMap;
      let addFlag = req.body.sendFlag;
      let flagEdit = req.body.editFlag;
      let flagDelete = req.body.deleteFlag;
      let qMapAdd = `INSERT INTO maps
      (user_id,name,category,owner_id,map_latlong)
    VALUES
      ((SELECT users.id FROM users WHERE users.username = '${req.session.user_id2}'), (SELECT maps.name FROM maps WHERE maps.id = '${mapID}'), (SELECT maps.category FROM maps WHERE maps.id = '${mapID}'), (SELECT users.id FROM users WHERE users.username = '${req.session.user_id2}'), (SELECT maps.map_latlong FROM maps WHERE maps.id = '${mapID}')) RETURNING id;`;
      let qMapFav = `INSERT INTO favorite_maps
      (map_id,user_id)
    VALUES
      ('${mapID}', (SELECT users.id FROM users WHERE users.username = '${req.session.user_id2}'));`;
      let qMapUnfav = `DELETE FROM favorite_maps WHERE map_id = '${mapID}' AND user_id = (SELECT users.id FROM users WHERE users.username = '${req.session.user_id2}')`;
      let qMapDelete = `DELETE FROM maps WHERE id = '${mapID}'`;
      let qFlagDelete = `DELETE FROM flags where id = (SELECT flags.id
        FROM flags
        WHERE flags.map_id = '${mapID}'
        OFFSET '${flagDelete}' FETCH FIRST
        1 ROWS ONLY
        );`;
      let qFlagEdit = `SELECT * from flags where flags.id = (SELECT flags.id
        FROM flags
        WHERE flags.map_id = '${mapID}'
        ORDER BY flags.id
        OFFSET '${flagEdit}' FETCH FIRST
        1 ROWS ONLY
        );`;
      let flagCoordsRaw = req.body.flagCoordinates;

      if (flagCoordsRaw !== undefined) {
        let flagCoords = flagCoordsRaw.substring(6);
        let qFlagData = `SELECT * FROM flags where flags.latlong ~= '${flagCoords}' AND flags.map_id = '${mapID}';`;
        db.query(qFlagData).then(data => {
          const title = data.rows[0].title;
          const description = data.rows[0].description;
          const image = data.rows[0].image;
          const address = data.rows[0].address;
          res.render("flagCoords", {
            title,
            description,
            image,
            address,
            user_id: req.session["user_id2"]
          });
        });
      }

      if (flagEdit !== undefined) {
        db.query(qFlagEdit).then(data => {
          const title = data.rows[0].title;
          const description = data.rows[0].description;
          const image = data.rows[0].image;
          const flagId = data.rows[0].id;
          const mapId = mapID;
          res.render("flagEdit", {
            title,
            description,
            image,
            flagId,
            mapId,
            user_id: req.session["user_id2"]
          });
        });
      }

      if (flagDelete !== undefined) {
        db.query(qFlagDelete).then(res.redirect(`${mapID}`));
      }

      if (mapAdd === "True") {
        db.query(qMapAdd)
          .then(res.redirect(`/user/${req.session["user_id2"]}`))
          .then(res.redirect(`${mapID}`));
      }

      if (mapAdd === "False") {
        db.query(qMapDelete)
          .then(res.redirect(`/user/${req.session["user_id2"]}`))
          .then(res.redirect(`${mapID}`));
      }

      if (mapFav === "True") {
        db.query(qMapFav).then(res.redirect(`${mapID}`));
      }

      if (mapFav === "False") {
        db.query(qMapUnfav).then(res.redirect(`${mapID}`));
      }
      if (addFlag === "True") {
        const flagName = req.body.flagName;
        const flagDescription = req.body.flagDescription;
        const imageURL = req.body.imageURL;
        const flagCoordsRaw = req.body.coordinates;
        const flagCoords = flagCoordsRaw.substring(6);
        const flagAddress = req.body.address;
        db.query(
          `
        INSERT INTO flags (latlong,address,map_id,title,description,image,user_id)
        VALUES ('${flagCoords}', '${flagAddress}', '${mapID}', $1, $2, $3, (SELECT users.id FROM users WHERE users.username = '${req.session.user_id2}') )
      `,
          [flagName, flagDescription, imageURL]
        ).then(
          db
            .query(
              `
        SELECT owner_id FROM maps WHERE maps.id = '${mapID}';
        `
            )
            .then(data => {
              let owner = data.rows[0].owner_id;
              db.query(
                `
            SELECT users.id FROM users WHERE users.username = '${req.session.user_id2}'
            `
              )
                .then(data => {
                  let user = data.rows[0].id;
                  if (owner !== user) {
                    db.query(`
                INSERT INTO contributors
                (map_id,user_id)
                  VALUES
                ('${mapID}', '${user}');
                `);
                  }
                })
                .then(res.redirect(`${mapID}`));
            })
        );
      }
      //Get the Owner of map

      //if the owner of map and username does not match, then add to contribution
    });
  return router;
};
