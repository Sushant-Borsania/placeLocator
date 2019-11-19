const mapCreator = data => {
  const latLang = data[0];
  const name = data[1];
  const category = data[2];
  latLang.forEach((data, i) => {
    $(".custom_grid").append(`
    <div class="card" style="width: 22rem;">
    <div class="mapPlaceholder" id="mapid-${i}"></div>
    <div class="card-body">
        <div class="left-content">
          <h5 class="card-title">${name[i]}</h5>
          <p class="card-text">
            Category: ${category[i]}
          </p>
        </div>
        <div class="right-content">
          <i class="fas fa-heart"></i>
          <i class="fas fa-plus"></i>
        </div>
      </div>
      <a href="#" class="btn btn-primary">Explore</a>
    </div>
    `);
    let mymap = L.map(`mapid-${i}`).setView(data, 14);
    L.tileLayer(
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
      {
        maxZoom: 18,
        id: "mapbox.streets"
      }
    ).addTo(mymap);
  });
};
