// // PG database client/connection setup
// const { Pool } = require("pg");
// const dbParams = require("./lib/db.js");
// const db = new Pool(dbParams);
// db.connect();

// const latlng = [
//   [51.040053, -114.066162],
//   [53.522523, -113.622669],
//   [43.65133, -79.379136],
//   [43.65133, -79.379136],
//   [43.65133, -79.379136]
// ];

// const mapData = pool
//   .query(
//     `
// SELECT * FROM maps;
//   `
//   )
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => console.error("query error", err.stack));

// console.log("mapDATA", mapData);

const mapCreator = data => {
  data.forEach((data, i) => {
    $(".custom_grid").append(`
    <div class="card" style="width: 22rem;">
      <div class="mapPlaceholder" id="mapid-${i}"></div>
    <div class  <script>
    mapCreator(latlngData)
  </script>class="fas fa-heart"></i>
            <i class="fas fa-plus"></i>
          </div>
        </div>
        <a href="#" class="btn btn-primary">Explore</a>
      </div>
    `);
    let mymap = L.map(`mapid-${i}`).setView(data, 13);
    L.tileLayer(
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
      {
        maxZoom: 18,
        id: "mapbox.streets"
      }
    ).addTo(mymap);
  });
};
