const express = require('express');
const app = express();
const port = 5000;

// Serve the signup.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

// Serve the CSS file
app.get('/signup.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/signup.css');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});