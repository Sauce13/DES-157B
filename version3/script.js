document.addEventListener("DOMContentLoaded", function () {
  Parse.initialize(
    "h6qKhWyRBT2uDRbUnmtK8CX7M3I5mrtx3RVAbDiR",
    "u61kPpqN6gDWgQgtUFTcpCkX7rvGA35uOa2Hlqmy"
  );
  Parse.serverURL = "https://parseapi.back4app.com/";

  async function saveMarker(lat, lng, popupText) {
    const Marker = Parse.Object.extend("Marker");
    const marker = new Marker();

    marker.set("lat", lat);
    marker.set("lng", lng);
    marker.set("popupText", popupText);

    try {
      let savedMarker = await marker.save();
      console.log("Marker saved successfully");

      // Return savedMarker object to get objectId
      return savedMarker;
    } catch (error) {
      console.error("Error while saving marker: ", error);
    }
  }
  var mapExtent = [0.0, -12000.0, 12000.0, 0.0];
  var mapMinZoom = 2.5;
  var mapMaxZoom = 4;
  var mapMaxResolution = 2.0;
  var mapMinResolution = Math.pow(2, mapMaxZoom) * mapMaxResolution;
  var tileExtent = [0.0, -12000.0, 12000.0, 0.0];
  var crs = L.CRS.Simple;
  var addMarkerEnabled = false;
  var deleteMarkerEnabled = false;
  var lastClickedLatLng; // variable to save last clicked latlng
  crs.transformation = new L.Transformation(
    1,
    -tileExtent[0],
    -1,
    tileExtent[3]
  );

  crs.scale = function (zoom) {
    return Math.pow(2, zoom) / mapMinResolution;
  };
  crs.zoom = function (scale) {
    return Math.log(scale * mapMinResolution) / Math.LN2;
  };

  var imageBounds = [
    crs.unproject(L.point(mapExtent[0], mapExtent[1])),
    crs.unproject(L.point(mapExtent[2], mapExtent[3])),
  ];

  var layer;
  var map = new L.Map("map", {
    maxZoom: mapMaxZoom,
    minZoom: mapMinZoom,
    crs: crs,
    maxBounds: imageBounds,
    maxBoundsViscosity: 1.0,
  });

  layer = L.tileLayer("./images/{z}/{x}/{y}.jpg", {
    minZoom: mapMinZoom,
    maxZoom: mapMaxZoom,
    tileSize: L.point(512, 512),
    noWrap: true,
    tms: false,
  }).addTo(map);

  map.fitBounds([
    crs.unproject(L.point(mapExtent[2], mapExtent[3])),
    crs.unproject(L.point(mapExtent[0], mapExtent[1])),
  ]);

  L.control.mousePosition().addTo(map);

  // Modal references
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  var confirmButton = document.getElementById("confirmButton");
  var input = document.getElementById("popupText");

  async function fetchMarkers() {
    const Marker = Parse.Object.extend("Marker");
    const query = new Parse.Query(Marker);

    try {
      const results = await query.find();

      for (let i = 0; i < results.length; i++) {
        var point = L.latLng(results[i].get("lat"), results[i].get("lng"));

        // Assign objectId from Parse to marker options
        L.marker(point, { id: results[i].id })
          .addTo(map)
          .bindPopup(results[i].get("popupText"))
          .openPopup();
      }
    } catch (error) {
      console.error("Error while fetching markers: ", error);
    }
  }

  var addMarker = async function (e) {
    lastClickedLatLng = e.latlng;
    var popupText = input.value;

    if (popupText) {
      // Save marker and get Parse object
      let savedMarker = await saveMarker(
        lastClickedLatLng.lat,
        lastClickedLatLng.lng,
        popupText
      );
      input.value = ""; // clear the input

      // Assign objectId from Parse to marker options
      L.marker(lastClickedLatLng, { id: savedMarker.id })
        .addTo(map)
        .bindPopup(popupText)
        .openPopup();

      // Turn off marker placement mode
      addMarkerEnabled = false;
      addContainer.classList.remove("active");
      map.off("click"); // remove the click event after placing the marker
    }
  };
  var AddMarkerControl = L.Control.extend({
    onAdd: function (map) {
      var addContainer = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-custom add"
      );

      addContainer.onclick = function (event) {
        addMarkerEnabled = !addMarkerEnabled;
        if (addMarkerEnabled) {
          addContainer.classList.add("active");
          modal.style.display = "block";

          // Set the map click event here, while marker placement mode is enabled
          map.on("click", addMarker);
        } else {
          addContainer.classList.remove("active");
          // If the marker placement mode is cancelled, we should also remove the map click event
          map.off("click");
        }
        L.DomEvent.stopPropagation(event);
      };

      return addContainer;
    },
    options: {
      position: "topleft",
    },
  });

  async function deleteMarker(e) {
    var markerId = e.target.options.id; // Get the id of the marker

    // Find the Parse Object associated with this marker
    const Marker = Parse.Object.extend("Marker");
    const query = new Parse.Query(Marker);
    query.equalTo("objectId", markerId);

    try {
      const markerObject = await query.first(); // There should be only one object with this id
      await markerObject.destroy();
      console.log("Marker deleted successfully");

      // Unpress the delete button
      deleteMarkerEnabled = false;
      deleteContainer.classList.remove("active");

      // If delete mode is cancelled, remove the click event from all markers
      map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
          layer.off("click");
        }
      });
    } catch (error) {
      console.error("Error while deleting marker: ", error);
    }

    // Remove marker from map
    map.removeLayer(e.target);
  }

  var deleteMarkerControl = L.Control.extend({
    onAdd: function (map) {
      var deleteContainer = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-custom delete"
      );
      deleteContainer.onclick = function (event) {
        // Activate delete mode
        deleteMarkerEnabled = !deleteMarkerEnabled;

        if (deleteMarkerEnabled) {
          deleteContainer.classList.add("active");
          //   document.getElementById("myModal2").style.display = "block";

          // Set click event for all markers and circles to delete them
          map.eachLayer(function (layer) {
            if (layer instanceof L.Marker || layer instanceof L.Circle) {
              layer.on("click", deleteMarker);
            }
          });
        } else {
          deleteContainer.classList.remove("active");

          // If delete mode is cancelled, remove the click event from all markers and circles
          map.eachLayer(function (layer) {
            if (layer instanceof L.Marker || layer instanceof L.Circle) {
              layer.off("click");
            }
          });
        }
        L.DomEvent.stopPropagation(event);
      };

      L.DomEvent.disableClickPropagation(deleteContainer); // disable event bubbling

      return deleteContainer;
    },
    options: {
      position: "topleft",
    },
  });
  map.addControl(new AddMarkerControl());
  map.addControl(new deleteMarkerControl());
  var addContainer = document.querySelector(".add"); // we move the container variable outside the control to have it accessible in our global scope

  span.onclick = function () {
    modal.style.display = "none";
    addContainer.classList.remove("active");
    addMarkerEnabled = false;
    deleteContainer.classList.remove("active");
    deleteMarkerEnabled = false;
    map.off("click"); // remove the click event when the modal is closed
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      addContainer.classList.remove("active");
      deleteContainer.classList.remove("active");
      deleteMarkerEnabled = false;
      addMarkerEnabled = false;
      map.off("click"); // remove the click event when the modal is closed
    }
  };

  confirmButton.onclick = function () {
    modal.style.display = "none";
    addContainer.classList.remove("active");
    addMarkerEnabled = false;

    if (!addMarkerEnabled) {
      map.on("click", addMarker);
    }
  };

  fetchMarkers();
});
