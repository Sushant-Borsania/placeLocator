const express = require("express");
const router = express.Router();

module.exports = db => {
  router
    .route("/")
    .get((req, res) => {})
    .post((req, res) => {
      console.log(req.body.flagName);
      console.log(req.body.flagDescription);
      console.log(req.body.imageURL);
      const query = `UPDATE flags 
      SET title = '${req.body.flagName}',
          description = '${req.body.flagDescription}',
          image = '${req.body.imageURL}'
      WHERE flags.id = '${req.body.flagId}';
      `;
      db.query(query).then(res.redirect(`/maps/${req.body.mapId}`));
    });
  return router;
};
