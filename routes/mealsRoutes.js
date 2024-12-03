const express = require('express');
const multer = require('multer');
const router = express.Router();

// הגדרת multer לטיפול בקובץ התמונה
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // היכן שהקובץ יישמר
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // יצירת שם קובץ ייחודי
    }
});

const upload = multer({ storage: storage });

// נתיב ה־POST להוספת הארוחה
router.post('/addMeal', upload.single('descriptionImage'), (req, res) => {
    const mealType = req.body.mealType;
    const date = req.body.date;
    const descriptionImage = req.file ? req.file.filename : null;

    // כאן נתקשר לקונטרולר שמטפל בהוספת הארוחה לדאטה-בייס
    mealController.addMeal(mealType, date, descriptionImage)
        .then(result => {
            res.status(201).json(result);  // אם הכל עבר בהצלחה
        })
        .catch(err => {
            res.status(500).json({ message: 'Error adding meal', error: err });
        });
});

module.exports = router;
