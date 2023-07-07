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

    // Create markers for current location and destination
    currentLocationMarker = L.marker([26.8439, 75.5652], { draggable: true })
      .addTo(map)
      .bindPopup("Current Location");

    destinationMarker = L.marker([26.8289, 75.8056], { draggable: true })
      .addTo(map)
      .bindPopup("Destination");

    // Initialize the geocoder
    geocoder = L.Control.Geocoder.opencage('c986aaa28af74f65b90e997289e37903');

    // Update the marker positions when the input fields change
    document
      .getElementById("current-location")
      .addEventListener("input", updateCurrentLocationMarker);
    document
      .getElementById("destination")
      .addEventListener("input", updateDestinationMarker);

    // Print location names in console after marker dragend events
    currentLocationMarker.on("dragend", function (event) {
      const latlng = event.target.getLatLng();
      reverseGeocode(latlng, function (result) {
        console.log(`Current Location: ${result}`);
        sendGeocodedAddress(result, 'current');
      }, 'current');
    });

    destinationMarker.on("dragend", function (event) {
      const latlng = event.target.getLatLng();
      reverseGeocode(latlng, function (result) {
        console.log(`Destination: ${result}`);
        sendGeocodedAddress(result, 'destination');
      }, 'destination');
    });
  }
}

function updateCurrentLocationMarker() {
    const currentLocationInput = $("#current-location");
  
    currentLocationInput.select2({
      placeholder: "Select current location",
      ajax: {
        url: "https://api.opencagedata.com/geocode/v1/json",
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            q: params.term,
            key: "YOUR_OPENCAGE_API_KEY",
          };
        },
        processResults: function (data) {
          const suggestions = data.results.map((result) => ({
            id: result.geometry.lat + "," + result.geometry.lng,
            text: result.formatted,
          }));
          return {
            results: suggestions,
          };
        },
        cache: true,
      },
    });
  
    currentLocationInput.on("select2:select", function (e) {
      const latlng = e.params.data.id.split(",");
      currentLocationMarker.setLatLng(latlng).update();
      map.panTo(latlng);
    });
  }
  
  function updateDestinationMarker() {
    const destinationInput = $("#destination");
  
    destinationInput.select2({
      placeholder: "Select destination",
      ajax: {
        url: "https://api.opencagedata.com/geocode/v1/json",
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            q: params.term,
            key: "c986aaa28af74f65b90e997289e37903",
          };
        },
        processResults: function (data) {
          const suggestions = data.results.map((result) => ({
            id: result.geometry.lat + "," + result.geometry.lng,
            text: result.formatted,
          }));
          return {
            results: suggestions,
          };
        },
        cache: true,
      },
    });
  
    destinationInput.on("select2:select", function (e) {
      const latlng = e.params.data.id.split(",");
      destinationMarker.setLatLng(latlng).update();
      map.panTo(latlng);
    });
  }
  initMap()