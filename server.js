// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const uuidv1 = require("uuid/v1");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

app.use(
  cookieSession({
    name: "user_id2",
    keys: [uuidv1()]
  })
);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded"
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
// const widgetsRoutes = require("./routes/widgets");
const indexRoutes = require("./routes/index");
const createRoutes = require("./routes/create");
const mapIdRoutes = require("./routes/maps");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const userMapRoutes = require("./routes/userMap");
const userFavMapRoutes = require("./routes/userFavMap");
const userContMapRoutes = require("./routes/userContMap");
const logoutRoutes = require("./routes/logout");
const flagEditRoutes = require("./routes/flagEdit");

//Importing helper file
const mapCreator = require("./helpers");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));
app.use("/create", createRoutes(db));
app.use(
  "/maps/:map_id",
  function(req, res, next) {
    req.map_config = {
      map_id: req.params.map_id
    };
    next();
  },
  mapIdRoutes(db)
);
app.use("/flagEdit", flagEditRoutes(db));

app.use("/login", loginRoutes(db));
app.use("/logout", logoutRoutes(db));
app.use("/register", registerRoutes(db));
app.use(
  "/user/:user_id",
  function(req, res, next) {
    req.user_config = {
      user_id: req.params.user_id
    };
    next();
  },
  userMapRoutes(db)
);
app.use(
  "/user/:user_id/favorites",
  function(req, res, next) {
    req.user_config = {
      user_id: req.params.user_id
    };
    next();
  },
  userFavMapRoutes(db)
);
app.use(
  "/user/:user_id/contributions",
  function(req, res, next) {
    req.user_config = {
      user_id: req.params.user_id
    };
    next();
  },
  userContMapRoutes(db)
);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.use("/", indexRoutes(db));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
