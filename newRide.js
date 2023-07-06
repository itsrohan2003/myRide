let map;
let currentLocationMarker;
let destinationMarker;
let geocoder;

function initMap() {
  const mapContainer = document.getElementById("map");
  const mapContainerHeight = mapContainer.offsetHeight;

  if (mapContainerHeight > 0) {
    // Initialize the map centered at the specific location
    map = L.map("map").setView([26.8439, 75.5652], 12);

    // Add the OpenStreetMap tiles to the map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add markers for current location and destination
    currentLocationMarker = L.marker([26.8439, 75.5652], { draggable: true })
      .addTo(map)
      .bindPopup("Current Location");

    destinationMarker = L.marker([26.8289, 75.8056], { draggable: true })
      .addTo(map)
      .bindPopup("Destination");

    geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
      placeholder: "Search...",
      geocoder: L.Control.Geocoder.nominatim(),
    })
      .on("markgeocode", function (e) {
        const latlng = e.geocode.center;
        if (e.target.options.id === "current-location") {
          currentLocationMarker.setLatLng(latlng);
          map.panTo(latlng);
        } else if (e.target.options.id === "destination") {
          destinationMarker.setLatLng(latlng);
          map.panTo(latlng);
        }
      })
      .addTo(map);

    // Update the marker positions when the input fields change
    document
      .getElementById("current-location")
      .addEventListener("input", updateCurrentLocationMarker);
    document
      .getElementById("destination")
      .addEventListener("input", updateDestinationMarker);
  }
}

function updateCurrentLocationMarker() {
  const currentLocation = document.getElementById("current-location").value;
  geocoder.geocode(currentLocation, function (results) {
    if (results.length > 0) {
      const latlng = results[0].center;
      currentLocationMarker.setLatLng(latlng);
      map.panTo(latlng);
    }
  });
}

function updateDestinationMarker() {
  const destination = document.getElementById("destination").value;
  geocoder.geocode(destination, function (results) {
    if (results.length > 0) {
      const latlng = results[0].center;
      destinationMarker.setLatLng(latlng);
      map.panTo(latlng);
    }
  });
}

function setLocation(inputId) {
  const location = document.getElementById(inputId).value;
  geocoder.geocode(location, function (results) {
    if (results.length > 0) {
      const latlng = results[0].center;
      if (inputId === "current-location") {
        currentLocationMarker.setLatLng(latlng).update();
        map.panTo(latlng);
      } else if (inputId === "destination") {
        destinationMarker.setLatLng(latlng).update();
        map.panTo(latlng);
      }
    }
  });
}

initMap();
