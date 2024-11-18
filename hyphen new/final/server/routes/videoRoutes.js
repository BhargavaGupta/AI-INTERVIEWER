const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { uploadVideo } = require('../controllers/videoController');

// Route for uploading videos
router.post('/upload', upload.single('video'), uploadVideo);

module.exports = router;
