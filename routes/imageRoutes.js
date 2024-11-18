const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/imageController');

router.post('/upload-url', ImageController.uploadImageByUrl);

module.exports = router;