const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Ensure the directory exists     
const uploadDir = "C:/hyphen new latest\hyphen new/final/video_ujwal";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer to save files to the specified directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('video'), (req, res) => {
    res.send('Video uploaded and saved successfully');
});

app.listen(3001, () => {
    console.log('Server started on http://localhost:3001');
});
