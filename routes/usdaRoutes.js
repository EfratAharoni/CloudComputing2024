const express = require('express');
const router = express.Router();
const ImageModel = require('../models/imageModel');
const { getGlucoseFromUSDA } = require('../models/usdaModel');

// פונקציה לקבלת תיאור תמונה
const getDescriptionFromImage = async (imagePath) => {
    const description = await ImageModel.getDescriptionFromImage(imagePath);
    console.log('Description from Imagga:', description);
    return description;
};

// פונקציה לקבלת נתוני גלוקוז מהתיאור
const getGlucoseLevelFromDescription = async (description) => {
    const glucoseData = await getGlucoseFromUSDA(description);
    console.log('Glucose data from USDA:', glucoseData);
    return glucoseData.glucoseLevel;
};

// ניתן להוסיף מסלול אם נחוץ:
router.get('/example', async (req, res) => {
    try {
        const description = await getDescriptionFromImage(req.query.imagePath);
        const glucoseLevel = await getGlucoseLevelFromDescription(description);
        res.json({ description, glucoseLevel });
    } catch (error) {
        console.error('Error in /example route:', error.message);
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
});

module.exports = router; // ייצוא של ה-Router
