const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Serve the signup.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

// Serve the CSS file
app.get('/signup.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/signup.css');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/login.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/login.css');
});
// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '245678@#Rohan',
  database: 'myRide',
});

// Handle form submission
app.post('/signup', (req, res) => {
  const { name, registrationNumber, course, year, password } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password: ', err);
      res.status(500).send('Internal server error');
    } else {
      // Insert form data into the "users" table
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database: ', err);
          res.status(500).send('Internal server error');
        } else {
          const sql = `INSERT INTO users (name, registration_number, course, year, password) VALUES (?, ?, ?, ?, ?)`;
          const values = [name, registrationNumber, course, year, hashedPassword];

          connection.query(sql, values, (error, results) => {
            connection.release(); // Release the connection back to the pool

            if (error) {
              console.error('Error inserting data: ', error);
              res.status(500).send('Internal server error');
            } else {
              res.redirect('http://localhost:3000/Loggedin.html');
            }
          });
        }
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});