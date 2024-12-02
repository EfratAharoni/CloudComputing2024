const express = require('express');
const router = express.Router();
const USDAController = require('../controllers/usdaController');

router.post('/checkGlucose', USDAController.checkGlucose);

module.exports = router;
