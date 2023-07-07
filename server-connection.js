const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const markerLocation = parsedUrl.query.markerLocation;

  if (markerLocation === 'server-connection.js') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      address: 'Your address',
    }));
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(3000);
console.log('Server running on port 3000');