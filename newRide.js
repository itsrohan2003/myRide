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
      geocoder = L.Control.Geocoder.nominatim();
  
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
          console.log("Current Location: ", result);
          sendGeocodedAddress(result, 'currentLocation');
        }, 'currentLocation');
      });
  
      destinationMarker.on("dragend", function (event) {
        const latlng = event.target.getLatLng();
        reverseGeocode(latlng, function (result) {
          console.log("Destination: ", result);
          sendGeocodedAddress(result, 'destination');
        }, 'destination');
      });
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

function reverseGeocode(latlng, callback, markerType) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data && data.address) {
                const address = data.display_name;
                callback(address);

                // Send the geocoded address to the server
                sendGeocodedAddress(address, markerType);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function sendGeocodedAddress(address, markerType) {
    const url = '/marker-location';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, markerType }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(`Geocoded address (${markerType}) sent successfully`);
        })
        .catch((error) => {
            console.error('Error:', error);
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


