const mysql = require('mysql2'); // Update this line

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'klhece@1234', // Replace with your MySQL password
    database: 'video_db',
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});
