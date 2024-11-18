const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer'); // Middleware for handling multipart/form-data

const app = express();
app.use(bodyParser.json());

// Set up storage with multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// API endpoint to receive video data
app.post('/api/uploadVideo', upload.single('video'), (req, res) => {
    const { title } = req.body;
    const videoData = req.file.buffer;  // Get the video data from the request

    const query = 'INSERT INTO videos (title, video_data) VALUES (?, ?)';
    db.query(query, [title, videoData], (err, result) => {
        if (err) {
            console.error('Error saving video: ', err);
            res.status(500).send('Error saving video.');
            return;
        }
        res.status(200).send('Video saved successfully.');
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
