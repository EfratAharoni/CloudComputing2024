const express = require('express');
const router = express.Router();
const USDAController = require('../controllers/usdaController');

router.post('/calculateCalories', USDAController.calculateCalories);
module.exports = router;

