const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let currentLocationData;
let destinationData;

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
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': getContentType(filePath) });
      res.end(data);
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
