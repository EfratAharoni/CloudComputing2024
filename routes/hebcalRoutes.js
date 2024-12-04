const express = require('express');
const router = express.Router();
const HebcalController = require('../controllers/hebcalController');

// נתיב לבדיקת חג
router.post('/check-date', HebcalController.checkDate);

module.exports = router;
