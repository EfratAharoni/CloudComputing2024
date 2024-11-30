const express = require('express');
const router = express.Router();
const HebcalController = require('../controllers/hebcalController');

// נתיב לבדיקת תאריך מול Hebcal
router.post('/check-date', HebcalController.checkDate);

module.exports = router;
