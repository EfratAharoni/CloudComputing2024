const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

console.log("gfhd");
// נתיב התחברות
router.post('/login', userController.login);

// נתיב יצירת משתמש חדש
router.post('/signup', userController.signup);

module.exports = router;
