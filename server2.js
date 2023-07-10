const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const https = require('https');

let currentLocationData;
let currentLocationCoords;
let destinationData;
let destinationCoords;

const OPENCAGE_API_KEY = 'c986aaa28af74f65b90e997289e37903';

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const pathname = reqUrl.pathname;

  if (pathname === '/') {
    serveFile(res, 'welcome.html');
  } else if (pathname === '/submit') {
    const query = reqUrl.query;
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
  } else {
    const filePath = path.join(__dirname, pathname.substr(1));
    serveFile(res, filePath);
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

function serveFile(res, filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      } else {
        let modifiedData = data;
  
        if (currentLocationCoords !== undefined) {
          modifiedData = modifiedData.replace('{{loc1}}', JSON.stringify(currentLocationCoords));
        } else {
          modifiedData = modifiedData.replace('{{loc1}}', '[]');
        }
  
        if (destinationCoords !== undefined) {
          modifiedData = modifiedData.replace('{{loc2}}', JSON.stringify(destinationCoords));
        } else {
          modifiedData = modifiedData.replace('{{loc2}}', '[]');
        }
  
        res.writeHead(200, { 'Content-Type': getContentType(filePath) });
        res.end(modifiedData);
      }
    });
  }

function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    default:
      return 'text/plain';
  }
}

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