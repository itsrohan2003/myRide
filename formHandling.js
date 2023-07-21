const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '245678@#Rohan',
    database: 'myRide',
});

const app = express();
const port = 3000; // You can change this to any port number you prefer


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files in the 'public' directory

//form handling

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html'));
});
app.get('/welcome.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/welcome.css');
});
app.get('/newRide.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'newRide.html'));
});
app.get('/newRide.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/newRide.css');
});
app.get('/searchRide.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'searchRide.html'));
});
app.get('/searchRide.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/searchRide.css');
});


app.post('/submitForm', (req, res) => {
    const formData = req.body;
    console.log('Received form data:');
    console.log(formData);

    // Insert the form data into the database
    insertFormDataIntoDatabase(formData);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Ride created :)');
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

function insertFormDataIntoDatabase(formData) {
    const query =
        'INSERT INTO rides (name, registration_number, current_location, destination, total_cost, vehicle, vacant_seats, ride_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
        formData.name,
        formData.registration_number,
        formData['current-location'],
        formData.destination,
        formData['total-cost'],
        formData.vehicle,
        formData['vacant-seats'],
        formData['ride-date'],
    ];

    dbConnection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
        } else {
            console.log('Data inserted into the database successfully.');
        }
    });
}
module.exports = { app, port };