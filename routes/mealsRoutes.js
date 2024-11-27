const express = require('express');
const router = express.Router();
const mealsController = require('../controllers/mealsController');

// נתיב להצגת כל הארוחות
router.get('/all-meals', mealsController.getAllMeals);

// נתיב ליצירת ארוחה חדשה
router.post('/create-meal', mealsController.createMeal);

module.exports = router;
