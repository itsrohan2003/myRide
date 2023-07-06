const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/marker-location') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const { address, markerType } = JSON.parse(body);
      console.log(`Received Marker Location (${markerType}): ${address}`);
      res.writeHead(200);
      res.end();
    });
  } else {
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './welcome.html'; // Change the default homepage to newRide.html
    }

    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.css') {
      contentType = 'text/css';
    } else if (ext === '.js') {
      contentType = 'text/javascript';
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // File not found
          res.writeHead(404);
          res.end('404 Not Found');
        } else {
          // Server error
          res.writeHead(500);
          res.end('500 Internal Server Error');
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  }
});

const port = 3000; // Change the port number if needed
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
