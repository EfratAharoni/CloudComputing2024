const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const mealController = require('../controllers/mealsController');


// הגדרת Multer לאחסון תמונות
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

router.post('/filterMeals', mealController.filterMealsByDate);

const upload = multer({ storage });

// ✅ **נתיב POST להוספת ארוחה**
router.post('/addMeal', upload.single('descriptionImage'), (req, res) => {
    const { mealType, date, BloodSugarLevel} = req.body;
    const descriptionImage = req.file ? req.file.path : null;

    mealController.createMeal(req, res, mealType, date, BloodSugarLevel, descriptionImage);
});

// ✅ **נתיב GET לחיזוי רמות סוכר**
router.get('/predictGlucose', mealController.predictGlucose);

module.exports = router;
