const https = require('https');
const { app, port } = require('./formHandling');



const OPENCAGE_API_KEY = 'c986aaa28af74f65b90e997289e37903';



let currentLocationData;
let currentLocationCoords;
let destinationData;
let destinationCoords;


app.get('/submit', (req, res) => {
    const query = req.query;
    const currentLocation = query['current-location'];
    const destination = query.destination;

    console.log('Received location data:');
    console.log('Current Location:', currentLocation);
    console.log('Destination:', destination);

    currentLocationData = currentLocation !== undefined ? currentLocation : undefined;
    destinationData = destination !== undefined ? destination : undefined;

    // Geocode the updated location data
    geocodeLocations();

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Location data received');
});



function geocodeLocations() {
    if (currentLocationData) {
        const currentLocationUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(currentLocationData)}&key=${OPENCAGE_API_KEY}`;
        https.get(currentLocationUrl, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                const currentLocationJson = JSON.parse(data);
                const results = currentLocationJson.results;

                if (results && results.length > 0) {
                    currentLocationCoords = results[0].geometry;
                    console.log('Geocoded Current Location:', currentLocationCoords);
                }
            });
        });
    }

    if (destinationData) {
        const destinationUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(destinationData)}&key=${OPENCAGE_API_KEY}`;
        https.get(destinationUrl, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                const destinationJson = JSON.parse(data);
                const results = destinationJson.results;

                if (results && results.length > 0) {
                    destinationCoords = results[0].geometry;
                    console.log('Geocoded Destination:', destinationCoords);
                }
            });
        });
    }
}