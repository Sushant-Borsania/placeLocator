const express = require("express");
const router = express.Router();

module.exports = db => {
  router
    .route("/")
    .get((req, res) => {})
    .post((req, res) => {
      const flagName = req.body.flagName;
      const flagDesc = req.body.flagDescription;
      const imageURL = req.body.imageURL;

      const query = `UPDATE flags
      SET title = $1,
          description = $2,
          image = $3
      WHERE flags.id = '${req.body.flagId}';
      `;
      db.query(query, [flagName, flagDesc, imageURL]).then(
        res.redirect(`/maps/${req.body.mapId}`)
      );
    });
  return router;
};
