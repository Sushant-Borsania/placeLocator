/* eslint-disable no-undef */
const mapCreator = data => {
  const latLang = data[0];
  const name = data[1];
  const category = data[2];
  const flags = data[3];
  const id = data[4];

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
      </div>
      <a href="/maps/${id[i]}" class="btn btn-primary">Explore</a>
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
    let boundry = [];
    if (flags[i] !== undefined) {
      for (let j = 0; j < flags[i].length; j++) {
        L.marker(flags[i][j]).addTo(mymap);
        boundry.push(flags[i][j]);
      }
      mymap.fitBounds([boundry]);
    }
  });
};

//Another version of function
const createSingleMap = data => {
  let address = '';
  let map = L.map("singleMap", {
    center: data.latLang,
    zoom: 12
  });

  L.control.scale().addTo(map);
  L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
      id: "mapbox.streets"
    }
  ).addTo(map);

  const onPopupOpen = () => {
    $(".marker-delete-button:visible").click(function() {
      results.clearLayers();
    });
  };

  let searchControl = new L.esri.Controls.Geosearch().addTo(map);
  let results = new L.LayerGroup().addTo(map);
  searchControl.on("results", function(data) {
    for (let i = data.results.length - 1; i >= 0; i--) {
      //Starting with blank canavas
      results.clearLayers();
      //Init marker
      let markerOne = L.marker(data.results[i].latlng);
      //Add marker layer
      results.addLayer(markerOne);
      //Add popup with X
      markerOne.bindPopup(
        "<input type='button' value='Delete this marker' class='marker-delete-button'/>"
      );
      //Adding function to delete the marker on click
      markerOne.on("popupopen", onPopupOpen);
      console.log(data.results[i].address);
      address = data.results[i].address;
      $(".hidden").removeClass("hidden");
    }
  });
  setTimeout(function() {
    $(".pointer").fadeOut("slow");
  }, 3400);

  data.flagCords.forEach(flag => {
    L.marker(flag).addTo(map);
  });
  map.fitBounds(data.flagCords);
  return address;
};
