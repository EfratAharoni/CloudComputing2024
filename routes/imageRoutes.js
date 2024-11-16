const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Route to handle image upload
router.post('/upload-image', imageController.uploadImage);

module.exports = router;
