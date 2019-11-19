const mapCreator = latlng => {
  latlng.forEach((data, i) => {
    let el = document.getElementById("custom_grid");
    let elChild = document.createElement("div");
    elChild.innerHTML = `
    <div class="card" style="width: 22rem;">
      <div class="mapPlaceholder" id="mapid-${i}"></div>
    <div class="card-body">
          <div class="left-content">
            <h5 class="card-title">Map Name</h5>
            <p class="card-text">
              Category: Gym
            </p>
          </div>
          <div class="right-content">
            <i class="fas fa-heart"></i>
            <i class="fas fa-plus"></i>
          </div>
        </div>
        <a href="#" class="btn btn-primary">Explore</a>
      </div>
    `;
    el.appendChild(elChild);
    // $(".custom_grid").append(`
    // <div class="card" style="width: 22rem;">
    //   <div class="mapPlaceholder" id="mapid-${i}"></div>
    // <div class="card-body">
    //       <div class="left-content">
    //         <h5 class="card-title">Map Name</h5>
    //         <p class="card-text">
    //           Category: Gym
    //         </p>
    //       </div>
    //       <div class="right-content">
    //         <i class="fas fa-heart"></i>
    //         <i class="fas fa-plus"></i>
    //       </div>
    //     </div>
    //     <a href="#" class="btn btn-primary">Explore</a>
    //   </div>
    // `);
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

module.exports = mapCreator;
