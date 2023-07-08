const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Get the requested URL and remove the leading '/'
  const url = req.url.substr(1);

  // If the URL is empty, serve the "welcome.html" file
  if (url === '') {
    serveFile(res, 'welcome.html');
  } else {
    // Determine the file path based on the requested URL
    const filePath = path.join(__dirname, url);

    // Serve the requested file
    serveFile(res, filePath);
  }
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// Helper function to serve a file
function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // File not found
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    } else {
      // Serve the file
      res.writeHead(200, { 'Content-Type': getContentType(filePath) });
      res.end(data);
    }
  });
}

// Helper function to determine the appropriate content type
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